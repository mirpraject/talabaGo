from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func
import os

from ..database import get_db
from ..models import University, Faculty, Subject, File, Test, TestQuestion, User, Withdrawal, StarTransfer
from ..security import hash_password

from .auth import get_current_user

router = APIRouter(prefix="/api/admin", tags=["admin"])


def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Faqat administratorlar uchun ruxsat berilgan",
        )
    return current_user


# ==============================================================================
# PYDANTIC SCHEMAS FOR ADMIN
# ==============================================================================
class UniversityIn(BaseModel):
    name: str
    short_name: str
    city: str | None = None

class FacultyIn(BaseModel):
    name: str

class SubjectIn(BaseModel):
    name: str

class FileEditIn(BaseModel):
    title: str
    description: str | None = None
    file_type: str | None = None
    semester: int | None = None
    course: int | None = None

class TestIn(BaseModel):
    title: str
    subject_id: int | None = None
    description: str | None = None
    level: str | None = None  # "school" | "university"
    grade: int | None = None  # 5-11 or 1-4

class QuestionIn(BaseModel):
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_answer: str  # A, B, C, D
    explanation: str | None = None

class UserCreateIn(BaseModel):
    username: str
    password: str
    full_name: str | None = None
    email: str | None = None
    phone: str | None = None
    is_admin: bool = False

class UserEditIn(BaseModel):
    full_name: str | None = None
    email: str | None = None
    phone: str | None = None
    is_admin: bool | None = None
    password: str | None = None

class StarAdjustIn(BaseModel):
    delta: float
    note: str | None = None

class BlockUserIn(BaseModel):
    is_blocked: bool
    reason: str | None = None



# ==============================================================================
# 1. UNIVERSITIES & FACULTIES
# ==============================================================================
@router.get("/universities")
def admin_list_universities(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    unis = db.query(University).order_by(University.name).all()
    res = []
    for u in unis:
        f_count = db.query(Faculty).filter(Faculty.university_id == u.id).count()
        file_count = db.query(File).filter(File.university_id == u.id).count()
        res.append({
            "id": u.id,
            "name": u.name,
            "short_name": u.short_name,
            "city": u.city,
            "faculty_count": f_count,
            "file_count": file_count,
        })
    return res

@router.post("/universities", status_code=status.HTTP_201_CREATED)
def admin_create_university(
    data: UniversityIn,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    existing = db.query(University).filter(University.short_name == data.short_name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ushbu qisqa nomli universitet allaqachon mavjud")
    uni = University(**data.model_dump())
    db.add(uni)
    db.commit()
    db.refresh(uni)
    return uni

@router.put("/universities/{uni_id}")
def admin_update_university(
    uni_id: int,
    data: UniversityIn,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    uni = db.query(University).filter(University.id == uni_id).first()
    if not uni:
        raise HTTPException(status_code=404, detail="Universitet topilmadi")
    uni.name = data.name
    uni.short_name = data.short_name
    uni.city = data.city
    db.commit()
    db.refresh(uni)
    return uni

@router.delete("/universities/{uni_id}")
def admin_delete_university(
    uni_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    uni = db.query(University).filter(University.id == uni_id).first()
    if not uni:
        raise HTTPException(status_code=404, detail="Universitet topilmadi")
    # Bog'liq fakultetlarni o'chirish
    db.query(Faculty).filter(Faculty.university_id == uni_id).delete()
    db.delete(uni)
    db.commit()
    return {"message": "Universitet va uning fakultetlari o'chirildi"}

@router.get("/universities/{uni_id}/faculties")
def admin_list_faculties(
    uni_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    return db.query(Faculty).filter(Faculty.university_id == uni_id).order_by(Faculty.name).all()

@router.post("/universities/{uni_id}/faculties", status_code=status.HTTP_201_CREATED)
def admin_create_faculty(
    uni_id: int,
    data: FacultyIn,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    fac = Faculty(university_id=uni_id, name=data.name)
    db.add(fac)
    db.commit()
    db.refresh(fac)
    return fac

@router.put("/faculties/{fac_id}")
def admin_update_faculty(
    fac_id: int,
    data: FacultyIn,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    fac = db.query(Faculty).filter(Faculty.id == fac_id).first()
    if not fac:
        raise HTTPException(status_code=404, detail="Fakultet topilmadi")
    fac.name = data.name
    db.commit()
    db.refresh(fac)
    return fac

@router.delete("/faculties/{fac_id}")
def admin_delete_faculty(
    fac_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    fac = db.query(Faculty).filter(Faculty.id == fac_id).first()
    if not fac:
        raise HTTPException(status_code=404, detail="Fakultet topilmadi")
    db.delete(fac)
    db.commit()
    return {"message": "Fakultet o'chirildi"}


# ==============================================================================
# 2. SUBJECTS
# ==============================================================================
@router.get("/subjects")
def admin_list_subjects(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    subs = db.query(Subject).order_by(Subject.name).all()
    res = []
    for s in subs:
        file_count = db.query(File).filter(File.subject_id == s.id).count()
        test_count = db.query(Test).filter(Test.subject_id == s.id).count()
        res.append({
            "id": s.id,
            "name": s.name,
            "file_count": file_count,
            "test_count": test_count,
        })
    return res

@router.post("/subjects", status_code=status.HTTP_201_CREATED)
def admin_create_subject(
    data: SubjectIn,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    existing = db.query(Subject).filter(Subject.name.ilike(data.name.strip())).first()
    if existing:
        raise HTTPException(status_code=400, detail="Bu nomdagi fan allaqachon mavjud")
    sub = Subject(name=data.name.strip())
    db.add(sub)
    db.commit()
    db.refresh(sub)
    return sub

@router.put("/subjects/{sub_id}")
def admin_update_subject(
    sub_id: int,
    data: SubjectIn,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    sub = db.query(Subject).filter(Subject.id == sub_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Fan topilmadi")
    sub.name = data.name.strip()
    db.commit()
    db.refresh(sub)
    return sub

@router.delete("/subjects/{sub_id}")
def admin_delete_subject(
    sub_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    sub = db.query(Subject).filter(Subject.id == sub_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Fan topilmadi")
    db.delete(sub)
    db.commit()
    return {"message": "Fan o'chirildi"}


# ==============================================================================
# 3. FILES
# ==============================================================================
@router.get("/files")
def admin_list_files(
    search: str | None = None,
    limit: int = 100,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    q = db.query(File)
    if search:
        q = q.filter(File.title.ilike(f"%{search}%"))
    files = q.order_by(File.created_at.desc()).limit(limit).all()
    res = []
    for f in files:
        res.append({
            "id": f.id,
            "title": f.title,
            "description": f.description,
            "file_type": f.file_type,
            "file_size": f.file_size,
            "views": f.views,
            "downloads": f.downloads,
            "rating": float(f.rating or 0),
            "university_name": f.university.short_name if f.university else None,
            "subject_name": f.subject.name if f.subject else None,
            "uploader_name": f.uploader.username if f.uploader else None,
            "created_at": f.created_at,
        })
    return res

@router.put("/files/{file_id}")
def admin_update_file(
    file_id: int,
    data: FileEditIn,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    file = db.query(File).filter(File.id == file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail="Fayl topilmadi")
    file.title = data.title
    file.description = data.description
    if data.file_type:
        file.file_type = data.file_type
    if data.semester is not None:
        file.semester = data.semester
    if data.course is not None:
        file.course = data.course
    db.commit()
    db.refresh(file)
    return file

@router.delete("/files/{file_id}")
def admin_delete_file(
    file_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    file = db.query(File).filter(File.id == file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail="Fayl topilmadi")
    if file.file_path and os.path.exists(file.file_path):
        try:
            os.remove(file.file_path)
        except OSError:
            pass
    db.delete(file)
    db.commit()
    return {"message": "Fayl o'chirildi"}


# ==============================================================================
# 4. TESTS & QUESTIONS
# ==============================================================================
@router.get("/tests")
def admin_list_tests(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    tests = db.query(Test).order_by(Test.created_at.desc()).all()
    res = []
    for t in tests:
        q_count = db.query(TestQuestion).filter(TestQuestion.test_id == t.id).count()
        res.append({
            "id": t.id,
            "title": t.title,
            "subject_id": t.subject_id,
            "subject_name": t.subject.name if t.subject else None,
            "description": t.description,
            "level": t.level,
            "grade": t.grade,
            "is_ai_generated": t.is_ai_generated,
            "created_at": t.created_at,
            "question_count": q_count,
            "tickets_count": max(1, (q_count + 19) // 20) if q_count > 0 else 0,
        })
    return res

@router.post("/tests", status_code=status.HTTP_201_CREATED)
def admin_create_test(
    data: TestIn,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    test = Test(
        title=data.title,
        subject_id=data.subject_id,
        description=data.description,
        level=data.level,
        grade=data.grade,
        created_by=admin.id,
    )
    db.add(test)
    db.commit()
    db.refresh(test)
    return test

@router.put("/tests/{test_id}")
def admin_update_test(
    test_id: int,
    data: TestIn,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    test = db.query(Test).filter(Test.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test topilmadi")
    test.title = data.title
    test.subject_id = data.subject_id
    test.description = data.description
    test.level = data.level
    test.grade = data.grade
    db.commit()
    db.refresh(test)
    return test

@router.delete("/tests/{test_id}")
def admin_delete_test(
    test_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    test = db.query(Test).filter(Test.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test topilmadi")
    db.delete(test)
    db.commit()
    return {"message": "Test va uning barcha savollari o'chirildi"}

@router.get("/tests/{test_id}/questions")
def admin_list_questions(
    test_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    return (
        db.query(TestQuestion)
        .filter(TestQuestion.test_id == test_id)
        .order_by(TestQuestion.id)
        .all()
    )

@router.post("/tests/{test_id}/questions", status_code=status.HTTP_201_CREATED)
def admin_add_question(
    test_id: int,
    data: QuestionIn,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    test = db.query(Test).filter(Test.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test topilmadi")
    
    q = TestQuestion(
        test_id=test_id,
        question_text=data.question_text,
        option_a=data.option_a,
        option_b=data.option_b,
        option_c=data.option_c,
        option_d=data.option_d,
        correct_answer=data.correct_answer.upper().strip(),
        explanation=data.explanation,
    )
    db.add(q)
    db.commit()
    db.refresh(q)
    return q

@router.put("/questions/{question_id}")
def admin_update_question(
    question_id: int,
    data: QuestionIn,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    q = db.query(TestQuestion).filter(TestQuestion.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Savol topilmadi")
    q.question_text = data.question_text
    q.option_a = data.option_a
    q.option_b = data.option_b
    q.option_c = data.option_c
    q.option_d = data.option_d
    q.correct_answer = data.correct_answer.upper().strip()
    q.explanation = data.explanation
    db.commit()
    db.refresh(q)
    return q

@router.delete("/questions/{question_id}")
def admin_delete_question(
    question_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    q = db.query(TestQuestion).filter(TestQuestion.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Savol topilmadi")
    db.delete(q)
    db.commit()
    return {"message": "Savol o'chirildi"}


# ==============================================================================
# 5. USERS
# ==============================================================================
@router.get("/users")
def admin_list_all_users(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    users = db.query(User).order_by(User.created_at.desc()).all()
    return [
        {
            "id": u.id,
            "student_id": u.student_id or f"T{u.id:06d}",
            "avatar_url": u.avatar_url or f"https://api.dicebear.com/7.x/bottts/svg?seed=T{u.id:06d}",
            "username": u.username,
            "full_name": u.full_name,
            "email": u.email,
            "phone": u.phone,
            "university": u.university,
            "level": u.level,
            "grade": u.grade,
            "is_admin": u.is_admin,
            "is_premium": bool(u.is_premium),
            "is_active": bool(u.is_active),
            "is_blocked": bool(getattr(u, "is_blocked", False)),
            "block_reason": getattr(u, "block_reason", None),
            "stars": u.stars or 0,
            "created_at": u.created_at,
        }
        for u in users
    ]


@router.post("/users", status_code=status.HTTP_201_CREATED)
def admin_create_user(
    data: UserCreateIn,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    existing = db.query(User).filter(User.username == data.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ushbu username band")
    u = User(
        username=data.username,
        hashed_password=hash_password(data.password),
        full_name=data.full_name,
        email=data.email or None,
        phone=data.phone or None,
        is_admin=data.is_admin,
        is_active=True,
    )
    db.add(u)
    db.commit()
    db.refresh(u)
    return {"id": u.id, "username": u.username, "is_admin": u.is_admin}

@router.put("/users/{user_id}")
def admin_edit_user(
    user_id: int,
    data: UserEditIn,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    u = db.query(User).filter(User.id == user_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="Foydalanuvchi topilmadi")
    if data.full_name is not None:
        u.full_name = data.full_name
    if data.email is not None:
        u.email = data.email
    if data.phone is not None:
        u.phone = data.phone
    if data.is_admin is not None:
        u.is_admin = data.is_admin
    if data.password:
        u.hashed_password = hash_password(data.password)
    db.commit()
    db.refresh(u)
    return {"message": "Foydalanuvchi yangilandi", "is_admin": u.is_admin}

@router.delete("/users/{user_id}")
def admin_delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    if user_id == admin.id:
        raise HTTPException(status_code=400, detail="O'z hisobingizni o'chira olmaysiz")
    u = db.query(User).filter(User.id == user_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="Foydalanuvchi topilmadi")

    try:
        from ..models import Withdrawal, StarTransfer
        db.query(Withdrawal).filter(Withdrawal.user_id == user_id).delete(synchronize_session=False)
        db.query(StarTransfer).filter((StarTransfer.sender_id == user_id) | (StarTransfer.receiver_id == user_id)).delete(synchronize_session=False)
        
        from ..models import File as FileModel
        user_files = db.query(FileModel).filter(FileModel.user_id == user_id).all()
        for f in user_files:
            try:
                if f.file_path and os.path.exists(f.file_path):
                    os.remove(f.file_path)
            except Exception:
                pass
            db.delete(f)
        
        db.delete(u)
        db.commit()
        return {"message": "Foydalanuvchi va unga bog'liq ma'lumotlar o'chirildi"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"O'chirishda xatolik yuz berdi: {str(e)}")


@router.post("/users/{user_id}/toggle-freeze")
def admin_toggle_user_freeze(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    if user_id == admin.id:
        raise HTTPException(status_code=400, detail="O'z hisobingizni muzlata olmaysiz")
    u = db.query(User).filter(User.id == user_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="Foydalanuvchi topilmadi")
    u.is_active = not bool(u.is_active)
    db.commit()
    db.refresh(u)
    return {
        "message": "Hisob faollashtirildi" if u.is_active else "Hisob vaqtincha muzlatildi",
        "is_active": u.is_active,
    }


@router.post("/users/{user_id}/toggle-block")
def admin_toggle_user_block(
    user_id: int,
    data: BlockUserIn | None = None,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    if user_id == admin.id:
        raise HTTPException(status_code=400, detail="O'z hisobingizni bloklay olmaysiz")
    u = db.query(User).filter(User.id == user_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="Foydalanuvchi topilmadi")
    
    if data is not None:
        u.is_blocked = data.is_blocked
        u.block_reason = data.reason if data.is_blocked else None
    else:
        u.is_blocked = not bool(getattr(u, "is_blocked", False))
        if not u.is_blocked:
            u.block_reason = None

    db.commit()
    db.refresh(u)
    return {
        "message": "Hisob bloklandi" if u.is_blocked else "Hisob blokdan chiqarildi",
        "is_blocked": u.is_blocked,
        "block_reason": u.block_reason,
    }


@router.post("/users/{user_id}/adjust-stars")
def admin_adjust_user_stars(
    user_id: int,
    data: StarAdjustIn,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    u = db.query(User).filter(User.id == user_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="Foydalanuvchi topilmadi")
    current_stars = float(u.stars or 0.0)
    new_stars = max(0.0, current_stars + data.delta)
    u.stars = new_stars
    db.commit()
    db.refresh(u)
    return {"message": "Yulduzlar balansi yangilandi", "stars": u.stars}


@router.post("/users/{user_id}/toggle-premium")
def admin_toggle_user_premium(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    u = db.query(User).filter(User.id == user_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="Foydalanuvchi topilmadi")
    u.is_premium = not bool(u.is_premium)
    db.commit()
    db.refresh(u)
    return {"message": "Premium holati o'zgartirildi", "is_premium": u.is_premium}


@router.get("/users/{user_id}/activity")
def admin_get_user_activity(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    u = db.query(User).filter(User.id == user_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="Foydalanuvchi topilmadi")

    # Uploaded files
    files = (
        db.query(File)
        .filter(File.uploader_id == u.id)
        .order_by(File.created_at.desc())
        .all()
    )


    # Withdrawals
    withdrawals = (
        db.query(Withdrawal)
        .filter(Withdrawal.user_id == u.id)
        .order_by(Withdrawal.created_at.desc())
        .all()
    )

    # Sent star transfers
    sent_transfers = (
        db.query(StarTransfer)
        .filter(StarTransfer.sender_id == u.id)
        .order_by(StarTransfer.created_at.desc())
        .all()
    )

    # Received star transfers
    received_transfers = (
        db.query(StarTransfer)
        .filter(StarTransfer.recipient_id == u.id)
        .order_by(StarTransfer.created_at.desc())
        .all()
    )

    # Tests created
    tests = (
        db.query(Test)
        .filter(Test.created_by == u.id)
        .order_by(Test.created_at.desc())
        .all()
    )

    return {
        "user": {
            "id": u.id,
            "student_id": u.student_id or f"T{u.id:06d}",
            "avatar_url": u.avatar_url or f"https://api.dicebear.com/7.x/bottts/svg?seed=T{u.id:06d}",
            "username": u.username,
            "full_name": u.full_name,
            "email": u.email,
            "phone": u.phone,
            "university": u.university,
            "level": u.level,
            "grade": u.grade,
            "is_admin": u.is_admin,
            "stars": u.stars or 0,
            "created_at": u.created_at,
        },
        "files": [
            {
                "id": f.id,
                "title": f.title,
                "file_type": f.file_type,
                "file_size": f.file_size,
                "views": f.views,
                "downloads": f.downloads,
                "rating": float(f.rating or 0),
                "created_at": f.created_at,
            }
            for f in files
        ],
        "withdrawals": [
            {
                "id": w.id,
                "amount": w.amount,
                "stars_spent": w.stars_spent,
                "method": w.method,
                "target": w.target,
                "status": w.status,
                "created_at": w.created_at,
            }
            for w in withdrawals
        ],
        "sent_transfers": [
            {
                "id": t.id,
                "recipient_id": t.recipient_id,
                "recipient_student_id": t.recipient_student_id,
                "recipient_username": db.query(User.username).filter(User.id == t.recipient_id).scalar() or "Noma'lum",
                "stars": t.stars,
                "note": t.note,
                "created_at": t.created_at,
            }
            for t in sent_transfers
        ],
        "received_transfers": [
            {
                "id": t.id,
                "sender_id": t.sender_id,
                "sender_student_id": db.query(User.student_id).filter(User.id == t.sender_id).scalar() or f"T{t.sender_id:06d}",
                "sender_username": db.query(User.username).filter(User.id == t.sender_id).scalar() or "Noma'lum",
                "stars": t.stars,
                "note": t.note,
                "created_at": t.created_at,
            }
            for t in received_transfers
        ],
        "tests": [
            {
                "id": ts.id,
                "title": ts.title,
                "level": ts.level,
                "grade": ts.grade,
                "created_at": ts.created_at,
            }
            for ts in tests
        ],
    }


@router.get("/users/by-student-id/{student_id}")
def admin_get_user_by_student_id(
    student_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    target = student_id.strip().upper()
    u = db.query(User).filter(func.upper(User.student_id) == target).first()
    if not u:
        raise HTTPException(status_code=404, detail="Student ID topilmadi")
    return admin_get_user_activity(user_id=u.id, db=db, admin=admin)

