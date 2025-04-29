import json
from backend.embeddings import get_embedding
from backend.vectorstore import collection  # or however your collection is defined

jsonl_path = "data/glossary.jsonl"  # update if needed

def load_and_ingest():
    with open(jsonl_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    for idx, line in enumerate(lines):
        entry = json.loads(line)
        text = entry.get("definition", entry.get("text", ""))  # fallback if needed
        metadata = {
            k: v for k, v in entry.items()
            if k not in ("definition", "text") and isinstance(v, (str, int, float, bool))
        }

        print(f"🔁 Ingesting glossary term: {metadata.get('term', f'item-{idx}')}")

        embedding = get_embedding(text)
        collection.add(
            documents=[text],
            embeddings=[embedding],
            metadatas=[metadata],
            ids=[f"glossary-{idx}"]
        )

    print("✅ Glossary ingestion complete.")

if __name__ == "__main__":
    load_and_ingest()
