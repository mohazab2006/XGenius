from __future__ import annotations

import secrets


def resolve_random_seed(query_value: int) -> int:
    """Reproducible if query_value >= 0; otherwise a fresh random 63-bit positive seed."""
    if query_value < 0:
        return int(secrets.randbits(63))
    return int(query_value)
