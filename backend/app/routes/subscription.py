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
    PREMIUM_PRICE_UZS,
    PREMIUM_DURATION_DAYS,
)
from .auth import get_current_user

router = APIRouter(prefix="/api/subscription", tags=["subscription"])


@router.get("/status", response_model=SubscriptionStatusOut)
def get_subscription_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    active = is_user_premium(current_user)
    db.commit()  # in case is_user_premium updated expired status
    return SubscriptionStatusOut(
        is_premium=active,
        premium_expires=current_user.premium_expires,
        plan=SubscriptionPlanOut(
            price_uzs=PREMIUM_PRICE_UZS,
            duration_days=PREMIUM_DURATION_DAYS,
        ),
    )


@router.post("/purchase", response_model=SubscriptionStatusOut)
def purchase_subscription(
    data: SubscriptionPurchaseRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    now = datetime.now(timezone.utc)
    
    # If user already has an active subscription, extend from existing expiration
    if current_user.is_premium and current_user.premium_expires:
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
    current_user.premium_expires = new_expires
    db.commit()
    db.refresh(current_user)

    return SubscriptionStatusOut(
        is_premium=True,
        premium_expires=current_user.premium_expires,
        plan=SubscriptionPlanOut(
            price_uzs=PREMIUM_PRICE_UZS,
            duration_days=PREMIUM_DURATION_DAYS,
        ),
    )


@router.post("/cancel", response_model=SubscriptionStatusOut)
def cancel_subscription(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    current_user.is_premium = False
    current_user.premium_expires = None
    db.commit()
    db.refresh(current_user)

    return SubscriptionStatusOut(
        is_premium=False,
        premium_expires=None,
        plan=SubscriptionPlanOut(
            price_uzs=PREMIUM_PRICE_UZS,
            duration_days=PREMIUM_DURATION_DAYS,
        ),
    )
