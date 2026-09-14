from sqlalchemy import Column, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from ..database import Base


class University(Base):
    __tablename__ = "universities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    short_name = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    logo_url = Column(String, nullable=True)
    city = Column(String, nullable=True)

    faculties = relationship("Faculty", back_populates="university", cascade="all, delete-orphan")
    files = relationship("File", back_populates="university")


class Faculty(Base):
    __tablename__ = "faculties"

    id = Column(Integer, primary_key=True, index=True)
    university_id = Column(Integer, ForeignKey("universities.id"), nullable=False)
    name = Column(String, index=True, nullable=False)
    short_name = Column(String, nullable=True)

    university = relationship("University", back_populates="faculties")
    files = relationship("File", back_populates="faculty")