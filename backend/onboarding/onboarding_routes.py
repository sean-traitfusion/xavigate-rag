# backend/onboarding/onboarding_routes.py

from fastapi import APIRouter
from pydantic import BaseModel
from backend.agents.onboarding_agent import (
    ask_onboarding_question,
    process_onboarding_response,
    ONBOARDING_PROMPTS
)
from backend.memory.storage import load_user_profile, is_user_unlocked

router = APIRouter()

@router.get("/api/onboarding/status")
def get_onboarding_status(user_id: str):
    """
    Returns whether the user has completed onboarding and their current trait themes.
    """
    # Load user profile
    profile = load_user_profile(user_id)
    unlocked = profile.unlocked if profile else False
    # Serialize trait themes if available
    trait_themes = {}
    if profile and hasattr(profile, 'trait_themes'):
        trait_themes = {k: v.dict() for k, v in profile.trait_themes.items()}
    return {"unlocked": unlocked, "trait_themes": trait_themes}
    
@router.post("/api/onboarding/reset")
def reset_onboarding(user_id: str):
    """
    Reset onboarding progress: clear traits, reset index and lock status.
    """
    from backend.memory.storage import load_user_profile, save_user_profile
    profile = load_user_profile(user_id)
    if profile:
        profile.unlocked = False
        setattr(profile, 'onboarding_index', 0)
        profile.trait_themes = {}
        save_user_profile(profile)
    return {"status": "reset"}

# Onboarding progress is persisted per user in their profile (onboarding_index)

class OnboardingResponseInput(BaseModel):
    user_id: str
    response: str

@router.get("/api/onboarding/next-question")
def get_next_onboarding_question(user_id: str):
    from backend.memory.storage import load_user_profile, save_user_profile
    from backend.memory.models import UserProfile
    from datetime import datetime

    # Load or initialize user profile
    profile = load_user_profile(user_id)
    if not profile:
        profile = UserProfile(user_id=user_id, name=None, onboarding_date=datetime.utcnow())
        save_user_profile(profile)

    # Determine next prompt index
    index = getattr(profile, "onboarding_index", 0)
    total = len(ONBOARDING_PROMPTS)
    if index >= total:
        return {"message": "All onboarding prompts completed."}

    question = ask_onboarding_question(index)
    return {
        "question": question,
        "next_prompt_index": index,
        "total_prompts": total
    }

@router.post("/api/onboarding/respond")
def submit_onboarding_response(payload: OnboardingResponseInput):
    user_id = payload.user_id
    response = payload.response

    # Process user reply and update memory
    process_onboarding_response(user_id, response)

    # Load and update user profile for persistent onboarding index
    from backend.memory.storage import load_user_profile, save_user_profile
    from backend.memory.models import UserProfile

    profile = load_user_profile(user_id)
    # Increment onboarding index for next question
    current_index = getattr(profile, "onboarding_index", 0)
    if current_index < len(ONBOARDING_PROMPTS):
        profile.onboarding_index = current_index + 1
        save_user_profile(profile)

    unlocked = is_user_unlocked(user_id)

    return {
        "message": "Response processed",
        "trait_themes": {k: v.dict() for k, v in profile.trait_themes.items()},
        "next_prompt_index": profile.onboarding_index,
        "total_prompts": len(ONBOARDING_PROMPTS)
    }

class FeedbackInput(BaseModel):
    user_id: str
    feedback: str
    confirmation: str

@router.post("/api/onboarding/feedback")
def submit_onboarding_feedback(payload: FeedbackInput):
    """
    Receive user feedback on summary and log or store it as needed.
    """
    # Log feedback
    print(f"📝 Onboarding feedback from {payload.user_id}: {payload.confirmation} — {payload.feedback}")
    # Treat feedback as a new trait response to adaptively probe
    process_onboarding_response(payload.user_id, payload.feedback)
    # Advance onboarding index
    from backend.memory.storage import load_user_profile, save_user_profile
    from backend.memory.models import UserProfile
    profile = load_user_profile(payload.user_id)
    if profile:
        idx = getattr(profile, 'onboarding_index', 0)
        if idx < len(ONBOARDING_PROMPTS):
            profile.onboarding_index = idx + 1
            save_user_profile(profile)
    # Prepare next question or summary if unlocked
    profile = load_user_profile(payload.user_id)
    unlocked = is_user_unlocked(payload.user_id)
    # Serialize trait themes
    themes = {k: v.dict() for k, v in profile.trait_themes.items()} if profile else {}
    # Next question if not unlocked
    next_q = None
    if not unlocked and profile and profile.onboarding_index < len(ONBOARDING_PROMPTS):
        next_q = ask_onboarding_question(profile.onboarding_index)
    return {
        "status": "feedback received",
        "unlocked": unlocked,
        "trait_themes": themes,
        "next_question": next_q
    }
    
class CompleteInput(BaseModel):
    user_id: str
    summary: str
    confidence: float
    confirmation: str

@router.post("/api/onboarding/complete")
def complete_onboarding(payload: CompleteInput):
    """
    Finalize onboarding: save summary, mark user unlocked permanently.
    """
    from backend.memory.storage import load_user_profile, save_user_profile
    profile = load_user_profile(payload.user_id)
    if not profile:
        return {"error": "User profile not found"}
    # Save summary and unlock
    profile.summary = payload.summary
    profile.unlocked = True
    profile.trust_established_flag = True
    profile.last_session_summary = payload.summary  # optional semantic field
    profile.alignment_index_history.append(payload.confidence)  # if numeric   
    save_user_profile(profile)
    return {"status": "completed", "summary": payload.summary}

print("✅ Modern onboarding_routes loaded")