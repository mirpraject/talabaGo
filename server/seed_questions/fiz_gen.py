"""Fizika — takrorlanmaydigan masalalar generatori (g = 10 m/s² olinadi)."""

import random

from .base import QuestionBank


def _w4(q, bank, correct, wrongs, expl):
    """4 ta variant: to'g'ri + 3 ta noto'g'ri."""
    if correct in wrongs:
        wrongs = list(wrongs)
        while correct in wrongs:
            wrongs[wrongs.index(correct)] = wrongs[-1] if wrongs[-1] != correct else "0"
    bank.add(q, [correct] + wrongs[:3], correct, expl)


def _template_speed(bank, rng):
    v = rng.randint(2, 40)
    t = rng.randint(1, 20)
    s = v * t
    q = f"Jism {v} m/s tezlik bilan {t} s harakatlandi. U qancha yo'l bosadi?"
    _w4(q, bank, f"{s} m",
        [f"{s + v} m", f"{s - v} m", f"{v + t} m", f"{s + 1} m", f"{s - 1} m"],
        f"S = v·t = {v}·{t} = {s} m.")


def _template_speed_time(bank, rng):
    s = rng.randint(10, 300)
    v = rng.randint(2, 30)
    if s % v:
        return
    t = s // v
    q = f"{s} m yo'lni {v} m/s tezlik bilan jism qancha vaqtda bosib o'tadi?"
    _w4(q, bank, f"{t} s",
        [f"{t + 1} s", f"{t - 1} s", f"{s + v} s", f"{t + v} s"],
        f"t = S/v = {s}/{v} = {t} s.")


def _template_accel(bank, rng):
    a = rng.randint(1, 12)
    t = rng.randint(1, 12)
    v = a * t
    q = f"Tinch holatdan {a} m/s² tezlanish bilan qo'zg'algan jism {t} s dan keyin qanday tezlikka erishadi?"
    _w4(q, bank, f"{v} m/s",
        [f"{v + a} m/s", f"{v - a} m/s", f"{a + t} m/s", f"{v + 1} m/s"],
        f"v = a·t = {a}·{t} = {v} m/s.")


def _template_freefall(bank, rng):
    t = rng.randint(1, 8)
    g = 10
    s = g * t * t // 2
    v = g * t
    if rng.random() < 0.5:
        q = f"Erkin tushayotgan jism {t} s da qancha balandlikdan tushadi? (g = 10 m/s²)"
        _w4(q, bank, f"{s} m",
            [f"{s + g} m", f"{v} m", f"{s - t} m", f"{g * t} m"],
            f"h = g·t²/2 = 10·{t}²/2 = {s} m.")
    else:
        q = f"Tinch holatdan erkin tushish davomida jism {t} s dan keyin qanday tezlikka erishadi? (g = 10 m/s²)"
        _w4(q, bank, f"{v} m/s",
            [f"{v + 5} m/s", f"{g * t * t // 2} m/s", f"{s} m/s", f"{v // 2} m/s"],
            f"v = g·t = 10·{t} = {v} m/s.")


def _template_newton(bank, rng):
    m = rng.randint(2, 20)
    f = rng.choice([x for x in range(m, m * 25, m)])
    if f % m != 0:
        return
    a = f // m
    q = f"Massasi {m} kg bo'lgan jismga {f} N kuch ta'sir qilsa, tezlanish qancha?"
    _w4(q, bank, f"{a} m/s²",
        [f"{a + 1} m/s²", f"{a - 1} m/s²", f"{f + m} m/s²", f"{a + 2} m/s²"],
        f"Nyupton 2-qonuni: a = F/m = {f}/{m} = {a} m/s².")


def _template_weight(bank, rng):
    m = rng.randint(3, 60)
    g = 10
    w = m * g
    q = f"Massasi {m} kg jismning og'irligi qancha? (g = 10 m/s²)"
    _w4(q, bank, f"{w} N",
        [f"{w + g} N", f"{m} N", f"{w * 2} N", f"{w - g} N"],
        f"P = m·g = {m}·10 = {w} N.")


def _template_work(bank, rng):
    f = rng.randint(5, 100)
    s = rng.randint(1, 20)
    w = f * s
    q = f"Jismni {f} N kuch bilan {s} m masofaga siljitganda bajarilgan ishni toping."
    _w4(q, bank, f"{w} J",
        [f"{w + f} J", f"{w - f} J", f"{f + s} J", f"{w + 1} J"],
        f"A = F·s = {f}·{s} = {w} J.")


def _template_work_power(bank, rng):
    w = rng.randint(50, 600)
    t = rng.choice([1, 2, 3, 4, 5, 10, 20])
    if w % t:
        return
    p = w // t
    q = f"{w} J ish {t} s da bajarildi. Quvvatni hisoblang."
    _w4(q, bank, f"{p} Vt",
        [f"{p + 1} Vt", f"{p - 1} Vt", f"{w * t} Vt", f"{p + 2} Vt"],
        f"P = A/t = {w}/{t} = {p} Vt.")


def _template_power_work(bank, rng):
    p = rng.randint(10, 200)
    t = rng.randint(1, 20)
    w = p * t
    q = f"Quvvati {p} Vt bo'lgan dvigatel {t} s da qancha ish bajaradi?"
    _w4(q, bank, f"{w} J",
        [f"{w + p} J", f"{w - p} J", f"{p + t} J", f"{w + 1} J"],
        f"A = P·t = {p}·{t} = {w} J.")


def _template_ke(bank, rng):
    m = rng.randint(2, 40)
    v = rng.randint(2, 20)
    ek = m * v * v // 2
    q = f"Massasi {m} kg, tezligi {v} m/s bo'lgan jismning kinetik energiyasini toping."
    _w4(q, bank, f"{ek} J",
        [f"{ek + m} J", f"{m * v} J", f"{m * v * v} J", f"{ek // 2} J"],
        f"Ek = m·v²/2 = {m}·{v}²/2 = {ek} J.")


def _template_pe(bank, rng):
    m = rng.randint(2, 30)
    h = rng.randint(1, 30)
    ep = m * 10 * h
    q = f"Massasi {m} kg jism {h} m balandlikda turibdi. Potensial energiyani toping (g = 10 m/s²)."
    _w4(q, bank, f"{ep} J",
        [f"{ep + m} J", f"{m * h} J", f"{ep // 2} J", f"{ep // 5} J"],
        f"Ep = m·g·h = {m}·10·{h} = {ep} J.")


def _template_ohm(bank, rng):
    i = rng.randint(1, 20)
    r = rng.randint(1, 50)
    v = i * r
    q = f"Zanjirda tok kuchi {i} A, qarshilik {r} Om. Kuchlanishni toping."
    _w4(q, bank, f"{v} V",
        [f"{v + i} V", f"{v - i} V", f"{i + r} V", f"{v // 2} V"],
        f"Om qonuni: U = I·R = {i}·{r} = {v} V.")


def _template_ohm_current(bank, rng):
    v = rng.randint(10, 220)
    r = rng.choice([2, 4, 5, 10, 20, 25, 50, 100])
    if v % r:
        return
    i = v // r
    q = f"Kuchlanish {v} V, qarshilik {r} Om bo'lsa, zanjirdagi tok kuchini toping."
    _w4(q, bank, f"{i} A",
        [f"{i + 1} A", f"{i - 1} A", f"{v // 10} A", f"{i // 2 or 1} A"],
        f"I = U/R = {v}/{r} = {i} A.")


def _template_density(bank, rng):
    m = rng.randint(20, 400)
    v = rng.choice([2, 4, 5, 10, 20, 50])
    if m % v:
        return
    rho = m // v
    q = f"Massasi {m} g, hajmi {v} sm³ bo'lgan moddaning zichligini toping."
    _w4(q, bank, f"{rho} g/sm³",
        [f"{rho + 1} g/sm³", f"{rho - 1} g/sm³", f"{m + v} g/sm³", f"{rho * 2} g/sm³"],
        f"ρ = m/V = {m}/{v} = {rho} g/sm³.")


def _template_volume(bank, rng):
    m = rng.randint(50, 500)
    rho = rng.choice([1, 2, 5, 10])
    if m % rho:
        return
    v = m // rho
    q = f"Massasi {m} g, zichligi {rho} g/sm³ bo'lgan moddaning hajmini toping."
    _w4(q, bank, f"{v} sm³",
        [f"{v + 1} sm³", f"{v - 1} sm³", f"{m - rho} sm³", f"{v * 2} sm³"],
        f"V = m/ρ = {m}/{rho} = {v} sm³.")


def _template_pressure(bank, rng):
    f = rng.randint(20, 600)
    s = rng.choice([2, 4, 5, 10, 20])
    if f % s:
        return
    p = f // s
    q = f"Yuzasi {s} m² bo'lgan sirtga {f} N kuch ta'sir qilsa, bosimni toping."
    _w4(q, bank, f"{p} Pa",
        [f"{p + 1} Pa", f"{p - 1} Pa", f"{f + s} Pa", f"{p // 2} Pa"],
        f"P = F/S = {f}/{s} = {p} Pa.")


def _template_momentum(bank, rng):
    m = rng.randint(2, 40)
    v = rng.randint(1, 30)
    p = m * v
    q = f"Massasi {m} kg, tezligi {v} m/s jismning impulsi (harakat miqdori) qancha?"
    _w4(q, bank, f"{p} kg·m/s",
        [f"{p + m} kg·m/s", f"{m * v * v} kg·m/s", f"{m + v} kg·m/s", f"{p - m} kg·m/s"],
        f"p = m·v = {m}·{v} = {p} kg·m/s.")


def _template_spring(bank, rng):
    k = rng.choice([20, 50, 100, 200, 400])
    x = rng.randint(1, 20) / 10
    f = int(k * x)
    q = f"Qattiqligi {k:.0f} N/m bo'lgan prujina {x} m ga cho'zildi. Elastiklik kuchi?"
    _w4(q, bank, f"{f} N",
        [f"{f + 5} N", f"{f - 5} N", f"{k + x} N", f"{f * 2} N"],
        f"F = k·x = {k}·{x} = {f} N.")


def _template_charge(bank, rng):
    i = rng.randint(1, 20)
    t = rng.randint(1, 30)
    qq = i * t
    q = f"Tok kuchi {i} A bo'lgan zanjirdan {t} s da qancha zaryad o'tadi (Q = I·t)?"
    _w4(q, bank, f"{qq} Kl",
        [f"{qq + i} Kl", f"{qq - i} Kl", f"{i + t} Kl", f"{qq // 2} Kl"],
        f"Q = I·t = {i}·{t} = {qq} Kl.")


def _template_heat(bank, rng):
    m = rng.randint(1, 10)
    c = rng.choice([500, 1000, 4200])
    dt = rng.randint(2, 30)
    q = c * m * dt
    qq = f"{m} kg moddani {dt} °C ga qizdirish uchun kerakli issiqlik miqdorini toping (c = {c} J/(kg·°C))."
    _w4(qq, bank, f"{q} J",
        [f"{q + c} J", f"{q - c} J", f"{c * dt} J", f"{q // 2} J"],
        f"Q = c·m·Δt = {c}·{m}·{dt} = {q} J.")


def _template_latent(bank, rng):
    m = rng.randint(1, 10)
    lam = rng.choice([330000, 2260000, 2100000])
    qq = m * lam
    q = f"{m} kg moddaning ayni erish/aylanish issiqligini toping (λ = {lam} J/kg)."
    _w4(q, bank, f"{qq} J",
        [f"{qq + lam} J", f"{lam} J", f"{qq // 2} J", f"{qq + m * 1000} J"],
        f"Q = λ·m = {lam}·{m} = {qq} J.")


def _template_waves(bank, rng):
    f = rng.randint(2, 100)
    lam = rng.randint(2, 50)
    v = f * lam
    q = f"To'lqin chastotasi {f} Hz, to'lqin uzunligi {lam} m bo'lsa, tarqalish tezligini toping."
    _w4(q, bank, f"{v} m/s",
        [f"{v + f} m/s", f"{f + lam} m/s", f"{v - f} m/s", f"{v + 2} m/s"],
        f"v = λ·f = {lam}·{f} = {v} m/s.")


def _template_freq(bank, rng):
    t = rng.choice([0.1, 0.2, 0.25, 0.4, 0.5, 0.8, 1, 1.25, 2, 2.5, 4, 5])
    f = 1 / t
    q = f"Davri T = {t} s bo'lgan tebranish chastotasini toping."
    _w4(q, bank, f"{f} Hz",
        [f"{round(f + 1, 1)} Hz", f"{t} Hz", f"{round(f - 0.25, 2)} Hz", f"{round(f * 2, 2)} Hz"],
        f"f = 1/T = 1/{t} = {f} Hz.")


def _template_eff(bank, rng):
    total = rng.choice([100, 200, 400, 500, 1000])
    useful = rng.choice([40, 80, 120, 250, 300, 500])
    if useful > total:
        return
    eta = useful * 100 // total
    q = f"Qurilma {total} J energiya sarflab, {useful} J ish bajaradi. FIK (samaradorlik) qancha?"
    _w4(q, bank, f"{eta}%",
        [f"{eta + 5}%", f"{eta - 5}%", f"{useful}%", f"{eta + 10}%"],
        f"η = (foydali/umumiy)·100% = {useful}·100/{total} = {eta}%.")


def _template_lever(bank, rng):
    f1 = rng.randint(10, 100)
    d1 = rng.randint(1, 5)
    d2 = rng.randint(2, 10)
    f2 = f1 * d1 // d2
    if f1 * d1 % d2:
        return
    q = f"Richagda F₁={f1} N kuch d₁={d1} m masofada. d₂={d2} m masofadagi F₂ kuchini toping (muvozanat)."
    _w4(q, bank, f"{f2} N",
        [f"{f2 + 1} N", f"{f2 - 1} N", f"{f1 * d2} N", f"{f1 - d2} N"],
        f"F₁·d₁ = F₂·d₂ → F₂ = {f1}·{d1}/{d2} = {f2} N.")


def _template_avg_speed(bank, rng):
    v1 = rng.randint(5, 50)
    v2 = rng.randint(5, 50)
    v = (v1 + v2) // 2
    q = f"Jism yo'lning yarmida {v1} m/s, ikkinchi yarmida {v2} m/s tezlikda harakatlandi (vaqtlar teng). O'rtacha tezlik?"
    _w4(q, bank, f"{v} m/s",
        [f"{v1} m/s", f"{v2} m/s", f"{v1 + v2} m/s", f"{v + 1} m/s"],
        f"v_ort = (v1+v2)/2 = {v} m/s.")


TEMPLATES = [
    _template_speed,
    _template_speed_time,
    _template_accel,
    _template_freefall,
    _template_newton,
    _template_weight,
    _template_work,
    _template_work_power,
    _template_power_work,
    _template_ke,
    _template_pe,
    _template_ohm,
    _template_ohm_current,
    _template_density,
    _template_volume,
    _template_pressure,
    _template_momentum,
    _template_spring,
    _template_charge,
    _template_heat,
    _template_latent,
    _template_waves,
    _template_freq,
    _template_eff,
    _template_lever,
    _template_avg_speed,
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