from pathlib import Path
from pydantic_settings import BaseSettings

# Root papka (studenthub/)
BASE_DIR = Path(__file__).resolve().parent.parent
DEFAULT_DB_PATH = (BASE_DIR / "studenthub.db").as_posix()


class Settings(BaseSettings):
    DATABASE_URL: str = f"sqlite:///{DEFAULT_DB_PATH}"
    SECRET_KEY: str = "change-this-secret-key-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    OPENAI_API_KEY: str | None = None
    OPENAI_BASE_URL: str = "https://api.openai.com/v1"
    OPENAI_MODEL: str = "gpt-4o-mini"

    class Config:
        env_file = ".env"


settings = Settings()