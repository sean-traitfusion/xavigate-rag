from openai import OpenAI
import os
import sys
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
prompt = " ".join(sys.argv[1:])

if not prompt:
    print("❌ No prompt provided.")
    sys.exit(1)

response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "You are a senior developer writing clean, production-grade code."},
        {"role": "user", "content": prompt}
    ]
)

output = response.choices[0].message.content.strip()

# Write output to a timestamped file
from datetime import datetime
filename = f"codex_output_{datetime.now().strftime('%Y%m%d_%H%M%S')}.py"

with open(filename, "w") as f:
    f.write(output)

print(f"\n💡 Codex Suggestion written to: {filename}\n")
print(output)