import time
import threading
from typing import Any, Callable, Optional


class MemoryCache:
    """
    High-performance thread-safe in-memory TTL cache.
    Eliminates redundant database queries during traffic spikes (100k+ users).
    """

    def __init__(self):
        self._store: dict[str, tuple[float, Any]] = {}
        self._lock = threading.Lock()

    def get(self, key: str) -> Optional[Any]:
        with self._lock:
            entry = self._store.get(key)
            if not entry:
                return None
            expiry, value = entry
            if time.time() > expiry:
                del self._store[key]
                return None
            return value

    def set(self, key: str, value: Any, ttl_seconds: int = 60) -> None:
        with self._lock:
            self._store[key] = (time.time() + ttl_seconds, value)

    def delete(self, key: str) -> None:
        with self._lock:
            self._store.pop(key, None)

    def clear_prefix(self, prefix: str) -> None:
        with self._lock:
            keys_to_delete = [k for k in self._store if k.startswith(prefix)]
            for k in keys_to_delete:
                del self._store[k]

    def clear(self) -> None:
        with self._lock:
            self._store.clear()


cache = MemoryCache()
