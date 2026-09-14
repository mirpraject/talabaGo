"""Informatika — maktab (5-11 sinf)."""
import random
from .base import q, _add, _num_wrong, TARGET_PER_GRADE


_CS = [
    ("Kompyuterning miyasi deb ataladigan qism", "Protsessor (CPU)", ["Monitor", "Klaviatura", "Printer"]),
    ("Axborotni saqlash qurilmasi", "Xotira (RAM/HDD)", ["Monitor", "Klaviatura", "Sichqoncha"]),
    ("Ma'lumot chiqarish qurilmasi", "Printer", ["Sichqoncha", "Klaviatura", "Mikrofon"]),
    ("Ma'lumot kiritish qurilmasi", "Klaviatura", ["Printer", "Monitor", "Dinamik"]),
    ("HTML nima?", "Veb-sahifa yaratish tili", ["Dasturlash o'yini", "Operatsion sistema", "Baza"]),
    ("CPU tezligi o'lchov birligi", "Gigagers (GHz)", ["Megabayt", "Gigabayt", "Bit"]),
    ("Fayl hajmi o'lchov birligi", "Bayt", ["Gers", "Volt", "Nyuton"]),
    ("Kompyuterni boshqaruvchi asosiy dastur", "Operatsion sistema", ["Brauzer", "O'yin", "Antivirus"]),
    ("Internetga ulanish qurilmasi", "Modem/Router", ["Printer", "Skanner", "Klaviatura"]),
    ("Kodlash tizimi ASCII necha bit?", "8 bit", ["4 bit", "2 bit", "16 bit"]),
]


def gen_informatika(target=350):
    items, seen = [], set()

    for _ in range(target):
        if len(items) >= target:
            break
        question, ans, wrongs = random.choice(_CS)
        _add(items, seen, question, ans, list(wrongs))

    # Son tizimlar (ikkilik)
    for _ in range(target):
        if len(items) >= target:
            break
        n = random.randint(1, 15)
        b = bin(n)[2:]
        _add(items, seen,
             f"{n} sonining ikkilik ko'rinishi?",
             b, [bin(n+1)[2:], bin(n-1)[2:] if n > 1 else "0", bin(n+2)[2:]])

    # Birliklar
    units = [
        ("1 kilobayt (KB) = ?", "1024 bayt", ["1000 bayt", "100 bayt", "2048 bayt"]),
        ("1 megabayt (MB) = ?", "1024 KB", ["1000 KB", "10 KB", "2048 KB"]),
        ("1 gigabayt (GB) = ?", "1024 MB", ["1000 MB", "10 MB", "2048 MB"]),
    ]
    for _ in range(target):
        if len(items) >= target:
            break
        question, ans, wrongs = random.choice(units)
        _add(items, seen, question, ans, list(wrongs))

    # Psevdokod tekshiruv
    for _ in range(target):
        if len(items) >= target:
            break
        a, b = random.randint(2, 10), random.randint(2, 10)
        op = random.choice(["+", "-", "*"])
        ans = eval(f"{a}{op}{b}")
        _add(items, seen,
             f"Dastur: a={a}, b={b}; natija = a {op} b. Natija?",
             str(ans), _num_wrong(ans))

    return items[:target]
