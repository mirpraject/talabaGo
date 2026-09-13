"""Geografiya — fakt-bank asosidagi takrorlanmaydigan savollar generatori."""

import random

from .base import QuestionBank

# ---------------------------------- DAVLATLAR ----------------------------------

CAPITALS = [
    ("O'zbekiston", "Toshkent"),
    ("Rossiya", "Moskva"),
    ("AQSh", "Vashington"),
    ("Xitoy", "Pekin"),
    ("Hindiston", "Nyu-Dehli"),
    ("Yaponiya", "Tokio"),
    ("Koreya Respublikasi", "Seul"),
    ("Qozog'iston", "Ostona"),
    ("Turkmaniston", "Ashxobod"),
    ("Qirg'iziston", "Bishkek"),
    ("Tojikiston", "Dushanbe"),
    ("Afg'oniston", "Kobul"),
    ("Eron", "Tehron"),
    ("Turkiya", "Anqara"),
    ("Ozarbayjon", "Boku"),
    ("Armaniston", "Yerevan"),
    ("Gruziya", "Tbilisi"),
    ("Ukraina", "Kiyev"),
    ("Belarus", "Minsk"),
    ("Polsha", "Varshava"),
    ("Germaniya", "Berlin"),
    ("Fransiya", "Parij"),
    ("Buyuk Britaniya", "London"),
    ("Italiya", "Rim"),
    ("Ispaniya", "Madrid"),
    ("Portugaliya", "Lissabon"),
    ("Gretsiya", "Afina"),
    ("Niderlandiya", "Amsterdam"),
    ("Belgiya", "Bryussel"),
    ("Shvetsariya", "Bern"),
    ("Avstriya", "Vena"),
    ("Shvetsiya", "Stokgolm"),
    ("Norvegiya", "Oslo"),
    ("Finlandiya", "Xelsinki"),
    ("Daniya", "Kopengagen"),
    ("Chexiya", "Praga"),
    ("Vengriya", "Budapesht"),
    ("Ruminiya", "Buxarest"),
    ("Bolgariya", "Sofiya"),
    ("Mongoliya", "Ulan-Bator"),
    ("Pokiston", "Islomobod"),
    ("Bangladesh", "Dakka"),
    ("Vetnam", "Xanoy"),
    ("Tailand", "Bangkok"),
    ("Indoneziya", "Jakarta"),
    ("Filippin", "Manila"),
    ("Malayziya", "Kuala-Lumpur"),
    ("Singapur", "Singapur"),
    ("Saudiya Arabistoni", "Ar-Riyod"),
    ("BAA", "Abu-Dabi"),
    ("Isroil", "Quddus"),
    ("Iroq", "Bag'dod"),
    ("Suriya", "Damashq"),
    ("Livan", "Bayrut"),
    ("Iordaniya", "Amman"),
    ("Misr", "Qohira"),
    ("Jazoir", "Jazoir"),
    ("Marokash", "Rabot"),
    ("Liviya", "Tripoli"),
    ("Tunis", "Tunis"),
    ("Sudan", "Xartum"),
    ("Efiopiya", "Addis-Abeba"),
    ("Keniya", "Nayrobi"),
    ("Nigeriya", "Abuja"),
    ("Gana", "Akra"),
    ("Senegal", "Dakar"),
    ("Janubiy Afrika Respublikasi", "Pretoriya"),
    ("Kanada", "Ottava"),
    ("Meksika", "Mexiko"),
    ("Kuba", "Gavana"),
    ("Braziliya", "Braziliya"),
    ("Argentina", "Buenos-Ayres"),
    ("Chili", "Santyago"),
    ("Peru", "Lima"),
    ("Kolumbiya", "Bogota"),
    ("Venesuela", "Karakas"),
    ("Ekvador", "Kito"),
    ("Boliviya", "Lapas"),
    ("Urugvay", "Montevideo"),
    ("Paragvay", "Asunsyon"),
    ("Avstraliya", "Kanberra"),
    ("Yangi Zelandiya", "Vellington"),
    ("Irlandiya", "Dublin"),
    ("Xorvatiya", "Zagreb"),
    ("Serbiya", "Belgrad"),
    ("Shotlandiya", "Edinburg"),
]

# ---------------------------------- MATERIKLAR ----------------------------------

CONTINENT_FACTS = [
    ("Osiyo", "eng katta materik"),
    ("Antarktida", "eng sovuq materik"),
    ("Afrika", "eng issiq materik"),
    ("Avstraliya", "eng kichik materik"),
    ("Janubiy Amerika", "Amazonka oqib o'tadigan materik"),
    ("Afrika", "Nilo daryosi oqib o'tadigan materik"),
]

OCEANS = [
    ("Tinch okeani", "eng katta okean"),
    ("Tinch okeani", "eng chuqur okean"),
    ("Shimoliy Muz okeani", "eng kichik okean"),
    ("Shimoliy Muz okeani", "eng sovuq okean"),
    ("Atlantika okeani", "Yevropa va Amerikani ajratadi"),
    ("Hind okeani", "Afrika, Osiyo va Avstraliya oralig'idagi okean"),
]

OCEAN_BY_CONTINENT = [
    ("O'zbekiston", "Orol dengizi"),
    ("Rossiya", "Kaspiy dengizi"),
    ("Turkiya", "Qora dengiz"),
    ("Italiya", "O'rta yer dengizi"),
    ("Misr", "Qizil dengiz"),
    ("Keniya", "Hind okeani"),
    ("Ispaniya", "O'rta yer dengizi"),
]

SEAS = [
    ("O'rta yer dengizi", "Yevropa va Afrika oralig'ida"),
    ("Qora dengiz", "Turkiya va Ukraina oralig'ida"),
    ("Qizil dengiz", "Afrika va Arabiston oralig'ida"),
    ("Kaspiy dengizi", "Yevropa va Osiyo oralig'ida"),
    ("O'lik dengiz", "dunyodagi eng sho'r dengiz"),
    ("Orol dengizi", "O'zbekistonda joylashgan"),
    ("Barens dengizi", "Rossiya shimolida joylashgan"),
]

# ---------------------------------- DARYOLAR ----------------------------------

RIVERS = [
    ("Nilo", "Afrika"),
    ("Amazonka", "Janubiy Amerika"),
    ("Missisipi", "Shimoliy Amerika"),
    ("Xuanxe", "Osiyo (Xitoy)"),
    ("Yanszi", "Osiyo (Xitoy)"),
    ("Volga", "Yevropa (Rossiya)"),
    ("Dunay", "Yevropa"),
    ("Sirdaryo", "O'zbekiston"),
    ("Amudaryo", "O'zbekiston"),
    ("Gang", "Osiyo (Hindiston)"),
    ("Temza", "Yevropa (Buyuk Britaniya)"),
    ("Sena", "Yevropa (Fransiya)"),
    ("Reyx", "Yevropa"),
    ("Missuri", "Shimoliy Amerika"),
    ("Nil", "Afrika"),
    ("Tiber", "Yevropa (Italiya)"),
    ("Ko'ksuv", "O'zbekiston (Farg'ona)"),
    ("Zarafshon", "O'zbekiston"),
]

# ---------------------------------- TOG'LAR ----------------------------------

MOUNTAINS = [
    ("Everest", "Himolay"),
    ("Chimbalak", "Qozog'iston"),
    ("Tyan-Shan", "Markaziy Osiyo"),
    ("Hisor tizmasi", "O'zbekiston"),
    ("Pamir", "Tojikiston"),
    ("Oltoy", "Rossiya"),
    ("Ural tog'lari", "Yevropa va Osiyo chegarasi"),
    ("Alp tog'lari", "Yevropa"),
    ("Qoraqum cho'li", "Turkmaniston"),
]

# ---------------------------------- SAYYORALAR / QUYOSH TIZIMI ----------------------------------

PLANET_FACTS = [
    ("Merkuriy", "Merkuriy", "Quyoshga eng yaqin sayyora"),
    ("Venera", "Venera", "Quyoshga ikkinchi yaqin sayyora"),
    ("Mars", "Mars", "Qizil sayyora"),
    ("Yupiter", "Yupiter", "eng katta sayyora"),
    ("Saturn", "Saturn", "halqalariga ega sayyora"),
    ("Mars", "Mars", "Yerdan keyingi sayyora"),
    ("Yer", "Yer", "hayot mavjud sayyora"),
]

LET_ME_REPORT_PLANET = [
    ("Merkuriy", "eng yaqin"),
    ("Venera", "eng issiq"),
    ("Mars", "qizil"),
    ("Yupiter", "eng katta"),
    ("Saturn", "halqali"),
]

# ---------------------------------- IQLIM / TAYBIIY RESURSLAR ----------------------------------

NATURAL_FACTS = [
    ("neft", "Saudiya Arabistoni"),
    ("gaz", "Rossiya"),
    ("oltin", "Janubiy Afrika"),
    ("almos", "Rossiya"),
    ("paxta", "O'zbekiston"),
    ("olmos", "Botsvana"),
    ("choy", "Xitoy"),
    ("qahva", "Braziliya"),
]

# ---------------------------------- LANDMARKLAR ----------------------------------

LANDMARKS = [
    ("Eyfel minorasi", "Parij"),
    ("Katta Xitoy devori", "Xitoy"),
    ("Egri minora", "Piza"),
    ("Taj Mahal", "Hindiston"),
    ("Kolizey", "Rim"),
    ("Registon maydoni", "Samarqand"),
    ("Burj Xelifa", "Dubay"),
    ("Osmono'par bino", "Nyu-York"),
    ("Aq- saroy", "Turkiston"),
    ("Shahrisabz qal'asi", "O'zbekiston"),
]

ORIENT = [
    ("shimol", "N"),
    ("janub", "J"),
    ("sharq", "Sh"),
    ("g'arb", "G'"),
]

# ---------------------------------- VILOYATLAR ----------------------------------

REGIONS = [
    ("Toshkent viloyati", "Toshkent"),
    ("Andijon viloyati", "Andijon"),
    ("Farg'ona viloyati", "Farg'ona"),
    ("Namangan viloyati", "Namangan"),
    ("Sirdaryo viloyati", "Guliston"),
    ("Jizzax viloyati", "Jizzax"),
    ("Samarqand viloyati", "Samarqand"),
    ("Navoiy viloyati", "Navoiy"),
    ("Buxoro viloyati", "Buxoro"),
    ("Qashqadaryo viloyati", "Qarshi"),
    ("Surxondaryo viloyati", "Termiz"),
    ("Xorazm viloyati", "Urganch"),
    ("Qoraqalpog'iston", "Nukus"),
    ("Sirdaryo viloyati", "Guliston"),
]

# ---------------------------------- RAQAMLI FAKTLAR ----------------------------------

NUM_FACTS = [
    ("Amudaryoning uzunligi", "2400 km", 2400),
    ("Sirdaryoning uzunligi", "2200 km", 2200),
    ("Orol dengizining maydoni (2000-yil)", "46 ming km²", 46),
    ("Everest cho'qqisining balandligi", "8848 m", 8848),
    ("O'zbekiston aholisi (taxminan)", "35 mln", 35),
    ("O'zbekistonning maydoni", "448 ming km²", 448),
    ("O'zbekistondagi viloyatlar soni", "12", 12),
    ("Konstitutsiyada belgilangan viloyatlar", "12", 12),
]


def _capital(bank, rng):
    country, cap = rng.choice(CAPITALS)
    caps = [c for (cc, c) in CAPITALS if c != cap]
    countries = [cc for (cc, c) in CAPITALS if cc != country]
    if rng.random() < 0.5:
        q = f"{country}ning poytaxti qaysi shahar?"
        correct = cap
        wrongs = rng.sample(caps, 3)
        expl = f"{country}ning poytaxti — {cap}."
    else:
        q = f"{cap} — qaysi davlatning poytaxti?"
        correct = country
        wrongs = rng.sample(countries, 3)
        expl = f"{cap} — {country} poytaxti."
    bank.add(q, [correct] + wrongs, correct, expl)


def _continent(bank, rng):
    cont, factline = rng.choice(CONTINENT_FACTS)
    wrongs = rng.sample([c for (c, f) in CONTINENT_FACTS if c != cont], 3)
    q = f"{factline} materigi qaysi?"
    bank.add(q, [cont] + wrongs, cont,
            f"{cont} — {factline.lower()} materik.")


def _ocean(bank, rng):
    ocean, factline = rng.choice(OCEANS)
    wrongs = rng.sample([o for (o, f) in OCEANS if o != ocean], 3)
    q = f"{factline} — qaysi okean?"
    bank.add(q, [ocean] + wrongs, ocean,
            f"{ocean} — {factline.lower()} okean.")


def _river(bank, rng):
    river, where = rng.choice(RIVERS)
    rivers = [r for (r, w) in RIVERS if r != river]
    q = f"{river} daryosi qayerda joylashgan?"
    correct = where
    wrongs = rng.sample([w for (r, w) in RIVERS if w != where], 3)
    bank.add(q, [correct] + wrongs, correct,
            f"{river} daryosi — {where}da oqadi.")


def _river_rev(bank, rng):
    river, where = rng.choice(RIVERS)
    q = f"{where}da joylashgan yirik daryo qaysi?"
    correct = river
    wrongs = rng.sample([r for (r, w) in RIVERS if r != river], 3)
    bank.add(q, [correct] + wrongs, correct,
            f"{where}da {river} daryosi joylashgan.")


def _mountain(bank, rng):
    mtn, where = rng.choice(MOUNTAINS)
    q = f"{mtn} — qayerda joylashgan?"
    correct = where
    wrongs = rng.sample([w for (m, w) in MOUNTAINS if w != where], 3)
    bank.add(q, [correct] + wrongs, correct,
            f"{mtn} — {where}da joylashgan.")


def _natural(bank, rng):
    res, country = rng.choice(NATURAL_FACTS)
    wrongs = rng.sample([cc for (r, cc) in NATURAL_FACTS if cc != country], 3)
    q = f"{res.capitalize()} zaxirasi bilan mashhur davlat qaysi?"
    bank.add(q, [country] + wrongs, country,
            f"{res} — {country}da ko'p qazib chiqariladi.")


def _landmark(bank, rng):
    lm, place = rng.choice(LANDMARKS)
    if rng.random() < 0.5:
        q = f"{lm} qayerda joylashgan?"
        correct = place
        wrongs = rng.sample([p for (l, p) in LANDMARKS if p != place], 3)
        expl = f"{lm} — {place}da joylashgan."
    else:
        q = f"{place}da joylashgan mashhur yodgorlik qaysi?"
        correct = lm
        wrongs = rng.sample([l for (l, p) in LANDMARKS if l != lm], 3)
        expl = f"{place}da {lm} joylashgan."
    bank.add(q, [correct] + wrongs, correct, expl)


def _regions(bank, rng):
    reg, center = rng.choice(REGIONS)
    centers = [c for (r, c) in REGIONS if c != center]
    regions = [r for (r, c) in REGIONS if r != reg]
    if rng.random() < 0.5:
        q = f"{reg}ning ma'muriy markazi qaysi?"
        correct = center
        wrongs = rng.sample(centers, 3)
        expl = f"{reg}ning markazi — {center}."
    else:
        q = f"{center} — qaysi viloyatning markazi?"
        correct = reg
        wrongs = rng.sample(regions, 3)
        expl = f"{center} — {reg}ning markazi."
    bank.add(q, [correct] + wrongs, correct, expl)


def _num_fact(bank, rng):
    qtxt, correct = rng.choice(NUM_FACTS)[:2]
    pool = [str(x) for x in [2400, 2200, 46, 8848, 35, 448, 12, 150, 3000, 500, 90, 1600] if str(x) != correct]
    wrongs = rng.sample(pool, 3)
    bank.add(qtxt, [correct] + wrongs, correct,
            f"{qtxt.lower()} — {correct}.")


def _orient(bank, rng):
    d, abbr = rng.choice(ORIENT)
    q = f"«{d}» yo'nalishi qanday qisqartiriladi?"
    wrongs = rng.sample([a for (x, a) in ORIENT if a != abbr], 3)
    bank.add(q, [abbr] + wrongs, abbr,
            f"«{d}» — {abbr} deb qisqartiriladi.")


def _planet(bank, rng):
    pl, wrong_pl, desc = rng.choice(PLANET_FACTS)
    q = f"{desc} — qaysi sayyora?"
    wrongs = rng.sample([w for (p, w, d) in PLANET_FACTS if p != pl], 3)
    bank.add(q, [pl] + wrongs, pl,
            f"{desc} sayyorasi — {pl}.")


def _sea(bank, rng):
    sea, where = rng.choice(SEAS)
    q = f"{sea} qayerda joylashgan?"
    correct = where
    wrongs = rng.sample([w for (s, w) in SEAS if w != where], 3)
    bank.add(q, [correct] + wrongs, correct,
            f"{sea} — {where} joylashgan.")


TEMPLATES = [
    _capital, _continent, _ocean, _river, _river_rev, _mountain,
    _natural, _landmark, _regions, _num_fact, _orient, _planet, _sea,
]


def generate_geografiya(bank: QuestionBank, rng: random.Random, target: int) -> None:
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
