from sqlalchemy import Column, ForeignKey, Integer, String, Text, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from ..database import Base


class Test(Base):
    __tablename__ = "tests"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=True, index=True)
    description = Column(Text, nullable=True)
    level = Column(String, nullable=True, index=True)  # "school" | "university"
    grade = Column(Integer, nullable=True)  # sinf (5-11) yoki kurs (1-4)
    is_ai_generated = Column(Boolean, default=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), default=func.now(), index=True
    )

    subject = relationship("Subject")
    creator = relationship("User")
    questions = relationship(
        "TestQuestion", back_populates="test", cascade="all, delete-orphan"
    )


class TestQuestion(Base):
    __tablename__ = "test_questions"

    id = Column(Integer, primary_key=True, index=True)
    test_id = Column(Integer, ForeignKey("tests.id"), nullable=False, index=True)
    question_text = Column(Text, nullable=False)
    option_a = Column(String, nullable=True)
    option_b = Column(String, nullable=True)
    option_c = Column(String, nullable=True)
    option_d = Column(String, nullable=True)
    correct_answer = Column(String, nullable=False)  # A, B, C, D
    explanation = Column(Text, nullable=True)

    test = relationship("Test", back_populates="questions")