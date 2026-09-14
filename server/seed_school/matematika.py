"""Maktab matematika — 5-11 sinf."""
import random
from .base import q, _add, _num_wrong, TARGET_PER_GRADE


def gen_matematika(target=350):
    items, seen = [], set()

    # ── 5-sinf: arifmetika ──
    for _ in range(target):
        if len(items) >= target:
            break
        a, b = random.randint(10, 99), random.randint(10, 99)
        op = random.choice(["+", "-", "*"])
        ans = eval(f"{a}{op}{b}")
        _add(items, seen,
             f"{a} {op} {b} = ?",
             str(ans), _num_wrong(ans))

    # ── kasrlar ──
    for _ in range(target):
        if len(items) >= target:
            break
        a, b = random.randint(1, 9), random.randint(2, 10)
        c, d = random.randint(1, 9), b
        num = a * d + c * b
        _add(items, seen,
             f"{a}/{b} + {c}/{d} = ? (oddiy ko'rinishda)",
             f"{num}/{b}",
             [f"{num+1}/{b}", f"{num}/{b+1}", f"{num-1}/{b}"])

    # ── 6-sinf: kasrlar, o'nli kasrlar ──
    for _ in range(target):
        if len(items) >= target:
            break
        a, b = random.randint(1, 9), random.randint(2, 12)
        ans = a / b
        _add(items, seen,
             f"{a} ÷ {b} = ? (o'nli kasr)",
             f"{ans:.2f}",
             [f"{ans+0.1:.2f}", f"{ans-0.05:.2f}", f"{ans+0.5:.2f}"])

    # ── foizlar ──
    for _ in range(target):
        if len(items) >= target:
            break
        son = random.randint(50, 500)
        foiz = random.choice([10, 15, 20, 25, 30, 40, 50])
        ans = son * foiz // 100
        _add(items, seen,
             f"{son} ning {foiz}% i nechga teng?",
             str(ans), _num_wrong(ans))

    # ── 7-sinf: algebraik ifodalar ──
    for _ in range(target):
        if len(items) >= target:
            break
        a, b, c = random.randint(1, 9), random.randint(1, 9), random.randint(1, 5)
        ans = a * c + b
        _add(items, seen,
             f"{a}x + {b} = {ans} bo'lsa, x = ?",
             str(c),
             [str(c+1), str(c-1), str(c+2)])

    # ── tenglamalar ──
    for _ in range(target):
        if len(items) >= target:
            break
        a = random.randint(2, 8)
        b = random.randint(1, 20)
        ans = a + b
        _add(items, seen,
             f"x + {b} = {ans} bo'lsa, x = ?",
             str(a), _num_wrong(a, 1, 20))

    # ── 8-sinf: kvadrat tenglamalar ──
    for _ in range(target):
        if len(items) >= target:
            break
        p = random.randint(2, 10)
        q_val = random.randint(1, 9)
        ans_p = p + q_val
        ans_q = p * q_val
        _add(items, seen,
             f"x² - {ans_p}x + {ans_q} = 0 ning ildizlari yig'indisi?",
             str(ans_p), _num_wrong(ans_p, 1, 30))

    # ── tengsizliklar ──
    for _ in range(target):
        if len(items) >= target:
            break
        a = random.randint(2, 10)
        b = random.randint(1, 30)
        ans = b // a + 1
        _add(items, seen,
             f"{a}x > {b} bo'lsa, x ning eng kichik butun qiymati?",
             str(ans), _num_wrong(ans, 1, 30))

    # ── 9-sinf: trigonometriya ──
    for _ in range(target):
        if len(items) >= target:
            break
        angle = random.choice([30, 45, 60, 90])
        sin_vals = {30: "1/2", 45: "√2/2", 60: "√3/2", 90: "1"}
        _add(items, seen,
             f"sin({angle}°) = ?",
             sin_vals[angle],
             _str_wrong(sin_vals[angle], ["1/2", "√2/2", "√3/2", "1", "0", "√3"]))

    # ── 10-sinf: vektorlar ──
    for _ in range(target):
        if len(items) >= target:
            break
        a1, a2 = random.randint(-5, 5), random.randint(-5, 5)
        b1, b2 = random.randint(-5, 5), random.randint(-5, 5)
        ans = a1 * b1 + a2 * b2
        _add(items, seen,
             f"a=({a1},{a2}), b=({b1},{b2}). a·b = ?",
             str(ans), _num_wrong(ans, -50, 50))

    # ── 11-sinf: limit ──
    for _ in range(target):
        if len(items) >= target:
            break
        n = random.randint(2, 10)
        ans = n * (n + 1) // 2
        _add(items, seen,
             f"1+2+...+{n} = ?",
             str(ans), _num_wrong(ans, 1, 200))

    return items[:target]
