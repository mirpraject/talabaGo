"""Algebra — takrorlanmaydigan, tushunarli savollar generatori."""

import random

from .base import QuestionBank


def _fmt(v):
    if isinstance(v, str):
        return v
    return f"{v}"


def _template_linear(bank, rng):
    x0 = rng.randint(1, 10)
    a = rng.choice([2, 3, 4, 5])
    c = rng.randint(1, 40)
    b = c - a * x0
    q = f"{a}x + {b} = {c} tenglamani yeching."
    correct = f"x = {x0}"
    opts = [correct, f"x = {x0 + 1}", f"x = {x0 - 1}", f"x = {a * x0 - b}"]
    bank.add(q, opts, correct,
            f"{a}x = {c} - {b} = {c - b}; x = {c - b} / {a} = {x0}. "
            "Ikkala tomonni koeffitsiyentga bo'lamiz.")


def _template_quad_roots(bank, rng):
    p = rng.randint(1, 9)
    q = rng.choice([i for i in range(1, 10) if i != p])
    a = rng.randint(1, 3)
    s = p + q
    pr = p * q
    # ax^2 - a*s x + a*p*q = 0 (ildizlar p, q)
    bval = -a * s
    cval = a * pr
    bstr = f"- {abs(bval)}x" if abs(bval) != 1 else "- x" if bval == -1 else "x" if bval == 1 else f"+ {abs(bval)}x"
    sgn = "+" if cval >= 0 else "-"
    q = (f"{a}x² {bstr} {sgn} {abs(cval)} = 0 tenglamaning "
         f"ildizlari yig'indisini toping.")
    correct = f"{s}"
    opts = [correct, f"{s + 1}", f"{s - 1}", f"{pr}"]
    bank.add(q, opts, correct,
            f"Kvadrat tenglamada ildizlar yig'indisi -b/a = {s} ga teng "
            "(Viet teoremasi).")


def _template_quad_disc(bank, rng):
    # x^2 + bx + c = 0, D = b^2 - 4c
    b = rng.randint(2, 8)
    cases = {
        "pos": [1, 4, 9, 16],
        "zero": [0],
        "neg": [-1, -4, -9],
    }
    kind = rng.choice(["pos", "zero", "neg"])
    if kind == "zero":
        c = (b * b) // 4
        if b * b % 4 != 0 or c <= 0:
            return
    elif kind == "pos":
        k = rng.choice(cases["pos"])
        c = (b * b - k) // 4
        if (b * b - k) % 4 != 0 or c <= 0:
            return
    else:
        k = -rng.choice([1, 4, 9])
        c = (b * b - k) // 4
        if (b * b - k) % 4 != 0 or c <= 0:
            return
    D = b * b - 4 * c
    roots = 2 if D > 0 else 1 if D == 0 else 0
    q = f"x² + {b}x + {c} = 0 tenglama nechta haqiqiy ildizga ega?"
    answer = f"{roots} ta"
    opts = ["2 ta", "1 ta", "0 ta", "Cheksiz ko'p"]
    opts = [o for o in opts if o != answer] + [answer]
    expl = (f"D = b² - 4ac = {b}² - 4·1·{c} = {b * b} - {4 * c} = {D}. "
            f"D {'> 0 — 2 ta' if D > 0 else '= 0 — 1 ta' if D == 0 else '< 0 — haqiqiy ildiz yo\'q'}"
            f" haqiqiy ildiz bor.")
    bank.add(q, opts, answer, expl)


def _template_system(bank, rng):
    x0 = rng.randint(-8, 8)
    y0 = rng.randint(-8, 8)
    a1 = rng.choice([1, 2, 3])
    b1 = rng.choice([1, 2])
    a2 = rng.choice([1, 2])
    b2 = rng.choice([1, 3, 4])
    c1 = a1 * x0 + b1 * y0
    c2 = a2 * x0 + b2 * y0
    q = (f"Tenglamalar sistemasini yeching: "
         f"{{ {a1}x + {b1}y = {c1}; {a2}x + {b2}y = {c2} }}")
    correct = f"x = {x0}, y = {y0}"
    opts = [
        correct,
        f"x = {x0 + 1}, y = {y0}",
        f"x = {x0}, y = {y0 + 1}",
        f"x = {y0}, y = {x0}",
    ]
    bank.add(q, opts, correct,
            f"(x; y) = ({x0}; {y0}) berilgan tenglamalarning ikkalasini ham "
            "qanoatlantiradi. Buni o'rniga qo'yib tekshirish mumkin.")


def _template_ap_nth(bank, rng):
    a1 = rng.randint(1, 15)
    d = rng.randint(1, 7)
    n = rng.randint(3, 12)
    an = a1 + (n - 1) * d
    q = (f"Arifmetik progressiyada a₁ = {a1}, ayirma d = {d}. "
         f"{n}-hadi aₙ ni toping.")
    correct = f"{an}"
    opts = [correct, f"{a1 + n * d}", f"{a1 + (n - 2) * d}", f"{a1 * n}"]
    bank.add(q, opts, correct,
            f"Formula: aₙ = a₁ + (n-1)d = {a1} + ({n}-1)·{d} = {an}.")


def _template_ap_sum(bank, rng):
    a1 = rng.randint(1, 10)
    d = rng.randint(1, 5)
    n = rng.choice([4, 5, 6, 8, 10])
    sn = n // 2 * (2 * a1 + (n - 1) * d) if n % 2 == 0 else n * a1 + (n * (n - 1) // 2) * d
    q = (f"Arifmetik progressiyada a₁ = {a1}, d = {d}. "
         f"Dastlabki {n} ta hadning yig'indisi Sₙ ni toping.")
    correct = f"{sn}"
    opts = [correct, f"{a1 * n + (n - 1) * d}", f"{a1 * n}", f"{sn + d}"]
    bank.add(q, opts, correct,
            f"Sₙ = n/2·(2a₁ + (n-1)d) = {n}/2·({2 * a1} + {n - 1}·{d}) = {sn}.")


def _template_gp_nth(bank, rng):
    a1 = rng.randint(1, 3)
    r = rng.choice([2, 3])
    n = rng.randint(3, 6)
    an = a1 * (r ** (n - 1))
    q = (f"Geometrik progressiyada b₁ = {a1}, maxraj q = {r}. "
         f"{n}-hadni toping.")
    correct = f"{an}"
    opts = [correct, f"{a1 * r ** n}", f"{a1 * n}", f"{a1 * (r + 1)}"]
    bank.add(q, opts, correct,
            f"bₙ = b₁·q^(n-1) = {a1}·{r}^{n - 1} = {an}.")


def _template_percent(bank, rng):
    x = rng.choice([200, 300, 400, 500, 800, 1000, 2500])
    p = rng.choice([5, 10, 15, 20, 25, 30, 50])
    res = x * p // 100
    q = f"{x} sonining {p}% ni toping."
    correct = f"{res}"
    opts = [correct, f"{x - res}", f"{x + res}", f"{p}"]
    bank.add(q, opts, correct,
            f"{p}% = {p}/100. {x} · {p}/100 = {res}.")


def _template_percent_change(bank, rng):
    x = rng.choice([120, 200, 350, 500])
    p = rng.choice([10, 20, 25])
    dec = rng.random() < 0.5
    if dec:
        res = x * (100 - p) // 100
        q = f"{x} soni {p}% ga kamaytirilsa natija nechchiga teng bo'ladi?"
    else:
        res = x * (100 + p) // 100
        q = f"{x} soni {p}% ga oshirilsa natija nechchiga teng bo'ladi?"
    correct = f"{res}"
    opts = [correct, f"{res + 1}", f"{res - 1}", f"{x}"]
    bank.add(q, opts, correct,
            f"({100 + (-p if dec else p)})/100 · {x} = {res}.")


def _template_identity_sum_sq(bank, rng):
    x = rng.randint(3, 10)
    y = rng.randint(1, x - 1)
    s = x + y
    prod = x * y
    val = x * x + y * y
    q = (f"x + y = {s} va xy = {prod} bo'lsa, "
         f"x² + y² ifodaning qiymatini toping.")
    correct = f"{val}"
    opts = [correct, f"{s * s}", f"{s * s - prod}", f"{s * s + 2 * prod}"]
    bank.add(q, opts, correct,
            f"x² + y² = (x+y)² - 2xy = {s}² - 2·{prod} = {val}.")


def _template_diff_squares(bank, rng):
    b = rng.randint(2, 9)
    q = f"Quyidagi ifodalarning qaysi biri x² - {b * b} ga teng?"
    correct = f"(x - {b})(x + {b})"
    opts = [
        correct,
        f"(x - {b})²",
        f"(x + {b})(x + {b})",
        f"(x - {b})(x - {b})",
    ]
    bank.add(q, opts, correct,
            f"x² - a² = (x - a)(x + a) formulasi bo'yicha "
            f"a = {b} olamiz.")


def _template_inequality(bank, rng):
    k = rng.randint(1, 9)
    c = rng.randint(1, 40)
    a = rng.choice([2, 3, 4, 5])
    b = rng.randint(-20, 20)
    # a*x + b > c => x > (c-b)/a
    num = c - b
    den = a
    x0 = -(-num // den)  # ceil division
    opts = [
        f"x > {x0}",
        f"x < {x0}",
        f"x > {x0 - 1}",
        f"x >= {x0}",
    ]
    correct = f"x > {x0}"
    q = f"{a}x + {b} > {c} tengsizlikning yechimini toping."
    bank.add(q, opts, correct,
            f"{a}x > {c} - ({b}) = {num}; x > {num}/{a} = {x0}. "
            "Musbat songa bo'lingan (a>0), belgi o'zgarmaydi.")


def _template_exp_rules(bank, rng):
    m = rng.randint(2, 8)
    n = rng.randint(2, 8)
    op = rng.choice(["mul", "pow", "div"])
    if op == "mul":
        q = f"a^{m} · a^{n} ifodani soddalashtiring."
        correct = f"a^{m + n}"
        opts = [correct, f"a^{m * n}", f"a^{m - n}", f"a^{n - m}"]
        expl = (f"Ko'paytirishda darajalar qo'shiladi: "
                f"a^m · a^n = a^(m+n) = a^{m + n}.")
    elif op == "pow":
        q = f"(a^{m})^{n} ifodani soddalashtiring."
        correct = f"a^{m * n}"
        opts = [correct, f"a^{m + n}", f"a^{n - m}", f"a^{m ** n}"]
        expl = (f"Darajani darajaga ko'tarishda ko'paytiriladi: "
                f"(a^m)^n = a^(m·n) = a^{m * n}.")
    else:
        q = f"a^{m} / a^{n} ifodani soddalashtiring (m > n)."
        correct = f"a^{m - n}"
        opts = [correct, f"a^{m + n}", f"a^{n - m}", f"a^{m + n - 1}"]
        expl = (f"Bo'lishda darajalar ayiriladi: "
                f"a^m / a^n = a^(m-n) = a^{m - n}.")
    bank.add(q, opts, correct, expl)


def _template_proportion(bank, rng):
    x0 = rng.randint(2, 9)
    shift = rng.choice([1, 2, 3])
    b = x0
    c = x0 + shift
    m = rng.randint(2, 6)
    if (m * c) % b != 0:
        return
    x = m * c // b
    q = f"{b} : {m} = {c} : x bo'lsa, x ni toping."
    correct = f"{x}"
    opts = [correct, f"{x + 1}", f"{x - 1}", f"{m}"]
    bank.add(q, opts, correct,
            f"Kesishgan ko'paytma: {b}·x = {m}·{c} = {m * c}; "
            f"x = {m * c} / {b} = {x}.")


def _template_eval_poly(bank, rng):
    a = rng.choice([1, 2, 3])
    b = rng.choice([-5, -3, 2, 4])
    c = rng.randint(-10, 10)
    x0 = rng.randint(-5, 5)
    val = a * x0 * x0 + b * x0 + c
    q = f"P(x) = {a}x² {('+ ' if b >= 0 else '- ')}{abs(b)}x {('+ ' if c >= 0 else '- ')}{abs(c)} funksiya P({x0}) ni hisoblang."
    correct = f"{val}"
    opts = [correct, f"{val + 1}", f"{val - 1}", f"{a * x0 + b}"]
    bank.add(q, opts, correct,
            f"x = {x0}: {a}·{x0}² {('+ ' if b >= 0 else '- ')}{abs(b)}·{x0} "
            f"{('+ ' if c >= 0 else '- ')}{abs(c)} = {val}.")


def _template_abs_eq(bank, rng):
    a = rng.randint(1, 9)
    b = rng.randint(1, 6)
    q = f"|x - {a}| = {b} tenglamaning katta ildizini toping."
    correct = f"{a + b}"
    opts = [correct, f"{a - b}", f"{a}", f"{b}"]
    bank.add(q, opts, correct,
            f"x - {a} = {b} yoki x - {a} = -{b}. "
            f"Yechimlar: x = {a + b} va x = {a - b}. Kattasi {a + b}.")


def _template_factor(bank, rng):
    a = rng.choice([2, 3, 4, 5])
    c = rng.randint(1, 6)
    q = f"{a * c}x² + {a * c}x ifodani umumiy ko'paytuvchini chiqaring."
    correct = f"{a * c}x(x + 1)"
    opts = [correct, f"x({a * c}x + 1)", f"{a * c}(x² + x)", f"x²({a * c} + 1)"]
    bank.add(q, opts, correct,
            f"Ikkala hadda umumiy {a * c}x bor: {a * c}x(x + 1).")


TEMPLATES = [
    _template_linear,
    _template_quad_roots,
    _template_system,
    _template_ap_nth,
    _template_ap_sum,
    _template_gp_nth,
    _template_percent,
    _template_percent_change,
    _template_identity_sum_sq,
    _template_diff_squares,
    _template_inequality,
    _template_exp_rules,
    _template_proportion,
    _template_eval_poly,
    _template_abs_eq,
    _template_factor,
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
            except (AssertionError, ZeroDivisionError):
                continue