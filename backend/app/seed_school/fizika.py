"""Fizika — maktab (5-11 sinf)."""
import random
from .base import q, _add, _num_wrong, TARGET_PER_GRADE


_FORMULAS = [
    ("v = s / t", "tezlik", ["kuch", "energiya", "zaryad"]),
    ("F = m · a", "Nyutonning 2-qonuni", ["Om qonuni", "Arximed qonuni", "Joulda"]),
    ("E = m · g · h", "potensial energiya", ["kinetik energiya", "kuch", "zaryad"]),
    ("P = m · g", "og'irlik kuchi", ["normal kuch", "elastiklik", "ishqalanish"]),
    ("W = F · s", "mexanik ish", ["kuch", "quvvat", "energiya"]),
    ("I = U / R", "Om qonuni (tok kuchi)", ["Joul-Lens", "Nyuton", "Arximed"]),
]


def gen_fizika(target=350):
    items, seen = [], set()

    # Formulalar
    for _ in range(target):
        if len(items) >= target:
            break
        formula, ans, wrongs = random.choice(_FORMULAS)
        _add(items, seen,
             f"{formula} formulasi nima ifodalaydi?",
             ans, list(wrongs))

    # Hisoblash
    for _ in range(target):
        if len(items) >= target:
            break
        v, t = random.randint(2, 20), random.randint(3, 12)
        _add(items, seen,
             f"Tezlik {v} m/s, vaqt {t} s. Yo'l (s = v·t)?",
             str(v*t), _num_wrong(v*t))

    for _ in range(target):
        if len(items) >= target:
            break
        m, a = random.randint(2, 20), random.randint(2, 10)
        _add(items, seen,
             f"m = {m} kg, a = {a} m/s². Kuch (F = m·a)?",
             str(m*a), _num_wrong(m*a))

    for _ in range(target):
        if len(items) >= target:
            break
        u, r = random.randint(10, 100), random.randint(2, 20)
        if u % r != 0:
            continue
        _add(items, seen,
             f"U = {u} V, R = {r} Om. Tok kuchi (I = U/R)?",
             str(u // r), _num_wrong(u // r, 1, 30))

    # Fizik kattalik birliklari
    units = [
        ("tezlik", "m/s", ["kg", "N", "V"]),
        ("kuch", "Nyuton (N)", ["J", "V", "Pa"]),
        ("energiya", "Joul (J)", ["N", "V", "kg"]),
        ("tok kuchi", "Amper (A)", ["V", "J", "N"]),
        ("kuchlanish", "Volt (V)", ["A", "J", "N"]),
        ("quvvat", "Vatt (Vt)", ["N", "J", "V"]),
        ("bosim", "Paskal (Pa)", ["N", "J", "V"]),
        ("zaryad", "Kulon (K)", ["A", "V", "J"]),
    ]
    for _ in range(target):
        if len(items) >= target:
            break
        katt, unit, wrongs = random.choice(units)
        _add(items, seen,
             f"{katt} o'lchov birligi?",
             unit, list(wrongs))

    return items[:target]
