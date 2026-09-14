from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from ..database import Base


class Withdrawal(Base):
    __tablename__ = "withdrawals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    amount = Column(Integer, nullable=False)  # so'm
    stars_spent = Column(Integer, nullable=False, default=0)
    method = Column(String, nullable=False)  # card | phone
    target = Column(String, nullable=False)  # karta raqami yoki telefon
    status = Column(String, nullable=False, default="pending", index=True)  # pending | paid | rejected
    admin_note = Column(String, nullable=True)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), default=func.now(), index=True
    )
    processed_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", backref="withdrawals")