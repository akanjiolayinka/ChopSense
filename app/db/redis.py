"""Redis-backed session memory for multi-turn conversations."""

# import redis.asyncio as redis


async def get_session(session_id: str):
    # TODO: fetch and deserialise the session state for the given id.
    return None


async def save_session(session_id: str, state) -> None:
    # TODO: serialise and persist the session state with the configured TTL.
    return None
