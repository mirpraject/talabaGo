"""Kimyo — maktab (5-11 sinf)."""
import random
from .base import q, _add, _num_wrong, TARGET_PER_GRADE


_ELEMENTS = [
    ("H", "vodorod", 1), ("He", "geliy", 2), ("Li", "litiy", 3),
    ("Be", "berilliy", 4), ("B", "bor", 5), ("C", "uglerod", 6),
    ("N", "azot", 7), ("O", "kislorod", 8), ("F", "ftor", 9),
    ("Na", "natriy", 11), ("Mg", "magniy", 12), ("Al", "alyuminiy", 13),
    ("Si", "kremniy", 14), ("P", "fosfor", 15), ("S", "oltingugurt", 16),
    ("Cl", "xlor", 17), ("K", "kaliy", 19), ("Ca", "kaltsiy", 20),
    ("Fe", "temir", 26), ("Cu", "mis", 29),
]

_FORMULAS = [
    ("H2O", "suv"), ("CO2", "karbonat angidrid"), ("NH3", "ammiak"),
    ("NaCl", "osh tuzi"), ("HCl", "xlorid kislota"), ("NaOH", "natriy gidroksid"),
    ("H2SO4", "sulfat kislota"), ("CaCO3", "ohaktosh"), ("CH4", "metan"),
]


def gen_kimyo(target=350):
    items, seen = [], set()

    # Element nomi / belgisi
    for _ in range(target):
        if len(items) >= target:
            break
        sym, name, num = random.choice(_ELEMENTS)
        wrongs = [n for s, n, k in _ELEMENTS if n != name][:3]
        _add(items, seen,
             f"«{name}» elementining kimyoviy belgisi?",
             sym, [s for s2, n2, k in _ELEMENTS if s2 != sym for s in [s2]][:3])

    # Atom raqami
    for _ in range(target):
        if len(items) >= target:
            break
        sym, name, num = random.choice(_ELEMENTS)
        _add(items, seen,
             f"{sym} elementining atom raqami (protonlar soni)?",
             str(num), _num_wrong(num, 1, 40))

    # Formula - nom
    for _ in range(target):
        if len(items) >= target:
            break
        formula, name = random.choice(_FORMULAS)
        wrongs = [n for f, n in _FORMULAS if n != name][:3]
        _add(items, seen,
             f"«{name}» moddasining formulasi?",
             formula, [f2 for f2, n2 in _FORMULAS if f2 != formula][:3])

    # Molekuladagi atomlar soni
    for _ in range(target):
        if len(items) >= target:
            break
        formula, name = random.choice(_FORMULAS)
        total = sum(int(c) if c.isdigit() else 1 for c in formula if not c.islower() and c != "(" )
        # oddiy hisob: harf+raqam
        counts = {}
        i = 0
        while i < len(formula):
            ch = formula[i]
            if ch.isupper():
                j = i + 1
                if j < len(formula) and formula[j].islower():
                    j += 1
                num_s = ""
                k = j
                while k < len(formula) and formula[k].isdigit():
                    num_s += formula[k]
                    k += 1
                counts[ch + formula[i+1:j]] = int(num_s) if num_s else 1
                i = k
            else:
                i += 1
        total = sum(counts.values())
        _add(items, seen,
             f"{formula} molekulasida jami nechta atom bor?",
             str(total), _num_wrong(total, 1, 20))

    # Valentlik
    valences = [
        ("H", "I"), ("O", "II"), ("Na", "I"), ("Cl", "I"),
        ("Ca", "II"), ("Al", "III"), ("Fe (holda)", "II/III"),
    ]
    for _ in range(target):
        if len(items) >= target:
            break
        el, val = random.choice(valences)
        wrongs = [v for e, v in valences if v != val][:3]
        _add(items, seen,
             f"{el} elementining doimiy valentligi?",
             val, wrongs)

    # ── Moddalar xossalari ──
    props = [
        ("Osh tuzi nechga eriydi?", "suvda yaxshi eriydi", ["suvda erimaydi", "faqat alkogolda eriydi", "faqat yog'da eriydi"]),
        ("Kislorod nimada eriydi (kichik miqdor)?", "suvda", ["faqat qattiq holda", "faqat gazda", "erimaydi"]),
        ("Suvning normal bosimdagi qaynash nuqtasi", "100°C", ["90°C", "80°C", "120°C"]),
        ("Suvning muzlash nuqtasi", "0°C", ["-10°C", "4°C", "10°C"]),
        ("Metallarning qizdirilganda kengayishi", "kengayadi", ["torayadi", "o'zgarmaydi", "parchalanadi"]),
        ("Alyuminiy qaysi guruh metall?", "amfoter metall", ["noble metall", "o'tish metall", "ishqoriy metall"]),
    ]
    for _ in range(target):
        if len(items) >= target:
            break
        question, ans, wrongs = random.choice(props)
        _add(items, seen, question, ans, list(wrongs))

    # ── Reaksiya tipi ──
    reactions = [
        ("2H₂ + O₂ → 2H₂O", "birikish reaksiyasi", ["parchalanish", "almashinish", "o'rin olish"]),
        ("CaCO₃ → CaO + CO₂", "parchalanish reaksiyasi", ["birikish", "almashinish", "o'rin olish"]),
        ("Zn + CuSO₄ → ZnSO₄ + Cu", "o'rin olish reaksiyasi", ["birikish", "parchalanish", "almashinish"]),
        ("AgNO₃ + NaCl → AgCl + NaNO₃", "almashinish reaksiyasi", ["birikish", "parchalanish", "o'rin olish"]),
        ("C + O₂ → CO₂", "birikish reaksiyasi", ["parchalanish", "almashinish", "o'rin olish"]),
        ("2H₂O₂ → 2H₂O + O₂", "parchalanish reaksiyasi", ["birikish", "almashinish", "o'rin olish"]),
    ]
    for _ in range(target):
        if len(items) >= target:
            break
        rxn, typ, wrongs = random.choice(reactions)
        _add(items, seen,
             f"Reaksiya tipi: {rxn}",
             typ, list(wrongs))

    # ── Element belgilari (teskari) ──
    for _ in range(target):
        if len(items) >= target:
            break
        sym, name, num = random.choice(_ELEMENTS)
        wrongs = [s for s2, n2, k in _ELEMENTS if s2 != sym for s in [s2]][:3]
        _add(items, seen,
             f"{sym} belgisi qaysi elementni ifodalaydi?",
             name, [n for n2, nn2, k in _ELEMENTS if nn2 != name for n in [nn2]][:3])

    # ── Molyar massa ──
    masses = [
        ("H₂O", "18 g/mol", ["16 g/mol", "17 g/mol", "20 g/mol"]),
        ("CO₂", "44 g/mol", ["34 g/mol", "44 g/mol", "46 g/mol"]),
        ("NH₃", "17 g/mol", ["15 g/mol", "18 g/mol", "19 g/mol"]),
        ("CH₄", "16 g/mol", ["14 g/mol", "17 g/mol", "18 g/mol"]),
        ("H₂SO₄", "98 g/mol", ["88 g/mol", "96 g/mol", "102 g/mol"]),
        ("NaCl", "58,5 g/mol", ["54 g/mol", "56 g/mol", "60 g/mol"]),
    ]
    for _ in range(target):
        if len(items) >= target:
            break
        f, m, wrongs = random.choice(masses)
        _add(items, seen,
             f"{f} ning molyar massasi (M)?",
             m, list(wrongs))

    return items[:target]
