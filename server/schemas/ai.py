from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)


class ChatResponse(BaseModel):
    reply: str
    files: list[dict] = []


class GenerateReportRequest(BaseModel):
    topic: str = Field(min_length=2, max_length=200)
    length: str = "medium"  # short, medium, long
    language: str = "uz"


class GenerateTestRequest(BaseModel):
    topic: str = Field(min_length=2, max_length=200)
    question_count: int = Field(default=10, ge=5, le=30)
    language: str = "uz"
    subject_id: int | None = None
    level: str | None = None
    grade: int | None = None


class GenerateReportResponse(BaseModel):
    title: str
    content: str
    summary: str = ""


class GenerateTestResponse(BaseModel):
    title: str
    questions: list[dict] = []


class ReportExportRequest(BaseModel):
    title: str
    content: str
    format: str = Field(pattern="^(docx|pdf)$")