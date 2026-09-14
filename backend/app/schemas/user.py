from pydantic import BaseModel, EmailStr, Field, field_validator
from datetime import datetime
import re


class UserBase(BaseModel):
    email: EmailStr | None = None
    username: str = Field(min_length=3, max_length=50)
    student_id: str | None = None
    avatar_url: str | None = None
    phone: str | None = Field(default=None, max_length=20)
    full_name: str | None = None
    university: str | None = None
    level: str | None = None  # "school" | "university"
    grade: int | None = None  # sinf (5-11) yoki kurs (1-4)


def validate_password(v: str) -> str:
    if len(v) < 6:
        raise ValueError("Parol kamida 6 ta belgidan iborat bo'lishi kerak")
    return v


class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    phone: str | None = Field(default=None, max_length=20)
    full_name: str | None = None
    university: str | None = None
    level: str | None = None  # "school" | "university"
    grade: int | None = None  # sinf (5-11) yoki kurs (1-4)
    email: EmailStr | None = None
    password: str

    @field_validator("password")
    @classmethod
    def check_password(cls, v: str) -> str:
        return validate_password(v)

    @field_validator("level")
    @classmethod
    def check_level(cls, v: str | None) -> str | None:
        if v is not None and v not in {"school", "university"}:
            raise ValueError("level school yoki university bo'lishi kerak")
        return v

    @field_validator("grade")
    @classmethod
    def check_grade(cls, v: int | None) -> int | None:
        if v is None:
            return None
        if v < 1 or v > 11:
            raise ValueError("grade 1-11 oralig'ida bo'lishi kerak")
        return v


class UserUpdate(BaseModel):
    full_name: str | None = None
    university: str | None = None
    level: str | None = None
    grade: int | None = None
    bio: str | None = None
    phone: str | None = None


class UserOut(UserBase):
    id: int
    is_active: bool = True
    is_blocked: bool = False
    block_reason: str | None = None
    is_admin: bool = False
    bio: str | None = None
    stars: float = 0.0
    is_premium: bool = False
    premium_expires: datetime | None = None
    created_at: datetime | None = None

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    username: str
    password: str