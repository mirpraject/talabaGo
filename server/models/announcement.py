from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text

from ..database import Base


class Announcement(Base):
    __tablename__ = "announcements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=True)
    type = Column(String(50), default="news", index=True)  # "ad", "news", "update", "alert", "event"
    badge_text = Column(String(50), nullable=True)         # "REKLAMA", "YANGILIK", "AKSIYA", "MUHIM"
    link_url = Column(String(500), nullable=True)          # "/rewards", "/files/12", "https://..."
    is_active = Column(Boolean, default=True, index=True)
    priority = Column(Integer, default=0)                  # Higher priority appears first
    created_at = Column(DateTime, default=datetime.utcnow)
