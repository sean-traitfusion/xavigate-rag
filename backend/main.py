from chunking import load_ad_framework, chunk_texts
from db import insert_chunks, get_connection
from vectorstore import get_unembedded_chunks, upsert_to_chroma
from query import query_ad_framework

def documents_exist():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM documents")
            return cur.fetchone()[0] > 0


if __name__ == "__main__":
    if not documents_exist():
        print("📄 No documents found. Ingesting...")
        texts = load_ad_framework("data/ad_framework.json")
        print(f"🧪 Loaded {len(texts)} cleaned text blocks.")
        chunks = chunk_texts(texts)
        insert_chunks(chunks)
    else:
        print("✅ Documents already exist in DB, skipping ingestion.")

    # Embed and upsert into Chroma
    docs = get_unembedded_chunks(limit=20)
    upsert_to_chroma(docs)

    query_ad_framework("How does the AD framework handle misalignment in teams?")