from pathlib import Path
from pydantic_settings import BaseSettings

# Root papka (studenthub/)
BASE_DIR = Path(__file__).resolve().parent.parent
DEFAULT_DB_PATH = (BASE_DIR / "studenthub.db").as_posix()

_DEFAULT_INSECURE_KEY = "change-this-secret-key-in-production"


class Settings(BaseSettings):
    DATABASE_URL: str = f"sqlite:///{DEFAULT_DB_PATH}"
    SECRET_KEY: str = _DEFAULT_INSECURE_KEY
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    # CORS — lokal ishlab chiqishda localhost:3000, ishlab chiqarishda domeningizni kiriting
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"

    OPENAI_API_KEY: str | None = None
    OPENAI_BASE_URL: str = "https://api.openai.com/v1"
    OPENAI_MODEL: str = "gpt-4o-mini"

    GEMINI_API_KEY: str | None = None
    GEMINI_MODEL: str = "gemini-3-flash-preview"

    @property
    def has_ai_key(self) -> bool:
        return bool(self.GEMINI_API_KEY or self.OPENAI_API_KEY)

    class Config:
        env_file = ".env"

    def get_allowed_origins(self) -> list[str]:
        """CORS uchun ruxsat etilgan origin ro'yxatini qaytaradi."""
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]


settings = Settings()

# ==============================================================================
# Xavfsizlik ogohlantirishi: agar standart kalit ishlatilsa
# ==============================================================================
import sys
import logging as _logging
_log = _logging.getLogger("studenthub.config")

if settings.SECRET_KEY == _DEFAULT_INSECURE_KEY:
    _log.warning(
        "⚠️  XAVFSIZLIK XATARI: SECRET_KEY standart (xavfli) qiymatda turибди! "
        ".env faylida SECRET_KEY = <kuchli tasodifiy kalit> ni o'rnating. "
        "Buyruq: python -c \"import secrets; print(secrets.token_hex(48))\""
    )