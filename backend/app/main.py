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
)

logger = logging.getLogger("studenthub")
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

app = FastAPI(
    title="StudentHUB API",
    description="O'zbekiston talabalari uchun xavfsiz akademik materiallar platformasi",
    version="0.3.0",
    docs_url="/docs",
    redoc_url=None,
)

# Global Safe Exception Handler (prevents leaking stack traces or internal DB info)
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Xavfsiz ushlangan server xatosi ({request.method} {request.url.path}): {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Serverda kutilmagan ichki xatolik yuz berdi. Tizim xatolikni avtomatik qayd etdi."},
    )

# Security Middlewares (executed in order)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RateLimiterMiddleware)
app.add_middleware(RequestSizeLimiterMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
        finally:
            db.close()
    except Exception as e:
        logger.warning(f"Boshlang'ich ma'lumotlarni tekshirishda xatolik: {e}")

# Root API endpoint for health check
@app.get("/health")
async def health_check():
    return {"status": "ok"}