from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Test, TestQuestion, User
from ..schemas import (
    TestCreateRequest,
    TestDetailOut,
    TestOut,
    TestQuestionOut,
    TestResultOut,
    TestSubmit,
)
from .auth import get_current_user
from ..premium_utils import is_user_premium, REGULAR_STAR_PER_ANSWER, PREMIUM_STAR_PER_ANSWER

router = APIRouter(prefix="/api/tests", tags=["tests"])


def test_to_out(db: Session, test: Test) -> TestOut:
    count = (
        db.query(TestQuestion).filter(TestQuestion.test_id == test.id).count()
    )
    tickets = max(1, (count + 19) // 20) if count > 0 else 0
    return TestOut(
        id=test.id,
        title=test.title,
        subject_id=test.subject_id,
        subject_name=test.subject.name if test.subject else None,
        description=test.description,
        level=test.level,
        grade=test.grade,
        is_ai_generated=test.is_ai_generated,
        created_at=test.created_at,
        question_count=count,
        tickets_count=tickets,
    )


@router.get("/", response_model=list[TestOut])
def list_tests(
    level: str | None = None,
    grade: int | None = None,
    db: Session = Depends(get_db),
):
    q = db.query(Test)
    if level:
        q = q.filter((Test.level == level) | (Test.level.is_(None)))
    if grade is not None:
        q = q.filter((Test.grade == grade) | (Test.grade.is_(None)))
    tests = q.order_by(Test.created_at.desc()).all()
    return [test_to_out(db, t) for t in tests]


@router.get("/{test_id}/tickets")
def get_test_tickets(
    test_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    test = db.query(Test).filter(Test.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test topilmadi")
    count = db.query(TestQuestion).filter(TestQuestion.test_id == test.id).count()
    total_tickets = max(1, (count + 19) // 20) if count > 0 else 1
    tickets = []
    for i in range(1, total_tickets + 1):
        q_count = min(20, max(0, count - (i - 1) * 20))
        tickets.append({
            "ticket_number": i,
            "question_count": q_count,
            "start_num": (i - 1) * 20 + 1 if count > 0 else 0,
            "end_num": (i - 1) * 20 + q_count if count > 0 else 0,
        })
    return {
        "test_id": test.id,
        "title": test.title,
        "total_questions": count,
        "total_tickets": total_tickets,
        "tickets": tickets,
    }


@router.get("/{test_id}", response_model=TestDetailOut)
def get_test(
    test_id: int,
    ticket: int = 1,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    test = db.query(Test).filter(Test.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test topilmadi")

    all_questions = (
        db.query(TestQuestion)
        .filter(TestQuestion.test_id == test_id)
        .order_by(TestQuestion.id.asc())
        .all()
    )
    total_q = len(all_questions)
    total_tickets = max(1, (total_q + 19) // 20) if total_q > 0 else 1
    ticket_num = max(1, min(ticket, total_tickets))

    # Har bir biletda aniq 20 ta takrorlanmas savol
    start_idx = (ticket_num - 1) * 20
    end_idx = start_idx + 20
    ticket_questions = all_questions[start_idx:end_idx]

    base = test_to_out(db, test)
    return TestDetailOut(
        **base.model_dump(),
        ticket_number=ticket_num,
        total_tickets=total_tickets,
        questions=[
            TestQuestionOut(
                id=q.id,
                question_text=q.question_text,
                option_a=q.option_a,
                option_b=q.option_b,
                option_c=q.option_c,
                option_d=q.option_d,
            )
            for q in ticket_questions
        ],
    )


@router.post("/{test_id}/submit", response_model=TestResultOut)
def submit_test(
    test_id: int,
    data: TestSubmit,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    test = db.query(Test).filter(Test.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test topilmadi")

    all_questions = (
        db.query(TestQuestion)
        .filter(TestQuestion.test_id == test_id)
        .order_by(TestQuestion.id.asc())
        .all()
    )
    total_q = len(all_questions)
    total_tickets = max(1, (total_q + 19) // 20) if total_q > 0 else 1
    ticket_num = max(1, min(data.ticket_number or 1, total_tickets))

    start_idx = (ticket_num - 1) * 20
    end_idx = start_idx + 20
    questions = all_questions[start_idx:end_idx]
    if not questions:
        questions = all_questions

    answer_map = {a.question_id: a.answer.upper() for a in data.answers}

    results = []
    score = 0
    for q in questions:
        user_ans = answer_map.get(q.id)
        correct = q.correct_answer.upper() == user_ans if user_ans else False
        if correct:
            score += 1
        results.append({
            "question_id": q.id,
            "question": q.question_text,
            "your_answer": user_ans or "",
            "correct_answer": q.correct_answer,
            "is_correct": correct,
            "explanation": q.explanation,
        })

    total = len(questions) or 1
    percentage = round((score / total) * 100, 1)

    is_premium = is_user_premium(current_user)
    star_rate = PREMIUM_STAR_PER_ANSWER if is_premium else REGULAR_STAR_PER_ANSWER
    stars_earned = round(score * star_rate, 2)

    current_user.stars = round(float(current_user.stars or 0.0) + stars_earned, 2)
    db.commit()

    return TestResultOut(
        score=score,
        total=len(questions),
        percentage=percentage,
        stars_earned=stars_earned,
        ticket_number=ticket_num,
        total_tickets=total_tickets,
        results=results,
    )


@router.post("/", response_model=TestOut, status_code=201)
def create_test(
    data: TestCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    test = Test(
        title=data.title,
        subject_id=data.subject_id,
        description=data.description,
        level=data.level or current_user.level,
        grade=data.grade if data.grade is not None else current_user.grade,
        created_by=current_user.id,
    )
    db.add(test)
    db.flush()
    for q in data.questions:
        opts = q.get("options") or []
        db.add(TestQuestion(
            test_id=test.id,
            question_text=q.get("question", ""),
            option_a=opts[0] if len(opts) > 0 else None,
            option_b=opts[1] if len(opts) > 1 else None,
            option_c=opts[2] if len(opts) > 2 else None,
            option_d=opts[3] if len(opts) > 3 else None,
            correct_answer=q.get("correct", "A"),
            explanation=q.get("explanation", ""),
        ))
    db.commit()
    return test_to_out(db, test)