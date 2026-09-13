"""Biologiya — maktab (5-11 sinf)."""
import random
from .base import q, _add, TARGET_PER_GRADE


_BIO = [
    ("Hujayraning energiya stansiyasi", "Mitoxondriya", ["Ribosoma", "Yadro", "Vakuola"]),
    ("Fotosintez sodir bo'ladigan organoid", "Xloroplast", ["Mitoxondriya", "Yadro", "Lizosoma"]),
    ("Oqsillar sintezlanadigan organoid", "Ribosoma", ["Mitoxondriya", "Xloroplast", "Yadro"]),
    ("Hujayraning boshqaruv markazi", "Yadro", ["Mitoxondriya", "Ribosoma", "Vakuola"]),
    ("Irsiy axborot saqlovchi molekula", "DNK", ["RNK", "Oqsil", "Yog'"]),
    ("Kislorod tashuvchi qon pigmenti", "Gemoglobin", ["Insulin", "Adrenalin", "Xlorofill"]),
    ("Yashil pigment", "Xlorofill", ["Gemoglobin", "Insulin", "Adrenalin"]),
    ("Qon shakarini boshqaruvchi gormon", "Insulin", ["Adrenalin", "Kortizol", "Tiroksin"]),
    ("Stressda ajraladigan gormon", "Adrenalin", ["Insulin", "Gormon", "Ferment"]),
    ("Suvning yarim o'tkazuvchan membrana orqali o'tishi", "Osmos", ["Diffuziya", "Fotosintez", "Nafas"]),
    ("Nafasda qonga kiradigan gaz", "Kislorod", ["Karbonat angidrid", "Azot", "Vodorod"]),
    ("Havoning asosiy tashkil qiluvchisi", "Azot (78%)", ["Kislorod (78%)", "Karbonat angidrid", "Vodorod"]),
    ("Insonning o'rtacha xromosoma soni", "46", ["48", "23", "78"]),
    ("Meropiya (havola) — boshqa so'z bilan", "Kislorodning hujayra va to'qimalarga o'tishi", ["Yog' oksidlanishi", "Suv almashinuvi", "Oqsil sintezi"]),
    ("O'simlik hujayrasidagi suv saqlovchi bo'shliq", "Vakuola", ["Lizosoma", "Yadro", "Mitoxondriya"]),
    ("Organizmning o'z turiga mos moslashuvi", "Adaptatsiya", ["Mutatsiya", "Evolyutsiya", "Seleksiya"]),
    ("Tuxum qo'yuvchi sutemizuvchi", "Echidna", ["Kobra", "Ilon", "Krokodil"]),
]


def gen_biologiya(target=350):
    items, seen = [], set()

    for _ in range(target):
        if len(items) >= target:
            break
        question, ans, wrongs = random.choice(_BIO)
        _add(items, seen, question, ans, list(wrongs))

    # Transport - aks holda ikkita tilli
    transport = [
        ("Arslon", "yirtqich", ["o'txo'r", "umurtqasiz", "sudraluvchi"]),
        ("Fil", "eng yirik quruqlik hayvoni", ["eng tez", "eng kichik", "suv hayvoni"]),
        ("Kobra", "zaharli ilon", ["zaharsiz ilon", "baliq", "qush"]),
        ("Kenguru", "marsupial", ["platsentar", "g'alla", "arpa"]),
    ]
    for _ in range(target):
        if len(items) >= target:
            break
        animal, fact, wrongs = random.choice(transport)
        _add(items, seen,
             f"«{animal}» — ?",
             fact, list(wrongs))

    # ── Xromosoma soni ──
    chromosomes = [
        ("Inson", "46", ["48", "23", "78"]),
        ("Maymun", "48", ["46", "24", "78"]),
        ("Piyoz", "16", ["46", "8", "32"]),
        ("Mushuk", "38", ["46", "19", "78"]),
        ("It", "78", ["46", "39", "38"]),
        ("Makkajo'xori", "20", ["46", "40", "10"]),
        ("Drosophila (Meva pashshasi)", "8", ["46", "4", "16"]),
        ("Ot", "64", ["46", "32", "48"]),
    ]
    for _ in range(target):
        if len(items) >= target:
            break
        org, num, wrongs = random.choice(chromosomes)
        _add(items, seen,
             f"{org} hujayrasida nechta xromosoma bor?",
             num, list(wrongs))

    # ── Organlar ──
    organs = [
        ("Qonni filtrlash vazifasini bajaruvchi organ", "Buyrak", ["Oshqozon", "O'pka", "Jigar"]),
        ("Kislorod almashinuvi sodir bo'ladigan organ", "O'pka", ["Yurak", "Buyrak", "Jigar"]),
        ("Ovqat hazm qiluvchi organ", "Oshqozon", ["Buyrak", "O'pka", "Yurak"]),
        ("Yurak qaysi tizimga mansub?", "Qon aylanish tizimi", ["Nafas tizimi", "Ovqat hazm tizimi", "Nerv tizimi"]),
        ("Miya qaysi tizimga mansub?", "Nerv tizimi", ["Qon aylanish", "Nafas", "Hazm"]),
        ("Suyaklar qaysi tizimga mansub?", "Tayanch-harakat", ["Nerv", "Qon aylanish", "Nafas"]),
    ]
    for _ in range(target):
        if len(items) >= target:
            break
        question, ans, wrongs = random.choice(organs)
        _add(items, seen, question, ans, list(wrongs))

    # ── Hayvon sinflari ──
    classes = [
        ("Ilon", "sudralib yuruvchilar", ["sut emizuvchilar", "qushlar", "baliklar"]),
        ("Kaptar", "qushlar", ["sut emizuvchilar", "sudralib yuruvchilar", "hasharotlar"]),
        ("Chivin", "hasharotlar", ["qushlar", "sut emizuvchilar", "baliklar"]),
        ("Akula", "baliklar", ["qushlar", "sudralib yuruvchilar", "hasharotlar"]),
        ("Qurbaqa", "amfibiyalar", ["sudralib yuruvchilar", "qushlar", "baliklar"]),
        ("Sigir", "sut emizuvchilar", ["qushlar", "amfibiyalar", "hasharotlar"]),
    ]
    for _ in range(target):
        if len(items) >= target:
            break
        animal, cls, wrongs = random.choice(classes)
        _add(items, seen,
             f"{animal} hayvonlar sinfiga mansub?",
             cls, list(wrongs))

    # ── O'simliklar ──
    plants = [
        ("Kartoshka", "ildizmeva", ["meva", "gul", "urug'"]),
        ("Sabzi", "ildizmeva", ["meva", "gul", "poya"]),
        ("Olma", "meva", ["ildizmeva", "gul", "poya"]),
        ("Bug'doy", "gulli o'simlik", ["yo'hsin", "qirqquloq", "suzuvchi o't"]),
        ("Terak", "daraxt", ["buta", "o't", "suzuvchi o't"]),
        ("Atirgul", "buta", ["daraxt", "o't", "tol"]),
    ]
    for _ in range(target):
        if len(items) >= target:
            break
        plant, cls, wrongs = random.choice(plants)
        _add(items, seen,
             f"{plant} qanday o'simlik?", cls, list(wrongs))

    # ── Genetika ──
    genetics = [
        ("Dominant va retsessiv allelning yig'indisi", "genotip", ["fenotip", "gen", "xromosoma"]),
        ("O'xshash fenotipga ega bo'lgan allellar", "gomozigota", ["geterozigota", "genotip", "fenotip"]),
        ("Turli allellar (Aa)", "geterozigota", ["gomozigota", "genotip", "fenotip"]),
        ("Mendelning 1-qonuni", "birxdillik qonuni", ["ayrilib chiqish", "mustaqil meros", "muqobillik"]),
        ("Mendelning 2-qonuni", "ayrilib chiqish qonuni", ["birxdillik", "mustaqil meros", "xromosoma"]),
        ("Mendelning 3-qonuni", "mustaqil meros", ["birxdillik", "ayrilib chiqish", "qtisod"]),
    ]
    for _ in range(target):
        if len(items) >= target:
            break
        question, ans, wrongs = random.choice(genetics)
        _add(items, seen, question, ans, list(wrongs))

    return items[:target]
