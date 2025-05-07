# backend/agents/onboarding_agent.py

from backend.memory.storage import (
    load_user_profile,
    update_trait_theme,
    mark_user_unlocked,
    save_user_profile,
)
from backend.memory.models import TraitTheme
from datetime import datetime
from typing import Tuple
import random

from backend.query import rag_query  # Assumes RAG works off tags like ["onboarding_docs"]

ONBOARDING_PROMPTS = [
    "What do people often rely on you for?",
    "What part of you doesn’t get enough space lately?",
    "What are you good at — but kind of tired of doing?",
    "When do you feel most like yourself?",
    "What’s something you wish someone had asked you this week?"
]

# Placeholder theme IDs used for early inference before a full theme detection logic is in place
TRAITS_TO_PROBE = [
    "quiet_helper",
    "hidden_voice",
    "structural_mind",
    "dreamer",
    "invisible_labor"
]
# Minimum required theme count + confidence (for internal checks)
MIN_TRAITS = len(TRAITS_TO_PROBE)
MIN_CONFIDENCE = 0.6

def infer_trait_from_response(user_response: str) -> Tuple[str, float, str]:
    """
    Uses RAG to analyze a response and infer a likely trait with confidence.
    Returns: (trait_name, confidence, reason)
    """
    prompt = f"""
The user just said: "{user_response}"

Based on this, infer which Multiple Nature trait theme (e.g. Helping, Teaching, Organizing, Creating) is most likely dominant, and explain why in 1 sentence.
Return a tuple: (trait, confidence score from 0.0 to 1.0, reasoning)
"""
    response = rag_query(prompt, tags=["onboarding_docs"])
    # TEMP: simulate RAG output
    return random.choice(TRAITS_TO_PROBE), round(random.uniform(0.6, 0.85), 2), "This is a placeholder explanation"

def ask_onboarding_question(index: int) -> str:
    """
    Return the prompt text for the given onboarding index.
    """
    if 0 <= index < len(ONBOARDING_PROMPTS):
        return ONBOARDING_PROMPTS[index]
    # Fallback generic question
    return "Tell me something about what energizes you."

def process_onboarding_response(user_id: str, user_response: str):
    trait, confidence, reason = infer_trait_from_response(user_response)
    update_trait_theme(user_id, trait, TraitTheme(
        confidence=confidence,
        source="onboarding",
        notes=reason
    ))

    profile = load_user_profile(user_id)
    # Previously auto-unlocked when enough traits were gathered;
    # now only finalize unlock upon explicit user confirmation via /complete endpoint.