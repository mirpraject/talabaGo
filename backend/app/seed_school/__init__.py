"""Maktab fanlari seed: har fan uchun 5-11 sinf testlari."""
from typing import Dict, List, Callable

from .matematika import gen_matematika
from .rus_tili import gen_russian
from .ingliz_tili import gen_english
from .ona_tili import gen_ona_tili
from .algebra_geometry import gen_algebra_geometry
from .tarix import gen_tarix
from .biologiya import gen_biologiya
from .kimyo import gen_kimyo
from .fizika import gen_fizika
from .informatika import gen_informatika

# Har bir fan: (generator, sinflar ro'yxati)
SCHOOL_SUBJECTS: Dict[str, Callable[[int], list]] = {
    "Matematika": gen_matematika,
    "Rus tili": gen_russian,
    "Ingliz tili": gen_english,
    "Ona tili": gen_ona_tili,
    "Algebra va Geometriya": gen_algebra_geometry,
    "Tarix": gen_tarix,
    "Biologiya": gen_biologiya,
    "Kimyo": gen_kimyo,
    "Fizika": gen_fizika,
    "Informatika": gen_informatika,
}

SCHOOL_GRADES = [5, 6, 7, 8, 9, 10, 11]
TESTS_PER_GRADE = 10  # har fan+sinf uchun testlar soni
QUESTIONS_PER_TEST = 10


def generate_school_bank(subject_name: str, target: int = 350) -> List[Dict]:
    """Fan bo'yicha savollar bankini yaratadi (barcha sinflar uchun umumiy)."""
    gen = SCHOOL_SUBJECTS[subject_name]
    return gen(target)


def get_config() -> Dict:
    return {
        "grades": SCHOOL_GRADES,
        "tests_per_grade": TESTS_PER_GRADE,
        "questions_per_test": QUESTIONS_PER_TEST,
    }
