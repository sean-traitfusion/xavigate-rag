# Xavigate Diagnostic Engine

A goal-driven, theory-based conversational diagnostic system built on the Multiple Natures (MN) and Alignment Dynamics (AD) frameworks.  
Designed to identify user problems, assess underlying energetic and motivational patterns, and recommend solution modules dynamically.

---

## 🛠️ Project Structure

xavigate-diagnostic-engine/
├── backend/
│   ├── api.py                # FastAPI backend for chat app
│   ├── chunking.py            # Document chunking logic
│   ├── ingest_glossary.py     # Glossary ingestion into RAG
│   ├── convert_csv_to_jsonl.py# CSV to JSONL converter
│   ├── session_memory.py      # (planned) In-session memory tracker
│   ├── diagnostic_agent.py    # (planned) Framing and diagnostic agent
│   ├── solution_recommender.py# (planned) Module recommendation engine
├── data/
│   ├── glossary.jsonl         # Processed glossary chunks
│   ├── scope_of_xavigate.docx # Master supported areas
│   ├── task_trait_alignment.docx # Practitioner method for diagnosis
│   ├── menu_of_life.docx      # Practitioner method for life design
│   ├── common_problems.jsonl  # (planned) Common user issues
├── notes/
│   └── design_notes.md        # (optional) Planning and architectural notes
├── README.md
├── requirements.txt           # Python dependencies (planned)

---

## 🎯 MVP Phase 1 Goals

- Expand RAG with common problems, task-trait alignment, and Menu of Life methods.
- Build a Framing + Diagnostic Agent that:
  - Frames vague problems
  - Gathers diagnostic information
  - Suggests modules based on detected misalignment
- Implement basic in-session memory.
- Soft launch module recommendations even if full modules aren't built.

---

## 📚 Core Knowledge Sources

- **Glossary of Multiple Natures and Alignment Dynamics**
- **Scope of Xavigate** (areas supported)
- **Task–Trait Alignment Method** (diagnostic interviewing)
- **Menu of Life Method** (life design framework)

---

## 🚀 Notes

- Current vectorstore: **Chroma** for local RAG.
- Metadata tagging distinguishes content types (glossary, method, case study).
- Using **LangChain** + **FastAPI**.

---