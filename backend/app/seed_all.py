"""Maktab, universitet va IT dasturlash testlarini DB'ga yuklovchi yagona seed script.

Ishga tushirish:
    cd backend
    & ".venv\\Scripts\\python.exe" -m app.seed_all
"""
import random
from sqlalchemy.orm import Session

from .database import Base, engine, SessionLocal
from .models import Test, TestQuestion, Subject
from .seed_school import SCHOOL_SUBJECTS, SCHOOL_GRADES
from . import seed_tests as _st
from .seed_it_dtm import (
    gen_python_questions,
    gen_django_questions,
    gen_algorithm_questions,
    gen_dtm_questions,
)

TESTS_PER_GRADE = 10
QUESTIONS_PER_TEST = 15

UNIVERSITY_SUBJECTS = {
    "Algebra": _st.gen_algebra,
    "Analitik Geometriya": _st.gen_geometry,
    "Matematik Analiz": _st.gen_analysis,
    "Fizika": _st.gen_physics,
    "Informatika": _st.gen_informatics,
    "Dasturlash": _st.gen_programming,
    "Kimyo": _st.gen_chemistry,
    "Iqtisodiyot": _st.gen_economics,
    "Ingliz tili": _st.gen_english,
    "Ona tili va adabiyot": _st.gen_uzbek,
    "Tarix": _st.gen_history,
    "Geografiya": _st.gen_geography,
    "Biyologiya": _st.gen_biology,
    "Falsafa": _st.gen_philosophy,
    "Pedagogika": _st.gen_pedagogy,
    "Psixologiya": _st.gen_psychology,
    "Python Dasturlash": gen_python_questions,
    "Django Web Framework": gen_django_questions,
    "Algoritmlar va Tuzilmalar": gen_algorithm_questions,
    "DTM Majburiy Fanlar": gen_dtm_questions,
}
UNIVERSITY_COURSES = [1, 2, 3, 4]


def _save_test(db, rng, title, subject, level, grade, questions):
    existing = db.query(Test).filter(Test.title == title, Test.subject_id == subject.id).first()
    if existing:
        return 0
    t = Test(
        title=title,
        subject_id=subject.id,
        description=f"{subject.name} — {grade}{'-sinf' if level == 'school' else '-kurs'}"
                    f" — {len(questions)} ta savol",
        level=level,
        grade=grade,
        is_ai_generated=False,
    )
    db.add(t)
    db.flush()
    for it in questions:
        opts = [it["correct"]] + list(it["wrong"])[:3]
        rng.shuffle(opts)
        db.add(TestQuestion(
            test_id=t.id,
            question_text=it["question"],
            option_a=opts[0], option_b=opts[1], option_c=opts[2], option_d=opts[3],
            correct_answer="ABCD"[opts.index(it["correct"])],
            explanation=it["exp"] or "",
        ))
    return len(questions)


def _unique_pool(bank, rng):
    seen = set()
    pool = []
    for it in bank:
        if it["question"] in seen:
            continue
        seen.add(it["question"])
        pool.append(it)
    rng.shuffle(pool)
    return pool


def seed_all(db: Session | None = None) -> int:
    Base.metadata.create_all(bind=engine)
    own = False
    if db is None:
        db = SessionLocal()
        own = True
    rng = random.Random(42)
    total = 0
    try:
        # ===== MAKTAB =====
        for sname, gen in SCHOOL_SUBJECTS.items():
            subj = db.query(Subject).filter(Subject.name == sname).first()
            if not subj:
                subj = Subject(name=sname)
                db.add(subj)
                db.commit()
            pool = _unique_pool(gen(500), rng)
            if len(pool) < QUESTIONS_PER_TEST:
                print(f"Maktab: {sname} — bank yetarli emas ({len(pool)})")
                continue
            for grade in SCHOOL_GRADES:
                for t_no in range(TESTS_PER_GRADE):
                    qs = rng.sample(pool, min(QUESTIONS_PER_TEST, len(pool)))
                    title = f"{sname} — {grade}-sinf — Test {t_no + 1}"
                    total += _save_test(db, rng, title, subj, "school", grade, qs)
            db.commit()
            print(f"Maktab: {sname} — {SCHOOL_GRADES[0]}-{SCHOOL_GRADES[-1]}-sinf ({TESTS_PER_GRADE} ta test) yuklandi")

        # ===== UNIVERSITET VA IT / DTM =====
        for sname, gen in UNIVERSITY_SUBJECTS.items():
            subj = db.query(Subject).filter(Subject.name == sname).first()
            if not subj:
                subj = Subject(name=sname)
                db.add(subj)
                db.commit()
            pool = _unique_pool(gen(800), rng)
            for course in UNIVERSITY_COURSES:
                for t_no in range(TESTS_PER_GRADE):
                    if len(pool) < QUESTIONS_PER_TEST:
                        continue
                    qs = rng.sample(pool, min(QUESTIONS_PER_TEST, len(pool)))
                    title = f"{sname} — {course}-kurs — Test {t_no + 1}"
                    total += _save_test(db, rng, title, subj, "university", course, qs)
            db.commit()
            print(f"Universitet/IT: {sname} — 1-4-kurs ({TESTS_PER_GRADE} ta test) yuklandi")

        db.commit()
        print(f"Jami yangi: {total} ta savol bazaga muvaffaqiyatli yuklandi.")
        return total
    finally:
        if own:
            db.close()


if __name__ == "__main__":
    seed_all()