from datetime import datetime
from pydantic import BaseModel, ConfigDict


class AnnouncementBase(BaseModel):
    title: str
    content: str | None = None
    type: str = "news"  # "ad", "news", "update", "alert", "event"
    badge_text: str | None = None
    link_url: str | None = None
    is_active: bool = True
    priority: int = 0


class AnnouncementCreate(AnnouncementBase):
    pass


class AnnouncementUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
    type: str | None = None
    badge_text: str | None = None
    link_url: str | None = None
    is_active: bool | None = None
    priority: int | None = None


class AnnouncementOut(AnnouncementBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class LiveTickerItem(BaseModel):
    id: str
    title: str
    type: str  # "ad", "news", "update", "withdrawal", "user_joined", "new_file"
    badge_text: str | None = None
    link_url: str | None = None
    icon: str | None = None
    time_ago: str | None = None
