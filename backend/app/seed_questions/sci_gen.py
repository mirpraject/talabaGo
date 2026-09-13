"""Kimyo va Biyologiya — fakt-bank asosidagi takrorlanmaydigan savollar."""

import random

from .base import QuestionBank

# ---------------------------------- KIMYO ----------------------------------

ELEMENTS = [
    ("Vodorod", "H", 1, False, "I", "gaz"),
    ("Kislorod", "O", 8, False, "II", "gaz"),
    ("Azot", "N", 7, False, "III", "gaz"),
    ("Uglerod", "C", 6, False, "IV", "qattiq"),
    ("Oltingugurt", "S", 16, False, "II", "qattiq"),
    ("Fosfor", "P", 15, False, "III", "qattiq"),
    ("Xlor", "Cl", 17, False, "I", "gaz"),
    ("Ftor", "F", 9, False, "I", "gaz"),
    ("Natriy", "Na", 11, True, "I", "qattiq"),
    ("Kaliy", "K", 19, True, "I", "qattiq"),
    ("Kaltsiy", "Ca", 20, True, "II", "qattiq"),
    ("Magniy", "Mg", 12, True, "II", "qattiq"),
    ("Alyuminiy", "Al", 13, True, "III", "qattiq"),
    ("Temir", "Fe", 26, True, "II/III", "qattiq"),
    ("Mis", "Cu", 29, True, "II", "qattiq"),
    ("Sink", "Zn", 30, True, "II", "qattiq"),
    ("Kumush", "Ag", 47, True, "I", "qattiq"),
    ("Oltin", "Au", 79, True, "III", "qattiq"),
    ("Qo'rg'oshin", "Pb", 82, True, "II", "qattiq"),
    ("Simob", "Hg", 80, True, "II", "suyuq"),
    ("Brom", "Br", 35, False, "I", "suyuq"),
    ("Yod", "I", 53, False, "I", "qattiq"),
    ("Kremniy", "Si", 14, False, "IV", "qattiq"),
    ("Boron", "B", 5, False, "III", "qattiq"),
]

IONS_FORM = [
    ("Na +", "Cl −", "NaCl"),
    ("K +", "Cl −", "KCl"),
    ("Ca 2+", "O 2−", "CaO"),
    ("Ca 2+", "Cl −", "CaCl2"),
    ("Mg 2+", "O 2−", "MgO"),
    ("Al 3+", "O 2−", "Al2O3"),
    ("Al 3+", "Cl −", "AlCl3"),
    ("Fe 2+", "O 2−", "FeO"),
    ("Fe 3+", "O 2−", "Fe2O3"),
    ("Cu 2+", "O 2−", "CuO"),
    ("Na +", "O 2−", "Na2O"),
    ("K +", "S 2−", "K2S"),
    ("H +", "Cl −", "HCl"),
    ("H +", "O 2−", "H2O"),
    ("Na +", "CO3 2−", "Na2CO3"),
    ("Ca 2+", "CO3 2−", "CaCO3"),
    ("H +", "SO4 2−", "H2SO4"),
    ("Na +", "SO4 2−", "Na2SO4"),
    ("NH4 +", "Cl −", "NH4Cl"),
    ("K +", "NO3 −", "KNO3"),
]

MOLMASS = [
    ("H2O", 18), ("CO2", 44), ("NH3", 17), ("CH4", 16), ("SO2", 64),
    ("H2SO4", 98), ("CaCO3", 100), ("NaCl", 58), ("HNO3", 63),
    ("NaOH", 40), ("C6H12O6", 180), ("O2", 32),
]

REACTIONS = [
    ("2H2 + O2 → 2H2O", "birikish"),
    ("C + O2 → CO2", "birikish"),
    ("2Mg + O2 → 2MgO", "birikish"),
    ("N2 + 3H2 → 2NH3", "birikish"),
    ("CaCO3 → CaO + CO2", "parchalanish"),
    ("2KClO3 → 2KCl + 3O2", "parchalanish"),
    ("Cu(OH)2 → CuO + H2O", "parchalanish"),
    ("CH4 + 2O2 → CO2 + 2H2O", "yonish"),
    ("2H2O2 → 2H2O + O2", "parchalanish"),
    ("2Na + Cl2 → 2NaCl", "birikish"),
    ("Fe + S → FeS", "birikish"),
    ("3H2 + N2 → 2NH3", "birikish"),
]

ACID_BASE = [
    ("HCl", "kislota"), ("H2SO4", "kislota"), ("HNO3", "kislota"), ("H3PO4", "kislota"),
    ("NaOH", "asos"), ("KOH", "asos"), ("Ca(OH)2", "asos"), ("Mg(OH)2", "asos"),
    ("NaCl", "tuz"), ("KNO3", "tuz"), ("CaCO3", "tuz"), ("CuSO4", "tuz"),
    ("H2O", "neytral oksid"),
]

STATES = [
    ("gulning hidi tarqalishi", "fizik xodisa"),
    ("suvning bug'lanishi", "fizik xodisa"),
    ("suvning muzlashi", "fizik xodisa"),
    ("shakarning suvda erishi", "fizik xodisa"),
    ("qog'ozning yirtilishi", "fizik xodisa"),
    ("shisha sinishi", "fizik xodisa"),
    ("tuzning suvda eritilishi", "fizik xodisa"),
    ("yog'ochning sinishi", "fizik xodisa"),
    ("temirning zanglashi", "kimyoviy xodisa"),
    ("nonning achishi", "kimyoviy xodisa"),
    ("yog'ochning yonishi", "kimyoviy xodisa"),
    ("moyning aynishi", "kimyoviy xodisa"),
    ("vinochilikdagi achish", "kimyoviy xodisa"),
    ("sulfat kislota va ishqor reaksiyasi", "kimyoviy xodisa"),
    ("o'rmondagi barglarning chirishi", "kimyoviy xodisa"),
    ("pishgan mevaning aynishi", "kimyoviy xodisa"),
    ("kumushning qorayishi", "kimyoviy xodisa"),
    ("sutning achishi", "kimyoviy xodisa"),
    ("qizil olmaning pishishi", "kimyoviy xodisa"),
    ("qalamning sinishi", "fizik xodisa"),
]


def _elem(bank, rng):
    name, sym, z, metal, val, st = rng.choice(ELEMENTS)
    fmt = rng.random()
    others = rng.sample([s for (n, s, *_) in ELEMENTS if s != sym], 3)
    names = rng.sample([n for (n, s, *_) in ELEMENTS if n != name], 3)
    if fmt < 0.4:
        q = f"Kimyoviy element «{name}»ning belgisi (simvoli) qaysi?"
        bank.add(q, [sym] + others, sym,
                f"{name} elementi {sym} belgisi bilan ifodalanadi.")
    elif fmt < 0.65:
        q = f"{sym} — qaysi kimyoviy elementning belgisi?"
        bank.add(q, [name] + names, name,
                f"{sym} — {name} elementining belgisi.")
    elif fmt < 0.8:
        q = f"«{name}» elementining davriy jadvaldagi tartib raqami qancha?"
        wrongs = rng.sample([z2 for (n2, s2, z2, *_) in ELEMENTS if z2 != z], 3)
        bank.add(q, [str(z)] + [str(w) for w in wrongs], str(z),
                f"{name}ning tartib raqami — {z}.")
    else:
        kan = "Metall" if metal else "Nometall"
        q = f"«{name}» elementi qaysi guruhga (metall/nometall) kiradi?"
        opts = ["Metall", "Nometall"]
        other = "Nometall" if metal else "Metall"
        bank.add(q, [kan, other, "Gaz", "Suyuq"], kan,
                f"{name} — {kan.lower()}.")
    # valentlik so'rovi (har biri uchun bitta qo'shimcha savol)
    if fmt >= 0.8:
        q2 = f"{name}ning ko'pchilik birikmalardagi valentligi?"
        vr = val.split("/")[0]
        bank.add(q2, [vr, "I", "IV", "VI"], vr,
                f"{name} uchun xarakterli valentlik — {val}.")


def _ion_form(bank, rng):
    cat, an, formula = rng.choice(IONS_FORM)
    q = f"{cat} va {an} ionlari birikganda qaysi formula hosil bo'ladi?"
    wrongs = rng.sample([f for (c, a, f) in IONS_FORM if f != formula], 3)
    bank.add(q, [formula] + wrongs, formula,
            f"Zaryadlar muvozanati natijasida {formula} hosil bo'ladi.")


def _molmass(bank, rng):
    f, m = rng.choice(MOLMASS)
    q = f"{f} ning molyar massasi (g/mol) qancha?"
    wrongs = rng.sample([m2 for (f2, m2) in MOLMASS if m2 != m], 3)
    bank.add(q, [str(m)] + [str(w) for w in wrongs], str(m),
            f"M({f}) = {m} g/mol.")


def _reaction(bank, rng):
    eq, typ = rng.choice(REACTIONS)
    t = typ if typ != "yonish" else "yonish"
    q = f"Quyidagi reaksiya qaysi turga kiradi?  {eq}"
    kinds = ["Birikish", "Parchalanish", "Almashtirish", "O'rin olish"]
    kinds2 = ["Birikish", "Parchalanish"]
    if t == "birikish":
        correct = "Birikish"
    elif t == "parchalanish":
        correct = "Parchalanish"
    else:
        correct = "Yonish"
        kinds = ["Yonish", "Birikish", "Parchalanish", "Neytrallash"]
    wrongs = [k for k in kinds if k != correct]
    rng.shuffle(wrongs)
    bank.add(q, [correct] + wrongs[:3], correct,
            f"Reaksiya: {eq}; turi — {correct.lower()}.")


def _acidbase(bank, rng):
    formula, cls = rng.choice(ACID_BASE)
    q = f"{formula} moddasi qaysi sinfga kiradi?"
    correct = cls
    classes = ["kislota", "asos", "tuz", "oksid", "neytral oksid"]
    wrongs = rng.sample([c for c in classes if c != cls], 3)
    bank.add(q, [correct] + wrongs, correct,
            f"{formula} — {cls}.")


def _physchem(bank, rng):
    phen, kind = rng.choice(STATES)
    q = f"«{phen}» — qanday xodisa?"
    correct = "Fizik xodisa" if kind == "fizik xodisa" else "Kimyoviy xodisa"
    other = "Kimyoviy xodisa" if correct == "Fizik xodisa" else "Fizik xodisa"
    bank.add(q, [correct, other, "Yadro xodisasi", "Elektr xodisasi"], correct,
            f"{phen} — {kind.lower()}.")


TEMPLATES = [_elem, _ion_form, _molmass, _reaction, _acidbase, _physchem]

# -------------------------------- BIYOLOGIYA --------------------------------

ORGANS = [
    ("Yurak", "Qonni tomirlar bo'ylab haydaydi"),
    ("O'pka", "Gaz almashinuvi: kislorod qabul qilish"),
    ("Jigar", "Qonni zararsizlantiradi, oqsil sintezi"),
    ("Buyrak", "Qonni filtrlab, siydik hosil qiladi"),
    ("Oshqozon", "Ovqatni hazm qilishni boshlaydi"),
    ("Miya", "Boshqaruv markazi, fikrlash va harakat"),
    ("Bosh miya", "Sezgi va xotira"),
    ("Teri", "Tanani himoya qiladi"),
    ("Ko'z", "Ko'rish organi"),
    ("Quloq", "Eshitish va muvozanat organi"),
    ("Til", "Ta'm bilish organi"),
    ("Burun", "Hid bilish organi"),
    ("Bo'g'iz", "Nafas va ovqat yo'li"),
    ("O't pufagi", "O't suyuqligini saqlaydi"),
    ("Me'da osti bezi", "Insulin ishlab chiqaradi"),
    ("Suyak", "Tayanch-harakat vazifasi"),
    ("Mushak", "Harakatni ta'minlaydi"),
    ("Qon", "Moddalarni tashiydi"),
    ("Limfa tuguni", "Immun himoya"),
    ("Taloq", "Qon hujayralarini boshqaradi"),
    ("Kallak", "Bosh suyagi: miyani himoya qiladi"),
    ("Yurak klapani", "Qonning teskari oqishini oldini oladi"),
    ("Arteriya", "Qonni yurakdan olib ketadi"),
    ("Vena", "Qonni yurakka olib keladi"),
    ("Bronx", "Havo o'pkaga olib boradi"),
    ("Traxeya", "Nafas yo'li"),
    ("Ingichka ichak", "Ozuqa moddalarning so'rilishi"),
    ("Oshqozon osti bezi", "Fermentlar ishlab chiqaradi"),
]

CELL_PARTS = [
    ("Yadro", "Hujayrani boshqaradi, DNK saqlaydi"),
    ("Sitoplazma", "Organoidlarni o'rab turadi"),
    ("Mitoxondriya", "Energiya (ATP) ishlab chiqaradi"),
    ("Ribosoma", "Oqsil sintez qiladi"),
    ("Xloroplast", "Fotosintez olib boradi"),
    ("Membrana", "Moddalarni o'tkazuvchanligini boshqaradi"),
    ("Vakuola", "Suv va moddalarni saqlaydi"),
    ("Golji kompleksi", "Moddalarni qayta ishlaydi"),
    ("Lizosoma", "Hujayra ichi tozaligi"),
    ("Endoplazmatik to'r", "Modda tashiydi"),
]

SYSTEMS = [
    ("Qon aylanish tizimi", "Qonni tashiydi"),
    ("Nafas tizimi", "Kislorod va karbonat angidrid"),
    ("Ovqat hazm qilish tizimi", "Ovqatni parchalaydi"),
    ("Asab tizimi", "Signal uzatadi"),
    ("Skelet tizimi", "Tayanch"),
    ("Mushaklar tizimi", "Harakat"),
    ("Endokrin tizimi", "Gormonlar"),
    ("Immun tizimi", "Himoya"),
    ("Ajratish tizimi", "Chiqindi moddalarni chiqaradi"),
    ("Reproduktiv tizim", "Nasl berish"),
]

KINGDOM_EXAMPLES = [
    ("O'simliklar", "dasturxon gul"), ("O'simliklar", "chinor"),
    ("O'simliklar", "bug'doy"), ("O'simliklar", "olma"),
    ("Hayvonlar", "sher"), ("Hayvonlar", "burgut"),
    ("Hayvonlar", "ilon"), ("Hayvonlar", "baliq"),
    ("Zamburug'lar", "qo'ziqorin"), ("Zamburug'lar", "zamok"),
    ("Bakteriyalar", "tayoqcha bakteriya"),
    ("Bakteriyalar", "kokklar"),
    ("Bakteriyalar", "spirillalar"),
    ("Viruslar", "gripp virusi"),
    ("Viruslar", "koronavirus"),
    ("Lishayniklar", "yashil lishaynik"),
]

BIOL_NUMS = [
    ("Inson skeletida nechta suyak bor?", "206"),
    ("Voyaga yetgan odamda nechta tish bor?", "32"),
    ("Inson hujayrasida nechta xromosoma (DNK) bor?", "46"),
    ("Yurak nechta kameradan iborat?", "4"),
    ("Insonning nechta sezgi organi bor?", "5"),
    ("O'pkada nechta bo'lak bor?", "5"),
]

PHOTOSYN = [
    ("Fotosintezda qanday gaz ajraladi?", "Kislorod"),
    ("Fotosintez uchun qaysi energiya kerak?", "Quyosh (yorug'lik)"),
    ("Xlorofill qanday modda?", "Yashil organoid pigment"),
    ("Fotosintez qanday moddalaar yordamida boradi?", "CO2 va H2O"),
    ("O'simlikni oziqlanishi qanday nomlanadi?", "Fotosintez"),
]

VITAMINS = [
    ("A vitamini", "sabzi, ko'z salomatligi"),
    ("B vitamini", "don mahsulotlari, asab"),
    ("C vitamini", "limon, immunitet"),
    ("D vitamini", "quyosh, suyak"),
    ("E vitamini", "o'simlik moyi, teri"),
]

BIO_FACTS = [
    ("Inson qonining o'rtacha miqdori", "5 litr"),
    ("Yurak bir daqiqada", "60-80 marta uriladi"),
    ("Inson miyasi og'irligi", "1,4 kg atrofida"),
    ("Inson o'pkasi tarkibidagi havo", "6 litr"),
    ("DNK nima degan ma'noda", "dezoksiribonuklein kislota"),
]


def _organs(bank, rng):
    organ, func = rng.choice(ORGANS)
    if rng.random() < 0.5:
        q = f"{organ}ning asosiy vazifasi?"
        correct = func
        wrongs = rng.sample([f2 for (o2, f2) in ORGANS if f2 != func], 3)
        expl = f"{organ} — {func.lower()}."
    else:
        q = f"«{func}» vazifasini bajaruvchi organ?"
        correct = organ
        wrongs = rng.sample([o2 for (o2, f2) in ORGANS if o2 != organ], 3)
        expl = f"{func} vazifasini {organ} bajaradi."
    bank.add(q, [correct] + wrongs, correct, expl)


def _cell(bank, rng):
    part, func = rng.choice(CELL_PARTS)
    if rng.random() < 0.5:
        q = f"{part}ning vazifasi?"
        correct = func
        wrongs = rng.sample([f2 for (p2, f2) in CELL_PARTS if f2 != func], 3)
    else:
        q = f"«{func}» — qaysi hujayra organoidi?"
        correct = part
        wrongs = rng.sample([p2 for (p2, f2) in CELL_PARTS if p2 != part], 3)
    bank.add(q, [correct] + wrongs, correct,
            f"{part} — {func.lower()}.")


def _systems(bank, rng):
    sysname, role = rng.choice(SYSTEMS)
    if rng.random() < 0.5:
        q = f"{sysname}ning vazifasi?"
        correct = role
        wrongs = rng.sample([r2 for (s2, r2) in SYSTEMS if r2 != role], 3)
    else:
        q = f"«{role}» — qaysi tizim?"
        correct = sysname
        wrongs = rng.sample([s2 for (s2, r2) in SYSTEMS if s2 != sysname], 3)
    bank.add(q, [correct] + wrongs, correct,
            f"{sysname} — {role.lower()}.")


def _kingdom(bank, rng):
    kingdom, ex = rng.choice(KINGDOM_EXAMPLES)
    if rng.random() < 0.5:
        q = f"{ex} — qaysi tirik mavjudotlar podsholigiga (kingdom) kiradi?"
        correct = kingdom
        wrongs = rng.sample([k for (k, e) in KINGDOM_EXAMPLES if k != kingdom], 3)
    else:
        q = f"{kingdom} birligi vakili qaysi?"
        correct = ex
        wrongs = rng.sample([e for (k, e) in KINGDOM_EXAMPLES if e != ex], 3)
    bank.add(q, [correct] + wrongs, correct,
            f"{ex} — {kingdom} guruhiga kiradi.")


def _biol_nums(bank, rng):
    q, n = rng.choice(BIOL_NUMS)
    base = n
    correct = base
    wrongs = rng.sample([str(x) for x in [206, 32, 46, 4, 5, 12, 640] if str(x) != base], 3)
    bank.add(q, [correct] + wrongs, correct,
            f"To'g'ri javob: {n}.")


def _photosyn(bank, rng):
    q, correct = rng.choice(PHOTOSYN)
    wrongs = rng.sample([a for (q2, a) in PHOTOSYN if a != correct], 3)
    bank.add(q, [correct] + wrongs, correct,
            f"Fotosintez mavzusiga oid: javob — {correct}.")


def _vitamins(bank, rng):
    vit, src = rng.choice(VITAMINS)
    if rng.random() < 0.5:
        q = f"{vit} qayerda ko'p uchraydi?"
        correct = src
        wrongs = rng.sample([s for (v, s) in VITAMINS if s != src], 3)
    else:
        q = f"«{src}» — qaysi vitamin manbai?"
        correct = vit
        wrongs = rng.sample([v for (v, s) in VITAMINS if v != vit], 3)
    bank.add(q, [correct] + wrongs, correct,
            f"{vit} — {src}dan olinadi.")


def _bio_facts(bank, rng):
    fact, val = rng.choice(BIO_FACTS)
    q = f"{fact} qancha?"
    correct = val
    wrongs = rng.sample([v for (f, v) in BIO_FACTS if v != val], 3)
    bank.add(q, [correct] + wrongs, correct,
            f"{fact}: {val}.")


TEMPLATES_BIO = [_organs, _cell, _systems, _kingdom, _biol_nums, _photosyn,
                 _vitamins, _bio_facts]


def generate_kimyo(bank: QuestionBank, rng: random.Random, target: int) -> None:
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


def generate_biologiya(bank: QuestionBank, rng: random.Random, target: int) -> None:
    attempts = 0
    while len(bank.items) < target and attempts < target * 6:
        attempts += 1
        order = TEMPLATES_BIO.copy()
        rng.shuffle(order)
        for t in order:
            if len(bank.items) >= target:
                break
            try:
                t(bank, rng)
            except (AssertionError, ZeroDivisionError, ValueError):
                continue