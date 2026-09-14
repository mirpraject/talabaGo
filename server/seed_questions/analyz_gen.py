"""Matematik Analiz — takrorlanmaydigan savollar generatori."""

import random

from .base import QuestionBank


def _template_limit_sub(bank, rng):
    a = rng.choice([1, 2, 3])
    b = rng.choice([-4, -1, 2, 5])
    c = rng.randint(-8, 8)
    x0 = rng.randint(-4, 4)
    val = a * x0 * x0 + b * x0 + c
    q = f"lim(x→{x0}) ({a}x² {('+ ' if b >= 0 else '- ')}{abs(b)}x {('+ ' if c >= 0 else '- ')}{abs(c)}) limit qiymatini toping."
    correct = f"{val}"
    opts = [correct, f"{val + 1}", f"{val - 1}", f"{a * x0 + b}"]
    bank.add(q, opts, correct,
            f"Ko'phad uzluksiz funksiya, x → {x0} o'rniga qo'yamiz: "
            f"{a}·{x0}² {('+ ' if b >= 0 else '- ')}{abs(b)}·{x0} {('+ ' if c >= 0 else '- ')}{abs(c)} = {val}.")


def _template_limit_factor(bank, rng):
    a = rng.randint(2, 8)
    q = f"lim(x→{a}) (x² - {a * a})/(x - {a}) limitini toping."
    correct = f"{2 * a}"
    opts = [correct, f"{a}", f"{a * a}", f"{2 * a - 1}"]
    bank.add(q, opts, correct,
            f"x² - a² = (x-a)(x+a) ga ajraladi: (x-a)(x+a)/(x-a) = x+a. "
            f"x → {a}: {a} + {a} = {2 * a}.")


def _template_power_deriv(bank, rng):
    n = rng.choice([2, 3, 4, 5, 6])
    q = f"(x^{n})' hosilasini toping."
    correct = f"{n}x^{n - 1}"
    opts = [correct, f"{n}x^{n}", f"x^{n - 1}", f"{n + 1}x^{n - 1}"]
    bank.add(q, opts, correct,
            f"Formula: (xⁿ)' = n·x^(n-1). n = {n} → {n}x^{n - 1}.")


def _template_deriv_at_point(bank, rng):
    a = rng.choice([1, 2, 3])
    b = rng.choice([-6, -3, 2, 4, 5])
    c = rng.randint(-9, 9)
    x0 = rng.randint(-3, 3)
    dval = 2 * a * x0 + b
    q = f"f(x) = {a}x² {('+ ' if b >= 0 else '- ')}{abs(b)}x {('+ ' if c >= 0 else '- ')}{abs(c)} funksiya f'({x0}) ni hisoblang."
    correct = f"{dval}"
    opts = [correct, f"{dval + 1}", f"{dval - 1}", f"{a * x0 + b}"]
    bank.add(q, opts, correct,
            f"f'(x) = {2 * a}x {('+ ' if b >= 0 else '- ')}{abs(b)}; "
            f"f'({x0}) = {2 * a}·{x0} {('+ ' if b >= 0 else '- ')}{abs(b)} = {dval}.")


def _template_integ_pow(bank, rng):
    n = rng.choice([1, 2, 3, 4])
    a = rng.choice([1, 2, 3])
    q = f"∫ {a}x^{n} dx integralni hisoblang."
    correct = f"{a}/{n + 1}·x^{n + 1} + C"
    opts = [correct, f"{a}x^{n + 1} + C", f"{a}n·x^{n - 1} + C", f"{a}/{n}·x^{n + 1} + C"]
    bank.add(q, opts, correct,
            f"∫xⁿ dx = x^{n + 1}/{n + 1} + C; koeffitsiyent saqlanadi: "
            f"{a}/{n + 1}·x^{n + 1} + C.")


def _template_def_integ(bank, rng):
    c = rng.choice([1, 2, 3])
    b = rng.randint(1, 6)
    val = c * b * b // 2
    if c * b * b % 2 != 0:
        val = c * b * b / 2
    q = f"∫₀^{b} {c}x dx aniq integralni hisoblang."
    correct = f"{val}"
    opts = [correct, f"{val + 1}", f"{val - 1}", f"{c * b}"]
    bank.add(q, opts, correct,
            f"∫ cx dx = c·x²/2; (0; {b}) chegarada: "
            f"{c}·{b}²/2 - {c}·0²/2 = {val}.")


def _template_monotone(bank, rng):
    k = rng.choice([2, 3, 4])
    b = rng.randint(-6, 6)
    # f'(x) = kx + b, x > -b/k o'sadi (k>0)
    pt = -(-b // k) if b >= 0 else (-b // k)  # ishora
    xk = -b / k
    # savol: f'(x) = kx + b; funksiya qaysi intervalda o'sadi
    if b == 0:
        xk = 0
    cutoff = int(xk) if xk == int(xk) else int(xk) + 1 if xk > 0 else int(xk)
    q = (f"f'(x) = {k}x {('+ ' if b >= 0 else '- ')}{abs(b)} hosila berilgan bo'lsa, "
         f"funksiya qaysi oraliqda o'sadi (k Ekvivalent: f' > 0)?")
    correct = f"x > {cutoff}"
    opts = [correct, f"x < {cutoff}", f"x > {cutoff - 1}", f"x < {cutoff + 1}"]
    bank.add(q, opts, correct,
            f"f' = {k}x {('+ ' if b >= 0 else '- ')}{abs(b)} > 0 → "
            f"{k}x {'> ' if b >= 0 else '> '}{-b / k} → "
            f"x > {cutoff} (o'suvchi oraliq).")


def _template_tangent_slope(bank, rng):
    a = rng.choice([1, 2, 3])
    b = rng.choice([-5, -2, 1, 3, 6])
    x0 = rng.randint(-3, 3)
    m = 2 * a * x0 + b
    q = f"f(x) = {a}x² {('+ ' if b >= 0 else '- ')}{abs(b)}x funksiya grafigiga x₀ = {x0} nuqtada o'tkazilgan urinmaning burchak koeffitsiyentini toping."
    correct = f"{m}"
    opts = [correct, f"{m + 1}", f"{a * x0}", f"{2 * a * x0}"]
    bank.add(q, opts, correct,
            f"Urinma koeffitsiyenti f'(x₀) ga teng: f'(x) = {2 * a}x "
            f"{('+ ' if b >= 0 else '- ')}{abs(b)}, f'({x0}) = {m}.")


def _template_avg_rate(bank, rng):
    k = rng.choice([2, 3, 5])
    b = rng.randint(-4, 4)
    x1 = rng.randint(0, 3)
    x2 = rng.randint(4, 7)
    q = f"f(x) = {k}x {('+ ' if b >= 0 else '- ')}{abs(b)} ning [{x1}; {x2}] kesmadagi o'rtacha o'zgarish tezligini toping."
    correct = f"{k}"
    opts = [correct, f"{k + 1}", f"{k - 1}", f"{k * x2 - k * x1}"]
    bank.add(q, opts, correct,
            f"O'rtacha tezlik = (f(x₂)-f(x₁))/(x₂-x₁); chiziqli funksiyada bu doim "
            f"k = {k} ga teng.")


def _template_limit_inf(bank, rng):
    a = rng.choice([2, 3, 5])
    b = rng.choice([1, 2, 4])
    c = rng.randint(-10, 10)
    d = rng.randint(-10, 10)
    val = a / b
    q = f"lim(x→∞) ({a}x {('+ ' if c >= 0 else '- ')}{abs(c)})/({b}x {('+ ' if d >= 0 else '- ')}{abs(d)}) ni toping."
    correct = f"{val}"
    opts = [correct, f"{a + b}", f"{c}/{d}", f"{round(a / b + 1, 2)}"]
    bank.add(q, opts, correct,
            f"x→∞ da kichik hadlar ahamiyatsiz: koeffitsiyentlar nisbati "
            f"{a}/{b} = {val}.")


TEMPLATES = [
    _template_limit_sub,
    _template_limit_factor,
    _template_power_deriv,
    _template_deriv_at_point,
    _template_integ_pow,
    _template_def_integ,
    _template_monotone,
    _template_tangent_slope,
    _template_avg_rate,
    _template_limit_inf,
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