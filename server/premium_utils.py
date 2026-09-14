from datetime import datetime, timezone
from .models.user import User

PREMIUM_PRICE_UZS = 15000
PREMIUM_DURATION_DAYS = 30
REGULAR_STAR_PER_ANSWER = 0.5
PREMIUM_STAR_PER_ANSWER = 1.2


def is_user_premium(user: User) -> bool:
    if not getattr(user, "is_premium", False):
        return False
    expires = getattr(user, "premium_expires", None)
    if expires is None:
        return True
    now = datetime.now(timezone.utc)
    if expires.tzinfo is None:
        expires = expires.replace(tzinfo=timezone.utc)
    if expires < now:
        user.is_premium = False
        return False
    return True
