"""Typed state objects flowing through the LangGraph agent.

Each node reads fields off this state and writes its outputs back. Keeping the
schema explicit makes the pipeline debuggable and lets the API layer return
the same shape it inspects internally.
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, ConfigDict, Field


class UserPersona(BaseModel):
    """What the agent believes about the user for this request.

    Most fields are optional because the persona is built incrementally over
    the course of a conversation — a first-turn cold-start user will only
    have ``raw_message`` filled in.
    """

    user_id: Optional[str] = None
    location: Optional[str] = None
    city: Optional[str] = None
    group_size: Optional[int] = None
    budget_ngn: Optional[int] = None
    mood: Optional[str] = None
    occasion: Optional[str] = None
    cuisine_preferences: List[str] = Field(default_factory=list)
    dietary_restrictions: List[str] = Field(default_factory=list)
    price_range: Optional[str] = None
    raw_message: Optional[str] = None


class RestaurantCandidate(BaseModel):
    """A single restaurant carried through the retrieval and rerank stages."""

    business_id: str
    name: str
    categories: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    price_range: Optional[str] = None
    rating: Optional[float] = None
    review_count: Optional[int] = None
    description: Optional[str] = None

    similarity_score: float = 0.0
    rerank_score: Optional[float] = None
    why_picked: Optional[str] = None


class ConversationTurn(BaseModel):
    role: str
    content: str


class AgentState(BaseModel):
    """The full state object carried through the LangGraph pipeline."""

    model_config = ConfigDict(arbitrary_types_allowed=True)

    session_id: str
    turn_number: int = 0
    user_persona: UserPersona = Field(default_factory=UserPersona)
    conversation_history: List[ConversationTurn] = Field(default_factory=list)
    candidates: List[RestaurantCandidate] = Field(default_factory=list)
    final_recommendations: List[RestaurantCandidate] = Field(default_factory=list)
    reasoning_trace: Optional[str] = None
    is_cold_start: bool = True
    context_summary: Optional[str] = None
    extras: Dict[str, Any] = Field(default_factory=dict)
