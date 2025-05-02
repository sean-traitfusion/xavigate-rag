# backend/onboarding/onboarding_routes.py
from fastapi import APIRouter
from pydantic import BaseModel
from backend.onboarding.flow import run_onboarding

router = APIRouter()

class OnboardingInput(BaseModel):
    user_id: str
    name: str
    traits_used: list[str]
    traits_suppressed: list[str]
    environment_support: str  # 'Yes', 'Sometimes', 'No'
    environment_blockers: list[str]

@router.post("/api/onboarding")
async def onboarding_handler(payload: OnboardingInput):
    profile = run_onboarding(
        user_id=payload.user_id,
        name=payload.name,
        traits_used=payload.traits_used,
        traits_suppressed=payload.traits_suppressed,
        environment_support=payload.environment_support,
        environment_blockers=payload.environment_blockers
    )
    return {
        "message": "Onboarding complete",
        "quadrant": profile.baseline_quadrant,
        "ax": profile.baseline_ax,
        "traits": profile.dominant_traits,
    }

print("✅ onboarding_routes loaded")
