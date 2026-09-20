import time
import threading
import hashlib
import re
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse, Response


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    OWASP xavfsizlik sarlavhalarini barcha javoblarga qo'shadi.
    XSS, Clickjacking, MIME-sniffing va ma'lumot oshkor bo'lishiga qarshi himoya.
    """

    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)

        # Asosiy xavfsizlik sarlavhalari
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = (
            "camera=(), microphone=(), geolocation=(), payment=(), usb=(), "
            "accelerometer=(), gyroscope=(), magnetometer=()"
        )

        # Server nomini oshkor qilmang
        response.headers["Server"] = "TalabaGo"

        # Content Security Policy (XSS va injeksiyalarga qarshi)
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            "font-src 'self' https://fonts.gstatic.com data:; "
            "img-src 'self' data: https: blob:; "
            "connect-src 'self' http://localhost:8000 http://127.0.0.1:8000 https://api.dicebear.com; "
            "frame-ancestors 'none';"
        )

        # HTTPS da HSTS (ishlab chiqarishda 1 yil)
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"

        # Kesh yo'riqnomasi — API javoblari keshlanmasin
        if request.url.path.startswith("/api/"):
            response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, private"
            response.headers["Pragma"] = "no-cache"

        return response


class RequestSizeLimiterMiddleware(BaseHTTPMiddleware):
    """
    Xotira tugashi va Slowloris/katta-payload DoS hujumlariga qarshi himoya.
    Maksimal 10 MB so'rov hajmi (kod bajarish endpointi uchun kichikroq).
    """

    MAX_BYTES = 10_485_760   # 10 MB — umumiy limit
    CODE_MAX_BYTES = 51_200  # 50 KB  — kod bajarish uchun

    async def dispatch(self, request: Request, call_next):
        if request.method == "OPTIONS":
            return await call_next(request)

        path = request.url.path
        content_length = request.headers.get("content-length")

        if content_length:
            try:
                length = int(content_length)
                # Kod bajarish endpointiga qattiqroq limit
                if path == "/api/learning/run" and length > self.CODE_MAX_BYTES:
                    return JSONResponse(
                        status_code=413,
                        content={"detail": "Kod hajmi juda katta (max 50 KB)."},
                    )
                if length > self.MAX_BYTES:
                    return JSONResponse(
                        status_code=413,
                        content={"detail": "So'rov hajmi juda katta. Maksimal: 10 MB."},
                    )
            except ValueError:
                pass

        return await call_next(request)


# IP bloklash ro'yxati (brute-force uchun)
_blocked_ips: dict[str, float] = {}
_blocked_lock = threading.Lock()
BLOCK_DURATION = 900  # 15 daqiqa


class RateLimiterMiddleware(BaseHTTPMiddleware):
    """
    DDoS, credential brute-force va scraping hujumlariga qarshi dinamik tezlik cheklagichi.
    Har bir marshrut sezgirligi asosida alohida chegara.
    Brute-force aniqlansa — IP 15 daqiqaga bloklanadi.
    """

    def __init__(self, app):
        super().__init__(app)
        self._clients: dict[str, list[float]] = {}
        self._lock = threading.Lock()
        self._last_cleanup = time.time()

    def _get_client_ip(self, request: Request) -> str:
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
        if now - self._last_cleanup > 300:
            threshold = now - 120
            self._clients = {
                ip: [t for t in times if t > threshold]
                for ip, times in self._clients.items()
                if any(t > threshold for t in times)
            }
            # Muddati tugagan bloklarni ham tozala
            with _blocked_lock:
                expired = [ip for ip, until in _blocked_ips.items() if now > until]
                for ip in expired:
                    del _blocked_ips[ip]
            self._last_cleanup = now

    async def dispatch(self, request: Request, call_next):
        if request.method == "OPTIONS":
            return await call_next(request)

        path = request.url.path
        client_ip = self._get_client_ip(request)
        now = time.time()

        # Bloklangan IP tekshiruvi
        with _blocked_lock:
            if client_ip in _blocked_ips:
                if now < _blocked_ips[client_ip]:
                    remaining = int(_blocked_ips[client_ip] - now)
                    return JSONResponse(
                        status_code=429,
                        headers={"Retry-After": str(remaining)},
                        content={
                            "detail": (
                                f"IP manzilingiz {remaining} soniyaga vaqtincha bloklangan. "
                                "Juda ko'p noto'g'ri urinishlar aniqlandi."
                            )
                        },
                    )
                else:
                    del _blocked_ips[client_ip]

        is_local = client_ip in ("127.0.0.1", "::1", "localhost", "testclient")

        # Har bir marshrut uchun alohida limitlar
        if path.startswith("/api/auth/login") or path.startswith("/api/auth/register"):
            max_requests = 200 if is_local else 8   # 8 ta urinish/daqiqa — brute-force himoya
            window = 60
            key = f"{client_ip}:login"
            brute_threshold = 15  # Agar 15 dan oshsa — bloklash
        elif path.startswith("/api/learning/run"):
            max_requests = 500 if is_local else 30  # 30 ta kod bajarish/daqiqa
            window = 60
            key = f"{client_ip}:coderun"
            brute_threshold = None
        elif path.startswith("/api/ai/"):
            max_requests = 300 if is_local else 20
            window = 60
            key = f"{client_ip}:ai"
            brute_threshold = None
        elif path.startswith("/api/admin/"):
            max_requests = 1000 if is_local else 100
            window = 60
            key = f"{client_ip}:admin"
            brute_threshold = None
        elif path.startswith("/api/"):
            max_requests = 5000 if is_local else 300
            window = 60
            key = f"{client_ip}:api"
            brute_threshold = None
        else:
            max_requests = 10000 if is_local else 1200
            window = 60
            key = f"{client_ip}:static"
            brute_threshold = None

        with self._lock:
            self._cleanup_stale(now)
            timestamps = self._clients.get(key, [])
            timestamps = [t for t in timestamps if now - t < window]

            if len(timestamps) >= max_requests:
                # Brute-force aniqlanganda IP bloklash
                if brute_threshold and len(timestamps) >= brute_threshold:
                    with _blocked_lock:
                        _blocked_ips[client_ip] = now + BLOCK_DURATION
                    return JSONResponse(
                        status_code=429,
                        headers={"Retry-After": str(BLOCK_DURATION)},
                        content={
                            "detail": (
                                "Juda ko'p muvaffaqiyatsiz urinish aniqlandi. "
                                f"IP manzilingiz {BLOCK_DURATION // 60} daqiqaga bloklandi."
                            )
                        },
                    )
                return JSONResponse(
                    status_code=429,
                    headers={"Retry-After": "60"},
                    content={
                        "detail": "Juda ko'p so'rov yuborildi. 1 daqiqadan so'ng qayta urinib ko'ring."
                    },
                )

            timestamps.append(now)
            self._clients[key] = timestamps

        return await call_next(request)


class PathTraversalGuardMiddleware(BaseHTTPMiddleware):
    """
    URL yo'lida path traversal (/../) hujumlariga qarshi himoya.
    """

    _TRAVERSAL = re.compile(r"\.\.(\\|\/|%2F|%5C|%252F|%255C)", re.IGNORECASE)

    async def dispatch(self, request: Request, call_next):
        raw_path = str(request.url)
        if self._TRAVERSAL.search(raw_path):
            return JSONResponse(
                status_code=400,
                content={"detail": "Noto'g'ri so'rov yo'li."},
            )
        return await call_next(request)
