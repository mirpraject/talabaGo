import time
import threading
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse, Response


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Applies standard OWASP security headers to all responses.
    Mitigates XSS, Clickjacking, MIME-sniffing, and info disclosure.
    """

    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)

        # Essential Security Headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "SAMEORIGIN"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        response.headers["Server"] = "StudentHUB-Security-Engine"

        return response


class RequestSizeLimiterMiddleware(BaseHTTPMiddleware):
    """
    Guards against memory exhaustion and Slowloris/huge-payload DoS attacks.
    Limits upload and request payloads to maximum 50 MB.
    """

    MAX_BYTES = 52_428_800  # 50 Megabytes

    async def dispatch(self, request: Request, call_next):
        if request.method == "OPTIONS":
            return await call_next(request)

        content_length = request.headers.get("content-length")
        if content_length:
            try:
                length = int(content_length)
                if length > self.MAX_BYTES:
                    return JSONResponse(
                        status_code=413,
                        content={
                            "detail": "So'rov hajmi juda katta. Maksimal ruxsat etilgan hajm: 50 MB (Payload Too Large)."
                        },
                    )
            except ValueError:
                pass

        return await call_next(request)


class RateLimiterMiddleware(BaseHTTPMiddleware):
    """
    In-memory dynamic rate limiter to protect against DDoS, credential brute-forcing, and scraping.
    Routes have distinct thresholds based on sensitivity.
    """

    def __init__(self, app):
        super().__init__(app)
        # IP -> list of timestamps
        self._clients: dict[str, list[float]] = {}
        self._lock = threading.Lock()
        self._last_cleanup = time.time()

    def _get_client_ip(self, request: Request) -> str:
        # Check standard reverse proxy headers
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            return forwarded.split(",")[0].strip()
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip.strip()
        if request.client and request.client.host:
            return request.client.host
        return "127.0.0.1"

    def _cleanup_stale(self, now: float):
        # Run cleanup every 5 minutes to prevent memory leak
        if now - self._last_cleanup > 300:
            threshold = now - 120
            self._clients = {
                ip: [t for t in times if t > threshold]
                for ip, times in self._clients.items()
                if any(t > threshold for t in times)
            }
            self._last_cleanup = now

    async def dispatch(self, request: Request, call_next):
        if request.method == "OPTIONS":
            return await call_next(request)

        path = request.url.path
        method = request.method
        client_ip = self._get_client_ip(request)

        # Local development / loopback traffic should not be choked
        is_local = client_ip in ("127.0.0.1", "::1", "localhost", "testclient")

        # Determine rate limit quota per minute
        # Sensitive routes: login / register / AI
        if path.startswith("/api/auth/login") or path.startswith("/api/auth/register"):
            max_requests = 100 if is_local else 20  # generous for local dev
            window = 60
            key = f"{client_ip}:login"
        elif path.startswith("/api/ai/"):
            max_requests = 200 if is_local else 30
            window = 60
            key = f"{client_ip}:ai"
        elif path.startswith("/api/"):
            max_requests = 5000 if is_local else 600
            window = 60
            key = f"{client_ip}:api"
        else:
            # Static files, docs, health check
            max_requests = 10000 if is_local else 1200
            window = 60
            key = f"{client_ip}:static"

        now = time.time()

        with self._lock:
            self._cleanup_stale(now)
            timestamps = self._clients.get(key, [])
            # Keep only requests within the window
            timestamps = [t for t in timestamps if now - t < window]

            if len(timestamps) >= max_requests:
                return JSONResponse(
                    status_code=429,
                    headers={"Retry-After": "60"},
                    content={
                        "detail": "Juda ko'p so'rov yuborildi. Iltimos, 1 daqiqadan so'ng qayta urinib ko'ring (Rate limit exceeded)."
                    },
                )

            timestamps.append(now)
            self._clients[key] = timestamps

        return await call_next(request)
