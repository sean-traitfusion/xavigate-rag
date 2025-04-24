# backend/api.py

from fastapi import FastAPI, Query, Header, HTTPException
from typing import Optional
import uvicorn
from backend.query import run_query  # this should be your main search function
from dotenv import load_dotenv
import os
from openai import OpenAI
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel



load_dotenv()
print("🚀 API_KEY from env:", os.getenv("XAVIGATE_KEY"))
API_KEY = os.getenv("XAVIGATE_KEY")

app = FastAPI(title="Xavigate RAG Search API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/query")
async def query(
    prompt: str = Query(..., description="Your search query"),
    top_k: int = Query(3, ge=1, le=10),
    origin: Optional[str] = None,
    topic: Optional[str] = None,
    audience: Optional[str] = None,
    x_xavigate_key: str = Header(..., alias="X-XAVIGATE-KEY")
):
    if x_xavigate_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid or missing API key")
    filters = {}
    if origin:
        filters["origin"] = origin
    if topic:
        filters["topic"] = topic
    if audience:
        filters["audience"] = audience

    try:
        results = run_query(prompt, top_k=top_k, filters=filters)
        return {"results": results}
    except Exception as e:
        return {"error": str(e)}
    
class PromptRequest(BaseModel):
    prompt: str
    top_k: Optional[int] = 3
    origin: Optional[str] = None
    topic: Optional[str] = None
    audience: Optional[str] = None

@app.post("/generate")
async def generate_answer(
    body: PromptRequest,
    x_xavigate_key: str = Header(..., alias="X-XAVIGATE-KEY")
):
    if x_xavigate_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid or missing API key")

    filters = {}
    if body.origin:
        filters["origin"] = body.origin
    if body.topic:
        filters["topic"] = body.topic
    if body.audience:
        filters["audience"] = body.audience

    results = run_query(body.prompt, top_k=body.top_k, filters=filters)

    # Ensure each result has a label
    for i, result in enumerate(results):
        result["term"] = result.get("metadata", {}).get("term", f"Source {i+1}")

    context = "\n\n".join([r["text"] for r in results])
    print("📦 Sources returned to frontend:")
    for r in results:
        print(r)

    final_prompt = f"""
You are an expert assistant helping users understand key ideas from internal documents. 
Use the provided context to answer the user's question as clearly and concisely as possible.

If the answer is not in the context, say:
"I’m not sure based on the current documents."

---

Context:
{context}

---

Question:
{body.prompt}

Answer:
""".strip()

    try:
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": final_prompt}],
            temperature=0.3
        )
        answer = completion.choices[0].message.content
        return {"answer": answer, "sources": results}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", 8000))
    uvicorn.run("backend.api:app", host=host, port=port, reload=True)
