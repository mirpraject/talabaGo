import re
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User, Withdrawal, StarTransfer
from ..schemas import (
    LeaderboardEntry,
    RewardsMe,
    WithdrawalOut,
    WithdrawRequest,
    WithdrawResult,
    StarTransferRequest,
    StarTransferOut,
    RecipientInfoOut,
    STARS_PER_WITHDRAWAL,
    SO_M_PER_WITHDRAWAL,
)
from .auth import get_current_user
from ..premium_utils import is_user_premium


router = APIRouter(prefix="/api/rewards", tags=["rewards"])


def _clean_digits(value: str) -> str:
    return re.sub(r"[^\d]", "", value)


@router.get("/me", response_model=RewardsMe)
def rewards_me(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    pending = (
        db.query(Withdrawal)
        .filter(
            Withdrawal.user_id == current_user.id,
            Withdrawal.status == "pending",
        )
        .count()
    )
    return RewardsMe(
        stars=round(float(current_user.stars or 0.0), 2),
        pending_count=pending,
        is_premium=is_user_premium(current_user),
        premium_expires=current_user.premium_expires,
    )


@router.post("/withdraw", response_model=WithdrawResult)
def withdraw(
    data: WithdrawRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.is_admin:
        raise HTTPException(
            status_code=400,
            detail="Admin hisobidan pul yechib bo'lmaydi. Pul yechish faqat talabalar uchun mo'ljallangan.",
        )

    stars = current_user.stars or 0

    if data.method == "card":
        digits = _clean_digits(data.target)
        if not (12 <= len(digits) <= 19):
            raise HTTPException(
                status_code=400, detail="Karta raqami noto'g'ri (12-19 ta raqam bo'lishi kerak)"
            )
        target = data.target.strip()
    else:
        digits = _clean_digits(data.target)
        if not (9 <= len(digits) <= 13):
            raise HTTPException(
                status_code=400, detail="Telefon raqam noto'g'ri (masalan: +998901234567)"
            )
        target = ("+" + digits) if not data.target.startswith("+") else data.target.strip()

    blocks = stars // STARS_PER_WITHDRAWAL
    if blocks < 1:
        raise HTTPException(
            status_code=400,
            detail=f"Pul yechish uchun kamida {STARS_PER_WITHDRAWAL} yulduz kerak",
        )

    stars_spent = blocks * STARS_PER_WITHDRAWAL
    amount = blocks * SO_M_PER_WITHDRAWAL

    current_user.stars = stars - stars_spent

    withdrawal = Withdrawal(
        user_id=current_user.id,
        amount=amount,
        stars_spent=stars_spent,
        method=data.method,
        target=target,
        status="pending",
    )
    db.add(withdrawal)
    db.commit()
    db.refresh(withdrawal)

    return WithdrawResult(
        amount=amount,
        stars_spent=stars_spent,
        remaining_stars=current_user.stars,
        withdrawal=WithdrawalOut.model_validate(withdrawal),
    )


@router.get("/withdrawals", response_model=list[WithdrawalOut])
def my_withdrawals(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Withdrawal)
        .filter(Withdrawal.user_id == current_user.id)
        .order_by(Withdrawal.created_at.desc())
        .all()
    )


@router.get("/leaderboard", response_model=list[LeaderboardEntry])
def leaderboard(limit: int = 10, db: Session = Depends(get_db)):
    users = (
        db.query(User)
        .order_by(User.stars.desc())
        .limit(limit)
        .all()
    )
    return [
        LeaderboardEntry(
            id=u.id,
            username=u.username,
            student_id=u.student_id,
            avatar_url=u.avatar_url,
            full_name=u.full_name,
            stars=round(float(u.stars or 0.0), 2),
            is_premium=is_user_premium(u),
        )
        for u in users
    ]


@router.get("/recipient-info", response_model=RecipientInfoOut)
def get_recipient_info(
    student_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    target_id = student_id.strip().upper()
    recipient = db.query(User).filter(func.upper(User.student_id) == target_id).first()
    if not recipient:
        raise HTTPException(
            status_code=404, detail="Bunday Student ID raqamli foydalanuvchi topilmadi"
        )
    if recipient.id == current_user.id:
        raise HTTPException(
            status_code=400, detail="O'zingizning Student ID raqamingizga yulduz o'tkaza olmaysiz"
        )
    return RecipientInfoOut(
        student_id=recipient.student_id or f"T{recipient.id:06d}",
        username=recipient.username,
        full_name=recipient.full_name,
        avatar_url=recipient.avatar_url,
    )


@router.post("/transfer", response_model=StarTransferOut)
def transfer_stars(
    data: StarTransferRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not is_user_premium(current_user) and not current_user.is_admin:
        raise HTTPException(
            status_code=403,
            detail="Yulduzchalarni do'stlarga o'tkazish faqat Premium foydalanuvchilar uchun ruxsat etilgan! Premium obunani atigi 15 000 so'mga faollashtiring.",
        )

    if data.stars <= 0:
        raise HTTPException(status_code=400, detail="O'tkaziladigan yulduzlar soni 0 dan ko'p bo'lishi kerak")

    current_stars = float(current_user.stars or 0.0)
    if current_stars < data.stars:
        raise HTTPException(
            status_code=400,
            detail=f"Yulduzlaringiz yetarli emas. Sizda {current_stars:.1f} ta yulduz bor",
        )

    target_id = data.recipient_student_id.strip().upper()
    recipient = db.query(User).filter(func.upper(User.student_id) == target_id).first()
    if not recipient:
        raise HTTPException(
            status_code=404, detail="Bunday Student ID raqamli foydalanuvchi topilmadi"
        )
    if recipient.id == current_user.id:
        raise HTTPException(
            status_code=400, detail="O'zingizga yulduz o'tkaza olmaysiz"
        )

    # Perform transfer
    current_user.stars = round(current_stars - data.stars, 2)
    recipient.stars = round(float(recipient.stars or 0.0) + data.stars, 2)

    transfer = StarTransfer(
        sender_id=current_user.id,
        recipient_id=recipient.id,
        recipient_student_id=recipient.student_id or f"T{recipient.id:06d}",
        stars=data.stars,
        note=data.note.strip() if data.note else None,
    )
    db.add(transfer)
    db.commit()
    db.refresh(transfer)

    return StarTransferOut(
        id=transfer.id,
        sender_id=current_user.id,
        sender_username=current_user.username,
        sender_student_id=current_user.student_id,
        recipient_id=recipient.id,
        recipient_username=recipient.username,
        recipient_student_id=recipient.student_id or f"T{recipient.id:06d}",
        stars=transfer.stars,
        note=transfer.note,
        created_at=transfer.created_at,
    )


@router.get("/transfers", response_model=list[StarTransferOut])
def list_transfers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    transfers = (
        db.query(StarTransfer)
        .filter(
            (StarTransfer.sender_id == current_user.id)
            | (StarTransfer.recipient_id == current_user.id)
        )
        .order_by(StarTransfer.created_at.desc())
        .limit(50)
        .all()
    )

    result = []
    for t in transfers:
        sender = db.query(User).filter(User.id == t.sender_id).first()
        recipient = db.query(User).filter(User.id == t.recipient_id).first()
        result.append(
            StarTransferOut(
                id=t.id,
                sender_id=t.sender_id,
                sender_username=sender.username if sender else "Noma'lum",
                sender_student_id=sender.student_id if sender else None,
                recipient_id=t.recipient_id,
                recipient_username=recipient.username if recipient else "Noma'lum",
                recipient_student_id=t.recipient_student_id,
                stars=t.stars,
                note=t.note,
                created_at=t.created_at,
            )
        )
    return result



# ---------- Admin ----------


def _require_admin(current_user: User) -> None:
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Ruxsat yo'q")


@router.get("/admin/withdrawals", response_model=list[WithdrawalOut])
def admin_list_withdrawals(
    status: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    q = db.query(Withdrawal)
    if status:
        q = q.filter(Withdrawal.status == status)
    return q.order_by(Withdrawal.created_at.desc()).all()


@router.post("/admin/withdrawals/{w_id}/approve")
def admin_approve(
    w_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    w = db.query(Withdrawal).filter(Withdrawal.id == w_id).first()
    if not w:
        raise HTTPException(status_code=404, detail="So'rov topilmadi")
    if w.status != "pending":
        raise HTTPException(status_code=400, detail="Bu so'rov allaqachon ko'rib chiqilgan")
    w.status = "paid"
    w.processed_at = datetime.utcnow()
    db.commit()
    return {"message": "To'lov amalga oshirildi", "id": w.id}


@router.post("/admin/withdrawals/{w_id}/reject")
def admin_reject(
    w_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    w = db.query(Withdrawal).filter(Withdrawal.id == w_id).first()
    if not w:
        raise HTTPException(status_code=404, detail="So'rov topilmadi")
    if w.status != "pending":
        raise HTTPException(status_code=400, detail="Bu so'rov allaqachon ko'rib chiqilgan")
    w.status = "rejected"
    w.processed_at = datetime.utcnow()
    user = db.query(User).filter(User.id == w.user_id).first()
    if user:
        user.stars = (user.stars or 0) + w.stars_spent
    db.commit()
    return {"message": "So'rov rad etildi, yulduzlar qaytarildi", "id": w.id}