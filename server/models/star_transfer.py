from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from ..database import Base


class StarTransfer(Base):
    __tablename__ = "star_transfers"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    recipient_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    recipient_student_id = Column(String, nullable=False, index=True)
    stars = Column(Float, nullable=False)
    note = Column(String, nullable=True)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), default=func.now()
    )

    sender = relationship("User", foreign_keys=[sender_id])
    recipient = relationship("User", foreign_keys=[recipient_id])
