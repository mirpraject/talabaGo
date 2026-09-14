from pydantic import BaseModel
from datetime import datetime


class TestQuestionOut(BaseModel):
    id: int
    question_text: str
    option_a: str | None = None
    option_b: str | None = None
    option_c: str | None = None
    option_d: str | None = None

    class Config:
        from_attributes = True


class TestQuestionWithAnswer(TestQuestionOut):
    correct_answer: str
    explanation: str | None = None


class TestOut(BaseModel):
    id: int
    title: str
    subject_id: int | None = None
    subject_name: str | None = None
    description: str | None = None
    level: str | None = None  # "school" | "university"
    grade: int | None = None  # sinf (5-11) yoki kurs (1-4)
    is_ai_generated: bool = False
    created_at: datetime
    question_count: int = 0
    tickets_count: int = 0

    class Config:
        from_attributes = True


class TestDetailOut(TestOut):
    ticket_number: int = 1
    total_tickets: int = 1
    questions: list[TestQuestionOut] = []


class TestAnswerItem(BaseModel):
    question_id: int
    answer: str


class TestSubmit(BaseModel):
    ticket_number: int | None = 1
    answers: list[TestAnswerItem]


class TestResultOut(BaseModel):
    score: int
    total: int
    percentage: float
    stars_earned: float = 0.0
    ticket_number: int | None = 1
    total_tickets: int | None = 1
    results: list[dict]


class TestCreateRequest(BaseModel):
    title: str
    subject_id: int | None = None
    description: str | None = None
    level: str | None = None
    grade: int | None = None
    questions: list[dict] = []


class TestGenerateRequest(BaseModel):
    title: str
    subject_id: int | None = None
    question_count: int = 10