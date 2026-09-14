"""Analitik Geometriya — takrorlanmaydigan savollar generatori."""

import random

from .base import QuestionBank


def _template_distance(bank, rng):
    x1 = rng.randint(-8, 8)
    y1 = rng.randint(-8, 8)
    dx = rng.choice([2, 3, 4, 5, 6, 8])
    dy = rng.choice([2, 3, 4, 6])
    if rng.random() < 0.5:
        dx = -dx
    if rng.random() < 0.5:
        dy = -dy
    x2 = x1 + dx
    y2 = y1 + dy
    d2 = dx * dx + dy * dy
    import math
    d = math.isqrt(d2) if int(math.sqrt(d2)) ** 2 == d2 else round(math.sqrt(d2), 1)
    q = f"A({x1}; {y1}) va B({x2}; {y2}) nuqtalar orasidagi masofani toping."
    correct = f"{d}"
    opts = [correct, f"{d + 1}", f"{d - 1}", f"{abs(dx) + abs(dy)}"]
    bank.add(q, opts, correct,
            f"d = √((x₂-x₁)² + (y₂-y₁)²) = √({dx}² + {dy}²) = √{d2} = {d}.")


def _template_midpoint(bank, rng):
    x1 = rng.randint(-10, 10)
    y1 = rng.randint(-10, 10)
    x2 = rng.randint(-10, 10)
    y2 = rng.randint(-10, 10)
    sx = x1 + x2
    sy = y1 + y2
    if sx % 2 or sy % 2:
        mx = round(sx / 2, 1)
        my = round(sy / 2, 1)
    else:
        mx = sx // 2
        my = sy // 2
    q = f"A({x1}; {y1}) va B({x2}; {y2}) kesma o'rtasining koordinatalarini toping."
    correct = f"M({mx}; {my})"
    opts = [correct, f"M({my}; {mx})", f"({x1 + x2}; {y1 + y2})", f"M({mx + 1}; {my})"]
    bank.add(q, opts, correct,
            f"O'rta nuqta koordinatalari arifmetik o'rta: "
            f"x = ({x1}+{x2})/2 = {mx}, y = ({y1}+{y2})/2 = {my}.")


def _template_slope(bank, rng):
    x1 = rng.randint(-6, 6)
    y1 = rng.randint(-6, 6)
    dx = rng.choice([1, 2, 3, 4])
    dy = rng.choice([2, 3, 4, 6, -3, 10])
    if rng.random() < 0.5:
        dy = -dy
    x2 = x1 + dx
    y2 = y1 + dy
    k = dy / dx
    q = f"A({x1}; {y1}) va B({x2}; {y2}) nuqtalardan o'tuvchi to'g'ri chiziqning burchak koeffitsiyentini toping."
    correct = f"{k}"
    opts = [correct, f"{dx}/{dy}", f"{round(k + 1, 1)}", f"{round(k - 1, 1)}"]
    bank.add(q, opts, correct,
            f"k = (y₂-y₁)/(x₂-x₁) = ({y2}-{y1})/({x2}-{x1}) = {dy}/{dx} = {k}.")


def _template_line_point(bank, rng):
    k = rng.choice([1, 2, 3])
    m = rng.randint(-5, 5)
    x0 = rng.randint(-5, 5)
    y0 = k * x0 + m
    q = f"y = {k}x {('+ ' if m >= 0 else '- ')}{abs(m)} to'g'ri chiziqda yotuvchi nuqtani toping."
    xw = rng.randint(-5, 5)
    yw = k * xw + m + rng.choice([1, 2])
    correct = f"({x0}; {y0})"
    opts = [correct, f"({xw}; {yw})", f"({x0 + 1}; {y0})", f"({m}; {x0})"]
    bank.add(q, opts, correct,
            f"x = {x0} ni qo'ysak y = {k}·{x0} {('+ ' if m >= 0 else '- ')}{abs(m)} = {y0} "
            "→ nuqta chiziqda yotadi.")


def _template_circle_point(bank, rng):
    cx = rng.randint(-4, 4)
    cy = rng.randint(-4, 4)
    r = rng.choice([3, 4, 5, 6])
    # aylanadagi nuqta
    import math
    a = rng.choice([3, 4, 5, 6, 8])
    b = rng.randint(1, 6)
    d2 = a * a + b * b
    if d2 != r * r:
        # masofa > < ni savol qilish
        kind = "inside" if d2 < r * r else "outside"
        q = (f"Markazi C({cx}; {cy}), radiusi {r} bo'lgan aylanaga nisbatan "
             f"M({cx + a}; {cy + b}) nuqta qayerda joylashgan?")
        ans = "Ichida" if kind == "inside" else "Tashqarisida"
        opts = [ans, "Aylanada", "Markazda", "Aniqlab bo'lmaydi"]
        expl = (f"Markazdan masofa kvadrati: {a}² + {b}² = {d2}, "
                f"r² = {r * r}. {d2} {'<' if d2 < r * r else '>'} {r * r} "
                f"→ nuqta {'ichida' if kind == 'inside' else 'tashqarisida'}.")
        bank.add(q, opts, ans, expl)
        return
    q = f"Markazi ({cx}; {cy}) va radiusi {r} bo'lgan aylana tenglamasini toping."
    correct = f"(x - {cx})² + (y - {cy})² = {r * r}"
    opts = [correct, f"(x - {cx})² + (y - {cy})² = {r}", f"x² + y² = {r * r}",
            f"(x + {cx})² + (y + {cy})² = {r * r}"]
    bank.add(q, opts, correct,
            f"Aylana tenglamasi: (x-a)²+(y-b)²=R², bu yerda (a;b) markaz, "
            f"R radius.")


def _template_circle_measure(bank, rng):
    r = rng.choice([2, 3, 4, 5, 7])
    q = rng.choice(["length", "area"])
    if q == "length":
        l = 2 * 3.14 * r
        correct = f"{round(2 * 3.14 * r, 2)}"
        opts = [correct, f"{round(3.14 * r * r, 2)}", f"{round(3.14 * r, 2)}", f"{2 * r}"]
        expl = (f"Uzunlik C = 2πR = 2·3.14·{r} = {round(2 * 3.14 * r, 2)}.")
    else:
        area = 3.14 * r * r
        correct = f"{round(area, 2)}"
        opts = [correct, f"{round(2 * 3.14 * r, 2)}", f"{round(3.14 * r, 2)}", f"{r * r}"]
        expl = f"Yuz S = πR² = 3.14·{r}² = {round(area, 2)}."
    if q == "length":
        bank.add(f"Radiusi {r} bo'lgan aylana uzunligini toping (π = 3.14).",
                 opts, correct, expl)
    else:
        bank.add(f"Radiusi {r} bo'lgan doira yuzini toping (π = 3.14).",
                 opts, correct, expl)


def _template_point_line_dist(bank, rng):
    a = rng.choice([1, 2, 3])
    b = rng.choice([1, 2])
    c = rng.randint(-6, 6)
    px = rng.randint(-4, 4)
    py = rng.randint(-4, 4)
    import math
    num = abs(a * px + b * py + c)
    den = math.isqrt(a * a + b * b)
    d = num / den
    q = (f"M({px}; {py}) nuqtadan {a}x {('+' if b >= 0 else '- ')}{abs(b)}y "
         f"{('+' if c >= 0 else '- ')}{abs(c)} = 0 to'g'ri chiziqqacha masofani toping.")
    correct = f"{d}"
    opts = [correct, f"{d + 1}", f"{d - 1}", f"{num}"]
    bank.add(q, opts, correct,
            f"d = |a·x₀ + b·y₀ + c| / √(a²+b²) = |{a}·{px} + {b}·{py} + ({c})| / √{a * a + b * b} "
            f"= {num}/{den} = {d}.")


def _template_vec_dot(bank, rng):
    x1 = rng.randint(-3, 3)
    y1 = rng.randint(-3, 3)
    x2 = rng.randint(-3, 3)
    y2 = rng.randint(-3, 3)
    if x1 == 0 and y1 == 0:
        return
    if x2 == 0 and y2 == 0:
        return
    dot = x1 * x2 + y1 * y2
    q = f"a = ({x1}; {y1}) va b = ({x2}; {y2}) vektorlarning skalyar ko'paytmasini toping."
    correct = f"{dot}"
    opts = [correct, f"{dot + 1}", f"{x1 * y1 + x2 * y2}", f"{abs(x1) + abs(y1) + abs(x2) + abs(y2)}"]
    bank.add(q, opts, correct,
            f"a·b = x₁·x₂ + y₁·y₂ = {x1}·{x2} + {y1}·{y2} = {dot}.")


def _template_parallelogram_area(bank, rng):
    # uchburchak yuzasi Shoelace bilan
    import math
    xs = rng.sample(range(0, 9), 3)
    ys = rng.sample(range(0, 9), 3)
    x1, x2, x3 = xs
    y1, y2, y3 = ys
    s = abs(x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2
    if s != int(s):
        return
    s = int(s)
    if s == 0:
        return
    q = f"A({x1}; {y1}), B({x2}; {y2}), C({x3}; {y3}) uchburchak yuzini toping."
    correct = f"{s}"
    opts = [correct, f"{s + 1}", f"{s * 2}", f"{abs(x1 - x2) + abs(y1 - y2)}"]
    bank.add(q, opts, correct,
            f"S = |x₁(y₂-y₃) + x₂(y₃-y₁) + x₃(y₁-y₂)|/2 = |{x1}({y2}-{y3}) "
            f"+ {x2}({y3}-{y1}) + {x3}({y1}-{y2})|/2 = {s}.")


def _template_parabola_vertex(bank, rng):
    h = rng.randint(-3, 3)
    k = rng.randint(-5, 5)
    a = rng.choice([1, 2])
    q = f"y = {a}(x {'+' if h >= 0 else '-'}{abs(h)})² {('+' if k >= 0 else '-')}{abs(k)} parabolaning uchi koordinatalarini toping."
    correct = f"({h}; {k})"
    opts = [correct, f"({-h}; {k})", f"({h}; {-k})", f"({k}; {h})"]
    bank.add(q, opts, correct,
            f"y = a(x-h)² + k ko'rinishda uchi (h; k). Bu yerda h = {h}, k = {k}.")


def _template_collinear(bank, rng):
    # uchta kollinear nuqta: B = A + t*(C-A)
    a = (rng.randint(-5, 5), rng.randint(-5, 5))
    c = (rng.randint(-5, 5), rng.randint(-5, 5))
    t = rng.choice([1, 2])
    b = (a[0] + t * (c[0] - a[0]), a[1] + t * (c[1] - a[1]))
    q = f"A({a[0]}; {a[1]}), B({b[0]}; {b[1]}), C({c[0]}; {c[1]}) nuqtalar bitta to'g'ri chiziqda yotadimi?"
    yes = "Ha"
    opts = [yes, "Yo'q", "Faqat A va B", "Faqat B va C"]
    expl = (f"B = A + {t}·(C-A): ({b[0]}; {b[1]}) = ({a[0]}; {a[1]}) + "
            f"{t}·(({c[0]}; {c[1]}) - ({a[0]}; {a[1]})); "
            "demak nuqtalar kollinear (Ha).")
    bank.add(q, opts, yes, expl)


TEMPLATES = [
    _template_distance,
    _template_midpoint,
    _template_slope,
    _template_line_point,
    _template_circle_point,
    _template_circle_measure,
    _template_point_line_dist,
    _template_vec_dot,
    _template_parallelogram_area,
    _template_parabola_vertex,
    _template_collinear,
]


def generate(bank: QuestionBank, rng: random.Random, target: int) -> None:
    attempts = 0
    while len(bank.items) < target and attempts < target * 6:
        attempts += 1
        order = TEMPLATES.copy()
        rng.shuffle(order)
        for t in order:
            if len(bank.items) >= target:
                break
            try:
                t(bank, rng)
            except (AssertionError, ZeroDivisionError, ValueError):
                continue