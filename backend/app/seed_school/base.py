"""Maktab fanlari uchun umumiy asos."""
import random
from typing import List, Dict

TARGET_PER_GRADE = 50


def q(question: str, correct: str, wrong: list, exp: str = "") -> Dict:
    return {"question": question, "correct": correct, "wrong": wrong, "exp": exp}


def _add(items, seen, question, correct, wrong, exp=""):
    if question in seen:
        return False
    seen.add(question)
    items.append(q(question, correct, wrong, exp))
    return True


def _num_wrong(correct_val, lo=1, hi=99, n=3):
    pool = set()
    while len(pool) < n:
        v = random.randint(lo, hi)
        if v != correct_val:
            pool.add(str(v))
    return list(pool)[:n]


def _str_wrong(correct_val, pool, n=3):
    candidates = [x for x in pool if x != correct_val]
    random.shuffle(candidates)
    return candidates[:n]
