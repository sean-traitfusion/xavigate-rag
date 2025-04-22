import json
from pathlib import Path
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Step 1: Load JSON and flatten into text blocks
def load_ad_framework(path: str) -> list[str]:
    import json
    from pathlib import Path

    raw = json.loads(Path(path).read_text())
    posts = raw["db"][0]["data"]["posts"]

    all_texts = []

    for post in posts:
        title = post.get("title", "")
        content = post.get("plaintext", "")
        if content:
            full_text = f"{title}\n\n{content}"
            all_texts.append(full_text.strip())

    return all_texts

# Step 2: Join and chunk with LangChain
def chunk_texts(texts: list[str], chunk_size=500, chunk_overlap=100) -> list[dict]:
    splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
        model_name="text-embedding-3-small",
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
    )
    joined_text = "\n".join(texts)
    chunks = splitter.split_text(joined_text)
    return [{"chunk_index": i, "content": chunk, "tokens": len(chunk.split())} for i, chunk in enumerate(chunks)]