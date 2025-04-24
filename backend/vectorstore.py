from chromadb import PersistentClient
from chromadb.utils.embedding_functions import OpenAIEmbeddingFunction
from backend.db import get_connection
from backend.embeddings import get_embedding
import uuid
import json

client = PersistentClient(path="chroma_db")

collection = client.get_or_create_collection(
    name="xavigate_ad",
)

def get_unembedded_chunks(limit=100):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT id, chunk_index, content, metadata
                FROM documents
                WHERE embedding IS NULL
                LIMIT %s
            """, (limit,))
            return cur.fetchall()

def update_embedding(doc_id, embedding):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                UPDATE documents
                SET embedding = %s
                WHERE id = %s
            """, (embedding, doc_id))
        conn.commit()

def upsert_to_chroma(docs):
    for doc in docs:
        doc_id, chunk_index, content, metadata = doc
        embedding = get_embedding(content)

        # Upsert into Chroma
        collection.upsert(
            documents=[content],
            ids=[str(doc_id)],
            metadatas=[{
                "chunk_index": chunk_index,
                **(metadata if metadata else {})
            }],
            embeddings=[embedding]
        )

        # Store embedding in Postgres
        update_embedding(doc_id, embedding)

    print(f"✅ Upserted {len(docs)} chunks into Chroma")