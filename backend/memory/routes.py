from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
from uuid import UUID
import os
import json
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
print("✅ memory_routes.py loaded")
print("🌍 ENV =", os.getenv("ENV"))

# === DB SETUP ===
conn = None
cursor = None

if os.getenv("ENV") != "dev":
    import psycopg2
    from backend.db import get_connection
    conn = get_connection()

    if conn:
        conn.autocommit = True
        cursor = conn.cursor()
        print("✅ Connected to Postgres (routes.py)")

        # === SCHEMA CREATION ===
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS session_memory (
            uuid UUID PRIMARY KEY,
            session_start TIMESTAMP DEFAULT NOW(),
            last_active TIMESTAMP,
            conversation_log JSONB,
            interim_scores JSONB,
            expires_at TIMESTAMP
        );
        """)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_memory (
            uuid UUID PRIMARY KEY,
            initial_personality_scores JSONB,
            score_explanations JSONB,
            trait_history JSONB,
            preferences JSONB,
            created_at TIMESTAMP DEFAULT NOW(),
            last_updated TIMESTAMP DEFAULT NOW()
        );
        """)
    else:
        print("⚠️ conn is None — Postgres failed silently?")
else:
    print("🧪 Skipping DB connection in dev mode (routes.py)")

# === MODELS ===

class SessionMemory(BaseModel):
    uuid: UUID
    session_start: datetime = Field(default_factory=datetime.utcnow)
    last_active: Optional[datetime] = None
    conversation_log: Dict[str, Any]
    interim_scores: Optional[Dict[str, Any]] = None
    expires_at: Optional[datetime] = None

class UserMemory(BaseModel):
    uuid: UUID
    initial_personality_scores: Optional[dict] = None
    score_explanations: Optional[dict] = None
    trait_history: Optional[dict] = None
    preferences: Optional[dict] = None

# === ROUTES ===

@router.post("/session-memory")
def upsert_session(mem: SessionMemory):
    from backend.memory.routes import upsert_session_direct
    upsert_session_direct(mem)
    return {"status": "session memory updated"}

def upsert_session_direct(mem: SessionMemory):
    if not conn or not cursor:
        print("⚠️ Skipping session upsert: no DB connection")
        return

    now = datetime.utcnow()
    expires_at = now + timedelta(hours=24)

    if not mem.conversation_log:
        print("⚠️ No conversation log to store — skipping upsert.")
        return

    cursor.execute("""
        INSERT INTO session_memory (uuid, session_start, last_active, conversation_log, interim_scores, expires_at)
        VALUES (%s, %s, %s, %s, %s, %s)
        ON CONFLICT (uuid) DO UPDATE SET
            last_active = EXCLUDED.last_active,
            conversation_log = session_memory.conversation_log || EXCLUDED.conversation_log,
            interim_scores = EXCLUDED.interim_scores,
            expires_at = EXCLUDED.expires_at;
    """, (
        str(mem.uuid),
        now,
        now,
        json.dumps(mem.conversation_log, default=str),
        json.dumps(mem.interim_scores or {}, default=str),
        expires_at
    ))

@router.get("/session-memory/{uuid}")
def get_session(uuid: str):
    if not conn or not cursor:
        print("⚠️ Skipping session fetch: no DB connection")
        return {}
    cursor.execute("SELECT conversation_log FROM session_memory WHERE uuid = %s", (uuid,))
    result = cursor.fetchone()
    return result[0] if result else {}

@router.post("/persistent-memory")
def upsert_user(mem: UserMemory):
    if not conn or not cursor:
        print("⚠️ Skipping user upsert: no DB connection")
        return {"status": "skipped (no DB)"}

    now = datetime.utcnow()
    cursor.execute("""
        INSERT INTO user_memory (uuid, initial_personality_scores, score_explanations, trait_history, preferences, created_at, last_updated)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (uuid) DO UPDATE SET
            initial_personality_scores = EXCLUDED.initial_personality_scores,
            score_explanations = EXCLUDED.score_explanations,
            trait_history = EXCLUDED.trait_history,
            preferences = EXCLUDED.preferences,
            last_updated = EXCLUDED.last_updated;
    """, (
        str(mem.uuid),
        json.dumps(mem.initial_personality_scores, default=str),
        json.dumps(mem.score_explanations, default=str),
        json.dumps(mem.trait_history, default=str),
        json.dumps(mem.preferences, default=str),
        now,
        now
    ))
    return {"status": "persistent memory updated"}

@router.get("/persistent-memory/{uuid}")
def get_user(uuid: str):
    if not conn or not cursor:
        print("⚠️ Skipping user fetch: no DB connection")
        return {}
    cursor.execute("SELECT * FROM user_memory WHERE uuid = %s", (uuid,))
    result = cursor.fetchone()
    if not result:
        return {}
    return {
        "uuid": result[0],
        "initial_personality_scores": result[1],
        "score_explanations": result[2],
        "trait_history": result[3],
        "preferences": result[4],
        "created_at": result[5],
        "last_updated": result[6]
    }

@router.get("/review/{uuid}")
def get_session_review(uuid: str):
    if not conn or not cursor:
        print("⚠️ Skipping review fetch: no DB connection")
        return {"conversation_log": {}, "persistent_memory": {}}

    cursor.execute("SELECT conversation_log FROM session_memory WHERE uuid = %s", (uuid,))
    session_result = cursor.fetchone()

    cursor.execute("SELECT * FROM user_memory WHERE uuid = %s", (uuid,))
    user_result = cursor.fetchone()

    return {
        "conversation_log": session_result[0] if session_result else {},
        "persistent_memory": {
            "uuid": user_result[0],
            "initial_personality_scores": user_result[1],
            "score_explanations": user_result[2],
            "trait_history": user_result[3],
            "preferences": user_result[4],
            "created_at": user_result[5],
            "last_updated": user_result[6],
        } if user_result else {}
    }