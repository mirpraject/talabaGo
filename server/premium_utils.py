from datetime import datetime, timezone
from typing import Optional, Dict, Any
from .models.user import User

# Narxlar va stavkalar (foydalanuvchi talabi asosida)
REGULAR_PRICE_UZS = 0
PLUS_PRICE_UZS = 40000
PLUS_PLUS_PRICE_UZS = 65000

REGULAR_STAR_PER_ANSWER = 0.5
PLUS_STAR_PER_ANSWER = 1.3
PLUS_PLUS_STAR_PER_ANSWER = 1.7

REGULAR_TEST_LIMIT = 150
PLUS_TEST_LIMIT = 700
PLUS_PLUS_TEST_LIMIT = None  # Cheksiz

PREMIUM_DURATION_DAYS = 30
PREMIUM_PRICE_UZS = PLUS_PRICE_UZS
PREMIUM_STAR_PER_ANSWER = PLUS_STAR_PER_ANSWER

SUBSCRIPTION_PLANS: Dict[str, Dict[str, Any]] = {
    "free": {
        "tier": "free",
        "name": "Oddiy",
        "badge": "Oddiy",
        "price_uzs": REGULAR_PRICE_UZS,
        "star_rate": REGULAR_STAR_PER_ANSWER,
        "test_limit": REGULAR_TEST_LIMIT,
        "duration_days": 0,
        "color": "slate",
        "hex": "#64748b",
        "features": [
            "Har bir to'g'ri javob uchun 0.5 yulduzcha",
            "Maksimal 150 ta test yechish imkoniyati",
            "Standart profil va umumiy materiallar",
        ],
    },
    "plus": {
        "tier": "plus",
        "name": "TalabaGo Plus",
        "badge": "PLUS",
        "price_uzs": PLUS_PRICE_UZS,
        "star_rate": PLUS_STAR_PER_ANSWER,
        "test_limit": PLUS_TEST_LIMIT,
        "duration_days": 30,
        "color": "emerald",
        "hex": "#10b981",
        "features": [
            "Har bir to'g'ri javob uchun 1.3 yulduzcha (+160% tezroq)",
            "700 ta test yechish limiti",
            "Yashil (Emerald) neon nishon va profil stili",
            "Yulduzlarni do'stlarga o'tkazish imkoniyati",
            "Dasturlash (Python, Algoritmlar) darslari",
        ],
    },
    "plus_plus": {
        "tier": "plus_plus",
        "name": "TalabaGo Plus+",
        "badge": "PLUS+",
        "price_uzs": PLUS_PLUS_PRICE_UZS,
        "star_rate": PLUS_PLUS_STAR_PER_ANSWER,
        "test_limit": PLUS_PLUS_TEST_LIMIT,
        "duration_days": 30,
        "color": "amber",
        "hex": "#f59e0b",
        "features": [
            "Har bir to'g'ri javob uchun 1.7 yulduzcha (+240% tezroq)",
            "Cheksiz testlar (Limit umuman yo'q!)",
            "Oltin (Gold/Amber) VIP profil nishoni va toji",
            "Cheksiz yulduz o'tkazmalari",
            "To'liq interaktiv dasturlash laboratoriyasi",
            "Reyting va qidiruvda eng yuqori ustunlik",
        ],
    },
}


def get_user_tier(user: User) -> str:
    """Foydalanuvchining joriy faol obuna darajasini qaytaradi: 'free' | 'plus' | 'plus_plus'"""
    if not user:
        return "free"

    tier = getattr(user, "subscription_tier", None)
    if tier in ("plus", "plus_plus"):
        # Muddatini tekshirish
        expires = getattr(user, "premium_expires", None)
        if expires:
            now = datetime.now(timezone.utc)
            if expires.tzinfo is None:
                expires = expires.replace(tzinfo=timezone.utc)
            if expires < now:
                user.is_premium = False
                user.subscription_tier = "free"
                return "free"
        return tier
    elif tier == "free":
        return "free"

    # Agar tier belgilanmagan bo'lsa va admin bo'lsa
    if getattr(user, "is_admin", False):
        return "plus_plus"

    # Eski bazalar bilan muvofiqlik: agar is_premium=True bo'lsa
    if getattr(user, "is_premium", False):
        return "plus"

    return "free"


def is_user_premium(user: User) -> bool:
    """Foydalanuvchi faol Plus yoki Plus+ obunasiga egami?"""
    tier = get_user_tier(user)
    return tier in ("plus", "plus_plus")


def get_user_star_rate(user: User) -> float:
    """To'g'ri javob uchun yulduz stavkasi: 0.5 (oddiy), 1.3 (plus), 1.7 (plus_plus)"""
    tier = get_user_tier(user)
    return SUBSCRIPTION_PLANS[tier]["star_rate"]


def get_user_test_limit(user: User) -> Optional[int]:
    """Test yechish limiti: 150 (oddiy), 700 (plus), None (plus_plus / cheksiz)"""
    tier = get_user_tier(user)
    return SUBSCRIPTION_PLANS[tier]["test_limit"]
