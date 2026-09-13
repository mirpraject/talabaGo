from pydantic import BaseModel, Field
from datetime import datetime


class StarTransferRequest(BaseModel):
    recipient_student_id: str = Field(min_length=3, max_length=50)
    amount: float = Field(gt=0, description="O'tkaziladigan yulduzchalar soni")
    note: str | None = Field(default=None, max_length=200)


class StarTransferOut(BaseModel):
    id: int
    sender_id: int
    sender_username: str | None = None
    recipient_id: int
    recipient_username: str | None = None
    recipient_student_id: str
    stars: float
    note: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class StarBalanceOut(BaseModel):
    stars: float
    is_premium: bool
    star_rate_per_answer: float
