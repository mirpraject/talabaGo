from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool

from .config import settings

connect_args = {}
engine_kwargs = {}

if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {
        "check_same_thread": False,
        "timeout": 30.0,
    }
    engine_kwargs = {
        "poolclass": NullPool,
    }

engine = create_engine(settings.DATABASE_URL, connect_args=connect_args, **engine_kwargs)

if settings.DATABASE_URL.startswith("sqlite"):
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA journal_mode=WAL;")
        cursor.execute("PRAGMA synchronous=NORMAL;")
        cursor.execute("PRAGMA busy_timeout=30000;")
        cursor.execute("PRAGMA cache_size=-64000;")  # 64MB memory page cache
        cursor.execute("PRAGMA temp_store=MEMORY;")
        cursor.execute("PRAGMA mmap_size=268435456;")  # 256MB memory map
        cursor.close()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()