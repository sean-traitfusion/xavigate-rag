import requests
import os
from dotenv import load_dotenv
load_dotenv()

port = os.getenv("API_PORT", 8010)
BASE_URL = f"http://localhost:{port}"

UUID = "00000000-0000-0000-0000-000000000001"

headers = {
    "X-XAVIGATE-KEY": "supersecuredevkey",
}

payload = {
    "uuid": UUID,
    "initial_personality_scores": {"clarity": 0.9},
    "score_explanations": {"clarity": "Clarifying source of disconnect"},
    "trait_history": {"tags_from_session": ["burnout", "overdrive"]},
    "preferences": {}
}

payload["uuid"] = str(payload["uuid"])

resp = requests.post(
    f"{BASE_URL}/persistent-memory",
    json=payload,
    headers=headers
)

print("\n📤 API Response:")
print(resp.json())