from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User
from ..schemas.subscription import (
    SubscriptionPlanOut,
    SubscriptionStatusOut,
    SubscriptionPurchaseRequest,
)
from ..premium_utils import (
    is_user_premium,
    get_user_tier,
    get_user_star_rate,
    get_user_test_limit,
    SUBSCRIPTION_PLANS,
    PREMIUM_DURATION_DAYS,
)
from .auth import get_current_user

router = APIRouter(prefix="/api/subscription", tags=["subscription"])


def build_status_response(user: User) -> SubscriptionStatusOut:
    tier = get_user_tier(user)
    current_plan_data = SUBSCRIPTION_PLANS[tier]
    
    all_plans = [
        SubscriptionPlanOut(**plan_data)
        for plan_data in SUBSCRIPTION_PLANS.values()
    ]
    current_plan = SubscriptionPlanOut(**current_plan_data)

    return SubscriptionStatusOut(
        is_premium=tier in ("plus", "plus_plus"),
        subscription_tier=tier,
        tier_name=current_plan_data["name"],
        star_rate=current_plan_data["star_rate"],
        tests_taken=getattr(user, "tests_taken", 0) or 0,
        test_limit=current_plan_data["test_limit"],
        premium_expires=user.premium_expires,
        plans=all_plans,
        current_plan=current_plan,
    )


@router.get("/status", response_model=SubscriptionStatusOut)
def get_subscription_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Expired bo'lsa yangilab qo'yish
    _ = is_user_premium(current_user)
    db.commit()
    return build_status_response(current_user)


@router.post("/purchase", response_model=SubscriptionStatusOut)
def purchase_subscription(
    data: SubscriptionPurchaseRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    target_tier = data.tier
    if target_tier not in ("plus", "plus_plus"):
        target_tier = "plus"

    now = datetime.now(timezone.utc)
    
    # Agar foydalanuvchida allaqachon faol obuna bo'lsa va muddati o'tmagan bo'lsa
    if current_user.premium_expires:
        existing_expires = current_user.premium_expires
        if existing_expires.tzinfo is None:
            existing_expires = existing_expires.replace(tzinfo=timezone.utc)
        if existing_expires > now:
            new_expires = existing_expires + timedelta(days=PREMIUM_DURATION_DAYS)
        else:
            new_expires = now + timedelta(days=PREMIUM_DURATION_DAYS)
    else:
        new_expires = now + timedelta(days=PREMIUM_DURATION_DAYS)

    current_user.is_premium = True
    current_user.subscription_tier = target_tier
    current_user.premium_expires = new_expires
    db.commit()
    db.refresh(current_user)

    return build_status_response(current_user)


@router.post("/cancel", response_model=SubscriptionStatusOut)
def cancel_subscription(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    current_user.is_premium = False
    current_user.subscription_tier = "free"
    current_user.premium_expires = None
    db.commit()
    db.refresh(current_user)

    return build_status_response(current_user)
