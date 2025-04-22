from chromadb import PersistentClient
from backend.embeddings import get_embedding

client = PersistentClient(path="chroma_db")
collection = client.get_or_create_collection(name="xavigate_ad")

def run_query(question: str, top_k=3, filters: dict = None):
    query_vector = get_embedding(question)
    filters = filters or {}

    query_args = {
        "query_embeddings": [query_vector],
        "n_results": top_k,
    }

    if filters:
        query_args["where"] = filters

    results = collection.query(**query_args)

    return [
        {
            "text": results["documents"][0][i],
            "metadata": results["metadatas"][0][i]
        }
        for i in range(len(results["documents"][0]))
    ]