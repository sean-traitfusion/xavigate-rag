from pathlib import Path
import json
from chunking import prepare_chunks

def bulk_chunk_all(base_dir: str):
    base = Path(base_dir)
    all_chunks = []

    for folder in base.iterdir():
        if folder.is_dir() and folder.name != "glossary":
            print(f"\n📂 Processing folder: {folder.name}")
            for file_path in folder.glob("*"):
                if file_path.suffix.lower() in [".docx", ".md", ".jsonl"]:
                    print(f"  📄 {file_path.name}")
                    try:
                        chunks = prepare_chunks(str(file_path))
                        all_chunks.extend(chunks)
                    except Exception as e:
                        print(f"    ⚠️ Error processing {file_path.name}: {e}")

    print(f"\n✅ Total chunks created: {len(all_chunks)}")

    # Save all to one big JSONL
    output_file = "bulk_chunks_all.jsonl"
    with open(output_file, "w", encoding="utf-8") as f:
        for chunk in all_chunks:
            f.write(json.dumps(chunk, ensure_ascii=False) + "\n")

    print(f"✅ Saved all chunks to {output_file}")

if __name__ == "__main__":
    bulk_chunk_all("data/")