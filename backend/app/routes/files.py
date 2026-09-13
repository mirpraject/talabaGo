import os
import pathlib
import uuid
import shutil

from fastapi import APIRouter, Depends, File as FileUpload, Form, HTTPException, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import File, Rating, Subject, User
from ..schemas import FileCreate, FileDetailOut, FileOut, RatingCreate, SubjectOut
from .auth import get_current_user

router = APIRouter(prefix="/api/files", tags=["files"])

from ..cache import cache

UPLOAD_DIR = os.path.join(
    pathlib.Path(__file__).resolve().parent.parent.parent, "uploads"
)
ALLOWED_TYPES = ["notes", "tests", "lectures", "lab", "book", "exercise", "midterm", "final"]

ALLOWED_EXTENSIONS = {
    ".pdf", ".docx", ".doc", ".pptx", ".ppt",
    ".xlsx", ".xls", ".txt", ".zip", ".rar",
    ".7z", ".png", ".jpg", ".jpeg"
}

DANGEROUS_EXTENSIONS = {
    ".exe", ".bat", ".cmd", ".sh", ".bash",
    ".php", ".py", ".js", ".vbs", ".ps1",
    ".cgi", ".pl", ".html", ".htm", ".jar", ".dll"
}

MAX_FILE_SIZE = 52_428_800  # 50 MB


def save_upload_file(upload: UploadFile) -> str:
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    ext = os.path.splitext(upload.filename or "")[1].lower()

    if ext in DANGEROUS_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Xavfsizlik talablariga binoan dasturiy va zararli (.exe, .bat, .php, .sh va b.) fayllarni yuklash qat'iyan man etiladi.",
        )

    if ext not in ALLOWED_EXTENSIONS and ext:
        raise HTTPException(
            status_code=400,
            detail="Faqat o'quv materiallari formatlariga (.pdf, .docx, .pptx, .xlsx, .zip va b.) ruxsat beriladi.",
        )

    filename = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload.file, buffer)

    file_size = os.path.getsize(file_path)
    if file_size > MAX_FILE_SIZE:
        os.remove(file_path)
        raise HTTPException(
            status_code=400,
            detail="Fayl hajmi 50 MB dan oshmasligi kerak (File Too Large).",
        )

    return file_path


def file_to_dict(file: File) -> dict:
    data = FileOut.model_validate(file).model_dump()
    data["file_path"] = file.file_path
    data["university_name"] = (
        file.university.short_name if file.university else None
    )
    data["faculty_name"] = file.faculty.name if file.faculty else None
    data["subject_name"] = file.subject.name if file.subject else None
    data["uploader_name"] = (
        file.uploader.full_name if file.uploader and file.uploader.full_name else None
    ) or (file.uploader.username if file.uploader else None)
    return data


@router.get("/", response_model=list[FileOut])
def list_files(
    file_type: str | None = None,
    university_id: int | None = None,
    subject_id: int | None = None,
    search: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(File)

    if file_type:
        query = query.filter(File.file_type == file_type)
    if university_id:
        query = query.filter(File.university_id == university_id)
    if subject_id:
        query = query.filter(File.subject_id == subject_id)
    if search:
        query = query.filter(
            or_(
                File.title.ilike(f"%{search}%"),
                File.description.ilike(f"%{search}%"),
            )
        )

    return query.order_by(File.created_at.desc()).all()


@router.get("/subjects", response_model=list[SubjectOut])
def list_subjects(db: Session = Depends(get_db)):
    cached = cache.get("files:subjects")
    if cached is not None:
        return cached
    data = db.query(Subject).order_by(Subject.name).all()
    cache.set("files:subjects", data, ttl_seconds=120)
    return data


@router.get("/my", response_model=list[FileOut])
def my_files(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(File)
        .filter(File.uploader_id == current_user.id)
        .order_by(File.created_at.desc())
        .all()
    )


@router.get("/{file_id}", response_model=FileDetailOut)
def get_file(file_id: int, db: Session = Depends(get_db)):
    file = db.query(File).filter(File.id == file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail="Fayl topilmadi")
    file.views += 1
    db.commit()
    return file_to_dict(file)


@router.get("/{file_id}/download")
def download_file(
    file_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    file = db.query(File).filter(File.id == file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail="Fayl topilmadi")
    if not os.path.exists(file.file_path):
        raise HTTPException(status_code=404, detail="Fayl serverda mavjud emas")

    file.downloads += 1
    db.commit()

    ext = os.path.splitext(file.file_path)[1] or ".pdf"
    download_name = f"{file.title}{ext}"

    return FileResponse(
        file.file_path,
        filename=download_name,
        media_type="application/octet-stream",
    )


@router.post("/", response_model=FileOut, status_code=status.HTTP_201_CREATED)
def upload_file(
    title: str = Form(...),
    description: str = Form(""),
    file_type: str = Form(...),
    university_id: int = Form(...),
    faculty_id: int | None = Form(None),
    subject_id: int | None = Form(None),
    semester: int | None = Form(None),
    course: int | None = Form(None),
    file: UploadFile = FileUpload(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if file_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Noto'g'ri fayl turi")

    file_path = save_upload_file(file)
    file_size = os.path.getsize(file_path)

    file_data = FileCreate(
        title=title,
        description=description,
        file_type=file_type,
        university_id=university_id,
        faculty_id=faculty_id,
        subject_id=subject_id,
        semester=semester,
        course=course,
    )

    new_file = File(
        **file_data.model_dump(),
        file_path=file_path,
        file_size=file_size,
        uploader_id=current_user.id,
    )
    db.add(new_file)
    db.commit()
    db.refresh(new_file)
    cache.delete("stats:overview")
    cache.delete("stats:subjects")
    cache.delete("universities:list")
    return new_file


@router.delete("/{file_id}")
def delete_file(
    file_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    file = db.query(File).filter(File.id == file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail="Fayl topilmadi")

    if file.uploader_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=403, detail="Bu faylni o'chirishga ruxsat yo'q"
        )

    if os.path.exists(file.file_path):
        try:
            os.remove(file.file_path)
        except OSError:
            pass

    db.delete(file)
    db.commit()
    cache.delete("stats:overview")
    cache.delete("stats:subjects")
    cache.delete("universities:list")
    return {"message": "Fayl o'chirildi"}


@router.post("/{file_id}/rating", status_code=status.HTTP_200_OK)
def rate_file(
    file_id: int,
    rating_data: RatingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    file = db.query(File).filter(File.id == file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail="Fayl topilmadi")

    existing = db.query(Rating).filter(
        Rating.file_id == file_id,
        Rating.user_id == current_user.id,
    ).first()

    if existing:
        existing.score = rating_data.score
    else:
        db.add(Rating(user_id=current_user.id, file_id=file_id, score=rating_data.score))

    db.commit()

    avg = db.query(Rating).filter(Rating.file_id == file_id).with_entities(
        func.avg(Rating.score).label("avg")
    ).scalar()
    file.rating = round(avg, 2)
    db.commit()

    return {"message": "Baho qo'shildi", "rating": file.rating}