# backend/memory/storage.py
import json
from pathlib import Path
from datetime import datetime
from typing import Optional
from typing import List
from .models import UserProfile, SessionRecord
import os
import time
import psycopg2
from psycopg2 import OperationalError
import psycopg2.extras
from dotenv import load_dotenv
load_dotenv()

USE_DB = os.getenv("ENV") != "dev"

if USE_DB:
    
    def wait_for_postgres(url, retries=10):
        for i in range(retries):
            try:
                return psycopg2.connect(url)
            except OperationalError as e:
                print(f"⏳ Waiting for Postgres... ({i+1}/{retries})")
                time.sleep(2)
        raise RuntimeError("Postgres did not become available")

    conn = wait_for_postgres(os.getenv("DATABASE_URL"))
    conn.autocommit = True
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)  # ← Use DictCursor

DATA_DIR = Path("backend/memory/data")
DATA_DIR.mkdir(parents=True, exist_ok=True)

from backend.session.session_state import PromptExchange

def load_session_history(user_id: str) -> List[PromptExchange]:
    if not USE_DB:
        print("🧪 Returning mock session history")
        return []

    cursor.execute("SELECT conversation_log FROM session_memory WHERE uuid = %s", (user_id,))
    result = cursor.fetchone()
    if not result or not result["conversation_log"]:
        return []

    try:
        exchanges = result["conversation_log"].get("exchanges", [])
        return [
            PromptExchange(
                user_prompt=entry.get("user_prompt", ""),
                assistant_response=entry.get("assistant_response", ""),
                tags=entry.get("tags", [])
            )
            for entry in exchanges
        ]
    except Exception as e:
        print(f"⚠️ Failed to parse conversation_log: {e}")
        return []

def get_user_filepath(user_id: str) -> Path:
    return DATA_DIR / f"user_{user_id}.json"


def load_user_profile(user_id: str) -> Optional[UserProfile]:
    filepath = get_user_filepath(user_id)
    if filepath.exists():
        with open(filepath, "r") as f:
            data = json.load(f)
            return UserProfile(**data)

    if USE_DB:
        cursor.execute("SELECT * FROM user_memory WHERE uuid = %s", (user_id,))
        result = cursor.fetchone()
        if result:
            trait_history = result["trait_history"] or {}
            return UserProfile(
                user_id=result["uuid"],
                name=result.get("name", "User"), # Default name if not found
                onboarding_date=result["created_at"],
                alignment_index_history=[],  # placeholder
                quadrant_history=[],         # placeholder
                avatar_profile=None,
                dominant_traits=trait_history.get("dominant_traits", []),
                suppressed_traits=trait_history.get("suppressed_traits", []),
                trust_established_flag=True,
                alignment_tags=[],
                alignment_stage="Imported from DB"
            )
    return None

    if USE_DB:
        cursor.execute("SELECT * FROM user_memory WHERE uuid = %s", (user_id,))
        result = cursor.fetchone()
        if result:
            # TODO: map DB row into UserProfile fields
            ...
    return None


def save_user_profile(profile: UserProfile):
    filepath = get_user_filepath(profile.user_id)
    with open(filepath, "w") as f:
        json.dump(profile.dict(), f, indent=2, default=str)


def save_session_record(record: SessionRecord):
    session_log_path = DATA_DIR / f"sessions_{record.user_id}.jsonl"
    with open(session_log_path, "a") as f:
        json.dump(record.dict(), f, default=str)
        f.write("\n")


def get_alignment_history(user_id: str) -> list:
    filepath = DATA_DIR / f"sessions_{user_id}.jsonl"
    if not filepath.exists():
        return []
    with open(filepath, "r") as f:
        return [json.loads(line) for line in f.readlines()]
    
def purge_expired_session_memory():
    if not USE_DB:
        print("🧪 Skipping purge in dev mode")
        return

    cursor.execute("DELETE FROM session_memory WHERE expires_at < NOW();")
    print("🧹 Expired session memory purged")


# Dev test hook
def init_test_user():
    profile = UserProfile(
        user_id="test123",
        name="Test User",
        onboarding_date=datetime.now(),
        dominant_traits=["Creative", "Healing"],
        alignment_stage="Early Discovery",
        trust_established_flag=True
    )
    save_user_profile(profile)
    print("✅ Test user initialized")
