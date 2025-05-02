# backend/api.py

from fastapi import APIRouter, Query, Header, HTTPException
from backend.memory.storage import load_user_profile
from backend.memory.routes import upsert_session
from backend.memory.routes import SessionMemory
from backend.memory.models import UserMemory
from backend.prompt_engine.engine import select_prompt
from backend.session.conversation_manager import route as conversation_route
from backend.session.session_state import SessionState, PromptExchange
from backend.agents.goal_setter import suggest_goal_from_context
from backend.agents.critique_agent import critique_assistant_response
from backend.agents.follow_up_agent import suggest_follow_up
from uuid import UUID
from datetime import datetime
from typing import Optional
import uvicorn
from backend.query import run_query  # this should be your main search function
from dotenv import load_dotenv
import os
from openai import OpenAI
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
from pydantic import BaseModel
import psycopg2
import json
import traceback



load_dotenv()
print("🚀 API_KEY from env:", os.getenv("XAVIGATE_KEY"))
API_KEY = os.getenv("XAVIGATE_KEY")



router = APIRouter()

@router.get("/query")
async def query(
    prompt: str = Query(..., description="Your search query"),
    top_k: int = Query(3, ge=1, le=10),
    origin: Optional[str] = None,
    topic: Optional[str] = None,
    audience: Optional[str] = None,
    uuid: Optional[str] = None,
    x_xavigate_key: str = Header(..., alias="X-XAVIGATE-KEY")
):
    if x_xavigate_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid or missing API key")

    try:
        user_profile = load_user_profile(uuid) if uuid else None
        session_state = SessionState(
            session_id=str(datetime.now().timestamp()),
            user_id=uuid,
            ax=user_profile.baseline_ax if user_profile else None,
            aq=user_profile.baseline_aq if user_profile else None,
            quadrant=user_profile.quadrant_history[-1] if user_profile and user_profile.quadrant_history else "QII",
            avatar_profile=user_profile.avatar_profile if user_profile else None,
            recent_tags=user_profile.alignment_tags if user_profile else [],
            history=[],
            goal=None
        )

        plan = conversation_route(session_state)

        memory_intro = ""
        comment_on = plan.get("comment_on")
        if comment_on:
            memory_intro = f"{comment_on}\n\n" + memory_intro

        # 🎯 Tone + prompt shaping
        system_prompt = select_prompt(
            quadrant=session_state.quadrant,
            active_tags=plan["emphasize_tags"],
            avatar_tone=plan["avatar_tone"],
            avatar_name=plan["avatar_name"]
        )   

        filters = {}
        if origin:
            filters["origin"] = origin
        if topic:
            filters["topic"] = topic
        if audience:
            filters["audience"] = audience

        results = run_query(prompt, top_k=top_k, filters=filters)
        for i, result in enumerate(results):
            result["term"] = result.get("metadata", {}).get("term", f"Source {i+1}")

        return {
            "results": results,
            "system_prompt": system_prompt,
            "quadrant": session_state.quadrant,
            "avatar_tone": plan["avatar_tone"],
            "tag_ids": [tag.tag_id for tag in session_state.recent_tags]
        }
    except Exception as e:
        return {"error": str(e)}

class PromptRequest(BaseModel):
    prompt: str
    top_k: Optional[int] = 5
    origin: Optional[str] = None
    topic: Optional[str] = None
    audience: Optional[str] = None
    avatar: Optional[str] = None
    uuid: Optional[str] = None

@router.post("/generate")
async def generate_answer(
    body: PromptRequest,
    x_xavigate_key: str = Header(..., alias="X-XAVIGATE-KEY")
):
    if x_xavigate_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid or missing API key")

    # 🧠 Connect to DB if not in dev
    session_memory = None
    persistent_memory = None
    if os.getenv("ENV") != "dev":
        conn = psycopg2.connect(os.getenv("DATABASE_URL"))
        conn.autocommit = True
        cursor = conn.cursor()

        if body.uuid:
            cursor.execute("SELECT conversation_log, interim_scores FROM session_memory WHERE uuid = %s", (body.uuid,))
            session_memory = cursor.fetchone()

            cursor.execute("SELECT initial_personality_scores, preferences FROM user_memory WHERE uuid = %s", (body.uuid,))
            persistent_memory = cursor.fetchone()
    else:
        print("🧪 Skipping DB connection in /generate (dev mode)")

    # 🔍 Load alignment profile from file-based memory
    user_profile = load_user_profile(body.uuid) if body.uuid else None

    from backend.memory.storage import load_session_history

    if not user_profile:
        return {"error": "User profile not found"}
    
    history = load_session_history(body.uuid)

    # 🧠 Build session state and get plan
    session_state = SessionState(
        session_id=str(datetime.now().timestamp()),
        user_id=body.uuid,
        ax=user_profile.baseline_ax if user_profile else None,
        aq=user_profile.baseline_aq if user_profile else None,
        quadrant=user_profile.quadrant_history[-1] if user_profile and user_profile.quadrant_history else "QII",
        avatar_profile=user_profile.avatar_profile if user_profile else None,
        recent_tags=user_profile.alignment_tags if user_profile else [],
        history=history,
        goal=None
    )
    from backend.agents.goal_setter import suggest_goal_from_context

    if not session_state.goal:
        inferred_goal = suggest_goal_from_context(body.prompt, session_state)
        session_state.goal = inferred_goal
        print(f"🎯 Inferred session goal: {inferred_goal}")
        plan = conversation_route(session_state)

    # 🎯 Tone + prompt shaping
    system_prompt = select_prompt(
        quadrant=session_state.quadrant,
        active_tags=plan["emphasize_tags"],
        avatar_tone=plan["avatar_tone"],
        avatar_name=plan["avatar_name"]
    )

    # 🧠 Optional comment injection
    comment_on = plan.get("comment_on")
    if comment_on:
        memory_intro = f"{comment_on}\n\n" + memory_intro


    # 🔍 Query RAG content
    filters = {}
    if body.origin:
        filters["origin"] = body.origin
    if body.topic:
        filters["topic"] = body.topic
    if body.audience:
        filters["audience"] = body.audience

    results = run_query(body.prompt, top_k=body.top_k, filters=filters)
    for i, result in enumerate(results):
        result["term"] = result.get("metadata", {}).get("term", f"Source {i+1}")

    context = "\n\n".join([r["text"] for r in results])

    print("📦 Sources returned to frontend:")
    for r in results:
        print(r)

    # 🧠 Memory summary
    memory_intro = ""
    if persistent_memory:
        personality_scores = persistent_memory[0]
        preferences = persistent_memory[1] or {}
        if personality_scores:
            memory_intro += "The user has the following personality trait scores:\n"
            for trait, score in personality_scores.items():
                memory_intro += f"- {trait}: {score}\n"

    if session_memory:
        conversation_log = session_memory[0]
        interim_scores = session_memory[1]
        if interim_scores:
            memory_intro += "\nThe assistant has inferred these interim observations:\n"
            for key, value in interim_scores.items():
                memory_intro += f"- {key}: {value}\n"

    import requests

    final_prompt = f"""
{system_prompt}

if session_state.goal:
    memory_intro = f"Session goal: {session_state.goal}\n\n" + memory_intro

Use the context and what you know about the user to answer clearly and with care.

If the answer is not in the context, say:
"I'm not sure based on the current documents."

---

User Memory Summary:
{memory_intro or "No memory available."}

---

Context:
{context}

---

Question:
{body.prompt}

Answer:
""".strip()

    print("📝 Final prompt sent to GPT:")
    print(final_prompt)

    try:
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": final_prompt}],
            temperature=0.3
        )

        answer = completion.choices[0].message.content

        print("📤 Plan going into CritiqueAgent:", plan)
        print("📤 Assistant response:", answer)

        # 🧠 Critique the assistant's performance
        critique = critique_assistant_response(plan, answer)
        print("🧪 CritiqueAgent feedback:")
        print(critique)

        # 💬 Generate follow-up suggestion
        followup = suggest_follow_up(body.prompt, answer, session_state)
        print("➡️ FollowUpAgent suggestion:")
        print(followup)

        from backend.memory.consolidate_session import synthesize_persistent_update

        # 🧠 Synthesize persistent memory update
        try:
            user_memory = synthesize_persistent_update(UUID(body.uuid), plan, critique)
            print("📥 Synthesized persistent memory update:")
            print(json.dumps(user_memory.model_dump(), indent=2, default=str))

            payload = user_memory.model_dump(exclude_none=False)
            payload["uuid"] = str(user_memory.uuid)

            # Directly save persistent memory via internal function to avoid HTTP deadlock
            try:
                from backend.memory.routes import upsert_user as upsert_user_route, UserMemory as PersistentUserMemory
                persistent_mem_model = PersistentUserMemory(**payload)
                resp = upsert_user_route(persistent_mem_model)
                print("✅ Memory save response:", resp)
            except Exception as e:
                print("❌ Error saving persistent memory directly:", e)
        except Exception as e:
            print("❌ Error generating or posting persistent memory:")
            traceback.print_exc()

        print("📥 Synthesized persistent memory update:")
        # Use Pydantic's json() to ensure UUIDs and other types are serialized properly
        print(json.dumps(user_memory.model_dump(), indent=2, default=str))

        # Try to load previous log from session memory
        existing_log = load_session_history(body.uuid)  # returns List[PromptExchange]

        # Convert back to dicts for DB write
        prior_exchanges = [
            {
                "user_prompt": e.user_prompt,
                "assistant_response": e.assistant_response,
                "tags": e.tags
            } for e in existing_log
        ]

        # Add new exchange
        prior_exchanges.append({
            "user_prompt": body.prompt,
            "assistant_response": answer,
            "tags": plan["emphasize_tags"]
        })
        conversation_log = {
            "exchanges": prior_exchanges,
            "plan_snapshot": plan
        }
        
        upsert_session(
            SessionMemory(
                uuid=UUID(body.uuid),
                conversation_log=conversation_log,
                interim_scores={}  # or extract from your inference logic later
            )
        )
        print("🧠 Conversation log saved:")
        print(json.dumps(conversation_log, indent=2, default=str))

        return {
            "answer": answer,
            "sources": results,
            "plan": plan,
            "followup": followup,
            "critique": critique
        }
    
    except Exception as e:
        return {"error": str(e)}

from fastapi import FastAPI
from threading import Thread
import time
from backend.memory.storage import purge_expired_session_memory

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    def periodic_purge():
        while True:
            time.sleep(3600)
            purge_expired_session_memory()

    Thread(target=periodic_purge, daemon=True).start()
    print("🕒 Memory purge task scheduled")
    yield  # startup complete

app = FastAPI(lifespan=lifespan)
app.include_router(router)

if __name__ == "__main__":
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", 8000))
    uvicorn.run(app, host=host, port=port, reload=True)
