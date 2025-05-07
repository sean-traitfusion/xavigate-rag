from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import openai
import json
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

# Enable frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# === CHAT ENDPOINT ===
class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(req: ChatRequest):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a coach helping people understand their personality and energy alignment."},
                {"role": "user", "content": req.message},
            ]
        )
        reply = response.choices[0].message.content.strip()
        return {"reply": reply}
    except Exception as e:
        return {"reply": f"❌ GPT error: {str(e)}"}

# === SAVE USER PROFILE ===
@app.post("/api/user/{username}")
async def save_user_data(username: str, request: Request):
    try:
        data = await request.json()
        safe_name = username.strip().lower()
        file_path = Path(__file__).parent / "user_data" / f"{safe_name}.json"
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        return {"status": "success"}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# === LOAD USER PROFILE ===
@app.get("/api/user/{username}")
async def load_user_data(username: str):
    safe_name = username.strip().lower()
    file_path = Path(__file__).parent / "user_data" / f"{safe_name}.json"
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            return JSONResponse(content=data)
    except Exception as e:
        return JSONResponse(status_code=404, content={"error": f"user '{safe_name}' not found"})
