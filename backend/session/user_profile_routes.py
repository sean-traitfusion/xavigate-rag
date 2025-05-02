# backend/session/user_profile_routes.py
from fastapi import APIRouter
from backend.memory.storage import load_user_profile

router = APIRouter()

@router.get("/api/user/{user_id}")
async def get_user_profile(user_id: str):
    profile = load_user_profile(user_id)
    if not profile:
        return {"error": "User not found"}
    return profile.dict()
