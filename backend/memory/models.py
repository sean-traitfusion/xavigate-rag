# backend/memory/models.py
from typing import List, Optional, Dict, Union
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class AlignmentTag(BaseModel):
    tag_id: str
    category: str  # trait_misalignment, emotional_risk, etc.
    trigger_source: str  # onboarding, reflection, quadrant_transition, etc.
    priority_level: int  # 1–10
    memory_scope: str  # session or persistent
    confidence_score: Optional[float] = None
    lifespan: Optional[str] = None  # e.g. "3 sessions", "14 days"
    created_by: Optional[str] = "ai"
    first_triggered_at: Optional[datetime] = None
    last_confirmed_at: Optional[datetime] = None

class AvatarProfile(BaseModel):
    avatar_id: str
    name: str
    tone: str
    shaping_sources: List[str]
    tone_matrix: Dict[str, float]
    modulation_bounds: Dict[str, Union[float, List[float]]]
    metaphor_lens: Optional[str]
    vocabulary_style: Optional[str]
    prompt_framing: Optional[str]
    trust_distance: Optional[str]
    last_updated: datetime
    locked: bool = False

class SessionRecord(BaseModel):
    session_id: str
    user_id: str
    session_date: datetime
    # Alignment Index (AX) score for the session
    ax: Optional[float] = None
    # Alignment Quotient (AQ) score for the session
    aq: Optional[float] = None
    # Alignment Stability Score (ASS) for the session
    ass: Optional[float] = None
    quadrant: Optional[str] = None
    summary: Optional[str] = None
    session_tags: List[AlignmentTag] = []
    micro_action_suggested: Optional[str] = None
    micro_action_response: Optional[str] = None

class UserProfile(BaseModel):
    user_id: str
    name: Optional[str]
    onboarding_date: datetime
    baseline_ax: Optional[float] = None
    baseline_aq: Optional[float] = None
    baseline_quadrant: Optional[str] = None
    # Alignment Stability Score (ASS): recent stability of alignment index
    ass: Optional[float] = None
    alignment_stage: Optional[str] = None  # Early, Mid, Optimizing
    dominant_traits: List[str] = []
    suppressed_traits: List[str] = []
    alignment_tags: List[AlignmentTag] = []
    avatar_profile: Optional[AvatarProfile] = None
    alignment_index_history: List[float] = []
    alignment_quotient_history: List[float] = []
    quadrant_history: List[str] = []
    last_session_summary: Optional[str] = None
    coaching_ready_flag: Optional[bool] = False
    trust_established_flag: Optional[bool] = False

class UserMemory(BaseModel):
    uuid: UUID
    initial_personality_scores: Optional[Dict[str, float]] = None
    score_explanations: Optional[Dict[str, str]] = None
    trait_history: Optional[Dict[str, list]] = None
    preferences: Optional[Dict[str, str]] = None
    avatar_profile: Optional[AvatarProfile] = None
    created_at: Optional[datetime] = None
    last_updated: Optional[datetime] = None