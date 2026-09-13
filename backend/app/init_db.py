"""Baza sxemasini yaratish va eski bazalarni yangilash.

Ishga tushirish:
    from app.init_db import init_db
    init_db()
"""

from sqlalchemy import inspect, text

from .database import Base, engine
from . import models  # noqa: F401  — barcha modellarni ro'yxatga oladi


def _add_column(table: str, column: str, ddl: str) -> None:
    inspector = inspect(engine)
    if table not in inspector.get_table_names():
        return
    cols = {c["name"] for c in inspector.get_columns(table)}
    if column not in cols:
        with engine.begin() as conn:
            conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {ddl}"))


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
    _add_column("users", "stars", "stars INTEGER NOT NULL DEFAULT 0")
    _add_column("users", "level", "level VARCHAR")
    _add_column("users", "grade", "grade INTEGER")
    _add_column("users", "is_blocked", "is_blocked BOOLEAN DEFAULT 0")
    _add_column("users", "block_reason", "block_reason VARCHAR")
    _add_column("tests", "level", "level VARCHAR")
    _add_column("tests", "grade", "grade INTEGER")
    print("Schema muvaffaqiyatli tayyorlandi / yangilandi")