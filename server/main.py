from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import pathlib

from .routes import (
    auth_router,
    universities_router,
    files_router,
    ai_router,
    tests_router,
    stats_router,
    rewards_router,
    admin_router,
    announcements_router,
    subscription_router,
    learning_router,
)
from .init_db import init_db

import logging
from starlette.requests import Request
from starlette.responses import JSONResponse

from .security_middleware import (
    SecurityHeadersMiddleware,
    RateLimiterMiddleware,
    RequestSizeLimiterMiddleware,
    PathTraversalGuardMiddleware,
)
from .config import settings



logger = logging.getLogger("studenthub")
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

# API docs faqat lokal ishlab chiqarish uchun ochiq
# Ishlab chiqarishda docs_url=None qilib o'chiring
_is_dev = settings.SECRET_KEY == "change-this-secret-key-in-production" or settings.DATABASE_URL.startswith("sqlite")

app = FastAPI(
    title="StudentHUB API",
    description="O'zbekiston talabalari uchun xavfsiz akademik materiallar platformasi",
    version="0.3.0",
    docs_url="/docs" if _is_dev else None,
    redoc_url=None,
    openapi_url="/openapi.json" if _is_dev else None,
)

from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

# Specific Exception Handlers so 4xx errors retain their status code and detail messages
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    extra_headers = getattr(exc, "headers", None) or {}
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
        headers=extra_headers if extra_headers else None,
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    detail = "Kiritilgan ma'lumotlarda xatolik bor"
    if errors:
        first_err = errors[0]
        field = first_err.get("loc", [""])[-1]
        msg = first_err.get("msg", "")
        if "password" in str(field).lower():
            detail = "Parol talablarga javob bermaydi (kamida 8 ta belgi, katta va kichik harf hamda raqam bo'lishi shart)"
        elif "username" in str(field).lower():
            detail = "Login kamida 3 ta belgidan iborat bo'lishi kerak"
        else:
            detail = f"{field}: {msg}"
    return JSONResponse(
        status_code=422,
        content={"detail": detail},
    )

# Global Safe Exception Handler (for unhandled 500 errors only)
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Xavfsiz ushlangan server xatosi ({request.method} {request.url.path}): {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Serverda kutilmagan xatolik yuz berdi. Iltimos, qayta urinib ko'ring."},
    )

# Security Middlewares (executed in reverse order — last added = first executed)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RateLimiterMiddleware)
app.add_middleware(RequestSizeLimiterMiddleware)
app.add_middleware(PathTraversalGuardMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept", "X-Requested-With"],
    max_age=3600,
)

# Include API routers
app.include_router(auth_router)
app.include_router(universities_router)
app.include_router(files_router)
app.include_router(ai_router)
app.include_router(tests_router)
app.include_router(stats_router)
app.include_router(rewards_router)
app.include_router(admin_router)
app.include_router(announcements_router)
app.include_router(subscription_router)
app.include_router(learning_router)

@app.on_event("startup")
def on_startup():
    init_db()
    try:
        from .database import SessionLocal
        from .models import University
        from .seed import seed
        db = SessionLocal()
        try:
            if db.query(University).count() == 0:
                logger.info("Baza bo'sh, boshlang'ich ma'lumotlar (seed) yuklanmoqda...")
                seed(db)
                logger.info("Boshlang'ich ma'lumotlar muvaffaqiyatli yuklandi.")
            from .models import Test
            from .seed_all import seed_all
            if db.query(Test).count() == 0:
                logger.info("Testlar bazasi bo'sh, barcha testlar generatsiya qilinmoqda...")
                seed_all(db)
                logger.info("Testlar muvaffaqiyatli generatsiya qilindi.")
        finally:
            db.close()
    except Exception as e:
        logger.warning(f"Boshlang'ich ma'lumotlarni tekshirishda xatolik: {e}")

# Root API endpoint for health check
@app.get("/health")
async def health_check():
    return {"status": "ok"}