from pydantic import BaseModel, Field
from datetime import datetime

STARS_PER_WITHDRAWAL = 100
SO_M_PER_WITHDRAWAL = 10000


class WithdrawRequest(BaseModel):
    method: str = Field(pattern="^(card|phone)$")
    target: str = Field(min_length=4, max_length=40)


class WithdrawalOut(BaseModel):
    id: int
    amount: int
    stars_spent: float
    method: str
    target: str
    status: str
    admin_note: str | None = None
    created_at: datetime
    processed_at: datetime | None = None

    class Config:
        from_attributes = True


class RewardsMe(BaseModel):
    stars: float = 0.0
    pending_count: int = 0
    is_premium: bool = False
    premium_expires: datetime | None = None


class WithdrawResult(BaseModel):
    amount: int
    stars_spent: float
    remaining_stars: float
    withdrawal: WithdrawalOut


class LeaderboardEntry(BaseModel):
    id: int
    username: str
    student_id: str | None = None
    avatar_url: str | None = None
    full_name: str | None = None
    stars: float = 0.0
    is_premium: bool = False


class StarTransferRequest(BaseModel):
    recipient_student_id: str = Field(min_length=3, max_length=20)
    stars: float = Field(gt=0)
    note: str | None = Field(default=None, max_length=150)


class RecipientInfoOut(BaseModel):
    student_id: str
    username: str
    full_name: str | None = None
    avatar_url: str | None = None


class StarTransferOut(BaseModel):
    id: int
    sender_id: int
    sender_username: str | None = None
    sender_student_id: str | None = None
    recipient_id: int
    recipient_username: str | None = None
    recipient_student_id: str
    stars: float
    note: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True