from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Float
from sqlalchemy.sql import func

from ..database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=True)
    username = Column(String, unique=True, index=True, nullable=False)
    student_id = Column(String, unique=True, index=True, nullable=True)
    avatar_url = Column(String, nullable=True)
    phone = Column(String, nullable=True, index=True)
    full_name = Column(String, nullable=True)
    university = Column(String, nullable=True)
    level = Column(String, nullable=True)  # "school" | "university"
    grade = Column(Integer, nullable=True)  # sinf (5-11) yoki kurs (1-4)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_blocked = Column(Boolean, default=False)
    block_reason = Column(String, nullable=True)
    is_admin = Column(Boolean, default=False)
    bio = Column(Text, nullable=True)
    stars = Column(Float, default=0.0, nullable=False)
    is_premium = Column(Boolean, default=False)
    subscription_tier = Column(String, default="free", nullable=False)  # "free" | "plus" | "plus_plus"
    tests_taken = Column(Integer, default=0, nullable=False)
    premium_expires = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), default=func.now()
    )