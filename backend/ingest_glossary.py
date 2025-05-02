from chunking import prepare_chunks
from vectorstore import add_to_chroma  
from pathlib import Path

def ingest_all_data():
    data_root = Path("data")
    doc_paths = list(data_root.rglob("*.docx")) + list(data_root.rglob("*.jsonl"))

    for path in doc_paths:
        print(f"Ingesting: {path}")
        chunks = prepare_chunks(str(path))
        add_to_chroma(chunks)  # This function pushes the chunks to Chroma

if __name__ == "__main__":
    ingest_all_data()