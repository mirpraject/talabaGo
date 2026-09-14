from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from ..cache import cache
from ..database import get_db
from ..models import File, Rating, Subject, Test, University, User, Withdrawal
from .auth import get_current_user

router = APIRouter(prefix="/api/stats", tags=["stats"])


@router.get("/overview")
def stats_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cached = cache.get("stats:overview")
    if cached is not None:
        return cached

    data = {
        "users": db.query(User).count(),
        "files": db.query(File).count(),
        "universities": db.query(University).count(),
        "subjects": db.query(Subject).count(),
        "tests": db.query(Test).count(),
        "downloads_total": db.query(func.coalesce(func.sum(File.downloads), 0)).scalar() or 0,
        "views_total": db.query(func.coalesce(func.sum(File.views), 0)).scalar() or 0,
        "ratings_total": db.query(Rating).count(),
        "stars_total": db.query(func.coalesce(func.sum(User.stars), 0)).scalar() or 0,
        "withdrawals_pending": db.query(Withdrawal).filter(Withdrawal.status == "pending").count(),
    }
    cache.set("stats:overview", data, ttl_seconds=30)
    return data


@router.get("/subjects")
def subject_stats(db: Session = Depends(get_db)):
    cached = cache.get("stats:subjects")
    if cached is not None:
        return cached

    rows = (
        db.query(Subject.id, Subject.name, func.count(File.id).label("file_count"))
        .outerjoin(File, File.subject_id == Subject.id)
        .group_by(Subject.id)
        .order_by(func.count(File.id).desc())
        .all()
    )
    result = [
        {"id": r.id, "name": r.name, "file_count": r.file_count or 0}
        for r in rows
    ]
    cache.set("stats:subjects", result, ttl_seconds=60)
    return result


@router.get("/top-files")
def top_files(limit: int = 5, db: Session = Depends(get_db)):
    files = (
        db.query(File)
        .order_by(File.downloads.desc(), File.rating.desc())
        .limit(limit)
        .all()
    )
    return [
        {
            "id": f.id,
            "title": f.title,
            "downloads": f.downloads,
            "rating": float(f.rating or 0),
            "file_type": f.file_type,
        }
        for f in files
    ]


@router.get("/recent-users")
def recent_users(limit: int = 5, db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.created_at.desc()).limit(limit).all()
    return [
        {
            "id": u.id,
            "username": u.username,
            "full_name": u.full_name,
            "created_at": u.created_at,
            "is_admin": u.is_admin,
        }
        for u in users
    ]


@router.get("/users")
def list_users(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Ruxsat yo'q")
    users = db.query(User).order_by(User.created_at.desc()).all()
    return [
        {
            "id": u.id,
            "username": u.username,
            "full_name": u.full_name,
            "email": u.email,
            "phone": u.phone,
            "is_admin": u.is_admin,
            "created_at": u.created_at,
        }
        for u in users
    ]