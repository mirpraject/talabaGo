from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..cache import cache
from ..database import get_db
from ..models import File, University, Faculty
from ..schemas import UniversityCreate, UniversityOut, FacultyCreate, FacultyOut

router = APIRouter(prefix="/api/universities", tags=["universities"])


@router.get("/", response_model=list[UniversityOut])
def list_universities(db: Session = Depends(get_db)):
    cached = cache.get("universities:list")
    if cached is not None:
        return cached

    universities = db.query(University).order_by(University.name).all()
    out = []
    for uni in universities:
        data = UniversityOut.model_validate(uni).model_dump()
        data["file_count"] = (
            db.query(File).filter(File.university_id == uni.id).count()
        )
        out.append(UniversityOut(**data))

    cache.set("universities:list", out, ttl_seconds=60)
    return out


@router.post("/", response_model=UniversityOut, status_code=status.HTTP_201_CREATED)
def create_university(data: UniversityCreate, db: Session = Depends(get_db)):
    university = db.query(University).filter(University.short_name == data.short_name).first()
    if university:
        raise HTTPException(status_code=400, detail="Bu universitet allaqachon mavjud")
    university = University(**data.model_dump())
    db.add(university)
    db.commit()
    db.refresh(university)
    cache.delete("universities:list")
    return university


@router.get("/{university_id}", response_model=UniversityOut)
def get_university(university_id: int, db: Session = Depends(get_db)):
    university = db.query(University).filter(University.id == university_id).first()
    if not university:
        raise HTTPException(status_code=404, detail="Universitet topilmadi")
    return university


@router.get("/{university_id}/faculties", response_model=list[FacultyOut])
def list_faculties(university_id: int, db: Session = Depends(get_db)):
    return db.query(Faculty).filter(Faculty.university_id == university_id).all()


@router.post("/{university_id}/faculties", response_model=FacultyOut, status_code=status.HTTP_201_CREATED)
def create_faculty(university_id: int, data: FacultyCreate, db: Session = Depends(get_db)):
    faculty = Faculty(university_id=university_id, name=data.name)
    db.add(faculty)
    db.commit()
    db.refresh(faculty)
    return faculty