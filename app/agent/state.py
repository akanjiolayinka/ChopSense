"""Typed state object flowing through the LangGraph agent.

Each node reads fields from this state and writes its outputs back. Keeping the
schema explicit makes the pipeline debuggable and lets us inspect any failure
at the exact stage it happened.
"""

# from typing import TypedDict, List, Optional


# TODO: define AgentState with persona, retrieved candidates, reranked list,
# reasoning trace, final response, and session metadata.
