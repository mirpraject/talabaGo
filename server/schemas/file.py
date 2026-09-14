from pydantic import BaseModel, Field
from datetime import datetime


class SubjectBase(BaseModel):
    name: str
    code: str | None = None


class SubjectCreate(SubjectBase):
    pass


class SubjectOut(SubjectBase):
    id: int

    class Config:
        from_attributes = True


class FileBase(BaseModel):
    title: str
    description: str | None = None
    file_type: str
    university_id: int
    faculty_id: int | None = None
    subject_id: int | None = None
    semester: int | None = None
    course: int | None = None


class FileCreate(FileBase):
    pass


class FileOut(FileBase):
    id: int
    file_size: int
    views: int
    downloads: int
    rating: float
    uploader_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class FileDetailOut(FileOut):
    file_path: str | None = None
    university_name: str | None = None
    faculty_name: str | None = None
    subject_name: str | None = None
    uploader_name: str | None = None


class RatingCreate(BaseModel):
    score: int = Field(ge=1, le=5)


class FileList(BaseModel):
    total: int
    items: list[FileOut]