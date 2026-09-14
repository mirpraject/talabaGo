from pydantic import BaseModel
from datetime import datetime


class SubscriptionPlanOut(BaseModel):
    name: str = "StudentHub Premium"
    price_uzs: int = 15000
    duration_days: int = 30
    features: list[str] = [
        "Har bir to'g'ri javob uchun 1.2 yulduzcha (oddiy: 0.5)",
        "Yulduzchalarni do'stlarga student_id orqali o'tkazish",
        "Python, Django va Algoritmlar interaktiv amaliy darslari",
        "Sayt ichida kod yozish va real-vaqtda bajarish (Code Sandbox)",
        "VIP Premium nishoni va reytingda ustunlik",
    ]


class SubscriptionStatusOut(BaseModel):
    is_premium: bool
    premium_expires: datetime | None = None
    plan: SubscriptionPlanOut = SubscriptionPlanOut()


class SubscriptionPurchaseRequest(BaseModel):
    payment_method: str = "click"  # "click", "payme", "uzum", "balance"
