from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
from openai import OpenAI
import os
import traceback
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# === GET /api/user/{username} ===
@app.get("/api/user/{username}")
async def get_user_profile(username: str):
    try:
        safe_name = username.strip().lower()
        file_path = Path(__file__).parent / "user_data" / f"{safe_name}.json"

        if not file_path.exists():
            print(f"❌ Profile not found: {file_path}")
            return JSONResponse(status_code=404, content={"error": "User not found"})

        print(f"✅ Returning profile: {file_path}")
        return FileResponse(path=file_path, media_type='application/json')

    except Exception as e:
        print("❌ Exception in GET /api/user:", e)
        return JSONResponse(status_code=500, content={"error": str(e)})

# === POST /generate ===
class GenerateRequest(BaseModel):
    prompt: str
    uuid: str
    avatar: str | None = None
    tone: str | None = None
    traitSummary: str | None = None

@app.post("/generate")
async def generate(request: Request):
    try:
        data = await request.json()
        user_prompt = data.get("prompt", "").strip()
        trait_summary = data.get("traitSummary", "").strip()
        uuid = data.get("uuid")

        if not user_prompt:
            return JSONResponse(status_code=400, content={"error": "Missing prompt"})

        context = fake_rag_retrieve(user_prompt + " " + trait_summary)

        full_prompt = f"""
You are a career coach who specializes in the Multiple Natures framework.

Here is the user's trait profile (1–10 scale):
{trait_summary}

Here is reference content from MN theory:
{context}

Now answer the user's question:
{user_prompt}
"""

        print("🧠 Sending prompt to OpenAI...")

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a career advisor using the Multiple Natures framework."},
                {"role": "user", "content": full_prompt}
            ]
        )

        final_answer = response.choices[0].message.content.strip()
        print("✅ GPT reply:", final_answer)

        return { "answer": final_answer }

    except Exception as e:
        print("❌ Exception during /generate:")
        print(traceback.format_exc())
        return JSONResponse(status_code=500, content={"error": str(e)})

# === POST /session-memory ===
@app.post("/session-memory")
async def store_session_memory(request: Request):
    print("🧠 Session memory received (stub).")
    return {"status": "ok"}

# === Fake RAG ===
def fake_rag_retrieve(query: str) -> str:
    return """
- Creative + Musical → Designer, Filmmaker, Composer.
- Educative + Interpersonal → Teacher, Coach, Facilitator.
- Logical + Entrepreneurial → Analyst, Strategist, Startup Founder.
- Healing + Intrapersonal → Therapist, Wellness Coach, Counselor.
"""
