"""TEST BANK SEEDER.

Har bir fan uchun 700+ test savolini yaratib, bazaga Test/TestQuestion sifatida
yuklaydi (AI ishlatilmaydi — tayyor hisoblangan/bank savollar).

Ishga tushirish:
    cd backend
    python -m app.seed_tests

Idempotent: xuddi shu nomdagi test allaqachon bo'lsa, o'tkazib yuboradi.
"""

import os
import random
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session

from server.database import SessionLocal, Base, engine
from server.models import Subject, Test, TestQuestion, User

random.seed(42)

TEST_SIZE = 40
TARGET = 700


def q(question_text: str, correct: str, wrong: list, exp: str = "") -> dict:
    return {"question": question_text, "correct": correct, "wrong": wrong, "exp": exp}


def dist(vals, correct, span):
    wrong = set()
    guard = 0
    while len(wrong) < 3 and guard < 200:
        guard += 1
        d = correct + random.randint(-span, span)
        if d != correct and d not in vals and d not in wrong:
            wrong.add(d)
    return list(wrong)


def idx_dist(vals, correct, low, high, exclude=None):
    wrong = set()
    guard = 0
    while len(wrong) < 3 and guard < 300:
        guard += 1
        d = random.randint(low, high)
        if d != correct and d not in vals and d != exclude and d not in wrong:
            wrong.add(d)
    return list(wrong)


# --------------------------------------------------------------------------
# Aniq fanlar: parametrik hisoblanadigan savollar
# --------------------------------------------------------------------------

def gen_algebra(target=TARGET):
    items, seen = [], set()

    def add(question_text, correct, wrong):
        if question_text in seen:
            return False
        seen.add(question_text)
        items.append(q(question_text, correct, wrong))
        return True

    # Exhaustive parameter sweeps guarantee enough unique texts.
    for a in range(1, 60):
        for x in range(-40, 41):
            if x == 0:
                continue
            b = random.randint(-40, 40)
            c = b + a * x
            if abs(c) > 3 * a * abs(x):
                continue
            add(f"{a}x + {b} = {c} tenglamani yeching.", str(x),
                [str(dd) for dd in dist({x}, x, 25)])
            if len(items) >= target:
                break
        if len(items) >= target:
            break

    while len(items) < target:
        r1 = random.randint(-15, 15)
        r2 = random.randint(-15, 15)
        if r1 == 0 or r2 == 0 or r1 == r2:
            continue
        bq = -(r1 + r2)
        cq = r1 * r2
        big = max(r1, r2)
        if not add(f"x² {'+ ' if bq >= 0 else '- '}{abs(bq)}x "
                   f"{'+ ' if cq >= 0 else '- '}{abs(cq)} = 0 "
                   "tenglamaning eng katta ildizini toping.", str(big),
                   [str(dd) for dd in dist({big}, big, 20)]):
            continue

    while len(items) < target:
        n = random.randint(5, 999)
        k = random.choice([5, 10, 15, 20, 25, 30, 40, 50, 60, 75])
        ans = n * k / 100
        add(f"{n} ning {k} foizini toping.", f"{ans:g}",
            [f"{ans + random.randint(1, 30):g}", f"{ans + random.randint(1, 30):g}",
             f"{ans - random.randint(1, 30):g}"])

    while len(items) < target:
        a1 = random.randint(-100, 100)
        d = random.randint(2, 30)
        nterm = random.randint(3, 25)
        ans = a1 + (nterm - 1) * d
        add(f"Arifmetik progressiyada a₁ = {a1}, d = {d}. {nterm}-hadni toping.",
            str(ans),
            [str(dd) for dd in dist({ans}, ans, 60)])

    while len(items) < target:
        r0 = random.randint(2, 9)
        a1g = random.randint(1, 20)
        nterm = random.randint(3, 10)
        ans = a1g * (r0 ** (nterm - 1))
        add(f"Geometrik progressiyada a₁ = {a1g}, q = {r0}. {nterm}-hadni toping.",
            str(ans),
            [str(dd) for dd in dist({ans}, ans, ans // 2 + 20)])

    for m in range(4, 51):
        add(f"{m * m} sonining kvadrat ildizini toping.", str(m),
            [str(dd) for dd in dist({m}, m, 12)])
        if len(items) >= target:
            break

    while len(items) < target:
        k2 = random.randint(2, 30)
        u = random.randint(-30, 30)
        add(f"x² - {k2 * k2} ni ko'paytuvchilarga ajrating.",
            f"(x - {k2})(x + {k2})",
            [f"(x - {k2})²", f"(x + {k2})²", f"(x - {u})(x + {u})"])

    while len(items) < target:
        coef = random.randint(2, 99)
        constc = random.randint(-200, 200)
        varn = random.randint(1, 999)
        ans = coef * varn + constc
        add(f"f(x) = {coef}x {'+ ' if constc >= 0 else '- '}{abs(constc)}. "
            f"f({varn}) ni toping.", str(ans),
            [str(dd) for dd in dist({ans}, ans, 80)])

    while len(items) < target:
        aq = random.randint(1, 60)
        add(f"3(x + {aq}) = 2(x - {aq}) tenglamani yeching. Javob: x = ?",
            str(-5 * aq),
            [str(dd) for dd in dist({-5 * aq}, -5 * aq, 40)])

    while len(items) < target:
        bq = random.randint(2, 30)
        add(f"x² = {bq * bq ** 2} tenglamaning musbat ildizini toping.",
            str(bq * bq),
            [str(dd) for dd in dist({bq * bq}, bq * bq, 20)])

    while len(items) < target:
        kk = random.randint(3, 40)
        add(f"{kk}⁴ ni hisoblang.", str(kk ** 4),
            [str(dd) for dd in dist({kk ** 4}, kk ** 4, kk ** 4 // 2)])

    for t in range(2, 30):
        add(f"x² + {2 * t}x + {t * t} — to'liq kvadratga ajrating.", f"(x + {t})²",
            [f"(x - {t})²", "(x + t)(x - t)", f"(x + {t})(x + 1)"])
        if len(items) >= target:
            break

    return items[:target]


def gen_geometry(target=TARGET):
    items, seen = [], set()

    def add(question_text, correct, wrong):
        if question_text in seen:
            return False
        seen.add(question_text)
        items.append(q(question_text, correct, wrong))
        return True

    # Pythagorean triples for integer distance: full sweep over shifts.
    triples = [(3, 4), (6, 8), (5, 12), (8, 15), (9, 12), (10, 24),
               (12, 16), (15, 20), (7, 24), (12, 35), (16, 30), (20, 21),
               (24, 32), (28, 45), (30, 40), (36, 48)]
    x1, y1 = 0, 0
    for (dx, dy), sx in ((t, s) for t in triples for s in (1, -1)):
        for sy in (1, -1):
            dx2, dy2 = dx * sx, dy * sy
            add(f"A({x1}; {y1}) va B({x1 + dx2}; {y1 + dy2}) nuqtalar "
                f"orasidagi masofani toping.",
                str(int((dx2 * dx2 + dy2 * dy2) ** 0.5)),
                [str(dd) for dd in dist({int((dx2**2 + dy2**2) ** 0.5)},
                                        int((dx2**2 + dy2**2) ** 0.5), 12)])
            if len(items) >= target:
                break
        if len(items) >= target:
            break

    # Midpoints: even deltas guarantee integer coordinates.
    for x1 in range(-30, 31, 3):
        for y1 in range(-30, 31, 3):
            for dx in (2, 4, 6, 8, 10):
                mx, my = x1 + dx / 2, y1 + dx / 2
                add(f"A({x1}; {y1}) va B({x1 + dx}; {y1 + dx}) — kesmaning "
                    f"o'rtasi koordinatalarini toping.",
                    f"({int(mx)}; {int(my)})",
                    [f"({int(mx) + random.randint(1, 4)}; {int(my)})",
                     f"({int(mx)}; {int(my) + random.randint(1, 4)})",
                     f"({int(mx) - random.randint(1, 4)}; {int(my) + random.randint(-2, 2)})"])
                if len(items) >= target:
                    break
            if len(items) >= target:
                break
        if len(items) >= target:
            break

    while len(items) < target:
        r = random.randint(3, 50)
        add(f"Radiusi {r} bo'lgan doiraning yuzini toping (π ≈ 3,14).",
            f"{3.14 * r * r:g}",
            [f"{3.14 * (r + random.randint(1, 5)) ** 2:g}",
             f"{3.14 * r * r + random.randint(10, 200):g}",
             f"{3.14 * (r - random.randint(0, 3)) ** 2:g}"])

    while len(items) < target:
        d1 = random.randint(4, 40)
        d2 = random.randint(4, 40)
        area = d1 * d2 / 2
        add(f"Diagonallari {d1} va {d2} ga teng rombning yuzini toping.",
            f"{int(area) if area == int(area) else area}",
            [str(dd) for dd in dist({int(area) if area == int(area) else area},
                                    int(area) if area == int(area) else area, 40)])

    for k1 in range(-8, 9):
        if k1 == 0:
            continue
        k2 = 1 if k1 != 1 else 2
        b1 = random.randint(-9, 9)
        add(f"y = {k1}x + {b1} to'g'ri chiziqqa PARALLEL bo'lgan "
            f"to'g'ri chiziq qaysi?",
            f"y = {k1}x + {random.randint(1, 9) * random.choice([1, -1])}",
            [f"y = {k2}x + {random.randint(1, 9)}",
             f"y = {random.randint(-5, 5)}x + {random.randint(1, 9)}",
             f"y = {-k1}x + 1"])
        if len(items) >= target:
            break

    # Distance from origin: exhaustive sweep.
    for ax in range(-30, 31):
        for ay in range(-30, 31):
            if ax == 0 and ay == 0:
                continue
            d0 = int((ax * ax + ay * ay) ** 0.5)
            if d0 * d0 != ax * ax + ay * ay:
                continue
            add(f"Koordinata boshidan ({ax}; {ay}) nuqtagacha masofani toping.",
                str(d0),
                [str(dd) for dd in dist({d0}, d0, 10)])
        if len(items) >= target:
            break

    while len(items) < target:
        a, b = random.randint(2, 40), random.randint(2, 40)
        p = 2 * (a + b)
        add(f"Tomonlari {a} va {b} bo'lgan to'g'ri to'rtburchak perimetri.",
            str(p),
            [str(dd) for dd in dist({p}, p, 30)])

    while len(items) < target:
        a, b = random.randint(2, 40), random.randint(2, 40)
        s = a * b
        add(f"Tomonlari {a} va {b} bo'lgan to'g'ri to'rtburchak yuzi.",
            str(s),
            [str(dd) for dd in dist({s}, s, s // 3)])

    return items[:target]


def gen_analysis(target=TARGET):
    items, seen = [], set()

    def add(question_text, correct, wrong):
        if question_text in seen:
            return False
        seen.add(question_text)
        items.append(q(question_text, correct, wrong))
        return True

    # Derivative of single monomial: full sweep over (a, n).
    for a in range(2, 61):
        for n in range(1, 9):
            coef = a * n
            add(f"f(x) = {a}x^{n} funksiyaning hosilasini toping.",
                f"{coef}x^{n - 1}",
                [f"{a}x^{n - 1}", f"{coef + random.randint(1, 5)}x^{n - 1}",
                 f"{coef}x^{n}"])
            if len(items) >= target:
                break
        if len(items) >= target:
            break

    while len(items) < target:
        a = random.randint(2, 50)
        n = random.randint(2, 6)
        m = random.randint(2, 9)
        add(f"f(x) = {a}x^{n} + {m}x² funksiyaning hosilasini toping.",
            f"{a * n}x^{n - 1} + {2 * m}x",
            [f"{a * n}x^{n} + {2 * m}x", f"{a}x^{n - 1} + {m}x",
             f"{a * n}x^{n - 1} - {2 * m}x"])

    while len(items) < target:
        m0 = random.randint(1, 30)
        n = random.randint(2, 7)
        a = (n + 1) * m0
        add(f"∫ {a}x^{n} dx integralni hisoblang.",
            f"{m0}x^{n + 1} + C",
            [f"{a}x^{n + 1} + C", f"{m0}x^{n} + C", f"{a * n}x^{n} + C"])

    while len(items) < target:
        a = random.randint(2, 30)
        add(f"∫ {a} dx integralni hisoblang.",
            f"{a}x + C",
            [f"{a} + C", f"{a // 2}x + C", f"{2 * a}x + C"])

    for a in range(2, 61):
        add(f"lim(x→{a}) (x² - {a*a}) / (x - {a}) limiti nimaga teng?",
            str(2 * a),
            [str(dd) for dd in dist({2 * a}, 2 * a, 15)])
        if len(items) >= target:
            break

    while len(items) < target:
        a = random.randint(2, 50)
        c = random.randint(2, 20)
        add(f"f(x) = {a}x + {c}. f'(3) qiymatini toping.", f"{a}",
            [str(dd) for dd in dist({a}, a, 20)])

    while len(items) < target:
        a = random.randint(2, 30)
        n = random.randint(2, 5)
        c = random.randint(1, 15)
        add(f"f(x) = {a}x^{n}. Hosilani x = {c} nuqtada hisoblang.",
            str(a * n * (c ** (n - 1))),
            [str(dd) for dd in dist({a * n * c ** (n - 1)}, a * n * c ** (n - 1), 80)])

    while len(items) < target:
        a = random.randint(2, 40)
        b = random.randint(1, 25)
        add(f"lim(x→∞) ({a}x + {b}) / ({2*a}x - 1) limiti nimaga teng?",
            "1/2",
            [f"{b}/{a}", "1", f"{a}/{b}"])

    while len(items) < target:
        a = random.randint(2, 20)
        b = random.randint(1, 12)
        kr = -b / (2 * a)
        ans_kr = str(int(kr)) if kr == int(kr) else f"-{b}/{2*a}"
        add(f"f(x) = {a}x² + {b}x. Hosilani nolga tenglashtirib "
            f"kritik nuqtani toping (f'(x) = 0).",
            f"x = {ans_kr}",
            [f"x = -{b}/{a}", "x = 0", f"x = {b}/{2*a}"])

    while len(items) < target:
        a = random.randint(2, 20)
        add(f"f(x) = {a}x³. Ikkinchi tartibli hosila f''(x) ni toping.",
            f"{6 * a}x",
            [f"{3 * a}x²", f"{6 * a}x²", f"{a * 6}"])

    while len(items) < target:
        a = random.randint(2, 15)
        k = random.randint(1, 10)
        add(f"f(x) = sin({k}x) funksiyaning hosilasini toping?",
            f"{k}cos({k}x)",
            [f"cos({k}x)", f"-{k}cos({k}x)", f"{k}sin({k}x)"])

    return items[:target]


def gen_physics(target=TARGET):
    items, seen = [], set()

    def add(question_text, correct, wrong):
        if question_text in seen:
            return False
        seen.add(question_text)
        items.append(q(question_text, correct, wrong))
        return True

    while len(items) < target:
        mode = random.randint(0, 15)

        if mode == 0:
            s, t = random.randint(12, 1500), random.randint(2, 25)
            if s % t != 0:
                continue
            add(f"Jism {s} m yo'lni {t} s da bosdi. Tezlikni toping (v = S/t).",
                str(s // t),
                [str(dd) for dd in dist({s // t}, s // t, 20)])

        elif mode == 1:
            m, a = random.randint(2, 60), random.randint(2, 20)
            add(f"m = {m} kg jismga a = {a} m/s² tezlanish beryapti. "
                f"Kuchni toping (F = ma).",
                str(m * a),
                [str(dd) for dd in dist({m * a}, m * a, 40)])

        elif mode == 2:
            m, v = random.randint(2, 20), random.randint(2, 15)
            ek = m * v * v // 2
            if m * v * v % 2 != 0:
                continue
            add(f"m = {m} kg, v = {v} m/s. Kinetik energiyani toping (Ek = mv²/2).",
                str(ek),
                [str(dd) for dd in dist({ek}, ek, ek // 2 + 10)])

        elif mode == 3:
            m, h = random.randint(2, 40), random.randint(3, 30)
            ep = m * 10 * h
            add(f"m = {m} kg jism h = {h} m balandlikda. Potensial energiyani "
                f"toping (Ep = mgh, g = 10).",
                str(ep),
                [str(dd) for dd in dist({ep}, ep, 600)])

        elif mode == 4:
            u, r = random.randint(20, 300), random.randint(2, 30)
            if u % r != 0:
                continue
            add(f"Kuchlanish U = {u} V, qarshilik R = {r} Ω. Tok kuchini toping "
                f"(I = U/R).",
                str(u // r),
                [str(dd) for dd in dist({u // r}, u // r, 10)])

        elif mode == 5:
            u, i = random.randint(20, 300), random.randint(2, 20)
            add(f"U = {u} V, I = {i} A. Quvvatni toping (P = UI).",
                str(u * i),
                [str(dd) for dd in dist({u * i}, u * i, 300)])

        elif mode == 6:
            m, v = random.randint(100, 900), random.randint(100, 900)
            if m % v == 0 or random.random() < 0.2:
                continue
            add(f"m = {m} kg, V = {v} m³. Zichlikni toping (ρ = m/V).",
                f"{m / v:.2f}",
                [f"{(m + v) / v:.2f}", f"{m / (v + 1):.2f}", f"{(m / v) + 1:.2f}"])

        elif mode == 7:
            f, s = random.randint(30, 400), random.randint(2, 30)
            add(f"F = {f} N kuch jismni {s} m siljitdi. Bajarilgan ish (A = FS).",
                str(f * s),
                [str(dd) for dd in dist({f * s}, f * s, 300)])

        elif mode == 8:
            m, dt = random.randint(2, 40), random.randint(10, 150)
            heat = 4200 * m * dt
            add(f"m = {m} kg suv ΔT = {dt}°C qizidi. Ketgan issiqlik miqdori "
                f"(Q = cmΔt, c = 4200).",
                str(heat),
                [str(dd) for dd in dist({heat}, heat, 60000)])

        elif mode == 9:
            v0, a, t = random.randint(1, 15), random.randint(2, 15), random.randint(1, 15)
            s = v0 * t + (a * t * t) // 2
            if a * t * t % 2 != 0:
                continue
            add(f"v₀ = {v0} m/s, a = {a} m/s². {t} s dagi yo'l (s = v₀t + at²/2).",
                str(s),
                [str(dd) for dd in dist({s}, s, 50)])

        elif mode == 10:
            f, s = random.randint(100, 2000), random.randint(2, 40)
            if f % s != 0:
                continue
            add(f"F = {f} N kuch {s} m² yuzaga ta'sir qiladi. Bosimni toping (P = F/S).",
                str(f // s),
                [str(dd) for dd in dist({f // s}, f // s, 50)])

        elif mode == 11:
            lam, freq = random.randint(2, 60), random.randint(20, 500)
            add(f"λ = {lam} m, f = {freq} Hz. To'lqin tezligini toping (v = λf).",
                str(lam * freq),
                [str(dd) for dd in dist({lam * freq}, lam * freq, 1500)])

        elif mode == 12:
            m = random.randint(2, 90)
            add(f"m = {m} kg jismning og'irligi qancha? (G = mg, g = 10).",
                str(10 * m),
                [str(dd) for dd in dist({10 * m}, 10 * m, 40)])

        elif mode == 13:
            m, v = random.randint(2, 30), random.randint(2, 20)
            add(f"m = {m} kg jismning impulsi: p = mv. p ni toping.",
                str(m * v),
                [str(dd) for dd in dist({m * v}, m * v, 60)])

        elif mode == 14:
            u, r = random.randint(20, 300), random.randint(2, 30)
            if u * u % r != 0:
                continue
            add(f"U = {u} V, R = {r} Ω. Quvvatni toping (P = U²/R).",
                str(u * u // r),
                [str(dd) for dd in dist({u * u // r}, u * u // r, 800)])

        elif mode == 15:
            f, l = random.randint(2, 100), random.randint(1, 20)
            add(f"Ish kuch bilan: A = {f} N · {l} m. A ni hisoblang (A = F·S).",
                str(f * l),
                [str(dd) for dd in dist({f * l}, f * l, 300)])

    return items[:target]


def gen_informatics(target=TARGET):
    items, seen = [], set()

    def add(question_text, correct, wrong):
        if question_text in seen:
            return False
        seen.add(question_text)
        items.append(q(question_text, correct, wrong))
        return True

    while len(items) < target:
        n = random.randint(2, 4095)
        add(f"{n} sonini ikkilik sanoq sistemasiga o'tkazing.",
            bin(n)[2:],
            [f"{bin(n ^ 1)[2:]}", bin(n >> 1)[2:] or "0",
             f"{bin(n + 1)[2:]}"])

    while len(items) < target:
        n = random.randint(2, 4095)
        add(f"Ikkilik {bin(n)[2:]} sonining o'nli qiymati qancha?",
            str(n),
            [str(dd) for dd in dist({n}, n, 40)])

    while len(items) < target:
        n = random.randint(16, 65535)
        add(f"{n} sonini o'n oltilik sanoq sistemasiga o'tkazing.",
            hex(n)[2:].upper(),
            [hex(n + 1)[2:].upper(), hex(n - 1)[2:].upper(), hex(n * 2)[2:].upper()])

    while len(items) < target:
        n = random.randint(8, 4095)
        add(f"{n} sonini sakkizlik sanoq sistemasiga o'tkazing.",
            oct(n)[2:],
            [oct(n | 1)[2:], oct(n + 1)[2:], oct(n - 1)[2:]])

    while len(items) < target:
        n = random.randint(1, 100)
        add(f"2^{n} nechaga teng? (ikkilik hisoblashda)", str(2 ** n),
            [str(dd) for dd in dist({2 ** n}, 2 ** n, 2 ** (n - 1))])

    while len(items) < target:
        n = random.randint(1, 999)
        add(f"{n} KB nechta bayt?", str(n * 1024),
            [str(dd) for dd in dist({n * 1024}, n * 1024, 1024)])

    while len(items) < target:
        n = random.randint(1, 999)
        add(f"{n} MB = nechta KB?", str(n * 1024),
            [str(dd) for dd in dist({n * 1024}, n * 1024, 1024)])

    while len(items) < target:
        n = random.randint(1, 999)
        add(f"{n} GB = nechta MB?", str(n * 1024),
            [str(dd) for dd in dist({n * 1024}, n * 1024, 1024)])

    while len(items) < target:
        n = random.randint(100, 9999)
        add(f"1 MB nechta Kbit? (1 bayt = 8 bit)", str(8192),
            ["1024", "1000", str(8 * n)])

    while len(items) < target:
        ch = random.choice("abcdefghijklmnopqrstuvwxyz")
        add(f"ASCII jadvalida '{ch}' harfi nechanchi o'rinda (a=97)?",
            str(ord(ch)),
            [str(ord(ch) - 1), str(ord(ch) + 1), str(ord(ch.upper()))])

    return items[:target]


def gen_programming(target=TARGET):
    items, seen = [], set()
    WORDS = ["Algoritm", "Python", "Dasturlash", "Sikl", "Bayt", "Raqam",
             "Ma'lumot", "Funksiya", "Tarmoq", "Server", "Kompyuter",
             "Interfeys", "Operatsiya", "Vektor", "Tugat", "Kirish", "Chiqish"]

    def add(question_text, correct, wrong):
        if question_text in seen:
            return False
        seen.add(question_text)
        items.append(q(question_text, correct, wrong))
        return True

    while len(items) < target:
        a, b = random.randint(1, 200), random.randint(1, 200)
        op = random.choice(["+", "-", "*"])
        ans = {"+": a + b, "-": a - b, "*": a * b}[op]
        add(f"Dastur qanday natija chiqaradi?\nx = {a}; y = {b}; "
            f"print(x {op} y)",
            str(ans),
            [str(dd) for dd in dist({ans}, ans, 40)])

    while len(items) < target:
        a, b = random.randint(1, 300), random.randint(1, 20)
        if a % b != 0:
            continue
        add(f"print({a} // {b}) — natija?", str(a // b),
            [str(a // b + 1), str(a // b - 1), str(random.randint(1, max(2, a // b + 3)))])

    while len(items) < target:
        a, b = random.randint(1, 300), random.randint(1, 300)
        add(f"print({a} % {b}) — qoldiq?", str(a % b),
            [str(dd) for dd in dist({a % b}, a % b, 12)])

    while len(items) < target:
        a = random.randint(2, 40)
        b = random.randint(2, 40)
        c = random.randint(2, 40)
        add(f"x = {a}; y = {b}\nx, y = y, {c}\nprint(x, y)",
            f"{b} {c}",
            [f"{a} {b}", f"{c} {b}", f"{a} {c}"])

    while len(items) < target:
        a = random.randint(1, 50)
        add(f"x = 10\nx += {a}\nx *= 2\nprint(x)",
            str(2 * (10 + a)),
            [str(dd) for dd in dist({2 * (10 + a)}, 2 * (10 + a), 15)])

    while len(items) < target:
        a = random.randint(2, 25)
        add(f"total = 0\nfor i in range(1, {a + 1}):\n    total += i\n"
            f"print(total) — 1 dan {a} gacha yig'indi?",
            str(a * (a + 1) // 2),
            [str(dd) for dd in dist({a * (a + 1) // 2}, a * (a + 1) // 2, 20)])

    while len(items) < target:
        w = random.choice(WORDS)
        add(f"len('{w}') — natija?", str(len(w)),
            [str(len(w) + 1), str(len(w) - 1), str(random.randint(1, 20))])

    while len(items) < target:
        a = random.randint(2, 30)
        add(f"def f(n): return n * n + {a}\nprint(f(5))",
            str(25 + a),
            [str(dd) for dd in dist({25 + a}, 25 + a, 15)])

    while len(items) < target:
        lst = [random.randint(1, 99) for _ in range(6)]
        i = random.randint(0, 5)
        add(f"a = {lst}\nprint(a[{i}]) — natija?",
            str(lst[i]),
            [str(lst[(i + 1) % 6]), str(lst[(i + 2) % 6]), str(max(lst))])

    while len(items) < target:
        a, b = random.randint(1, 90), random.randint(1, 90)
        if a == b:
            continue
        hi = max(a, b)
        lo = min(a, b)
        add(f"if {a} > {b}: print({hi})\nelse: print({lo})\n— natija?",
            str(hi), [str(lo), str(hi + 1), str(hi - 1)])

    while len(items) < target:
        a = random.randint(2, 12)
        p = random.randint(1, 8)
        add(f"for i in range(1, {2 * a}, 2): print(i, end=' ')\n— nechta son?",
            str(a),
            [str(dd) for dd in dist({a}, a, 3)])

    while len(items) < target:
        a = random.randint(1, 20)
        add(f"print('A' * {a}) — qanday ko'rinishda chiqadi?",
            f"{'A' * a}",
            [f"{'A' * (a + 1)}", f"{'A' * max(1, a - 1)}", "AAAAAAAA"])

    while len(items) < target:
        a = random.randint(2, 40)
        add(f"s = 0\nfor i in range({a}):\n    s += 2\nprint(s)",
            str(2 * a),
            [str(dd) for dd in dist({2 * a}, 2 * a, 12)])

    while len(items) < target:
        a, b = random.randint(1, 50), random.randint(1, 50)
        add(f"print(bool({a} < {b}))", str(a < b),
            [str(not (a < b)).lower(), "None", "0"])

    return items[:target]


PERIODIC = {"H": 1, "He": 4, "C": 12, "N": 14, "O": 16, "F": 19, "Na": 23,
            "Mg": 24, "Al": 27, "Si": 28, "P": 31, "S": 32, "Cl": 35.5,
            "K": 39, "Ca": 40, "Fe": 56, "Cu": 64, "Zn": 65, "Br": 80,
            "Ag": 108, "I": 127, "Ba": 137, "Pb": 207}


def parse_formula(formula):
    import re
    pat = re.compile(r"([A-Z][a-z]?)(\d*)")
    counts = {}
    for el, num in pat.findall(formula):
        counts[el] = counts.get(el, 0) + (int(num) if num else 1)
    return counts


def molar_mass(formula):
    counts = parse_formula(formula)
    if not counts:
        return None
    total = 0.0
    for el, n in counts.items():
        if el not in PERIODIC:
            return None
        total += PERIODIC[el] * n
    if int(total) == total:
        return int(total)
    return total


def gen_chemistry(target=TARGET):
    items, seen = [], set()
    formulas = ["CO2", "SO2", "NO2", "NH3", "CH4", "C2H6", "C2H4", "C2H2",
                "NaCl", "KCl", "CaCl2", "MgCl2", "FeCl3", "Na2O", "K2O",
                "CaO", "MgO", "Fe2O3", "Al2O3", "Na2SO4", "CaCO3", "NaHCO3",
                "H2SO4", "H2CO3", "HNO3", "H3PO4", "NaOH", "KOH", "Ca(OH)2",
                "C6H12O6", "C2H5OH", "CH3COOH", "CuO", "ZnO", "FeO", "AgNO3",
                "BaSO4", "KMnO4", "KClO3", "AlCl3", "N2O5", "P2O5", "SO3",
                "SiO2", "MnO2", "Ca3PO4", "Na3PO4", "K2CO3", "NH4OH"]
    elements = list(PERIODIC.items())

    def add(question_text, correct, wrong):
        if question_text in seen:
            return False
        seen.add(question_text)
        items.append(q(question_text, correct, wrong))
        return True

    # Mode 2 pairwise: largest atomic mass among 4 random elements.
    while len(items) < target:
        chosen = random.sample(elements, 4)
        heavy = max(chosen, key=lambda x: x[1])
        others = [e for e, m in chosen if e != heavy[0]]
        add(f"Berilgan elementlardan eng KATTA atom massaga ega bo'lgani qaysi? "
            f"({', '.join(e for e, m in chosen)})",
            heavy[0], others)

    # Molar mass + formula atom counts (dedup makes these additive).
    while len(items) < target:
        f = random.choice(formulas)
        mm = molar_mass(f)
        if mm is None:
            continue
        add(f"{f} ning molyar massasi (g/mol)?", str(mm),
            [str(mm + random.randint(3, 30)), str(mm - random.randint(3, 30)),
             str(random.randint(30, 200))])

    while len(items) < target:
        el, mass = random.choice(elements)
        add(f"{el} elementining atom raqami (protonlar soni)?", str(mass),
            [str(max(1, mass - 1)), str(mass + 2), str(mass + 8)])

    while len(items) < target:
        f = random.choice(["H2O", "CO2", "NH3", "CH4", "SO2", "NO2",
                           "C2H6", "C2H4", "C2H2", "CH3COOH"])
        counts = parse_formula(f)
        total = sum(counts.values())
        add(f"{f} molekulasida jami nechta atom bor?", str(total),
            [str(total + 1), str(total + 2), str(max(1, total - 1))])

    return items[:target]


def gen_economics(target=TARGET):
    items, seen = [], set()

    def add(question_text, correct, wrong):
        if question_text in seen:
            return False
        seen.add(question_text)
        items.append(q(question_text, correct, wrong))
        return True

    while len(items) < target:
        mode = random.randint(0, 5)

        if mode == 0:
            rev, cost = random.randint(1000, 9000), random.randint(500, 4000)
            add(f"Daromad {rev} so'm, xarajat {cost} so'm. Foyda?",
                str(rev - cost),
                [str(dd) for dd in dist({rev - cost}, rev - cost, 1000)])

        elif mode == 1:
            price, p = random.randint(100, 900), random.randint(5, 30)
            ans = price * p // 100
            if price * p % 100 != 0:
                continue
            add(f"{price} so'mlik tovarga {p}% chegirma. Chegirma miqdori?",
                str(ans),
                [str(dd) for dd in dist({ans}, ans, 50)])

        elif mode == 2:
            p, r, t = random.randint(1000, 9000), random.randint(5, 20), random.randint(12, 72)
            ans = p * r * t // 100
            if p * r * t % 100 != 0:
                continue
            add(f"S = {p} so'm, yillik foiz {r}%, muddat {t//12} yil. "
                f"Oddiy foizli daromad (P*r*t/100)?",
                str(ans),
                [str(dd) for dd in dist({ans}, ans, 500)])

        elif mode == 3:
            price, p = random.randint(1000, 9000), random.randint(5, 25)
            add(f"{price} so'mga {p}% QQS qo'shilsa, yakuniy narx qancha?",
                str(price + price * p // 100),
                [str(dd) for dd in dist({price + price * p // 100},
                                        price + price * p // 100, 500)])

        elif mode == 4:
            gdp, pop = random.randint(1000, 9000), random.randint(10, 100)
            if gdp % pop != 0:
                continue
            add(f"YaIM = {gdp} mln so'm, aholi = {pop} ming. "
                f"Aholi jon boshiga YaIM?",
                str(gdp // pop),
                [str(dd) for dd in dist({gdp // pop}, gdp // pop, 100)])

        elif mode == 5:
            qty, price = random.randint(100, 900), random.randint(10, 90)
            add(f"Talab: mahsulot {qty} dona, narxi {price} so'm. "
                f"Umumiy tushum?", str(qty * price),
                [str(dd) for dd in dist({qty * price}, qty * price, 3000)])

    return items[:target]


# INSERT_GENERATORS_HERE


# --------------------------------------------------------------------------
# Ingliz tili
# --------------------------------------------------------------------------

EN_VOCAB = [
    ("book", "kitob"), ("student", "talaba"), ("teacher", "o'qituvchi"),
    ("school", "maktab"), ("university", "universitet"), ("lesson", "dars"),
    ("class", "sinf"), ("pen", "ruchka"), ("pencil", "qalam"),
    ("notebook", "daftar"), ("bag", "sumka"), ("chair", "stul"),
    ("table", "stol"), ("window", "deraza"), ("door", "eshik"),
    ("day", "kun"), ("night", "tun"), ("morning", "ertalab"),
    ("evening", "kechqurun"), ("week", "hafta"), ("month", "oy"),
    ("year", "yil"), ("today", "bugun"), ("tomorrow", "ertaga"),
    ("yesterday", "kecha"), ("water", "suv"), ("bread", "non"),
    ("milk", "sut"), ("tea", "choy"), ("coffee", "qahva"),
    ("apple", "olma"), ("banana", "banan"), ("orange", "apelsin"),
    ("meat", "go'sht"), ("fish", "baliq"), ("egg", "tuxum"),
    ("family", "oila"), ("father", "ota"), ("mother", "ona"),
    ("brother", "aka-uka"), ("sister", "opa-singil"), ("son", "o'g'il"),
    ("daughter", "qiz"), ("friend", "do'st"), ("house", "uy"),
    ("room", "xona"), ("kitchen", "oshxona"), ("garden", "bog'"),
    ("city", "shahar"), ("village", "qishloq"), ("street", "ko'cha"),
    ("road", "yo'l"), ("car", "mashina"), ("bus", "avtobus"),
    ("train", "poezd"), ("plane", "samolyot"), ("ship", "kema"),
    ("money", "pul"), ("work", "ish"), ("job", "kasb"),
    ("doctor", "shifokor"), ("engineer", "muhandis"), ("lawyer", "yurist"),
    ("artist", "rassom"), ("music", "musiqa"), ("song", "qo'shiq"),
    ("film", "film"), ("game", "o'yin"), ("sport", "sport"),
    ("football", "futbol"), ("basketball", "basketbol"), ("run", "yugurish"),
    ("swim", "suzish"), ("walk", "yurish"), ("read", "o'qish"),
    ("write", "yozish"), ("learn", "o'rganish"), ("speak", "gapirish"),
    ("listen", "tinglash"), ("think", "o'ylash"), ("know", "bilish"),
    ("love", "sevish"), ("like", "yoqtirish"), ("help", "yordam berish"),
    ("buy", "sotib olish"), ("sell", "sotish"), ("give", "bermoq"),
    ("take", "olmoq"), ("come", "kelmoq"), ("go", "bormoq"),
    ("eat", "yemoq"), ("drink", "ichmoq"), ("sleep", "uxlash"),
    ("wake", "uyg'onish"), ("open", "ochmoq"), ("close", "yopmoq"),
    ("small", "kichik"), ("big", "katta"), ("long", "uzun"),
    ("short", "qisqa"), ("new", "yangi"), ("old", "eski"),
    ("good", "yaxshi"), ("bad", "yomon"), ("beautiful", "chiroyli"),
    ("strong", "kuchli"), ("fast", "tez"), ("slow", "sekin"),
    ("hot", "issiq"), ("cold", "sovuq"), ("warm", "iliq"),
    ("happy", "baxtli"), ("sad", "qayg'uli"), ("tired", "charchagan"),
    ("busy", "band"), ("free", "bo'sh"), ("right", "to'g'ri"),
    ("wrong", "noto'g'ri"), ("true", "rost"), ("false", "yolg'on"),
    ("hard", "qiyin"), ("easy", "oson"), ("interesting", "qiziqarli"),
    ("boring", "zerikarli"), ("sweet", "shirin"), ("sour", "nordon"),
    ("salt", "tuz"), ("sugar", "shakar"), ("vegetable", "sabzavot"),
    ("fruit", "meva"), ("flower", "gul"), ("tree", "daraxt"),
    ("sun", "quyosh"), ("moon", "oy"), ("star", "yulduz"),
    ("sky", "osmon"), ("earth", "yer"), ("mountain", "tog'"),
    ("river", "daryo"), ("lake", "ko'l"), ("sea", "dengiz"),
    ("forest", "o'rmon"), ("desert", "cho'l"), ("rain", "yomg'ir"),
    ("snow", "qor"), ("wind", "shamol"), ("cloud", "bulut"),
    ("ice", "muz"), ("fire", "olov"), ("light", "yorug'lik"),
    ("dark", "qorong'i"), ("color", "rang"), ("white", "oq"),
    ("black", "qora"), ("red", "qizil"), ("green", "yashil"),
    ("blue", "ko'k"), ("yellow", "sariq"), ("brown", "jigarrang"),
    ("time", "vaqt"), ("hour", "soat"), ("minute", "daqiqa"),
    ("second", "soniya"), ("question", "savol"), ("answer", "javob"),
    ("word", "so'z"), ("sentence", "gap"), ("language", "til"),
    ("country", "davlat"), ("world", "dunyo"), ("people", "odamlar"),
    ("child", "bola"), ("man", "erkak"), ("woman", "ayol"),
    ("hand", "qo'l"), ("head", "bosh"), ("eye", "ko'z"),
    ("ear", "quloq"), ("nose", "burun"), ("mouth", "og'iz"),
    ("heart", "yurak"), ("blood", "qon"), ("bone", "suyak"),
    ("body", "tana"), ("health", "salomatlik"), ("ill", "kasal"),
    ("medicine", "dori"), ("hospital", "kasalxona"), ("phone", "telefon"),
    ("computer", "kompyuter"), ("internet", "internet"), ("email", "elektron pochta"),
    ("message", "xabar"), ("news", "yangiliklar"), ("letter", "xat"),
    ("page", "sahifa"), ("number", "son"), ("story", "hikoya"),
    ("idea", "g'oya"), ("problem", "muammo"), ("solution", "yechim"),
    ("part", "qism"), ("place", "joy"), ("name", "ism"),
    ("thing", "narsa"), ("person", "shaxs"), ("life", "hayot"),
    ("death", "o'lim"), ("mind", "aql"), ("memory", "xotira"),
    ("dream", "tush"), ("hope", "umid"), ("fear", "qo'rquv"),
    ("joy", "quvonch"), ("peace", "tinchlik"), ("war", "urush"),
    ("power", "kuch"), ("freedom", "erkinlik"), ("justice", "adolat"),
    ("truth", "haqiqat"), ("way", "yo'l"), ("goal", "maqsad"),
    ("plan", "reja"), ("rule", "qoida"), ("law", "qonun"),
    ("duty", "majburiyat"), ("rights", "huquqlar"), ("history", "tarix"),
    ("geography", "geografiya"), ("science", "fan"), ("math", "matematika"),
    ("art", "san'at"), ("culture", "madaniyat"), ("society", "jamiyat"),
    ("government", "hukumat"), ("president", "prezident"), ("countryside", "qishloq joy"),
    ("rabbi-it", "quyon"), ("dog", "it"), ("cat", "mushuk"),
    ("horse", "ot"), ("cow", "sigir"), ("sheep", "qo'y"),
    ("bird", "qush"), ("lion", "sher"), ("wolf", "bo'ri"),
    ("bear", "ayiq"), ("elephant", "fil"), ("camel", "tuya"),
    ("tiger", "yo'lbars"), ("monkey", "maymun"), ("rabbit", "quyon"),
]

EN_IRREGULAR = [
    ("go", "went", "gone"), ("come", "came", "come"), ("take", "took", "taken"),
    ("give", "gave", "given"), ("see", "saw", "seen"), ("eat", "ate", "eaten"),
    ("drink", "drank", "drunk"), ("write", "wrote", "written"), ("read", "read", "read"),
    ("speak", "spoke", "spoken"), ("break", "broke", "broken"), ("begin", "began", "begun"),
    ("buy", "bought", "bought"), ("bring", "brought", "brought"), ("think", "thought", "thought"),
    ("teach", "taught", "taught"), ("catch", "caught", "caught"), ("get", "got", "got"),
    ("forget", "forgot", "forgotten"), ("know", "knew", "known"), ("fly", "flew", "flown"),
    ("grow", "grew", "grown"), ("sleep", "slept", "slept"), ("keep", "kept", "kept"),
    ("feel", "felt", "felt"), ("leave", "left", "left"), ("lose", "lost", "lost"),
    ("meet", "met", "met"), ("pay", "paid", "paid"), ("say", "said", "said"),
    ("sell", "sold", "sold"), ("send", "sent", "sent"), ("sit", "sat", "sat"),
    ("stand", "stood", "stood"), ("swim", "swam", "swum"), ("run", "ran", "run"),
    ("sing", "sang", "sung"), ("win", "won", "won"), ("find", "found", "found"),
    ("hold", "held", "held"), ("hide", "hid", "hidden"), ("hear", "heard", "heard"),
    ("make", "made", "made"), ("build", "built", "built"), ("choose", "chose", "chosen"),
    ("drive", "drove", "driven"), ("fall", "fell", "fallen"), ("draw", "drew", "drawn"),
    ("wear", "wore", "worn"), ("rise", "rose", "risen"), ("ride", "rode", "ridden"),
]


EN_VOCAB_Q = [
    "«{en}» so'zining o'zbekcha tarjimasi qaysi?",
    "«{en}» so'zi o'zbek tilida nimani bildiradi?",
    "{en} — o'zbekchada qanday aytiladi?",
    "«{en}» so'zining ma'nosi qaysi javobda to'g'ri berilgan?",
]
EN_VOCAB_R = [
    "«{uz}» so'zining inglizcha tarjimasi qaysi?",
    "«{uz}» so'zi ingliz tilida nimani bildiradi?",
    "{uz} — inglizchada qanday aytiladi?",
    "«{uz}» so'zining inglizcha mos kelishi qaysi?",
]


def gen_english(target=TARGET):
    items, seen = [], set()

    def add(question_text, correct, wrong):
        if question_text in seen:
            return False
        seen.add(question_text)
        items.append(q(question_text, correct, wrong))
        return True

    for nit in range(target * 6):
        if len(items) >= target:
            break
        mode = random.randint(0, 3)
        if mode == 0:
            en, uz = random.choice(EN_VOCAB)
            wrong = [w for e, w in EN_VOCAB if w != uz]
            add(random.choice(EN_VOCAB_Q).format(en=en), uz,
                random.sample(wrong, 3))
        elif mode == 1:
            en, uz = random.choice(EN_VOCAB)
            wrong = [e for e, w in EN_VOCAB if e != en]
            add(random.choice(EN_VOCAB_R).format(uz=uz), en,
                random.sample(wrong, 3))
        elif mode == 2:
            v1, v2, v3 = random.choice(EN_IRREGULAR)
            wrong2 = [f for a, f, g in EN_IRREGULAR if f != v2]
            add(f"Fe'lning o'tgan zamon (Past Simple) shakli: {v1} → ?", v2,
                random.sample(wrong2, 3))
        else:
            v1, v2, v3 = random.choice(EN_IRREGULAR)
            wrong3 = [g for a, f, g in EN_IRREGULAR if g != v3]
            add(f"Fe'lning III shakli (Past Participle): {v1} → ?", v3,
                random.sample(wrong3, 3))

    return items[:target]


# --------------------------------------------------------------------------
# Ona tili va adabiyot
# --------------------------------------------------------------------------

UZ_SYNONYMS = [
    ("katta", "ulkan"), ("kichik", "mitti"), ("chiroyli", "go'zal"),
    ("tez", "ildam"), ("sekin", "asta"), ("yaxshi", "a'lo"),
    ("yomon", "sifatsiz"), ("aqlli", "zakiy"), ("qo'rqoq", "yuraksiz"),
    ("jasur", "botir"), ("toza", "pokiza"), ("kambag'al", "qashshoq"),
    ("boy", "badavlat"), ("kuchli", "qudratli"), ("achchiq", "talx"),
    ("shirin", "shakor"), ("issiq", "qaynoq"), ("sovuq", "muzdek"),
    ("yengil", "vaznsiz"), ("og'ir", "vazmin"), ("baland", "yuqori"),
    ("past", "pastroq"), ("uzoq", "yiroq"), ("yaqin", "qo'shni"),
    ("tekin", "bepul"), ("hamma", "barcha"), ("hech kim", "noch"),
    ("uchramoq", "duch kelmoq"), ("hayron", "taajjub"), ("g'amgin", "xafa"),
    ("xursand", "shod"), ("yig'lamoq", "siraqizmoq"), ("kulmoq", "jilmaymoq"),
    ("so'ramoq", "iloj so'ramoq"), ("bilmoq", "xabardor bo'lmoq"), ("ish", "mehnat"),
    ("o'y", "fikr"), ("gapirish", "nutq"), ("yozish", "bitmoq"),
    ("o'qish", "mutolaa"), ("kitob", "asar"), ("yurak", "dil"),
    ("ko'z", "nazar"), ("bola", "farzand"), ("ota", "padar"),
    ("ona", "momatar"), ("do'st", "o'rtog"), ("shahar", "kent"),
    ("qishloq", "ovul"), ("yo'l", "sayohat"), ("daryo", "muhim suv yo'li"),
    ("tog'", "baland tog'"), ("o'rmon", "qalin daraxtzor"), ("osmon", "samo"),
    ("quyosh", "oftob"), ("oy", "mahobatli samoviy jism"), ("yulduz", "sitora"),
    ("ovqat", "taom"), ("non", "nan"), ("choy", "mayizli ichimlik"),
    ("kuch", "quvvat"), ("vaqt", "zamon"), ("hayot", "umr"),
    ("o'lim", "ajal"), ("tinchlik", "omonlik"), ("urush", "jang"),
    ("g'alaba", "zafar"), ("mag'lubiyat", "yengilish"), ("erk", "hurlik"),
    ("yaxlit", "butun"), ("yarim", "nimta"), ("bo'sh", "xoli"),
    ("to'la", "lingė tula"), ("ko'p", "mo'l"), ("kam", "oz"),
    ("kerak", "zarur"), ("lozim", "shart"), ("mumkin", "ijozat bor"),
    ("yo'q", "noto'g'ri"), ("bor", "mavjud"), ("ha", "rost"),
    ("erta", "tong"), ("kech", "oqshom"), ("kun", "kunduz"),
    ("tun", "kecha"), ("yoz", "joz"), ("qish", "qirov"),
    ("bahor", "ko'klam"), ("kuz", "sarg'ish fasl"), ("mehmon", "mijoz"),
    ("uy", "xonadon"), ("bog'", "gulzor"), ("daraxt", "yog'och"),
    ("gul", "chechak"), ("suv", "ob-havo manbai"), ("havo", "atmosfera"),
    ("tuz", "namak"), ("shakar", "qand"), ("o't", "aloq"),
    ("go'sht", "lahm"), ("baliq", "mahiy"), ("tuxum", "bex"),
    ("sut", "qaymoq"), ("choy", "choi"), ("meva", "samara"),
    ("sabzavot", "sabzi"), ("odam", "inson"), ("ayol", "xotin"),
    ("erkak", "yigit"), ("qiz", "bonu"), ("o'g'il", "farzand"),
]

UZ_ANTONYMS = [
    ("katta", "kichik"), ("baland", "past"), ("uzun", "qisqa"),
    ("keng", "tor"), ("ochiq", "yopiq"), ("issiq", "sovuq"),
    ("qaynoq", "muzdek"), ("tez", "sekin"), ("erta", "kech"),
    ("kun", "tun"), ("yaxshi", "yomon"), ("toza", "iflos"),
    ("shirin", "achchiq"), ("yengil", "og'ir"), ("boy", "kambag'al"),
    ("chaqqon", "sekin"), ("yigit", "qiz"), ("o'ng", "chap"),
    ("yo'q", "bor"), ("kam", "ko'p"), ("past", "yuqori"),
    ("qisqa masofa", "uzoq masofa"), ("to'g'ri", "noto'g'ri"),
    ("ha", "yo'q"), ("kuchli", "kuchsiz"), ("jasur", "qo'rqoq"),
    ("baxtli", "baxtsiz"), ("hayot", "o'lim"), ("tinchlik", "urush"),
    ("g'alaba", "mag'lubiyat"), ("sotib olmoq", "sotmoq"),
    ("bermoq", "olmoq"), ("kelmoq", "ketmoq"), ("ochmoq", "yopmoq"),
    ("boshi", "oxiri"), ("avval", "keyin"), ("ichida", "tashqarida"),
    ("yuqorida", "pastda"), ("chapda", "o'ngda"), ("oldida", "orqasida"),
    ("boshlanish", "tugash"), ("yaqin", "uzoq"), ("yangi", "eski"),
    ("yosh", "qari"), ("katta yo'l", "kichik yo'l"), ("shirin", "talx"),
]

UZ_POS = [
    ("kitob", "ot"), ("go'zal", "sifat"), ("o'qimokda", "fe'l"),
    ("tez", "ravish"), ("men", "olmosh"), ("va", "bog'lovchi"),
    ("yoki", "bog'lovchi"), ("uchun", "ko'makchi"), ("ustida", "ko'makchi"),
    ("daraxt", "ot"), ("yashil", "sifat"), ("uchdi", "fe'l"),
    ("bugun", "ravish"), ("sen", "olmosh"), ("ular", "olmosh"),
    ("lekin", "bog'lovchi"), ("bilan", "ko'makchi"), ("shahar", "ot"),
    ("katta", "sifat"), ("yozdi", "fe'l"), ("har kuni", "ravish"),
    ("biz", "olmosh"), ("ammo", "bog'lovchi"), ("sabr", "ot"),
    ("sabrli", "sifat"), ("keldi", "fe'l"), ("doim", "ravish"),
    ("qachon", "olmosh"), ("chunki", "bog'lovchi"), ("to'g'risida", "ko'makchi"),
    ("dengiz", "ot"), ("tinch", "sifat"), ("turadi", "fe'l"),
    ("hali", "ravish"), ("nimaga", "olmosh"), ("go'yo", "bog'lovchi"),
    ("ortida", "ko'makchi"), ("vaqt", "ot"), ("foydali", "sifat"),
    ("ishladi", "fe'l"), ("kecha", "ravish"), ("qani", "olmosh"),
]

UZ_AUTHORS = [
    ("Alisher Navoiy", "Xamsa"), ("Alisher Navoiy", "Lison ut-tayr"),
    ("Alisher Navoiy", "Mahbub ul-qulub"), ("Zahiriddin Muhammad Bobur", "Boburnoma"),
    ("Zahiriddin Muhammad Bobur", "Devoni Boburiy"), ("Muhammad Yusuf", "Bebahor bahor"),
    ("Abdulla Qodiriy", "O'tkan kunlar"), ("Abdulla Qodiriy", "Mehrobdan chayon"),
    ("Abdulla Qodiriy", "Obid ketmon"), ("Cho'lpon", "Kecha va kunduz"),
    ("Cho'lpon", "Shoirning orzusi"), ("Usmon Nosir", "Yurak"),
    ("Hamid Olimjon", "Zaynab va Omon"), ("Hamid Olimjon", "Oygul va Baxtiyor"),
    ("G'afur G'ulom", "Shum bola"), ("G'afur G'ulom", "Meni kichik uyim"),
    ("Oybek", "Ulug' yo'l"), ("Oybek", "Navoiy"),
    ("Abdulhamid Cho'lpon", "Paranj"), ("Said Ahmad", "Ufq"),
    ("Said Ahmad", "Kelinlar qo'zg'oloni"), ("O'tkir Hoshimov", "Ikki eshik orasi"),
    ("O'tkir Hoshimov", "Dunyoning ishlari"), ("O'tkir Hoshimov", "Bahor qaytmaydi"),
    ("Tog'ay Murod", "Otamdan qolgan dalalar"), ("Erkin Vohidov", "Ruhlar isyoni"),
    ("Abdulla Oripov", "Yillar armoni"), ("Abdulla Oripov", "Jannatga yo'l"),
    ("Maqsud Shayxzoda", "Mirzo Ulug'bek"), ("Maqsud Shayxzoda", "Jaloliddin Manguberdi"),
    ("Asqad Muhтar", "Chinor"), ("Pirimqul Qodirov", "Yulduzli tunlar"),
    ("Pirimqul Qodirov", "Uch ildiz"), ("Omon Muxtor", "Egizaklar"),
    ("Odil Yoqubov", "Ulug'bek xazinasi"), ("Mirmuhsin", "Me'mor"),
    ("Abdurahmon Jomiy", "Yetti go'zal"), ("Alisher Navoiy", "Farhod va Shirin"),
    ("Alisher Navoiy", "Layli va Majnun"), ("Ogahiy", "Sabot ul-ojiziyn"),
    ("Munavvar Qori", "Ilm va amal"), ("Tursunoy Saidazimova", "O'zbek qizi"),
    ("Zulfiya", "Hovlim ostidagi daraxtlar"), ("Erkin Vohidov", "Yoshlik"),
    ("Shukrullo", "Jangchi yurak"), ("Uyg'un", "O'rik gullaganda"),
    ("Mirtemir", "O'zbek kuchi"), ("Oybek", "Qutlug' qon"),
]

UZ_BOOKS = {
    "Xamsa": "Alisher Navoiy", "Boburnoma": "Zahiriddin Muhammad Bobur",
    "O'tkan kunlar": "Abdulla Qodiriy", "Kecha va kunduz": "Cho'lpon",
    "Shum bola": "G'afur G'ulom", "Ulug' yo'l": "Oybek",
    "Yulduzli tunlar": "Pirimqul Qodirov", "Ikki eshik orasi": "O'tkir Hoshimov",
    "Lison ut-tayr": "Alisher Navoiy", "Devoni Boburiy": "Zahiriddin Muhammad Bobur",
    "Mehrobdan chayon": "Abdulla Qodiriy", "Zaynab va Omon": "Hamid Olimjon",
    "Navoiy": "Oybek", "Ruhlar isyoni": "Erkin Vohidov",
    "Yillar armoni": "Abdulla Oripov", "Mirzo Ulug'bek": "Maqsud Shayxzoda",
    "Jannatga yo'l": "Abdulla Oripov", "Otamdan qolgan dalalar": "Tog'ay Murod",
    "Uch ildiz": "Pirimqul Qodirov", "Kelinlar qo'zg'oloni": "Said Ahmad",
    "Dunyoning ishlari": "O'tkir Hoshimov", "Bahor qaytmaydi": "O'tkir Hoshimov",
    "Egizaklar": "Omon Muxtor", "Me'mor": "Mirmuhsin",
    "Bebahor bahor": "Muhammad Yusuf", "Paranj": "Abdulhamid Cho'lpon",
    "Shoirning orzusi": "Cho'lpon", "Yurak": "Usmon Nosir",
    "Farhod va Shirin": "Alisher Navoiy", "Layli va Majnun": "Alisher Navoiy",
}

UZ_TERMS = [
    ("O'xshatish", "so'z va iboralarning obrazli qo'llanishi: kabi, singari, yanglig"),
    ("Mubolag'a", "narsa-hodisani kuchaytirib tasvirlash, bo'rttirish"),
    ("Metafora", "ko'chma ma'noda qo'llash, o'xshatishsiz ko'chirish"),
    ("Kinoya", "bir narsani aytib, uning aksini nazarda tutish"),
    ("Qochirim", "foydalanilgan an'anaviy so'z turkumi"),
    ("Glavrax", "badiiy asar qahramonlari nomi ro'yxati"),
    ("Epigraf", "asar boshiga qo'yilgan iqtibos"),
    ("Tasvir", "voqea va manzarani jonli shaklda aks ettirish"),
    ("Bildirmoqda", "muallifning fikr-mulohazalari, his-tuyg'ulari"),
    ("Sujet", "asar voqealarining ketma-ket rivoji"),
    ("Kompozitsiya", "asar qismlarining o'zaro joylashuvi"),
    ("Obraz", "badiiy asarda aks etgan arete tasviri"),
    ("Interyer", "ichki makon tasviri, xona jihozlarini ifodalash"),
    ("Peyzaj", "tabiat manzarasining tasviri"),
    ("Portret", "qahramon tashqi qiyofasining tasviri"),
    ("Dilog", "ikki kishi o'rtasidagi suhbat"),
    ("Monolog", "bir kishining nutqi"),
    ("Polїlog", "bir necha kishi ishtirokidagi nutq"),
    ("Sinistromodell", "asar voqealari avj nuqtasi"),
    ("Kultімінация", "asar voqealari eng keskin nuqtasi"),
]


UZ_SYN_Q = [
    "«{a}» so'zining sinonimini toping.",
    "«{a}» so'ziga ma'nodoshi bo'lgan so'z qaysi?",
    "{a} so'zining sinonimi qaysi javobda berilgan?",
]
UZ_ANT_Q = [
    "«{a}» so'zining antonimini toping.",
    "«{a}» so'ziga qarama-qarshi ma'noli so'z qaysi?",
    "{a} so'zining ziddi (antonimi) qaysi javobda?",
]
UZ_POS_Q = [
    "«{w}» so'zi qaysi so'z turkumiga kiradi?",
    "{w} so'zi morfologik jihatdan qaysi turkumga mansub?",
    "«{w}» so'zining so'z turkumini aniqlang.",
]
UZ_AUTHOR_Q = [
    "«{work}» asarining muallifi kim?",
    "«{work}» asarini kim yozgan?",
    "{work} asarining yozuvchisi qaysi?",
]


def gen_uzbek(target=TARGET):
    items, seen = [], set()

    def add(question_text, correct, wrong):
        if question_text in seen:
            return False
        seen.add(question_text)
        items.append(q(question_text, correct, wrong))
        return True

    for a, b in UZ_SYNONYMS:
        if len(items) >= target:
            return items[:target]
        add(random.choice(UZ_SYN_Q).format(a=a), b,
            random.sample([w for x, w in UZ_SYNONYMS if w != b], 3))

    for nit in range(target * 8):
        if len(items) >= target:
            break
        a, b = random.choice(UZ_ANTONYMS)
        wrong = [w for x, w in UZ_ANTONYMS if w != b]
        add(random.choice(UZ_ANT_Q).format(a=a), b, random.sample(wrong, 3))
        if len(items) >= target:
            break
        wrong = [x for x, w in UZ_ANTONYMS if x != a]
        add(random.choice(UZ_ANT_Q).format(a=b), a, random.sample(wrong, 3))

    for nit in range(target * 4):
        if len(items) >= target:
            break
        word, pos = random.choice(UZ_POS)
        all_pos = ["ot", "sifat", "fe'l", "ravish", "olmosh", "bog'lovchi", "ko'makchi"]
        wrong = [p for p in all_pos if p != pos]
        add(random.choice(UZ_POS_Q).format(w=word), pos, random.sample(wrong, 3))

    for nit in range(target * 4):
        if len(items) >= target:
            break
        author, work = random.choice(UZ_AUTHORS)
        wrong_works = [w for a, w in UZ_AUTHORS if w != work]
        wrong_authors = [a for a, w in UZ_AUTHORS if a != author]
        add(random.choice(UZ_AUTHOR_Q).format(work=work), author,
            random.sample(wrong_authors, 3))
        if len(items) >= target:
            break
        add(f"«{author}» asarining nomi qaysi?", work, random.sample(wrong_works, 3))

    for nit in range(target * 4):
        if len(items) >= target:
            break
        term, desc = random.choice(UZ_TERMS)
        wrong = [t for t, d in UZ_TERMS if t != term]
        add(f"«{desc}» — bu nima deyiladi?", term, random.sample(wrong, 3))

    # Parametric morphology: ko'plik (-lar), egalik (-ning), o'tgan zamon (-di).
    for nit in range(target * 4):
        if len(items) >= target:
            break
        w = random.choice(["kitob", "bola", "daraxt", "shahar", "gul", "uy",
                           "ota", "do'st", "qush", "daftar", "qalam", "suv"])
        add(f"«{w}» so'zining ko'plik shakli qanday?",
            f"{w}lar",
            random.sample([w + "ning", w + "da", w + "siz", w + "chi"], 3))

    for nit in range(target * 4):
        if len(items) >= target:
            break
        w = random.choice(["kitob", "daftar", "stol", "uy", "gul", "qush"])
        add(f"«{w}» so'ziga egalik qo'shimchasini qo'shing (unga tegishli).",
            f"{w}im",
            random.sample([f"{w}lar", f"{w}da", f"{w}ning", f"{w}siz"], 3))

    for nit in range(target * 4):
        if len(items) >= target:
            break
        v = random.choice(["yoz", "o'qi", "kel", "ket", "sot", "ol", "ber", "chiq", "kir", "ishla"])
        add(f"«{v}moq» fe'lining o'tgan zamon shakli (egalik 3-shaxs) qanday?",
            f"{v}di",
            random.sample([f"{v}moqda", f"{v}ish", f"{v}moqchi", f"{v}maydi"], 3))

    for nit in range(target * 4):
        if len(items) >= target:
            break
        w = random.choice(["yaxshi", "tez", "chiroyli", "katta", "issiq", "sovuq"])
        add(f"«{w}» so'zidan ravish yasang (daraja/kuchaytirish).",
            f"{w}roq",
            random.sample([w + "lik", w + "chi", w + "siz", w + "dagi"], 3))

    return items[:target]


# --------------------------------------------------------------------------
# Tarix
# --------------------------------------------------------------------------

HISTORY_EVENTS = [
    ("O'zbekiston Respublikasi mustaqilligining e'lon qilinishi", 1991),
    ("Alisher Navoiyning tug'ilishi", 1441), ("Amir Temurning tug'ilishi", 1336),
    ("Amir Temur davlati poytaxti — Samarqandga aylanishi", 1370),
    ("Boburning Kabuga kirishi va Boburiylar imperiyasining asos solinishi", 1526),
    ("Mirzo Ulug'bek rasadxonasining qurilishi", 1420),
    ("Chingizxonning Xorazmga yurishi", 1219),
    ("Jaloladdin Manguberdi qo'shinlarining Hindon daryosidagi jangi", 1221),
    ("Tohiriy va Somaniylar davri boshlanishi", 819),
    ("Xiva xonligining vujudga kelishi", 1511),
    ("Buxoro amirligining tashkil topishi (Mang'itlar sulolasi)", 1747),
    ("Qo'qon xonligining tashkil topishi", 1709),
    ("O'zbekiston SSR tashkil topishi", 1924),
    ("Toshkentdagi zilzila", 1966),
    ("Toshkent metropolitenining ochilishi", 1977),
    ("Abdulla Qodiriyning «O'tkan kunlar» asari", 1926),
    ("Avval-ba Sinne shoh taxtga o'tirishi", -330),
    ("Yunon-Baqtriya podsholigi shakllanishi", -250),
    ("Ko'hna Marvdagi ipak savdosi", 0),
    ("Arab xalifaligining Movarounnahrga bosqini", 704),
    ("Badiiy va ilmiy kashfiyot: al-Xorazmiyning tug'ilishi", 783),
    ("Ibn Sino tug'ilgan yil", 980),
    ("Ulug'bekning vafoti", 1449),
    ("Sanjar saltanati davri", 1118),
    ("Chig'atoy ulusi o'rnida Amir Temur hokimiyati", 1370),
    ("Boburning «Boburnoma» kitobi", 1530),
    ("Rus taraqqiyparvarlari ta'sirida yangi usul maktablari", 1890),
    ("Jadidlar tomonidan «Taraqqiy» gazetasi", 1906),
    ("Farg'ona va Toshkentdagi milli ozodlik qo'zg'olonlari", 1916),
    ("Turkiston Avtonom Sovet respublikasi tuzilishi", 1918),
    ("O'zbekiston Fransiyadek hududni qamragan urush yillari", 1941),
    ("Samarqand viloyati tashkil topgan", 1930),
    ("Oliy Majlis birinchi chaqirig'i", 1990),
    ("O'zbekiston Respublikasi Konstitutsiyasi qabul qilinishi", 1992),
    ("Milly valyuta — so'm muomalaga kiritilishi", 1994),
    ("Oliy Majlis Senatining tashkil topishi", 2005),
    ("Mustaqil O'zbekiston paytga asos solingan", 2020),
]

HISTORY_PEOPLE = [
    ("Amir Temur", "Temuriylar sarkardasi va davlat asoschisi"),
    ("Mirzo Ulug'bek", "astronom, matematik olim va hukmdor"),
    ("Alisher Navoiy", "ulug' shoir, davlat arbobi"),
    ("Zahiriddin Muhammad Bobur", "Boburiylar imperiyasi asoschisi va shoir"),
    ("Ibn Sino", "tibbiyot va falsafa olimi"),
    ("al-Xorazmiy", "algebra asoschisi olim"),
    ("al-Farg'oniy", "astronom olim"),
    ("Axmad al-Farg'oniy", "geometriya va astronomiya asarlari muallifi"),
    ("Abu Rayhon Beruniy", "qomusiy olim"),
    ("Jaloladdin Manguberdi", "Xorazm sarkardasi"),
    ("Chingizxon", "Mo'g'ul imperiyasining asoschisi"),
    ("Аbu Bakr Qaffol", "hadis ilmi olimi"),
    ("Kaykovus", "«Qobusnoma» asar muallifi"),
    ("Sa'di Sheroziy", "«Guliston» va «Bo'ston» muallifi"),
    ("Firdavsiy", "«Shohnoma» doston muallifi"),
    ("Nizomiy Ganjaviy", "«Xamsa» muallifi"),
    ("Mahmud Qoshg'ariy", "«Devonu lug'atit-turk» muallifi"),
    ("Yusuf Xos Hojib", "«Qutadg'u bilig» muallifi"),
    ("Axmad Yassaviy", "«Devoni hikmat» muallifi"),
    ("Shahzoda Rahima", "O'zbek kinomatograflari"),
]


def gen_history(target=TARGET):
    items, seen = [], set()

    def add(question_text, correct, wrong):
        if question_text in seen:
            return False
        seen.add(question_text)
        items.append(q(question_text, correct, wrong))
        return True

    for nit in range(target * 6):
        if len(items) >= target:
            break
        ev, year = random.choice(HISTORY_EVENTS)
        wrong_years = [y for e, y in HISTORY_EVENTS if y != year]
        add(f"«{ev}» voqeasi qaysi yilda sodir bo'lgan?", str(year),
            [str(w) for w in random.sample(wrong_years, 3)])
        if len(items) >= target:
            break
        wrong = [e for e, y in HISTORY_EVENTS if e != ev]
        add(f"{year} yilda sodir bo'lgan voqea qaysi?", ev,
            random.sample(wrong, 3))

    for nit in range(target * 6):
        if len(items) >= target:
            break
        person, desc = random.choice(HISTORY_PEOPLE)
        wrong = [p for p, d in HISTORY_PEOPLE if p != person]
        add(f"«{desc}» — bu kim?", person, random.sample(wrong, 3))
        if len(items) >= target:
            break
        person, desc = random.choice(HISTORY_PEOPLE)
        wrong = [d for p, d in HISTORY_PEOPLE if d != desc]
        add(f"{person} kim sifatida mashhur?", desc, random.sample(wrong, 3))

    # Comparative: qaysi voqea avvalroq? (yillar orqali hisoblash)
    ev_pool = [(e, y) for e, y in HISTORY_EVENTS if isinstance(y, int)]
    pairs = [(a, b) for a in ev_pool for b in ev_pool
             if a[0] != b[0] and a[1] != b[1]]
    for early, late in random.sample(pairs, min(len(pairs), 4000)):
        good, bad = (early, late) if early[1] < late[1] else (late, early)
        add(f"Qaysi voqea avvalroq sodir bo'lgan? «{good[0]}» ({good[1]} yil) "
            f"yoki «{late[0]}» ({late[1]} yil)?",
            f"{good[0]}",
            [f"{late[0]}", "Ikkalasi bir vaqtda",
             random.choice([e for e, y in HISTORY_EVENTS
                            if e not in (good[0], late[0])])])
        if len(items) >= target:
            break

    return items[:target]


# --------------------------------------------------------------------------
# Geografiya
# --------------------------------------------------------------------------

GEO_CAPITALS = [
    ("Toshkent", "O'zbekiston"), ("Moskva", "Rossiya"), ("Parij", "Fransiya"),
    ("Berlin", "Germaniya"), ("London", "Buyuk Britaniya"), ("Rim", "Italiya"),
    ("Pekin", "Xitoy"), ("Tokyo", "Yaponiya"), ("Seul", "Janubiy Koreya"),
    ("Anqara", "Turkiya"), ("Lohsun", "Pokiston"), ("Boku", "Ozarbayjon"),
    ("Olmaota", "Qozog'iston"), ("Bishkek", "Qirg'iziston"), ("Dushanbe", "Tojikiston"),
    ("Ashxobod", "Turkmaniston"), ("Kiyev", "Ukraina"), ("Minsk", "Belarus"),
    ("Vilnyus", "Litva"), ("Riga", "Latviya"), ("Tallin", "Estoniya"),
    ("Vashington", "AQSh"), ("O'ttava", "Kanada"), ("Mexiko", "Meksika"),
    ("Buenos-Ayres", "Argentina"), ("Braziliya", "Braziliya (sobiq poytaxt Rio)"),
    ("Lima", "Peru"), ("Bogota", "Kolumbiya"), ("Santyago", "Chili"),
    ("Karokas", "Venesuela"), ("Qohira", "Misr"), ("Riad", "Saudiya Arabistoni"),
    ("Abu-Dabi", "BAA"), ("Tehron", "Eron"), ("Bag'dod", "Iroq"),
    ("Damashq", "Suriya"), ("Bayrut", "Livan"), ("Ammon", "Iordaniya"),
    ("Tel-Aviv", ("Isroil poytaxti e'tirofli")), ("Er-Riyoz", "Saudiya Arabistoni"),
    ("Sana", "Yaman"), ("Maskat", "Ummon"), ("Dakka", "Bangladesh"),
    ("Katmandu", "Nepal"), ("Kolombo", "Shri-Lanka"), ("Bangkok", "Tailand"),
    ("Xanoy", "Vyetnam"), ("Jakarta", "Indoneziya"), ("Manila", "Filippin"),
    ("Kuala-Lumpur", "Malayziya"), ("Singapur", "Singapur"), ("Kano", "Nigeriya"),
    ("Nayrobi", "Keniya"), ("Addis-Abeba", "Efiopiya"), ("Rabot", "Marokash"),
    ("Kabir", "Afg'oniston"), ("Ko'prik kent", "Afg'oniston"), ("Islomobod", "Pokiston"),
    ("Dunyo, eng baland tog'iq Cho'qqi — Everest", "Himalay (Nepal)"),
]

GEO_FACTS = [
    ("Kaspiy dengizi", "dunyodagi eng katta ko'l"),
    ("Bodomli Suv", "Baliq dengizi atrofi"),
    ("Ishchio karri", "dunyo bo'yicha eng katta quruqlik — Osiyo"),
    ("Nil daryosi", "Afrikadagi eng uzun daryo"),
    ("Amudaryo", "O'zbekistonning asosiy daryosi"),
    ("Sirdaryo", "Markaziy Osiyoning ikkinchi yirik daryosi"),
    ("Orol", "Markaziy Osiyodagi shirin suvli ko'l"),
    ("Sayhun", "Sirdaryoning qadimiy nomi"),
    ("Jayhun", "Amudaryoning qadimiy nomi"),
    ("Chirchiq", "Toshkent viloyatidagi daryo"),
    ("Hind okeani", "uchinchi yirik okean"),
    ("Tinch okeani", "dunyodagi eng katta okean"),
    ("Kingizning qadimiy qirg'oq chizig'i", "Amudaryo delta"),
    ("Olmaliq", "mis konlari bilan mashhur shahar"),
    ("Buxoro", "ipak yo'li bo'yidagi qadimiy shahar"),
    ("Samarqand", "eng qadimiy shaharlaridan biri"),
    ("Xiva", "ochiq osmon ostidagi muzey shahar"),
    ("Nukus", "Qoraqalpoq'iston poytaxti"),
    ("Muynoq", "Orol bo'yidagi shahar"),
]


GEO_NUM = [  # (nom, kategoriya, qiymat, birlik)
    ("Nil", "daryo", 6650, "km"), ("Amazonka", "daryo", 6400, "km"),
    ("Temza", "daryo", 346, "km"), ("Amudaryo", "daryo", 2540, "km"),
    ("Sirdaryo", "daryo", 2212, "km"), ("Volga", "daryo", 3530, "km"),
    ("Don", "daryo", 1870, "km"), ("Tigr", "daryo", 1900, "km"),
    ("Yevfrat", "daryo", 2880, "km"), ("Gang", "daryo", 2510, "km"),
    ("Xuanxe", "daryo", 4845, "km"), ("Yansəzi", "daryo", 6300, "km"),
    ("Missisipi", "daryo", 3770, "km"), ("Missuri", "daryo", 3767, "km"),
    ("Evel", "daryo", 4180, "km"), ("Ubangi", "daryo", 2272, "km"),
    ("Kolumbiya", "daryo", 1953, "km"), ("Ind", "daryo", 3180, "km"),
    ("Kongo", "daryo", 4700, "km"), ("Tuna", "daryo", 2860, "km"),
    ("Kizil", "daryo", 6300, "km"), ("Mekong", "daryo", 4500, "km"),
    ("Bobrobiy daryo", "daryo", 4590, "km"), ("Orinoko", "daryo", 2140, "km"),
    ("Danubiy", "daryo", 2850, "km"), ("Reyn", "daryo", 1233, "km"),
    ("Sena", "daryo", 776, "km"), ("Lora", "daryo", 1020, "km"),
    ("Vistula", "daryo", 1047, "km"), ("Zambezi", "daryo", 2574, "km"),
    ("Kaspiy", "ko'l", 371000, "km²"), ("Orol", "ko'l", 68000, "km²"),
    ("Balxash", "ko'l", 16996, "km²"), ("Issiqko'l", "ko'l", 6236, "km²"),
    ("Baykal", "ko'l", 31500, "km²"), ("Bodom", "ko'l", 58700, "km²"),
    ("Tanganika", "ko'l", 32900, "km²"), ("Malo", "ko'l", 68000, "km²"),
    ("Olmaliq", "tog'", 1581, "m"), ("Hazrat Sulton", "tog'", 4643, "m"),
    ("Cho'qqi Pobeda", "tog'", 7439, "m"), ("Elbrus", "tog'", 5642, "m"),
    ("Eversett", "tog'", 8848, "m"), ("K2", "tog'", 8611, "m"),
    ("Kançenjung", "tog'", 8586, "m"), ("Lhotse", "tog'", 8516, "m"),
    ("Makalu", "tog'", 8485, "m"), ("Cho-Oyu", "tog'", 8188, "m"),
    ("Dhaulagiri", "tog'", 8167, "m"), ("Manaslu", "tog'", 8163, "m"),
    ("Nanga Parbat", "tog'", 8126, "m"), ("Annapurna", "tog'", 8091, "m"),
    ("Gazerkbrum", "tog'", 8080, "m"), ("Broad Peak", "tog'", 8051, "m"),
    ("Surxansay", "tog'", 4085, "m"), ("Chimyon", "tog'", 3309, "m"),
    ("Toshkent", "shahar", 2600000, "aholi"), ("Samarqand", "shahar", 575000, "aholi"),
    ("Buxoro", "shahar", 280000, "aholi"), ("Namangan", "shahar", 640000, "aholi"),
    ("Andijon", "shahar", 441000, "aholi"), ("Farg'ona", "shahar", 299000, "aholi"),
    ("Qarshi", "shahar", 274000, "aholi"), ("Nukus", "shahar", 310000, "aholi"),
    ("Urganch", "shahar", 150000, "aholi"), ("Jizzax", "shahar", 180000, "aholi"),
    ("Navoiy", "shahar", 141000, "aholi"), ("Guliston", "shahar", 90000, "aholi"),
    ("Termiz", "shahar", 150000, "aholi"), ("Xiva", "shahar", 95000, "aholi"),
]

GEO_CAP_Q = [
    "{country} davlatining poytaxti qaysi shahar?",
    "{country} shtati/prezidenti qaysi shaharda joylashgan?",
    "Qaysi shahar {country} davlatining poytaxti?",
]
GEO_CAP_R = [
    "{cap} shahri qaysi davlatning poytaxti?",
    "{cap} — qaysi mamlakatdagi asosiy shahar/poytaxt?",
]


def gen_geography(target=TARGET):
    items, seen = [], set()

    def add(question_text, correct, wrong):
        if question_text in seen:
            return False
        seen.add(question_text)
        items.append(q(question_text, correct, wrong))
        return True

    for nit in range(target * 6):
        if len(items) >= target:
            break
        cap, country = random.choice(GEO_CAPITALS)
        wrong = [c for c, co in GEO_CAPITALS if c != cap]
        add(random.choice(GEO_CAP_Q).format(country=country), cap,
            random.sample(wrong, 3))
        if len(items) >= target:
            break
        wrong = [co for c, co in GEO_CAPITALS if co != country]
        add(random.choice(GEO_CAP_R).format(cap=cap), country,
            random.sample(wrong, 3))

    for nit in range(target * 6):
        if len(items) >= target:
            break
        item, fact = random.choice(GEO_FACTS)
        wrong = [f for i, f in GEO_FACTS if f != fact]
        add(f"«{fact}» — qaysi geografik obyekt?", item, random.sample(wrong, 3))
        if len(items) >= target:
            break
        wrong = [i for i, f in GEO_FACTS if i != item]
        add(f"{item} haqida qaysi ma'lumot to'g'ri?", fact,
            random.sample(wrong, 3))

    # Raqamli taqqoslash: qaysi qiymat kattaroq/uzunroq?
    for nit in range(target * 4):
        if len(items) >= target:
            break
        pair = random.sample(GEO_NUM, 2)
        (a, ca, va, ua), (b, cb, vb, ub) = pair
        if va == vb:
            continue
        hi, lo = (a, ca, va, ua), (b, cb, vb, ub)
        if va < vb:
            hi, lo = lo, hi
        add(f"Kattalik bo'yicha taqqoslang: «{hi[0]}» ({hi[2]} {hi[3]}) "
            f"va «{lo[0]}» ({lo[2]} {lo[3]}). Qaysi biri katta?",
            hi[0],
            [lo[0], random.choice([g[0] for g in GEO_NUM if g[0] not in (hi[0], lo[0])]),
             random.choice([g[0] for g in GEO_NUM if g[0] not in (hi[0], lo[0])])])

    return items[:target]


# --------------------------------------------------------------------------
# Biyologiya
# --------------------------------------------------------------------------

BIO_TERMS = [
    ("Mitoxondriya", "hujayraning energiya stansiyasi"),
    ("Xloroplast", "fotosintez sodir bo'ladigan organoid"),
    ("Ribosoma", "oqsillar sintezlanadigan organoid"),
    ("Yadro", "hujayraning boshqaruv markazi"),
    ("Hujayra membranasi", "hujayra tashqi qobig'i, moddalar kirish-chiqishini boshqaradi"),
    ("Vakuola", "o'simlik hujayrasidagi suv va modda saqlovchi bo'shliq"),
    ("Gologen apparat", "oqsillarni qadoqlash va tashish"),
    ("Lizosoma", "hujayra ichidagi hazm organoidi"),
    ("Sitoplazma", "organoidlar joylashgan yarim suyuq muhit"),
    ("Xromosoma", "irsiy axborot saqlovchi tuzilma"),
    ("DNK", "irsiy axborot tashuvchi molekula"),
    ("RNK", "oqsillar sintezida ishtirok etuvchi nucleic kislota"),
    ("A-T juftligi", "DNKda adenin qarshisida timin turadi"),
    ("G-S juftligi", "DNKda guanin qarshisida sitozin turadi"),
    ("Fotosintez", "o'simliklarda yorug'likda organik modda sintezi"),
    ("Xlorofill", "yashil pigment"),
    ("Osmos", "suvning yarim o'tkazuvchan membrana orqali o'tishi"),
    ("Diffuziya", "moddalarning zichligi yuqori tomondan past tomonga siljishi"),
    ("Gemoglobin", "kislorod tashuvchi qizil qon pigmenti"),
    ("Ferment", "biokimyoviy reaksiyalarni tezlashtiruvchi oqsil"),
    ("Gormon", "ichki sekretsiya bezi ishlab chiqaradigan tartibga soluvchi modda"),
    ("Insulin", "qon shakari darajasini boshqaruvchi gormon"),
    ("Adrenalin", "stress vaziyatida ajralib chiqadigan gormon"),
    ("Vitamin C", "sitrus mevalarda ko'p bo'lgan vitamin"),
    ("Vitamin D", "quyosh nuri ta'sirida sintezlanadigan vitamin"),
    ("Kaltsiy", "suyaklarning mustahkamligiga javob beruvchi mineral"),
    ("Temir", "qon tarkibidagi gemoglobin tarkibiga kiradigan metall"),
    ("Yod", "qalqonsimon bez ishi uchun zarur element"),
    ("Uglerod", "organik birikmalarning asosiy elementi"),
    ("Kislorod", "nafas olishda qonga kiradigan gaz"),
    ("Karbonat angidrid", "nafas chiqarishda ajralib chiqadigan gaz"),
    ("Azot", "havoning asosiy (78%) tashkil etuvchisi"),
    ("Bakteriya", "bir hujayrali prokariot organizm"),
    ("Virus", "hujayradan tashqarida hayot belgilariga ega bo'lmagan mavjudot"),
    ("Ameba", "o'z shaklini o'zgartiruvchi bir hujayrali hayvon"),
    ("Euglena yashil", "hayvon va o'simlik xususiyatini birlashtirgan"),
    ("Gidra", "chuchuk suvlarda yashovchi seldi suv havzalaridagi hayvon"),
    ("Ilon", "sudralib yuruvchi"),
    ("Kobra", "zaharli ilon"),
    ("Echidna", "tuxum qo'yuvchi sutemizuvchi"),
    ("Kenguru", "Hindiston va Avstraliyada mashhur chuqurchali hayvon"),
    ("Koala", "Avstraliya cho'lida yashaydigan marsupial"),
]

BIO_ANIMALS = [
    ("Arslon", "yirtqich sut emizuvchi — hayvonlar shohi"),
    ("Fil", "eng yirik quruqlik hayvoni"),
    ("Gitaal", "eng yirik sut emizuvchi — dengiz"),
    ("Amur", "eng tez yuguruvchi hayvon"),
    ("Temirchi", "ñaqish kuchi mashhur"),
    ("Yo'lbars", "mushuksimonlar oilasiga mansub yirik yirtqich"),
    ("Ayiq", "qishda uyquga ketadigan yirik sut emizuvchi"),
    ("Bo'ri", "it oilasiga mansub yirtqich"),
    ("Tulki", "ayyorligi bilan mashhur hayvon"),
    ("Quyon", "tez ko'payuvchi kichik sut emizuvchi"),
    ("Kirpi", "ignali himoyasi bor kichik hayvon"),
    ("Kalamush", "kemiruvchilar vakili"),
    ("Kaktus", "cho'l sharoitiga moslashgan o'simlik"),
    ("Paxta", "O'zbekistonning asosiy ekini"),
    ("Bug'doy", "non tayyorlanadigan donli o'simlik"),
    ("Sholi", "guruch olinadigan o'simlik"),
    ("Oqqorong'u", "gulxayri — dorivor"),
    ("Gulxayri", "dorivor o'simlik"),
]


BIO_TERM_Q = [
    "«{desc}» — bu nima deyiladi?",
    "{desc} — qaysi biologik tushuncha?",
    "«{desc}» degan hodisa/tuzilma qaysi atama bilan ataladi?",
]
BIO_ANIMAL_Q = [
    "«{fact}» — qaysi hayvon/o'simlik?",
    "{fact} degan tavsif qaysi organizmga tegishli?",
    "«{fact}» — bu qaysi jonzot?",
]

BIO_NUM = [  # (organizm, kategoriya, qiymat)
    ("Inson", "xromosoma", 46), ("Maymun", "xromosoma", 48),
    ("Piyoz", "xromosoma", 16), ("Makkajo'xori", "xromosoma", 20),
    ("Bug'doy", "xromosoma", 42), ("Karfıt", "xromosoma", 14),
    ("Pomidor", "xromosoma", 24), ("Salqin olma", "xromosoma", 34),
    ("Ot", "xromosoma", 64), ("Sigir", "xromosoma", 60),
    ("It", "xromosoma", 78), ("Mushuk", "xromosoma", 38),
    ("Quyon", "xromosoma", 44), ("G'oz", "xromosoma", 80),
    ("Tovuq", "xromosoma", 78), ("Chivin", "xromosoma", 6),
    ("Drosophila", "xromosoma", 8), ("Xamsa balig'i", "xromosoma", 48),
    ("Qurbaqa", "xromosoma", 26), ("Gigant ammonit", "xromosoma", 104),
    ("Gorilla", "xromosoma", 48), ("Shimpanze", "xromosoma", 48),
    ("Eshak", "xromosoma", 62), ("Qo'y", "xromosoma", 54),
    ("Echki", "xromosoma", 60), ("Cho'chqa", "xromosoma", 38),
    ("O'rdak", "xromosoma", 80), ("Kalamush", "xromosoma", 42),
    ("Sichqon", "xromosoma", 40), ("Karam", "xromosoma", 18),
    ("Sabzi", "xromosoma", 18), ("Qulupnay", "xromosoma", 56),
    ("Bodring", "xromosoma", 14), ("Baqlajon", "xromosoma", 24),
    ("Qovun", "xromosoma", 24),
]


def gen_biology(target=TARGET):
    items, seen = [], set()

    def add(question_text, correct, wrong):
        if question_text in seen:
            return False
        seen.add(question_text)
        items.append(q(question_text, correct, wrong))
        return True

    for nit in range(target * 6):
        if len(items) >= target:
            break
        term, desc = random.choice(BIO_TERMS)
        wrong = [t for t, d in BIO_TERMS if t != term]
        add(random.choice(BIO_TERM_Q).format(desc=desc), term,
            random.sample(wrong, 3))
        if len(items) >= target:
            break
        term, desc = random.choice(BIO_TERMS)
        wrong = [d for t, d in BIO_TERMS if d != desc]
        add(f"{term} haqida to'g'ri ta'rifni toping.", desc,
            random.sample(wrong, 3))

    for nit in range(target * 6):
        if len(items) >= target:
            break
        animal, fact = random.choice(BIO_ANIMALS)
        wrong = [f for a, f in BIO_ANIMALS if f != fact]
        add(random.choice(BIO_ANIMAL_Q).format(fact=fact), animal,
            random.sample(wrong, 3))
        if len(items) >= target:
            break
        animal, fact = random.choice(BIO_ANIMALS)
        wrong = [a for a, f in BIO_ANIMALS if a != animal]
        add(f"{animal} qaysi qator to'g'ri tavsiflanadi?", fact,
            random.sample(wrong, 3))

    # Raqamli: xromosoma soni va taqqoslash
    for nit in range(target * 4):
        if len(items) >= target:
            break
        org, kind, val = random.choice(BIO_NUM)
        others = [o for o, k, v in BIO_NUM if o != org]
        add(f"{org}ning somatik hujayrasida nechta xromosoma bor?",
            str(val),
            [str(v) for v in random.sample([x[2] for x in BIO_NUM if x[2] != val], 3)])
        if len(items) >= target:
            break
        pair = random.sample(BIO_NUM, 2)
        (a, ka, va), (b, kb, vb) = pair
        if va == vb:
            continue
        hi, lo = (a, va), (b, vb)
        if va < vb:
            hi, lo = lo, hi
        add(f"Qaysi organizmning hujayrasida xromosoma soni KO'P: "
            f"{hi[0]} ({hi[1]}) yoki {lo[0]} ({lo[1]})?",
            hi[0],
            [lo[0],
             random.choice([x[0] for x in BIO_NUM if x[0] not in (hi[0], lo[0])]),
             random.choice([x[0] for x in BIO_NUM if x[0] not in (hi[0], lo[0])])])

    return items[:target]


# --------------------------------------------------------------------------
# Falsafa
# --------------------------------------------------------------------------

PHIL_CONCEPTS = [
    ("Ontologiya", "borliq haqidagi ta'limot"),
    ("Gnoseologiya", "bilish haqidagi ta'limot"),
    ("Aksiologiya", "qadriyatlar haqidagi ta'limot"),
    ("Etika", "axloq haqidagi fan"),
    ("Estetika", "go'zallik haqidagi fan"),
    ("Dialektika", "rivojlanish va qarama-qarshiliklar haqidagi ta'limot"),
    ("Metafizika", "o'zgarmas mohiyatlarni o'rganuvchi falsafiy yondashuv"),
    ("Muammo", "falsafiy tadqiqotning dastlabki bosqichi"),
    ("Gipoteza", "ilmiy taxmin"),
    ("Paradigma", "fanda hukmron qarashlar tizimi"),
    ("Determinizm", "hodisalarning sababiy bog'liqligi"),
    ("Indeterminizm", "sababiy bog'liqlikni inkor qilish"),
    ("Monizm", "borliqning yagona asosini tan olish"),
    ("Dualizm", "ikki asosni (ruh va materiya) tan olish"),
    ("Pluralizm", "ko'plab asoslarni tan olish"),
    ("Idealizm", "ruh/ong borliqning asosi deb qarash"),
    ("Materializm", "materiya borliqning asosi deb qarash"),
    ("Sensualizm", "bilim manbai — sezgi a'zolari"),
    ("Ratsionalizm", "bilim manbai — aql"),
    ("Empirizm", "bilim manbai — tajriba"),
    ("Agnostitsizm", "olamni bilish mumkin emas degan nuqtayi nazar"),
    ("Nihilizm", "qadriyatlarni inkor etish"),
    ("Fatalizm", "taqdirlanganlikni tan olish"),
    ("Voluntarizm", "irodani asosiy omil deb bilish"),
    ("Eudemonizm", "baxt-saodatni oliy maqsad deb bilish"),
    ("Altruizm", "boshqalar manfaati uchun yashash"),
    ("Kosmizm", "inson va koinot uyg'unligi g'oyasi"),
    ("Teotsentrizm", "Xudoni borliq markazi deb bilish"),
    ("Antropotsentrizm", "insonni borliq markazi deb bilish"),
    ("Substansiya", "mustaqil mavjud bo'lgan asos"),
    ("Atribut", "substansiyaning muhim xossasi"),
    ("Modus", "substansiyaning o'zgaruvchan holati"),
    ("Refleksiya", "o'z bilimlarini o'zi tekshirish"),
    ("Intuitsiya", "isbotsiz bevosita bilish"),
    ("Analogiya", "o'xshashlik asosida xulosa chiqarish"),
    ("Induksiya", "xususiy bilimdan umumiy bilimga o'tish"),
    ("Deduksiya", "umumiy bilimdan xususiy bilimga o'tish"),
    ("Abstraksiya", "muhim belgilarni ajratib olish"),
    ("Sintez", "qismlarni yaxlitlikka birlashtirish"),
    ("Analiz", "yaxlitlikni qismlarga ajratish"),
    ("Evristika", "ijodiy izlanish va topish san'ati"),
    ("Ekzistensializm", "inson mavjudligi muammosi"),
    ("Pragmatizm", "amaliy foydani haqiqat mezoni deb bilish"),
    ("Pozitivizm", "faqat ilmiy bilimni haqiqiy deb bilish"),
    ("Skeptitsizm", "har qanday bilimga shubha bilan qarash"),
    ("Stoitsizm", "vazminlik va burchga amal qilish ta'limoti"),
    ("Kosmologiya", "koinot haqidagi falsafiy ta'limot"),
    ("Teleologiya", "mavjudlikni maqsad nuqtayi nazaridan tushuntirish"),
    ("Gumanizm", "insonni oliy qadriyat deb bilish"),
    ("Animizm", "joning tabiat hodisalarida yashashiga ishonish"),
    ("Mitologiya", "olamni afsonalar orqali tushuntirish"),
]

PHIL_THINKERS = [
    ("Sokrat", "«O'zingni o'zing bil» g'oyasi", -469),
    ("Platon", "g'oyalar dunyosi haqidagi ta'limot", -427),
    ("Aristotel", "formal mantiq asoschisi", -384),
    ("Konfutsiy", "xitoy mutafakkiri, axloq ta'limoti", -551),
    ("Lao-tszi", "daoizm asoschisi", -604),
    ("Pifagor", "sonlarni borliq asosi deb bilgan", -570),
    ("Geraklit", "«hamma narsa oqadi» g'oyasi", -535),
    ("Demokrit", "atomlar haqidagi ta'limot", -460),
    ("Epikur", "lazzat va xotirjamlik haqidagi ta'limot", -341),
    ("Abu Nasr Forobiy", "«Muallim as-soniy» (ikkinchi muallim)", 870),
    ("Ibn Sino", "tibbiyot va falsafa qomusiy olimi", 980),
    ("Ibn Rushd", "Aristotel sharhlovchisi", 1126),
    ("Imom G'azzoliy", "islom falsafasi va tasavvuf vakili", 1058),
    ("Ahmad Yassaviy", "tasavvufda « Devoni hikmat» muallifi", 1093),
    ("Jaloliddin Rumiy", "«Masnaviyi ma'naviy» muallifi", 1207),
    ("Bahouddin Naqshband", "naqshbandiya tariqati asoschisi", 1318),
    ("Amir Temur", "sarkarda, davlat asoschisi", 1336),
    ("Mirzo Ulug'bek", "astronom va hukmdor", 1394),
    ("Alisher Navoiy", "ulug' shoir va mutafakkir", 1441),
    ("Fransis Bekon", "empirizmga asos solgan", 1561),
    ("Rene Dekart", "«Men o'ylayapman, demak mavjudman» g'oyasi", 1596),
    ("Benedikt Spinoza", "panteist falsafa vakili", 1632),
    ("Imanuil Kant", "«Narsa o'zidan-o'zi» ta'limoti", 1724),
    ("Georg Gegel", "dialektika tizimini yaratgan", 1770),
    ("Karl Marks", "dialektik materializm asoschisi", 1818),
    ("Fridrix Nitsshe", "«supermen» g'oyasi", 1844),
]


PHIL_CONCE_Q = [
    "«{desc}» — bu nima deyiladi?",
    "{desc} — qaysi falsafiy tushuncha?",
    "«{desc}» degan ta'limot qaysi atama bilan nomlanadi?",
]
PHIL_CONCE_R = [
    "{term} ta'limotining mohiyati qaysi?",
    "{term} nimani o'rganadi?",
    "{term} falsafiy tushunchasining ma'nosi qaysi?",
]
PHIL_THINK_Q = [
    "«{idea}» g'oyasi qaysi mutafakkirga tegishli?",
    "{idea} — kimning falsafiy g'oyasi?",
    "«{idea}» degan qarash qaysi faylasufga mansub?",
]
PHIL_THINK_R = [
    "{thinker} qaysi g'oya bilan mashhur?",
    "{thinker} falsafiy merosi bilan nima mashhur?",
    "{thinker} — qaysi g'oyaning muallifi?",
]


def gen_philosophy(target=TARGET):
    items, seen = [], set()

    def add(question_text, correct, wrong):
        if question_text in seen:
            return False
        seen.add(question_text)
        items.append(q(question_text, correct, wrong))
        return True

    for term, desc in PHIL_CONCEPTS:
        wrong = [t for t, d in PHIL_CONCEPTS if t != term]
        for ph in PHIL_CONCE_Q:
            if len(items) >= target:
                return items[:target]
            add(ph.format(desc=desc), term, random.sample(wrong, 3))
        wrongd = [d for t, d in PHIL_CONCEPTS if d != desc]
        for ph in PHIL_CONCE_R:
            if len(items) >= target:
                return items[:target]
            add(ph.format(term=term), desc, random.sample(wrongd, 3))

    for thinker, idea, year in PHIL_THINKERS:
        wrong_i = [i for t, i, y in PHIL_THINKERS if i != idea]
        for ph in PHIL_THINK_Q:
            if len(items) >= target:
                return items[:target]
            add(ph.format(idea=idea), thinker, random.sample(wrong_i, 3))
        wrong_t = [t for t, i, y in PHIL_THINKERS if t != thinker]
        for ph in PHIL_THINK_R:
            if len(items) >= target:
                return items[:target]
            add(ph.format(thinker=thinker), idea, random.sample(wrong_t, 3))

    paired = [(a, b) for a in PHIL_THINKERS for b in PHIL_THINKERS
              if a != b and a[2] != b[2]]
    for early, late in random.sample(paired, min(len(paired), 20000)):
        if len(items) >= target:
            break
        good, bad = (early, late) if early[2] < late[2] else (late, early)
        wrongs = [t for t, i, y in PHIL_THINKERS if t not in (good[0], bad[0])]
        add(f"Qaysi mutafakkir AVVALROQ yashagan? {good[0]} yoki {bad[0]}?",
            good[0], random.sample(wrongs, 3))
        if len(items) >= target:
            break
        add(f"Qaysi mutafakkir KEYINROQ yashagan? {good[0]} yoki {bad[0]}?",
            bad[0], random.sample(wrongs, 3))

    return items[:target]


# --------------------------------------------------------------------------
# Pedagogika
# --------------------------------------------------------------------------

PED_TERMS = [
    ("Ta'lim", "bilim, ko'nikma va malakalarni shakllantirish jarayoni"),
    ("Tarbiya", "shaxsni ma'lum fazilatlarga yo'naltiruvchi jarayon"),
    ("Didaktika", "ta'lim nazariyasi"),
    ("Metodika", "xususiy o'qitish usullari haqidagi fan"),
    ("Dars", "sinfda tashkil etiladigan asosiy ta'lim shakli"),
    ("Mashg'ulot", "ta'lim ishi shakllaridan biri"),
    ("Mustaqil ish", "o'quvchining o'z kuchi bilan bajariladigan topshiriq"),
    ("Baholash", "o'quvchining bilim darajasini aniqlash"),
    ("Rivojlantiruvchi ta'lim", "o'quvchini faol rivojlantiruvchi ta'lim"),
    ("Innovatsion ta'lim", "zamonaviy usul va texnologiyalarga asoslangan ta'lim"),
    ("Individual ta'lim", "har bir o'quvchiga alohida yondashuv"),
    ("Fanlararo bog'liqlik", "turli fanlar bilan o'zaro aloqa"),
    ("O'quv dasturi", "fan bo'yicha o'quv materiallari rejasi"),
    ("Darslik", "o'quv adabiyotining asosiy turi"),
    ("Pedagogik mahorat", "o'qituvchining professional mahorati"),
    ("Pedagogik qobiliyat", "o'quvchilar bilan ishlash qobiliyati"),
    ("Motivatsiya", "o'quvchining o'rganishga undashi"),
    ("Intellektual rivojlanish", "o'quvchining aqliy o'sishi"),
    ("Test", "bilimni aniqlash vositasi"),
    ("Tarbiyaviy faoliyat", "shaxsni ijtimoiylashtirishga yo'naltirilgan jarayon"),
    ("Tarbiya metodi", "tarbiya maqsadiga erishish usuli (masalan, ishontirish)"),
    ("O'qitish metodi", "o'qitish jarayonida ishlatiladigan usul"),
    ("Uy ishi", "darsdan tashqari bajariladigan topshiriq"),
    ("Takrorlash", "bilimni mustahkamlash usuli"),
    ("Yangi mavzuni o'zlashtirish", "yangi bilim materialini o'rganish"),
    ("Jamoa ta'limi", "sinfda birgalikda o'qish"),
    ("Guruhli ish", "o'quvchilarni guruhlarga bo'lib ishlash"),
    ("Sokratik metod", "savol-javob orqali bilim olish"),
    ("Munozara", "o'quvchilarning fikr almashish usuli"),
    ("Illyustratsiya", "ko'rgazmali qurol bilan ta'lim"),
    ("Tarbiyaviy natija", "tarbiya jarayonining yakuniy samarasi"),
    ("O'qituvchi roli", "ta'lim jarayonini boshqaruvchi subyekt"),
    ("O'quvchilarning mustaqilligi", "o'quvchining erkin faoliyati"),
    ("Bilish faoliyati", "o'quvchi tomonidan bilimni o'zlashtirish jarayoni"),
    ("Ko'nikma", "avtomatlashgan harakat usuli"),
    ("Malaka", "ko'nikma asosida shakllangan faoliyat sifati"),
    ("Bilim", "voqelik haqidagi tushunchalar majmui"),
    ("Dars rejasi", "darsning tuzilishi va ketma-ketligi"),
    ("Individual yondashuv", "o'quvchi xususiyatlarini hisobga olish"),
    ("Feedback", "o'qituvchi-o'quvchi aloqasi"),
    ("Tarbiya maqsadi", "tarbiyada kutiladigan natija"),
    ("Axloqiy tarbiya", "axloq me'yorlarini shakllantirish"),
    ("Estetik tarbiya", "go'zallikni his qilishni shakllantirish"),
    ("Jismoniy tarbiya", "jismoniy rivojlanishni ta'minlash"),
    ("Mehnat tarbiyasi", "mehnatga muhabbatni tarbiyalash"),
    ("Darsdan tashqari ish", "darsdan tashqarida olib boriladigan faoliyat"),
    ("Tarbiya tamoyillari", "tarbiya ishining asosiy qoidalari"),
    ("Ta'lim tamoyillari", "ta'lim jarayonining asosiy qoidalari"),
    ("Pedagogik tahlil", "dars yoki faoliyatni tahlil qilish"),
    ("O'qituvchi nutqi", "o'qituvchining pedagogik talablarga mos nutqi"),
    ("Ijodiy faoliyat", "o'quvchining ijodiy qobiliyatini rivojlantirish"),
    ("Portfoliо", "o'quvchi yutuqlarini to'plash usuli"),
    ("Differensial ta'lim", "o'quvchilarni qobiliyatiga qarab o'qitish"),
]

PED_FIGURES = [
    ("Qosimov", "zamonaviy o'zbek pedagogi", 1937),
    ("Amir Temur", "ta'limga alohida e'tibor qaratgan hukmdor", 1336),
    ("A.Yasaviy", "«Devoni hikmat»da tarbiyaviy g'oyalar", 1093),
    ("Abu Nasr Forobiy", "bilim va axloq uyg'unligi g'oyasi", 870),
    ("Ibn Sino", "ta'limni yoshga moslash g'oyasi", 980),
    ("Beruniy", "fanlarni yaxlit o'rganish g'oyasi", 973),
    ("Mirzo Ulug'bek", "ilmiy ta'limga hissa qo'shgan hukmdor", 1394),
    ("Alisher Navoiy", "axloqiy tarbiya g'oyasi", 1441),
    ("K.D.Ushinskiy", "rus pedagogi, «Bolalar dunyosi» muallifi", 1823),
    ("Y.A.Komenskiy", "didaktika asoschisi", 1592),
    ("J.J.Russo", "tabiiy ta'lim g'oyasi", 1712),
    ("Pestalotsi", "rivojlantiruvchi ta'lim g'oyasi", 1746),
    ("A.S.Makarenko", "jamoa orqali tarbiya g'oyasi", 1888),
    ("V.Suxomlinskiy", "bolani sevish pedagogikasi", 1918),
    ("Abdulla Avloniy", "«Turkiy guliston yoxud axloq» muallifi", 1878),
    ("Munavvar Qori", "jadid maktablariga asos solgan", 1878),
    ("K.Bezrukov", "tarbiya metodlarini tizimlashtirgan", 1918),
    ("J.Lokk", "empirik tarbiya g'oyasi", 1632),
    ("I.G.Pestalottsi", "bolalar ta'limini isloh qilgan", 1746),
    ("K.N.Ventsel", "bepul maktab g'oyasi", 1857),
]


PED_TERM_Q = [
    "«{desc}» — pedagogik atamasi qanday nomlanadi?",
    "{desc} — qaysi pedagogik tushuncha?",
    "«{desc}» jarayoni pedagogikada qanday ataladi?",
]
PED_TERM_R = [
    "{term} nima?",
    "{term} — pedagogikada nimani anglatadi?",
    "{term} tushunchasining ma'nosi qaysi?",
]
PED_FIG_Q = [
    "«{idea}» g'oyasi qaysi pedagoga tegishli?",
    "{idea} — kimning pedagogik g'oyasi?",
    "«{idea}» degan qarash qaysi o'qituvchi-pedagogga mansub?",
]
PED_FIG_R = [
    "{fig} qaysi g'oya bilan mashhur?",
    "{fig} pedagogik merosi bilan nima mashhur?",
    "{fig} — qaysi g'oyaning muallifi?",
]


def gen_pedagogy(target=TARGET):
    items, seen = [], set()

    def add(question_text, correct, wrong):
        if question_text in seen:
            return False
        seen.add(question_text)
        items.append(q(question_text, correct, wrong))
        return True

    for term, desc in PED_TERMS:
        wrong = [t for t, d in PED_TERMS if t != term]
        for ph in PED_TERM_Q:
            if len(items) >= target:
                return items[:target]
            add(ph.format(desc=desc), term, random.sample(wrong, 3))
        wrongd = [d for t, d in PED_TERMS if d != desc]
        for ph in PED_TERM_R:
            if len(items) >= target:
                return items[:target]
            add(ph.format(term=term), desc, random.sample(wrongd, 3))

    for fig, idea, year in PED_FIGURES:
        wrong_i = [i for f, i, y in PED_FIGURES if i != idea]
        for ph in PED_FIG_Q:
            if len(items) >= target:
                return items[:target]
            add(ph.format(idea=idea), fig, random.sample(wrong_i, 3))
        wrong_f = [f for f, i, y in PED_FIGURES if f != fig]
        for ph in PED_FIG_R:
            if len(items) >= target:
                return items[:target]
            add(ph.format(fig=fig), idea, random.sample(wrong_f, 3))

    paired = [(a, b) for a in PED_FIGURES for b in PED_FIGURES
              if a != b and a[2] != b[2]]
    for early, late in random.sample(paired, min(len(paired), 20000)):
        if len(items) >= target:
            break
        good, bad = (early, late) if early[2] < late[2] else (late, early)
        wrongs = [f for f, i, y in PED_FIGURES if f not in (good[0], bad[0])]
        add(f"Qaysi pedagog AVVALROQ faoliyat ko'rsatgan? "
            f"{good[0]} yoki {bad[0]}?",
            good[0], random.sample(wrongs, 3))
        if len(items) >= target:
            break
        add(f"Qaysi pedagog KEYINROQ faoliyat ko'rsatgan? "
            f"{good[0]} yoki {bad[0]}?",
            bad[0], random.sample(wrongs, 3))

    return items[:target]


# --------------------------------------------------------------------------
# Psixologiya
# --------------------------------------------------------------------------

PSY_TERMS = [
    ("Sezgi", "predmetlarning ayrim xossalarini aks ettirish"),
    ("Idrok", "predmetlarning yaxlit tasvirlarini aks ettirish"),
    ("Diqqat", "ongning muayyan obyektga yo'nalganligi"),
    ("Xotira", "ma'lumotni esda saqlash va qayta tiklash"),
    ("Tafakkur", "voqelikni umumlashgan va biivosita aks ettirish"),
    ("Nutq", "fikrni ifodalash va uzatish vositasi"),
    ("Tasavvur", "yangi obrazlarni yaratish"),
    ("Iroda", "maqsadga erishish uchun ongli harakat"),
    ("Ehtiyoj", "faoliyatning bosh manbai"),
    ("Motiv", "faoliyatga undovchi sabab"),
    ("Emotsiya", "tashqi ta'sirlarga subyektiv munosabat"),
    ("His", "emotsional kechinmalarning barqaror shakli (sevgi, g'azab)"),
    ("Temperament", "psixik faoliyatning individual dinamik xususiyati"),
    ("Xarakter", "barqaror xususiyatlar yig'indisi"),
    ("Qobiliyat", "faoliyatda namoyon bo'ladigan individual xususiyat"),
    ("Bilim", "tushunchalar tizimi"),
    ("O'qish", "bilim olishga yo'naltirilgan faoliyat"),
    ("O'yin", "bolalar faoliyatining asosiy turi"),
    ("Mehnat", "moddiy/ma'naviy boylik yaratuvchi faoliyat"),
    ("Muloqot", "odamlar o'rtasidagi axborot almashish"),
    ("Refleksiya", "o'z hissiyotlari va holatini anglash"),
    ("Ekstraversiya", "tashqi dunyoga yo'nalganlik"),
    ("Introversiya", "ichki dunyoga yo'nalganlik"),
    ("Stimul", "qo'zg'atuvchi omil"),
    ("His-tuyg'u", "odam tajribalarining bir shakli"),
    ("Tarbiya", "shaxs rivojlanishiga ta'sir (psixologik jihat)"),
    ("Uyg'unlik", "emosional barqarorlik"),
    ("Stress", "kuchli ta'sirga organizmning javobi"),
    ("Fobiya", "kuchli qo'rquv"),
    ("Agressiya", "tajovuzkor xatti-harakat"),
    ("Ma'lumotni qayta ishlash", "miyaning axborot qabul qilish jarayoni"),
    ("Ong", "psixikaning oliy shakli"),
    ("Ongsizlik", "anglanmagan psixik jarayonlar"),
    ("Shaxs", "ijtimoiy xususiyatlarning yaxlit tizimi"),
    ("O'z-o'zini anglash", "shaxsning o'zini bilishi"),
    ("Ijtimoiy idrok", "boshqalarning holatini tushunish"),
    ("Empatiya", "boshqa odam his-tuyg'ularini his qilish"),
    ("Kreativlik", "ijodiy qobiliyat"),
    ("Iqtidor", "yuqori darajadagi qobiliyat"),
    ("Reaksiya vaqti", "stimulga javob berish tezligi"),
    ("O'rganish", "tajriba natijasida xatti-harakat o'zgarishi"),
    ("Fiksatsiya", "harakatning mustahkamlanishi"),
    ("Transfer", "o'rganilgan ko'nikmaning yangi vaziyatga o'tishi"),
    ("Interference", "qarama-qarshi o'rganish ta'siri"),
    ("Motivatsiya ierarxiyasi", "Maslou nazariyasidagi ehtiyojlar tartibi"),
    ("Ijrochilik", "ko'nikmani bajarish sifati"),
    ("Adaptatsiya", "yangi sharoitga moslashish"),
    ("Voyaga yetish davri", "rivojlanish bosqichlaridan biri"),
    ("Identifikatsiya", "o'zini boshqaga o'xshatish"),
    ("Proeksiya", "o'z fazilatlarini boshqaga ko'chirish"),
    ("Repressiya", "noqulay xotirani ongsizlikka siqish"),
    ("Sublimatsiya", "bosimni ijodiy faoliyatga aylantirish"),
    ("Kognitiv dissonance", "qarama-qarshi bilimlar to'qnashuvi"),
    ("Effekt predushego", "tanlov uchun avvalgi taassurot ta'siri"),
]

PSY_FIGURES = [
    ("V.Wundt", "eksperimental psixologiya asoschisi", 1832),
    ("Z.Freyd", "psixoanaliz asoschisi", 1856),
    ("I.P.Pavlov", "shartli reflekslar haqidagi ta'limot", 1849),
    ("J.Piaje", "bolalar tafakkuri rivojlanishi tadqiqotchisi", 1896),
    ("A.Maslou", "ehtiyojlar ierarxiyasi nazariyasi", 1908),
    ("L.S.Vigotskiy", "«yaqin rivojlanish zonasi» konsepsiyasi", 1896),
    ("K.G.Yung", "analitik psixologiya asoschisi", 1875),
    ("B.F.Skinner", "operant ta'lim nazariyasi", 1904),
    ("K.Rodjers", "insonparvar psixologiya vakili", 1902),
    ("E.Erikson", "shaxs rivojlanishi bosqichlari nazariyasi", 1902),
    ("A.N.Leontyev", "faoliyat nazariyasi", 1903),
    ("S.L.Rubinshteyn", "falsafiy psixologiya vakili", 1889),
    ("Abu Ali Ibn Sino", "psixologiya masalalariga oid fikrlar", 980),
    ("Al-G'azzoliy", "nafs/holat psixologiyasi", 1058),
    ("U.Jeyms", "funksional psixologiya asoschisi", 1842),
    ("E.Torndik", "sinov-xato ta'lim nazariyasi", 1874),
    ("J.Uotson", "bixeviorizm asoschisi", 1878),
    ("A.Adler", "individual psixologiya asoschisi", 1870),
    ("E.From", "insonparvar psixoanaliz", 1900),
    ("A.Bandura", "ijtimoiy o'rganish nazariyasi", 1925),
]


PSY_TERM_Q = [
    "«{desc}» — psixologik tushuncha qaysi?",
    "{desc} — qaysi psixologik atama?",
    "«{desc}» hodisasi psixologiyada qanday nomlanadi?",
]
PSY_TERM_R = [
    "{term} — bu nima?",
    "{term} — psixologiyada nimani anglatadi?",
    "{term} tushunchasining ma'nosi qaysi?",
]
PSY_FIG_Q = [
    "«{idea}» — qaysi psixologga tegishli?",
    "{idea} — kimning psixologik ta'limoti?",
    "«{idea}» g'oyasi qaysi olimga mansub?",
]
PSY_FIG_R = [
    "{fig} nima bilan mashhur?",
    "{fig} psixologik merosi bilan nima mashhur?",
    "{fig} — qaysi g'oyaning muallifi?",
]


def gen_psychology(target=TARGET):
    items, seen = [], set()

    def add(question_text, correct, wrong):
        if question_text in seen:
            return False
        seen.add(question_text)
        items.append(q(question_text, correct, wrong))
        return True

    for term, desc in PSY_TERMS:
        wrong = [t for t, d in PSY_TERMS if t != term]
        for ph in PSY_TERM_Q:
            if len(items) >= target:
                return items[:target]
            add(ph.format(desc=desc), term, random.sample(wrong, 3))
        wrongd = [d for t, d in PSY_TERMS if d != desc]
        for ph in PSY_TERM_R:
            if len(items) >= target:
                return items[:target]
            add(ph.format(term=term), desc, random.sample(wrongd, 3))

    for fig, idea, year in PSY_FIGURES:
        wrong_i = [i for f, i, y in PSY_FIGURES if i != idea]
        for ph in PSY_FIG_Q:
            if len(items) >= target:
                return items[:target]
            add(ph.format(idea=idea), fig, random.sample(wrong_i, 3))
        wrong_f = [f for f, i, y in PSY_FIGURES if f != fig]
        for ph in PSY_FIG_R:
            if len(items) >= target:
                return items[:target]
            add(ph.format(fig=fig), idea, random.sample(wrong_f, 3))

    paired = [(a, b) for a in PSY_FIGURES for b in PSY_FIGURES
              if a != b and a[2] != b[2]]
    for early, late in random.sample(paired, min(len(paired), 20000)):
        if len(items) >= target:
            break
        good, bad = (early, late) if early[2] < late[2] else (late, early)
        wrongs = [f for f, i, y in PSY_FIGURES if f not in (good[0], bad[0])]
        add(f"Qaysi psixolog AVVALROQ yashagan? {good[0]} yoki {bad[0]}?",
            good[0], random.sample(wrongs, 3))
        if len(items) >= target:
            break
        add(f"Qaysi psixolog KEYINROQ yashagan? {good[0]} yoki {bad[0]}?",
            bad[0], random.sample(wrongs, 3))

    return items[:target]


# INSERT_GENERATORS_HERE


SUBJECT_GENERATORS = {
    "Algebra": gen_algebra,
    "Analitik Geometriya": gen_geometry,
    "Matematik Analiz": gen_analysis,
    "Fizika": gen_physics,
    "Informatika": gen_informatics,
    "Dasturlash": gen_programming,
    "Kimyo": gen_chemistry,
    "Iqtisodiyot": gen_economics,
    "Ingliz tili": gen_english,
    "Ona tili va adabiyot": gen_uzbek,
    "Tarix": gen_history,
    "Geografiya": gen_geography,
    "Biyologiya": gen_biology,
    "Falsafa": gen_philosophy,
    "Pedagogika": gen_pedagogy,
    "Psixologiya": gen_psychology,
}


def seed_tests(db: Session | None = None) -> int:
    Base.metadata.create_all(bind=engine)
    own = False
    if db is None:
        db = SessionLocal()
        own = True
    try:
        admin = db.query(User).filter(User.username == "admin").first()
        total = 0
        for sname, gen in SUBJECT_GENERATORS.items():
            subj = db.query(Subject).filter(Subject.name == sname).first()
            if not subj:
                print(f"Fan topilmadi: {sname}")
                continue
            questions = gen(TARGET)
            random.shuffle(questions)
            seen, pool = set(), []
            for it in questions:
                if it["question"] in seen:
                    continue
                seen.add(it["question"])
                pool.append(it)

            for i in range(0, len(pool), TEST_SIZE):
                chunk = pool[i:i + TEST_SIZE]
                title = f"{sname} — Test {i // TEST_SIZE + 1}"
                if db.query(Test).filter(Test.title == title,
                                         Test.subject_id == subj.id).first():
                    continue
                t = Test(
                    title=title,
                    subject_id=subj.id,
                    description=f"{sname} fanidan {len(chunk)} ta savol",
                    level=None,
                    grade=None,
                    is_ai_generated=False,
                    created_by=admin.id if admin else None,
                )
                db.add(t)
                db.flush()
                for it in chunk:
                    options = [it["correct"]] + list(it["wrong"])[:3]
                    random.shuffle(options)
                    correct_letter = "ABCD"[options.index(it["correct"])]
                    db.add(TestQuestion(
                        test_id=t.id,
                        question_text=it["question"],
                        option_a=options[0],
                        option_b=options[1],
                        option_c=options[2],
                        option_d=options[3],
                        correct_answer=correct_letter,
                        explanation=it["exp"] or "",
                    ))
                total += len(chunk)
            print(f"{sname}: {len(pool)} ta savol yaratildi")
        db.commit()
        print(f"Jami: {total} ta savol yuklandi.")
        return total
    finally:
        if own:
            db.close()


if __name__ == "__main__":
    seed_tests()