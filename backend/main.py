import sys
import os
sys.path.append(os.path.dirname(__file__))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

print("🚀 main.py has been loaded", flush=True)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
print("✅ CORS middleware loaded", flush=True)


try:
    from backend.api import router as api_router
    app.include_router(api_router)
    print("✅ api_router loaded", flush=True)
except Exception as e:
    print("❌ Failed to load api_router:", e)
    raise

try:
    from backend.memory.routes import router as memory_router
    app.include_router(memory_router)
    print("✅ memory_router loaded", flush=True)
except Exception as e:
    print("❌ Failed to load memory_router:", e)
    raise

try:
    from backend.onboarding.onboarding_routes import router as onboarding_router
    app.include_router(onboarding_router)
    print("✅ onboarding_router loaded", flush=True)
except Exception as e:
    print("❌ Failed to load onboarding_router:", e)
    raise

try:
    from backend.session.session_routes import router as session_router
    app.include_router(session_router)
    print("✅ session_router loaded", flush=True)
except Exception as e:
    print("❌ Failed to load session_router:", e)
    raise

try:
    from backend.session.aq_routes import router as aq_router
    app.include_router(aq_router)
    print("✅ aq_router loaded", flush=True)
except Exception as e:
    print("❌ Failed to load aq_router:", e)
    raise

try:
    from backend.session.user_profile_routes import router as user_profile_router
    app.include_router(user_profile_router)
    print("✅ user_profile_router loaded", flush=True)
except Exception as e:
    print("❌ Failed to load user_profile_router:", e)
    raise

print("🚦 Routes loaded:", flush=True)
for r in app.routes:
    print(f"{r.path} — {r.methods}", flush=True)