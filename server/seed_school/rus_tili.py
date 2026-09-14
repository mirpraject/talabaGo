"""Rus tili — 5-11 sinf."""
import random
from .base import q, _add, TARGET_PER_GRADE


_RUS_WORDS = [
    ("книга", "ж.), китоб", ["стол", "окно", "молоко"]),
    ("стол", "м.), стол", ["книга", "окно", "молоко"]),
    ("окно", "ср.), deraza", ["стол", "книга", "молоко"]),
    ("молоко", "ср.), sut", ["стол", "окно", "книга"]),
    ("дом", "м.), uy", ["стол", "окно", "река"]),
    ("река", "ж.), daryo", ["дом", "стол", "гора"]),
    ("гора", "ж.), tog'", ["река", "дом", "стол"]),
    ("собака", "ж.), it", ["кошка", "лошадь", "птица"]),
    ("кошка", "ж.), mushuk", ["собака", "лошадь", "птица"]),
    ("лошадь", "ж.), ot", ["собака", "кошка", "птица"]),
]

_RUS_VERBS = [
    ("читать", "o'qish", ["писать", "бегать", "петь"]),
    ("писать", "yozish", ["читать", "бегать", "петь"]),
    ("бегать", "yugurish", ["читать", "писать", "петь"]),
    ("петь", "kuylash", ["читать", "писать", "бегать"]),
    ("говорить", "gapirish", ["слушать", "смотреть", "делать"]),
    ("слушат", "eshitish", ["говорить", "смотреть", "делать"]),
    ("смотреть", "ko'rish", ["говорить", "слушать", "делать"]),
    ("делать", "qilish", ["говорить", "слушать", "смотреть"]),
]

_RUS_ADJ = [
    ("большой", "katta", ["маленький", "красивый", "новый"]),
    ("маленький", "kichik", ["большой", "красивый", "новый"]),
    ("красивый", "chiroyli", ["большой", "маленький", "новый"]),
    ("новый", "yangi", ["большой", "маленький", "старый"]),
    ("старый", "eski", ["большой", "маленький", "новый"]),
    ("хороший", "yaxshi", ["плохой", "большой", "новый"]),
    ("плохой", "yomon", ["хороший", "большой", "новый"]),
]


def gen_russian(target=350):
    items, seen = [], set()

    # …_Topish (noun gender)
    for _ in range(target):
        if len(items) >= target:
            break
        noun, info, wrongs = random.choice(_RUS_WORDS)
        _add(items, seen,
             f"«{noun}» so'zi qaysi jinsda?",
             info, [f"{w}" for w in wrongs])

    # Fe'l tarjimasi
    for _ in range(target):
        if len(items) >= target:
            break
        verb, tr, wrongs = random.choice(_RUS_VERBS)
        _add(items, seen,
             f"«{verb}» so'zining o'zbekchasi?",
             tr, list(wrongs))

    # Sifat tarjimasi
    for _ in range(target):
        if len(items) >= target:
            break
        adj, tr, wrongs = random.choice(_RUS_ADJ)
        _add(items, seen,
             f"«{adj}» so'zining o'zbekchasi?",
             tr, list(wrongs))

    # Jumlani to'ldirish
    templates = [
        ("Я ___ книгу.", "читаю", ["пишу", "бегаю", "пою"]),
        ("Он ___ в школу.", "идёт", ["читает", "пишет", "поёт"]),
        ("Мы ___ по-русски.", "говорим", ["пишем", "читаем", "поём"]),
        ("Они ___ музыку.", "слушают", ["смотрят", "пишут", "читают"]),
        ("Ты ___ красиво.", "пишешь", ["читаешь", "бегаешь", "поёшь"]),
    ]
    for _ in range(target):
        if len(items) >= target:
            break
        sent, ans, wrongs = random.choice(templates)
        _add(items, seen, sent, ans, list(wrongs))

    # Qo'shimcha so'z
    extras = [
        ("природа", "tabiat", ["muzey", "kitob", "shahar"]),
        ("учитель", "o'qituvchi", ["talaba", "shifokor", "o'simlik"]),
        ("студент", "talaba", ["o'qituvchi", "shifokor", "o'simlik"]),
        ("школа", "maktab", ["universitet", "bozor", "kutubxona"]),
        ("семья", "oila", ["maktab", "shahar", "davlat"]),
    ]
    for _ in range(target):
        if len(items) >= target:
            break
        w, tr, wrongs = random.choice(extras)
        _add(items, seen, f"«{w}» so'zining o'zbekchasi?", tr, list(wrongs))

    # ── Ko'plik shakllari ──
    plurals = [
        ("книга", "книги", ["книга", "книгий", "книгам"]),
        ("стол", "столы", ["стол", "стола", "столов"]),
        ("окно", "окна", ["окно", "окны", "окном"]),
        ("дом", "дома", ["дом", "домы", "домо"]),
        ("город", "города", ["город", "городы", "городо"]),
        ("учитель", "учителя", ["учитель", "учителяи", "учительы"]),
        ("сестра", "сёстры", ["сестра", "сестрыи", "сестрам"]),
        ("брат", "братья", ["брат", "браты", "братом"]),
        ("дерево", "деревья", ["дерево", "дерева", "деревом"]),
        ("друг", "друзья", ["друг", "други", "друго"]),
    ]
    for _ in range(target):
        if len(items) >= target:
            break
        sg, pl, wrongs = random.choice(plurals)
        _add(items, seen,
             f"«{sg}» so'zining ko'plik shakli qanday?",
             pl, list(wrongs))

    # ── O'tgan zamon ──
    past = [
        ("читал", "o'qidi", ["o'qiydi", "o'qir", "yozadi"]),
        ("писал", "yozdi", ["yozadi", "o'qiydi", "uyg'ondi"]),
        ("ходил", "bordi", ["boradi", "keladi", "yuradi"]),
        ("смотрел", "ko'rdi", ["ko'radi", "eshitdi", "gapirdi"]),
        ("говорил", "gapirdi", ["gapiridi", "ko'rdi", "yozdi"]),
        ("читала", "o'qidi (ayol)", ["o'qiydi", "yozdi", "sotdi"]),
        ("был", "edi (bo'lgan)", ["bo'lar", "bor", "chiqar"]),
        ("ехал", "bordi (transportda)", ["keladi", "yuradi", "oqiydi"]),
    ]
    for _ in range(target):
        if len(items) >= target:
            break
        rus, tr, wrongs = random.choice(past)
        _add(items, seen,
             f"«{rus}» (o'tgan zamon) so'zining o'zbekchasi?",
             tr, list(wrongs))

    # ── Raqamlar ──
    numbers = [
        ("один", "bir", ["ikki", "uch", "besh"]),
        ("два", "ikki", ["bir", "uch", "besh"]),
        ("три", "uch", ["bir", "ikki", "besh"]),
        ("четыре", "to'rt", ["bir", "ikki", "uch"]),
        ("пять", "besh", ["to'rt", "oltit", "yetti"]),
        ("шесть", "olti", ["besh", "yetti", "sakkiz"]),
        ("семь", "yetti", ["olti", "sakkiz", "to'qqiz"]),
        ("восемь", "sakkiz", ["yetti", "to'qqiz", "o'n"]),
        ("девять", "to'qqiz", ["sakkiz", "o'n", "o'n bir"]),
        ("десять", "o'n", ["to'qqiz", "o'n bir", "yigirma"]),
    ]
    for _ in range(target):
        if len(items) >= target:
            break
        rus, uz, wrongs = random.choice(numbers)
        _add(items, seen,
             f"«{rus}» sonining o'zbekchasi?",
             uz, list(wrongs))

    # ── Yaqinlik/joylashuv savollari ──
    questions = [
        ("Где ты живёшь?", "Qayerda yashaysiz?", ["Nima qilyapsiz?", "Qachon kelasiz?", "Kim siz?"]),
        ("Что ты делаешь?", "Nima qilyapsiz?", ["Qayerda?", "Qachon?", "Kim?"]),
        ("Кто это?", "Bu kim?", ["Bu nima?", "Nechanchi?", "Qachon?"]),
        ("Сколько это стоит?", "Bu necha turadi?", ["Bu qancha?", "Kim u?", "Qayerda?"]),
    ]
    for _ in range(target):
        if len(items) >= target:
            break
        rus, uz, wrongs = random.choice(questions)
        _add(items, seen,
             f"«{rus}» so'rog'ining ma'nosi?",
             uz, list(wrongs))

    # ── Ranglar ──
    colors = [
        ("красный", "qizil", ["ko'k", "yashil", "sariq"]),
        ("синий", "ko'k", ["qizil", "yashil", "qora"]),
        ("зелёный", "yashil", ["qizil", "ko'k", "oq"]),
        ("жёлтый", "sariq", ["qizil", "ko'k", "jigarrang"]),
        ("чёрный", "qora", ["oq", "ko'k", "qizil"]),
        ("белый", "oq", ["qora", "yashil", "sariq"]),
        ("серый", "kulrang", ["qora", "oq", "ko'k"]),
        ("коричневый", "jigarrang", ["qora", "oq", "qizil"]),
    ]
    for _ in range(target):
        if len(items) >= target:
            break
        rus, uz, wrongs = random.choice(colors)
        _add(items, seen,
             f"«{rus}» so'zining o'zbekchasi?",
             uz, list(wrongs))

    # ── Hafta kunlari ──
    days = [
        ("понедельник", "dushanba", ["seshanba", "chorshanba", "juma"]),
        ("вторник", "seshanba", ["dushanba", "chorshanba", "shanba"]),
        ("среда", "chorshanba", ["dushanba", "seshanba", "qish"]),
        ("четверг", "payshanba", ["chorshanba", "juma", "dushanba"]),
        ("пятница", "juma", ["payshanba", "shanba", "yakshanba"]),
        ("суббота", "shanba", ["juma", "yakshanba", "dushanba"]),
        ("воскресенье", "yakshanba", ["juma", "shanba", "payshanba"]),
    ]
    for _ in range(target):
        if len(items) >= target:
            break
        rus, uz, wrongs = random.choice(days)
        _add(items, seen,
             f"«{rus}» hafta kunining o'zbekchasi?",
             uz, list(wrongs))

    # ── Zamon belgilari ──
    time_words = [
        ("сегодня", "bugun", ["kecha", "ertaga", "hozir"]),
        ("вчера", "kecha", ["bugun", "ertaga", "hozir"]),
        ("завтра", "ertaga", ["kecha", "bugun", "hozir"]),
        ("утром", "ertalab", ["kechqurun", "tunda", "paysin"]),
        ("вечером", "kechqurun", ["ertalab", "tunda", "paysin"]),
        ("ночью", "tunda", ["ertalab", "kechqurun", "paysin"]),
        ("зима", "qish", ["yoz", "bahor", "kuz"]),
        ("лето", "yoz", ["qish", "bahor", "kuz"]),
        ("осень", "kuz", ["qish", "bahor", "yoz"]),
        ("весна", "bahor", ["qish", "yoz", "kuz"]),
    ]
    for _ in range(target):
        if len(items) >= target:
            break
        rus, uz, wrongs = random.choice(time_words)
        _add(items, seen,
             f"«{rus}» so'zining o'zbekchasi?",
             uz, list(wrongs))

    # ── Oila ──
    family = [
        ("мама", "ona", ["ota", "aka", "opa"]),
        ("папа", "ota", ["ona", "aka", "opa"]),
        ("брат", "aka/uka", ["ona", "opa", "xola"]),
        ("сестра", "singil/opa", ["ona", "aka", "buvim"]),
        ("бабушка", "buvim", ["bobom", "ona", "xola"]),
        ("дедушка", "bobom", ["buvim", "ona", "aka"]),
    ]
    for _ in range(target):
        if len(items) >= target:
            break
        rus, uz, wrongs = random.choice(family)
        _add(items, seen,
             f"«{rus}» so'zining o'zbekchasi?",
             uz, list(wrongs))

    # ── Kasb nomlari ──
    jobs = [
        ("врач", "shifokor", ["o'qituvchi", "muhandis", "quruvchi"]),
        ("инженер", "muhandis", ["shifokor", "o'qituvchi", "quruvchi"]),
        ("учитель", "o'qituvchi", ["shifokor", "muhandis", "quruvchi"]),
        ("строитель", "quruvchi", ["shifokor", "muhandis", "o'qituvchi"]),
        ("водитель", "haydovchi", ["shifokor", "o'qituvchi", "tarbiyachi"]),
        ("продавец", "sotuvchi", ["haydovchi", "shifokor", "muhandis"]),
        ("ученик", "o'quvchi", ["talaba", "o'qituvchi", "sotuvchi"]),
        ("студент", "talaba", ["o'quvchi", "o'qituvchi", "shifokor"]),
    ]
    for _ in range(target):
        if len(items) >= target:
            break
        rus, uz, wrongs = random.choice(jobs)
        _add(items, seen,
             f"«{rus}» so'zining o'zbekchasi?",
             uz, list(wrongs))

    return items[:target]
