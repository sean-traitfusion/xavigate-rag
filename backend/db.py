import psycopg2
from psycopg2.extras import Json
from dotenv import load_dotenv
import os

load_dotenv()

DB_CONFIG = {
    "dbname": os.getenv("POSTGRES_DB", "xavigate"),
    "user": os.getenv("POSTGRES_USER", "xavigate_user"),
    "password": os.getenv("POSTGRES_PASSWORD", "changeme"),
    "host": os.getenv("POSTGRES_HOST", "localhost"),
    "port": os.getenv("POSTGRES_PORT", "5432"),
}


def get_connection():
    return psycopg2.connect(**DB_CONFIG)


def insert_chunks(chunks, source="AD Framework"):
    with get_connection() as conn:
        with conn.cursor() as cur:
            for chunk in chunks:
                cur.execute(
                    """
                    INSERT INTO documents (source, chunk_index, content, tokens, metadata)
                    VALUES (%s, %s, %s, %s, %s)
                    """,
                    (
                        source,
                        chunk["chunk_index"],
                        chunk["content"],
                        chunk["tokens"],
                        Json({"version": "v1", "origin": "AD"}),
                    ),
                )
        conn.commit()
    print(f"✅ Inserted {len(chunks)} chunks into Postgres")