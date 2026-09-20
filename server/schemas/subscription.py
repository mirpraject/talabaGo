from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class SubscriptionPlanOut(BaseModel):
    tier: str
    name: str
    badge: str
    price_uzs: int
    star_rate: float
    test_limit: Optional[int] = None
    duration_days: int
    color: str
    hex: str
    features: List[str]


class SubscriptionStatusOut(BaseModel):
    is_premium: bool
    subscription_tier: str  # "free" | "plus" | "plus_plus"
    tier_name: str
    star_rate: float
    tests_taken: int
    test_limit: Optional[int] = None
    premium_expires: Optional[datetime] = None
    plans: List[SubscriptionPlanOut]
    current_plan: SubscriptionPlanOut


class SubscriptionPurchaseRequest(BaseModel):
    tier: str = "plus"  # "plus" | "plus_plus"
    payment_method: str = "click"  # "click", "payme", "uzum", "balance"
