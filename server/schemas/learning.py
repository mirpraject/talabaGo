from pydantic import BaseModel
from typing import Any


class ExerciseOut(BaseModel):
    id: str
    title: str
    difficulty: str  # "oson", "o'rta", "qiyin"
    description: str
    initial_code: str
    test_cases: list[dict[str, Any]] = []
    hint: str | None = None


class LessonOut(BaseModel):
    id: str
    slug: str
    title: str
    track: str  # "python", "django", "algorithms"
    track_title: str
    summary: str
    content: str
    exercises: list[ExerciseOut] = []


class TrackOut(BaseModel):
    id: str
    title: str
    description: str
    icon: str
    lessons_count: int
    lessons: list[LessonOut] = []


class CodeRunRequest(BaseModel):
    code: str
    exercise_id: str | None = None
    input_data: str | None = None


class CodeRunResponse(BaseModel):
    stdout: str
    stderr: str
    exit_code: int
    success: bool
    exercise_completed: bool = False
    feedback: str | None = None
