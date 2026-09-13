"""Tarix — maktab (5-11 sinf)."""
import random
from .base import q, _add, TARGET_PER_GRADE


_HISTORY = [
    ("O'zbekiston Respublikasi mustaqillikka erishgan yil", "1991", ["1990", "1992", "1989"]),
    ("Amir Temur davlati poytaxti", "Samarqand", ["Buxoro", "Toshkent", "Xiva"]),
    ("Alisher Navoiy yashagan davr shohi", "Husayn Boyqaro", ["Bobur", "Temur", "Ulug'bek"]),
    ("Ulug'bek rasadxonasi qurilgan shahar", "Samarqand", ["Buxoro", "Toshkent", "Xiva"]),
    ("«Avesto» kitobi qaysi davrda bitilgan", "Qadimgi Xorazm", ["Baqtriya", "So'g'diyona", "Partiya"]),
    ("Zardushtiylik muqaddas kitobi", "Avesto", ["Qur'on", "Injil", "Torot"]),
    ("Chingizxonning imperiyasi qaysi hududda tashkil bo'lgan", "Mo'g'uliston", ["Xitoy", "Hindiston", "Eron"]),
    ("Xiva xonligining poytaxti", "Xiva", ["Buxoro", "Qo'qon", "Toshkent"]),
    ("Buxoro amirligining poytaxti", "Buxoro", ["Xiva", "Qo'qon", "Toshkent"]),
    ("Qo'qon xonligining poytaxti", "Qo'qon", ["Buxoro", "Xiva", "Toshkent"]),
    ("Toshkentdagi metropoliten ochilgan yil", "1977", ["1966", "1980", "1975"]),
    ("Toshkent zilzilasi yili", "1966", ["1977", "1956", "1990"]),
    ("«Boburnoma» asarining muallifi", "Zahiriddin Muhammad Bobur", ["Navoiy", "Ulug'bek", "Temur"]),
    ("Jaloliddin Manguberdi jang qilgan daryo", "Hind daryosi", ["Sirdaryo", "Amudaryo", "Nil"]),
    ("Mustaqillik bayrog'i qabul qilingan yil", "1991", ["1990", "1992", "1995"]),
    ("O'zbekiston SSR tashkil topgan yil", "1924", ["1917", "1930", "1941"]),
    ("Ilk o'simlik va hayvonlarning nomi", "Flora va fauna", ["Kosmik jism", "Meteorit", "Vulqon"]),
    ("Somoniy va Tohiriy sulolalari boshlangan yil", "819", ["900", "1000", "750"]),
    ("Qadimgi Xorazm davlati markazi", "Xorazm", ["So'g'd", "Baqtriya", "Farg'ona"]),
    ("O'zbekistonning BMTga a'zo bo'lgan yil", "1992", ["1991", "1993", "1995"]),
]


def gen_tarix(target=350):
    items, seen = [], set()

    for _ in range(target):
        if len(items) >= target:
            break
        question, ans, wrongs = random.choice(_HISTORY)
        _add(items, seen, question, ans, list(wrongs))

    # Muallif-asar juftlik
    pairs = [
        ("Alisher Navoiy", "Xamsa"),
        ("Abdulla Qodiriy", "O'tkan kunlar"),
        ("Cho'lpon", "Kecha va kunduz"),
        ("Bobur", "Boburnoma"),
        ("Ulug'bek", "Ziji Ko'raganiy"),
        ("Ibn Sino", "Tib qonunlari"),
        ("Al-Xorazmiy", "Al-jabr val-Muqobala"),
    ]
    for _ in range(target):
        if len(items) >= target:
            break
        a, w = random.choice(pairs)
        wrongs = [x for x2, w2 in pairs if (x2, w2) != (a, w) for x in [w2]][:3]
        _add(items, seen,
             f"«{w}» asarining muallifi kim?",
             a, wrongs)

    # ── Yil-savollari ──
    year_questions = [
        ("O'zbekiston mustaqillik yili", "1991", ["1989", "1990", "1992"]),
        ("Toshkent metropoliteni ochilgan yil", "1977", ["1966", "1975", "1980"]),
        ("Toshkentdagi zilzila sodir bo'lgan yil", "1966", ["1964", "1977", "1970"]),
        ("O'zbekiston SSR tuzilgan yil", "1924", ["1917", "1930", "1940"]),
        ("Amir Temur tug'ilgan yil", "1336", ["1405", "1370", "1300"]),
        ("Navoiy tug'ilgan yil", "1441", ["1500", "1420", "1336"]),
        ("Samarqandga Amir Temurning poytaxt ko'chishi", "1370", ["1405", "1336", "1449"]),
        ("Jaloliddin Manguberdi vafot etgan yil", "1231", ["1221", "1219", "1245"]),
        ("Chingizxon Xorazmga bostirib kirgan yil", "1219", ["1221", "1231", "1200"]),
        ("Ulug'bek rasadxonasi qurilgan yil", "1420", ["1449", "1405", "1336"]),
    ]
    for _ in range(target):
        if len(items) >= target:
            break
        question, ans, wrongs = random.choice(year_questions)
        _add(items, seen, question, ans, list(wrongs))

    # ── Davlat-shahar / shoh-user ──
    rulers = [
        ("Amir Temur imperiyasining poytaxti", "Samarqand", ["Buxoro", "Xiva", "Toshkent"]),
        ("Buxoro amirligining poytaxti", "Buxoro", ["Samarqand", "Xiva", "Qo'qon"]),
        ("Xiva xonligining poytaxti", "Xiva", ["Buxoro", "Qo'qon", "Toshkent"]),
        ("Qo'qon xonligining poytaxti", "Qo'qon", ["Buxoro", "Xiva", "Samarqand"]),
        ("Ashtarxoniy sulolasi hukumronlik qilgan davlat", "Buxoro xonligi", ["Xiva xonligi", "Qo'qon xonligi", "Temuriylar"]),
        ("Muhammad Rahimxon II hukmronlik qilgan hudud", "Xiva xonligi", ["Buxoro amirligi", "Qo'qon xonligi", "Rossiya"]),
        ("Sohibqiron nomi bilan mashhur shoh", "Amir Temur", ["Shohruh", "Ulug'bek", "Bobur"]),
        ("Husayn Boyqaro hukmronlik qilgan davlat", "Hirot (Temuriylar)", ["Buxoro", "Samarqand", "Xiva"]),
    ]
    for _ in range(target):
        if len(items) >= target:
            break
        question, ans, wrongs = random.choice(rulers)
        _add(items, seen, question, ans, list(wrongs))

    # ── Jadid tarixi ──
    jadids = [
        ("Jadidchilik harakati asoschi namoyandasi", "Mahmudxo'ja Behbudiy", ["G'afur G'ulom", "Hamza", "Oybek"]),
        ("«Samarkand» gazetasini asoschisi", "Mahmudxo'ja Behbudiy", ["Abdulla Avloniy", "Hamza", "Munavvarqori"]),
        ("«Turkiy guliston yoxud axloq» asar muallifi", "Abdulla Avloniy", ["Behbudiy", "Hamza", "Fitrat"]),
        ("«Maktabni kim ta'minlaydi?» muallifi", "Fitrat", ["Avloniy", "Behbudiy", "Hamza"]),
        ("Qo'qon jadid maktabini ochgan", "Hamza", ["Behbudiy", "Avloniy", "Fitrat"]),
        ("«Padarkush» dramasi muallifi", "Hamza", ["Behbudiy", "Avloniy", "Fitrat"]),
    ]
    for _ in range(target):
        if len(items) >= target:
            break
        question, ans, wrongs = random.choice(jadids)
        _add(items, seen, question, ans, list(wrongs))

    return items[:target]
