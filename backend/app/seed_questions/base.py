"""Umumiy yordamchi funksiyalar: variantlarni aralashtirish, deduplikatsiya."""

import random
from typing import Iterable

_OPT_LETTERS = ("A", "B", "C", "D")


def finalize(
    rng: random.Random,
    question: str,
    options: list[str],
    correct: str,
    explanation: str,
) -> dict:
    """4 ta variantni olib, to'g'ri javobni tasodifiy o'ringa qo'yadi.

    `correct` matni options ichida bo'lishi kerak. Agar options 4 tadan
    kam bo'lsa, 'Yuqoridagilarning hech biri' qo'shilmaydi — variantlar
    to'liq bo'lishi uchun qo'lda 4 ta variant beriladi.
    """
    assert len(options) == 4, f"Options 4 ta bo'lishi kerak: {question!r}"
    assert correct in options, f"correct variant ichida emas: {question!r}"
    assert len(set(options)) == 4, f"4 ta variant barchasi har xil bo'lishi shart: {question!r}"
    order = list(range(4))
    rng.shuffle(order)
    ordered = [options[i] for i in order]
    correct_letter = _OPT_LETTERS[ordered.index(correct)]
    return {
        "question": question,
        "options": ordered,
        "correct_letter": correct_letter,
        "correct": correct,
        "explanation": explanation,
    }


class QuestionBank:
    """Takrorlanmas savollar to'plamini yig'uvchi konteyner."""

    def __init__(self, rng: random.Random | None = None):
        self.rng = rng or random.Random()
        self._seen: set[str] = set()
        self.items: list[dict] = []

    def add(
        self,
        question: str,
        options: list[str],
        correct: str,
        explanation: str,
    ) -> bool:
        qn = question.strip().lower()
        if qn in self._seen:
            return False
        self._seen.add(qn)
        self.items.append(
            finalize(self.rng, question, options, correct, explanation)
        )
        return True

    def add_many(self, qs: Iterable[tuple]) -> int:
        """qs: (question, options, correct, explanation) ketma-ketligi."""
        n = 0
        for q in qs:
            if len(q) == 4:
                n += int(self.add(*q))
            else:
                n += int(self.add(q[0], q[1], q[2], q[3]))
        return n


def pick(n: int, limit: int) -> int:
    return max(1, min(n, limit))