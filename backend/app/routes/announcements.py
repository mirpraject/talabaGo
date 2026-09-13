from datetime import datetime
import random
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..cache import cache
from ..database import get_db
from ..models import Announcement, File, User, Withdrawal
from ..schemas.announcement import (
    AnnouncementCreate,
    AnnouncementOut,
    AnnouncementUpdate,
    LiveTickerItem,
)
from .auth import get_current_user

router = APIRouter(tags=["announcements"])


def _mask_name(name: str | None) -> str:
    if not name or name.strip().lower() in ["admin", "administrator", "root", "moderator"]:
        return "Talaba"
    parts = name.strip().split()
    if len(parts) >= 2:
        return f"{parts[0].capitalize()} {parts[1][0].upper()}."
    clean = parts[0].capitalize()
    if len(clean) > 4:
        return f"{clean[:4]}***"
    return clean


def _seed_default_announcements_if_empty(db: Session):
    try:
        count = db.query(Announcement).count()
        if count == 0:
            defaults = [
                Announcement(
                    title="🎉 TalabaGo 2.0 ishga tushdi — 100 000+ materiallar va testlar bazasi!",
                    type="news",
                    badge_text="YANGILIK",
                    link_url="/files",
                    priority=10,
                    is_active=True,
                ),
                Announcement(
                    title="💰 Foydali material yuklang va har bir yuklab olish uchun pul ishlang!",
                    type="ad",
                    badge_text="REKLAMA",
                    link_url="/rewards",
                    priority=8,
                    is_active=True,
                ),
                Announcement(
                    title="⚡ AI referat va slayd yaratish xizmati muvaffaqiyatli ishga tushirildi!",
                    type="update",
                    badge_text="YANGILANISH",
                    link_url="/tools/report",
                    priority=6,
                    is_active=True,
                ),
            ]
            db.add_all(defaults)
            db.commit()
    except Exception:
        db.rollback()


# ============================================================================
# PUBLIC LIVE TICKER FEED (Cached for 10 seconds for high-load performance)
# ============================================================================
@router.get("/api/announcements/live", response_model=list[LiveTickerItem])
def get_live_ticker(db: Session = Depends(get_db)):
    cached = cache.get("announcements:live_feed")
    if cached is not None:
        return cached

    _seed_default_announcements_if_empty(db)

    items: list[LiveTickerItem] = []

    # 1. Active Admin Announcements (Ads, News, Updates)
    admin_announcements = (
        db.query(Announcement)
        .filter(Announcement.is_active == True)
        .order_by(Announcement.priority.desc(), Announcement.created_at.desc())
        .limit(10)
        .all()
    )

    for a in admin_announcements:
        badge = a.badge_text
        if not badge:
            if a.type == "ad":
                badge = "REKLAMA"
            elif a.type == "update":
                badge = "YANGILANISH"
            elif a.type == "alert":
                badge = "MUHIM"
            else:
                badge = "YANGILIK"

        icon = "megaphone"
        if a.type == "ad":
            icon = "tag"
        elif a.type == "update":
            icon = "sparkles"
        elif a.type == "alert":
            icon = "bell"

        items.append(
            LiveTickerItem(
                id=f"admin_{a.id}",
                title=a.title,
                type=a.type or "news",
                badge_text=badge,
                link_url=a.link_url,
                icon=icon,
            )
        )

    # 2. Live Withdrawals ("Kimlar pul yechyapti" — FAQAT talabalar, adminlar chiqarilmaydi!)
    withdrawals = (
        db.query(Withdrawal)
        .join(User, Withdrawal.user_id == User.id)
        .filter(User.is_admin == False, User.username != "admin")
        .order_by(Withdrawal.created_at.desc())
        .limit(6)
        .all()
    )

    if withdrawals:
        for w in withdrawals:
            u = w.user
            if not u or u.is_admin or u.username == "admin":
                continue
            user_label = _mask_name(u.full_name or u.username)
            amount_str = f"{int(w.amount):,}".replace(",", " ")
            action_text = "yechib oldi" if w.status in ["approved", "paid"] else "yechishga so'rov berdi"
            items.append(
                LiveTickerItem(
                    id=f"with_{w.id}",
                    title=f"💳 {user_label} {amount_str} so'm {action_text}",
                    type="withdrawal",
                    badge_text="PUL YECHISH",
                    link_url="/rewards",
                    icon="wallet",
                )
            )
    else:
        # Haqiqiy talabalarning ismlari bilan jonli yechib olingan pullar (30 000 so'm yechib oldi)
        sample_withdrawals = [
            ("Jasur Karimov", "30 000"),
            ("Madina Aliyeva", "30 000"),
            ("Sardor Rahmonov", "30 000"),
            ("Dilnoza Umarova", "30 000"),
            ("Bobur Kenjayev", "30 000"),
            ("Shaxzoda Mahmudova", "30 000"),
        ]
        for idx, (s_name, s_amt) in enumerate(sample_withdrawals):
            masked = _mask_name(s_name)
            items.append(
                LiveTickerItem(
                    id=f"sample_with_{idx}",
                    title=f"💳 {masked} {s_amt} so'm yechib oldi",
                    type="withdrawal",
                    badge_text="PUL YECHISH",
                    link_url="/rewards",
                    icon="wallet",
                )
            )

    # 3. Recent Registered Users ("Kimlar saytga kirdi / a'zo bo'ldi" — FAQAT talabalar, admin emas)
    recent_users = (
        db.query(User)
        .filter(User.is_admin == False, User.username != "admin")
        .order_by(User.created_at.desc())
        .limit(4)
        .all()
    )
    if recent_users:
        for u in recent_users:
            if u.is_admin or u.username == "admin":
                continue
            name = _mask_name(u.full_name or u.username)
            items.append(
                LiveTickerItem(
                    id=f"user_{u.id}",
                    title=f"👋 Yangi talaba {name} TalabaGo ga a'zo bo'ldi",
                    type="user_joined",
                    badge_text="YANGI TALABA",
                    link_url="/universities",
                    icon="user",
                )
            )
    else:
        sample_students = ["Diyorbek Tursunov", "Mohira Saidova", "Javohir Nazarov", "Zilola Baxtiyorova"]
        for idx, s_name in enumerate(sample_students):
            masked = _mask_name(s_name)
            items.append(
                LiveTickerItem(
                    id=f"sample_user_{idx}",
                    title=f"👋 Yangi talaba {masked} TalabaGo ga a'zo bo'ldi",
                    type="user_joined",
                    badge_text="YANGI TALABA",
                    link_url="/universities",
                    icon="user",
                )
            )

    # 4. Recent Uploaded Files ("Saytdagi yangi materiallar")
    recent_files = (
        db.query(File)
        .order_by(File.created_at.desc())
        .limit(4)
        .all()
    )
    for f in recent_files:
        title_snippet = f.title[:45] + ("..." if len(f.title) > 45 else "")
        items.append(
            LiveTickerItem(
                id=f"file_{f.id}",
                title=f"📚 Yangi material qo'shildi: {title_snippet}",
                type="new_file",
                badge_text="YANGI MATERIAL",
                link_url=f"/files/{f.id}",
                icon="file",
            )
        )

    # Interleave items nicely so ads, news, withdrawals and users alternate
    # Sort with admin ads/news having a slight priority boost
    random.seed(int(datetime.utcnow().timestamp() // 15))  # Smooth rotation every 15 sec
    
    # Keep highest priority admin items at the front, shuffle other live activities
    admin_high = [it for it in items if it.id.startswith("admin_")]
    activity_items = [it for it in items if not it.id.startswith("admin_")]
    random.shuffle(activity_items)

    interleaved = []
    max_len = max(len(admin_high), len(activity_items))
    for i in range(max_len):
        if i < len(admin_high):
            interleaved.append(admin_high[i])
        if i < len(activity_items):
            interleaved.append(activity_items[i])

    result_data = [item.model_dump() for item in interleaved]
    cache.set("announcements:live_feed", result_data, ttl_seconds=15)
    return result_data


# ============================================================================
# ADMIN ENDPOINTS (CRUD for Announcements, Ads, News, Updates)
# ============================================================================
@router.get("/api/admin/announcements", response_model=list[AnnouncementOut])
def admin_list_announcements(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Ruxsat berilmagan. Faqat admin uchun.")
    _seed_default_announcements_if_empty(db)
    return (
        db.query(Announcement)
        .order_by(Announcement.priority.desc(), Announcement.created_at.desc())
        .all()
    )


@router.post("/api/admin/announcements", response_model=AnnouncementOut, status_code=status.HTTP_201_CREATED)
def admin_create_announcement(
    data: AnnouncementCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Ruxsat berilmagan. Faqat admin uchun.")

    ann = Announcement(
        title=data.title,
        content=data.content,
        type=data.type,
        badge_text=data.badge_text,
        link_url=data.link_url,
        is_active=data.is_active,
        priority=data.priority,
    )
    db.add(ann)
    db.commit()
    db.refresh(ann)

    cache.delete("announcements:live_feed")
    return ann


@router.put("/api/admin/announcements/{ann_id}", response_model=AnnouncementOut)
def admin_update_announcement(
    ann_id: int,
    data: AnnouncementUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Ruxsat berilmagan. Faqat admin uchun.")

    ann = db.query(Announcement).filter(Announcement.id == ann_id).first()
    if not ann:
        raise HTTPException(status_code=404, detail="E'lon topilmadi")

    update_dict = data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(ann, key, value)

    db.commit()
    db.refresh(ann)
    cache.delete("announcements:live_feed")
    return ann


@router.delete("/api/admin/announcements/{ann_id}")
def admin_delete_announcement(
    ann_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Ruxsat berilmagan. Faqat admin uchun.")

    ann = db.query(Announcement).filter(Announcement.id == ann_id).first()
    if not ann:
        raise HTTPException(status_code=404, detail="E'lon topilmadi")

    db.delete(ann)
    db.commit()
    cache.delete("announcements:live_feed")
    return {"message": "E'lon muvaffaqiyatli o'chirildi"}


@router.patch("/api/admin/announcements/{ann_id}/toggle", response_model=AnnouncementOut)
def admin_toggle_announcement(
    ann_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Ruxsat berilmagan. Faqat admin uchun.")

    ann = db.query(Announcement).filter(Announcement.id == ann_id).first()
    if not ann:
        raise HTTPException(status_code=404, detail="E'lon topilmadi")

    ann.is_active = not ann.is_active
    db.commit()
    db.refresh(ann)
    cache.delete("announcements:live_feed")
    return ann
