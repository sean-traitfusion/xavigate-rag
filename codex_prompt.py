import openai
import sys
import os

openai.api_key = os.getenv("OPENAI_API_KEY")

prompt = " ".join(sys.argv[1:])

if not prompt:
    print("❌ No prompt provided.")
    sys.exit(1)

response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "You are a senior developer writing high-quality Python code."},
        {"role": "user", "content": prompt}
    ]
)

print("\n💡 Codex Suggestion:\n")
print(response.choices[0].message.content.strip())