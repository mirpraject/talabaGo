from sqlalchemy import Column, ForeignKey, Integer, String, Text, DateTime, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from ..database import Base


class File(Base):
    __tablename__ = "files"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    file_type = Column(String, index=True, nullable=False)  # notes, tests, lectures, lab
    file_path = Column(String, nullable=False)
    file_size = Column(Integer, default=0)
    semester = Column(Integer, nullable=True)
    course = Column(Integer, nullable=True)
    views = Column(Integer, default=0)
    downloads = Column(Integer, default=0)
    rating = Column(Numeric(3, 2), default=0)

    university_id = Column(Integer, ForeignKey("universities.id"), nullable=False, index=True)
    faculty_id = Column(Integer, ForeignKey("faculties.id"), nullable=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=True, index=True)
    uploader_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    university = relationship("University", back_populates="files")
    faculty = relationship("Faculty", back_populates="files")
    subject = relationship("Subject", back_populates="files")
    uploader = relationship("User")

    ratings = relationship("Rating", back_populates="file", cascade="all, delete-orphan")


class Rating(Base):
    __tablename__ = "ratings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    file_id = Column(Integer, ForeignKey("files.id"), nullable=False)
    score = Column(Integer, nullable=False)  # 1-5

    user = relationship("User")
    file = relationship("File", back_populates="ratings")