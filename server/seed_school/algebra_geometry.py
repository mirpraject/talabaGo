"""Algebra + Geometriya — maktab (5-11 sinf)."""
import random
from .base import q, _add, _num_wrong, TARGET_PER_GRADE


def gen_algebra_geometry(target=350):
    items, seen = [], set()

    # ── Algebra: soddalashtirish ──
    for _ in range(target):
        if len(items) >= target:
            break
        a, b = random.randint(2, 9), random.randint(2, 9)
        ans = a + b
        _add(items, seen,
             f"{a}x + {b}x = ? (x ga nisbatan)",
             f"{ans}x", [f"{ans+1}x", f"{ans-1}x", f"{ans+2}x"])

    # ── Ko'paytirish ──
    for _ in range(target):
        if len(items) >= target:
            break
        a, b = random.randint(2, 9), random.randint(2, 9)
        _add(items, seen,
             f"{a} · {b} = ?",
             str(a*b), _num_wrong(a*b))

    # ── Kvadrat tenglama ildizlari ──
    for _ in range(target):
        if len(items) >= target:
            break
        p = random.randint(2, 8)
        qr = random.randint(1, 8)
        b = p + qr
        c = p * qr
        _add(items, seen,
             f"x² - {b}x + {c} = 0. Ildizlar ko'paytmasi?",
             str(c), _num_wrong(c, 1, 100))

    # ── Geometriya: yuza ──
    for _ in range(target):
        if len(items) >= target:
            break
        a, b = random.randint(3, 12), random.randint(3, 12)
        _add(items, seen,
             f"To'g'ri to'rtburchakning bo'yi {a}, eni {b}. Yuzi?",
             str(a*b), _num_wrong(a*b))

    # ── Perimetr ──
    for _ in range(target):
        if len(items) >= target:
            break
        a, b = random.randint(3, 12), random.randint(3, 12)
        _add(items, seen,
             f"To'g'ri to'rtburchakning bo'yi {a}, eni {b}. Perimetri?",
             str(2*(a+b)), _num_wrong(2*(a+b)))

    # ── Kvadrat ──
    for _ in range(target):
        if len(items) >= target:
            break
        a = random.randint(3, 15)
        _add(items, seen,
             f"Kvadrat tomoni {a}. Yuzi?",
             str(a*a), _num_wrong(a*a))

    # ── Doira ──
    for _ in range(target):
        if len(items) >= target:
            break
        r = random.randint(2, 8)
        _add(items, seen,
             f"Radiusi {r} bo'lgan doiraning yuzi? (π≈3.14)",
             f"{3.14*r*r:.1f}",
             [f"{3.14*(r+1)**2:.1f}", f"{3.14*(r-1)**2:.1f}", f"{6.28*r:.1f}"])

    # ── Uchburchak ──
    for _ in range(target):
        if len(items) >= target:
            break
        a, h = random.randint(3, 12), random.randint(3, 12)
        _add(items, seen,
             f"Uchburchak asosi {a}, balandligi {h}. Yuzi?",
             str(a*h//2), _num_wrong(a*h//2))

    # ── Burchaklar ──
    for _ in range(target):
        if len(items) >= target:
            break
        angles = {90: "to'g'ri", 45: "o'tkir", 120: "o'tmas", 180: "yoyiq"}
        ang = random.choice(list(angles.keys()))
        _add(items, seen,
             f"{ang}° burchak qaysi turga mansub?",
             angles[ang], [angles[o] for o in angles if o != ang])

    # ── Piramida ──
    for _ in range(target):
        if len(items) >= target:
            break
        a, h = random.randint(2, 6), random.randint(3, 9)
        _add(items, seen,
             f"To'g'ri to'rtburchak prizma: asos bo'yi {a}, eni {a}, balandligi {h}. Hajmi?",
             str(a*a*h), _num_wrong(a*a*h))

    return items[:target]
