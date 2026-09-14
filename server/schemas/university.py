from pydantic import BaseModel
from datetime import datetime


class UniversityBase(BaseModel):
    name: str
    short_name: str
    description: str | None = None
    city: str | None = None
    logo_url: str | None = None


class UniversityCreate(UniversityBase):
    pass


class UniversityOut(UniversityBase):
    id: int
    file_count: int = 0

    class Config:
        from_attributes = True


class FacultyBase(BaseModel):
    university_id: int
    name: str


class FacultyCreate(FacultyBase):
    pass


class FacultyOut(FacultyBase):
    id: int

    class Config:
        from_attributes = True