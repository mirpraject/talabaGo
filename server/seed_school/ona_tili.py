"""Ona tili va adabiyot — maktab (5-11 sinf)."""
import random
from .base import q, _add, TARGET_PER_GRADE


_UZ_POS = [
    ("kitob", "ot"), ("gul", "ot"), ("shahar", "ot"), ("daraxt", "ot"),
    ("go'zal", "sifat"), ("katta", "sifat"), ("chiroyli", "sifat"),
    ("yaxshi", "sifat"), ("oq", "sifat"), ("qora", "sifat"),
    ("bormoq", "fe'l"), ("kelmoq", "fe'l"), ("o'qimoq", "fe'l"),
    ("yozmoq", "fe'l"), ("ko'rmoq", "fe'l"),
    ("tez", "ravish"), ("sekin", "ravish"), ("yuqori", "ravish"),
    ("men", "olmosh"), ("sen", "olmosh"), ("siz", "olmosh"),
    ("u", "olmosh"), ("biz", "olmosh"), ("ular", "olmosh"),
]

_UZ_SYNONYMS = [
    ("chiroyli", "go'zal"), ("katta", "ulkan"), ("yaxshi", "yaxshigina"),
    ("tez", "chaqqon"), ("o'qimishli", "bilimdon"), ("baxtli", "xursand"),
    ("hamyon", "hamyon"), ("ustoz", "muallim"), ("bolalar", "yosh bolalar"),
    ("maktab", "maktabxona"), ("shahzo", "shahzoda"), ("kitob", "asar"),
]

_UZ_ANTONYMS = [
    ("katta", "kichik"), ("issiq", "sovuq"), ("uzun", "qisqa"),
    ("og'ir", "yengil"), ("yuqori", "past"), ("tez", "sekin"),
    ("och", "to'q"), ("yosh", "qari"), ("qora", "oq"),
]

_UZ_AUTHORS = [
    ("Alisher Navoiy", "Xamsa"),
    ("Abdulla Qodiriy", "O'tkan kunlar"),
    ("Cho'lpon", "Kecha va kunduz"),
    ("G'afur G'ulom", "Shum bola"),
    ("Oybek", "Navoiy"),
    ("Erkin Vohidov", "Yoshlik"),
    ("Abdulla Oripov", "O'zbekiston"),
    ("Uvaysiy", "Sado"),
]

_SET = [
    ("ot so'z turkumi", "so'z turkumlariga mansub"),
    ("ega va kesim", "gapning bosh bo'laklari"),
    ("to'ldiruvchi, aniqlovchi, hol", "gapning ikkinchi darajali bo'laklari"),
]


def gen_ona_tili(target=350):
    items, seen = [], set()

    # So'z turkumlari
    for _ in range(target):
        if len(items) >= target:
            break
        w, pos = random.choice(_UZ_POS)
        poss = list({p for _, p in _UZ_POS})
        wrongs = [p for p in poss if p != pos]
        _add(items, seen,
             f"«{w}» so'zi qaysi so'z turkumiga mansub?",
             pos, wrongs[:3])

    # Sinonim
    for _ in range(target):
        if len(items) >= target:
            break
        a, b = random.choice(_UZ_SYNONYMS)
        wrongs = [s2 for s1, s2 in _UZ_SYNONYMS if s2 != b][:3]
        _add(items, seen,
             f"«{a}» so'zining sinonimi?",
             b, wrongs)

    # Antonim
    for _ in range(target):
        if len(items) >= target:
            break
        a, b = random.choice(_UZ_ANTONYMS)
        wrongs = [w2 for w1, w2 in _UZ_ANTONYMS if w2 != b][:3]
        _add(items, seen,
             f"«{a}» so'zining antonimi?",
             b, wrongs)

    # Asoschilar
    for _ in range(target):
        if len(items) >= target:
            break
        author, work = random.choice(_UZ_AUTHORS)
        wrongs = [w for a, w in _UZ_AUTHORS if w != work][:3]
        _add(items, seen,
             f"«{work}» asarining muallifi kim?",
             author, [a for a, w in _UZ_AUTHORS if a != author][:3])

    # Gap bo'laklari
    for _ in range(target):
        if len(items) >= target:
            break
        ans, desc = random.choice(_SET)
        _add(items, seen,
             f"{desc} qaysi gap bo'laklari?",
             ans.split(" - ")[0], ["bosh bo'laklar", "ikkinchi darajali", "to'ldiruvchi"])

    # Grammatika: ko'plik
    for _ in range(target):
        if len(items) >= target:
            break
        w = random.choice(["kitob", "qalam", "daraxt", "gul", "bolalar", "stol"])
        _add(items, seen,
             f"«{w}» so'zining ko'plik shakli?",
             w + "lar", random.sample([w + "ning", w + "da", w + "siz", w + "chi"], 3))

    # ── Gabriya: hol shakllari ──
    possessive = [
        ("kitob", "kitobim"),
        ("qalam", "qalamim"),
        ("ota", "otam"),
        ("ona", "onam"),
        ("ustoz", "ustozim"),
        ("do'st", "do'stim"),
    ]
    for _ in range(target):
        if len(items) >= target:
            break
        w, form = random.choice(possessive)
        _add(items, seen,
             f"«{w}» so'ziga egalik qo'shimchasini qo'shing (meniki).",
             form, random.sample([w + "lar", w + "da", w + "ning", w + "siz"], 3))

    # ── Fe'l zamonlari ──
    verbs = [
        ("o'qimoq", "o'qidi"),
        ("yozmoq", "yozdi"),
        ("kelmoq", "keldi"),
        ("ketmoq", "ketdi"),
        ("gapirmoq", "gapirdi"),
        ("yugurmoq", "yugurdi"),
        ("ko'rmoq", "ko'rdi"),
        ("bormoq", "bordi"),
    ]
    for _ in range(target):
        if len(items) >= target:
            break
        inf, past = random.choice(verbs)
        _add(items, seen,
             f"«{inf}» fe'lining o'tgan zamon shakli?",
             past, random.sample([inf[:-3] + "moqda", inf[:-3] + "moqchi", inf[:-3] + "maydi", inf[:-3] + "ish"], 3))

    # ── Gap bo'laklari ──
    sent = [
        ("Men kitob o'qidim.", "ega — men", ["ega — kitob", "ega — o'qidim", "ega — x"]),
        ("Bolalar maktabda o'qiyapti.", "ega — bolalar", ["ega — maktabda", "ega — o'qiyapti", "ega — x"]),
        ("O'qituvchi dars o'tadi.", "ega — o'qituvchi", ["ega — dars", "ega — o'tadi", "ega — x"]),
        ("U gullarni suv qipti.", "ega — u", ["ega — gullarni", "ega — suv", "ega — x"]),
        ("Biz ertaga dam olamiz.", "ega — biz", ["ega — ertaga", "ega — dam", "ega — x"]),
    ]
    for _ in range(target):
        if len(items) >= target:
            break
        s, ans, wrongs = random.choice(sent)
        _add(items, seen,
             f"\"{s}\" gapida ega qaysi so'z?",
             ans, list(wrongs))

    # ── No to'g'ri so'zlar ──
    ortho = [
        ("«maktab» so'zining to'g'ri yozilishi", "maktab", ["maqtab", "maktap", "maqtav"]),
        ("«go'zal» so'zining to'g'ri yozilishi", "go'zal", ["g'o'zal", "gozal", "guzal"]),
        ("«o'quvchi» so'zining to'g'ri yozilishi", "o'quvchi", ["okuuchi", "o'qivchi", "o'quvci"]),
        ("«yaxshi» so'zining to'g'ri yozilishi", "yaxshi", ["yahshi", "yaxci", "yaqshi"]),
        ("«ona»  va «otam» — qanday aloqa?", "qarindoshlik", ["turdoshlik", "sinonim", "antonim"]),
    ]
    for _ in range(target):
        if len(items) >= target:
            break
        s, ans, wrongs = random.choice(ortho)
        _add(items, seen, s, ans, list(wrongs))

    # ── So'z yasash ──
    deriv = [
        ("o'qimoq", "o'quvchi"),
        ("ishlamoq", "ishchi"),
        ("yozmoq", "yozuvchi"),
        ("o'ynamoq", "o'yinchoq"),
        ("olmoq", "oluvchi"),
        ("saqlamoq", "saqlovchi"),
    ]
    for _ in range(target):
        if len(items) >= target:
            break
        verb, noun = random.choice(deriv)
        _add(items, seen,
             f"«{verb}» fe'lidan shaxs oti yasang.",
             noun, random.sample([verb[:-3] + "moq", verb[:-3] + "maydi", verb[:-3] + "lar", verb[:-3] + "da"], 3))

    # ── So'zlashuv uslubi ──
    terms = [
        ("So'z turkumlari nechta asosiy turga bo'linadi?", "10", ["6", "8", "12"]),
        ("Ot so'z turkumi nimani bildiradi?", "narsa va hodisa nomini", ["harakatni", "belgini", "sonni"]),
        ("Fe'l so'z turkumi nimani bildiradi?", "harakat va holatni", ["nomni", "belgini", "sonni"]),
        ("Sifat so'z turkumi nimani bildiradi?", "belgini", ["harakatni", "nomni", "sonni"]),
        ("Ravish qaysi savolga javob beradi?", "qanday? qayerda?", ["kim? nima?", "nechta?", "qaysi?"]),
        ("Qo'shma so'z deb nimaga aytiladi?", "ikki so'zdan tuzilgan", ["bitta so'zga", "uch so'zga", "qisqartmaga"]),
        ("Gap so'zlarining qanday tartibi uzil-kesildir?", "so'z tartibi", ["so'z turkumi", "bo'lak tartibi", "ma'no"]),
        ("Tirnoq («») qanday ma'noda ishlatiladi?", "iqtibos va nomlarda", ["so'roqda", "undovda", "tekislashda"]),
        ("Vergul gapda qanday vazifa bajaradi?", "bo'laklarni ajratadi", ["gapni tugatadi", "so'roq bildiradi", "kesimni qo'shadi"]),
        ("Narsa va buyumlarning nomlarini bildiruvchi so'zlar?", "otlar", ["fe'llar", "ravish", "sifatlar"]),
        ("Harakatni bildiruvchi so'zlar?", "fe'llar", ["otlar", "sifatlar", "sonlar"]),
    ]
    for _ in range(target):
        if len(items) >= target:
            break
        question, ans, wrongs = random.choice(terms)
        _add(items, seen, question, ans, list(wrongs))

    # ── Adabiyot ──
    literary = [
        ("Alisher Navoiy asarining nomi", "Xamsa", ["O'tkan kunlar", "Kecha va kunduz", "Shum bola"]),
        ("Abdulla Qodiriyning mashhur romani", "O'tkan kunlar", ["Xamsa", "Kecha va kunduz", "Boburnoma"]),
        ("«Shum bola» asari muallifi", "G'afur G'ulom", ["Navoiy", "Qodiriy", "Oybek"]),
        ("«Kecha va kunduz» muallifi", "Cho'lpon", ["Navoiy", "Qodiriy", "G'ulom"]),
        ("«Boburnoma» muallifi", "Zahiriddin Muhammad Bobur", ["Navoiy", "Oripov", "Vohidov"]),
        ("«O'tkan kunlar» asarining qahramonlari", "Otabek va Kumush", ["Tohir va Zuhra", "Layli va Majnun", "Farhod va Shirin"]),
        ("«G'urbatda» she'ri muallifi", "Cho'lpon", ["Navoiy", "Oripov", "Vohidov"]),
        ("Ogahiy noma interaqti asari", "Shajaratu-l-atrok", ["Xamsa", "Boburnoma", "O'tkan kunlar"]),
        ("Alisher Navoiyning haqiqiy ismi", "Nizomiddin Mir Alisher", ["Zahiriddin", "O'tabek", "G'azon"]),
        ("Munisa Xonum hofizasining asari", "«O'rtoqlik»", ["«Xamsa»", "«O'tkan kunlar»", "«Boburnoma»"]),
    ]
    for _ in range(target):
        if len(items) >= target:
            break
        question, ans, wrongs = random.choice(literary)
        _add(items, seen, question, ans, list(wrongs))

    return items[:target]
