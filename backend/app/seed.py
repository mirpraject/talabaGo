"""Boshlang'ich ma'lumotlarni bazaga to'ldirish.

Ishga tushirish:
    cd backend
    python -m app.seed
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session

from app.database import SessionLocal, Base, engine
from app.models import University, Faculty, Subject, File
from app.models.user import User
from app.security import hash_password


def seed(db: Session) -> None:
    Base.metadata.create_all(bind=engine)

    if db.query(User).count() == 0:
        admin = User(
            email="admin@studenthub.uz",
            username="admin",
            full_name="Administrator",
            hashed_password=hash_password("admin123"),
            is_admin=True,
        )
        db.add(admin)
    else:
        admin = db.query(User).filter(User.username == "admin").first()

    universities = [
        ("Toshkent Davlat Pedagogika Universiteti", "TDPU", "Toshkent"),
        ("Toshkent Axborot Texnologiyalari Universiteti", "TATU", "Toshkent"),
        ("O'zbekiston Milliy Universiteti", "O'zMU", "Toshkent"),
        ("O'zbekiston Xalqaro Islom Akademiyasi", "O'XIA", "Toshkent"),
        ("Samarqand Davlat Universiteti", "SamDU", "Samarqand"),
        ("Toshkent Davlat Texnika Universiteti", "TDTU", "Toshkent"),
        ("Toshkent Davlat Iqtisodiyot Universiteti", "TDIU", "Toshkent"),
        ("Andijon Davlat Universiteti", "ADU", "Andijon"),
        ("Namangan Davlat Universiteti", "NamDU", "Namangan"),
        ("Buxoro Davlat Universiteti", "BuxDU", "Buxoro"),
    ]

    for name, short, city in universities:
        if not db.query(University).filter(University.short_name == short).first():
            db.add(University(name=name, short_name=short, city=city))

    db.commit()

    subjects = [
        "Algebra",
        "Analitik Geometriya",
        "Matematik Analiz",
        "Dasturlash",
        "Fizika",
        "Kimyo",
        "Informatika",
        "Ingliz tili",
        "Ona tili va adabiyot",
        "Tarix",
        "Geografiya",
        "Biyologiya",
        "Iqtisodiyot",
        "Falsafa",
        "Pedagogika",
        "Psixologiya",
    ]
    for name in subjects:
        if not db.query(Subject).filter(Subject.name == name).first():
            db.add(Subject(name=name))

    db.commit()

    tdp = db.query(University).filter(University.short_name == "TDPU").first()
    if tdp and db.query(Faculty).filter(Faculty.university_id == tdp.id).count() == 0:
        db.add_all([
            Faculty(university_id=tdp.id, name="Matematika-Informatika"),
            Faculty(university_id=tdp.id, name="Fizika"),
            Faculty(university_id=tdp.id, name="Filologiya"),
        ])
        db.commit()

    faculty_sets = {
        "TATU": ["Kompyuter injiniringi", "Telekommunikatsiya texnologiyalari"],
        "O'zMU": ["Matematika", "Fizika", "Iqtisodiyot", "Jurnalistika"],
        "SamDU": ["Tabiiy fanlar", "Ijtimoiy fanlar", "Pedagogika"],
        "TDTU": ["Energiya tizimlari", "Mexanika", "Qurilish"],
        "TDIU": ["Iqtisodiyot", "Moliya", "Marketing"],
        "ADU": ["Fizika-matematika", "Filologiya"],
        "NamDU": ["Tabiiy fanlar", "Pedagogika", "Filologiya"],
        "BuxDU": ["Filologiya", "Tarix va geografiya"],
    }
    for short, names in faculty_sets.items():
        uni = db.query(University).filter(University.short_name == short).first()
        if not uni:
            continue
        existing = {
            f.name for f in db.query(Faculty).filter(Faculty.university_id == uni.id).all()
        }
        for name in names:
            if name not in existing:
                db.add(Faculty(university_id=uni.id, name=name))
    db.commit()

    seed_content_files(db, admin)

    print("Seed ma'lumotlar muvaffaqiyatli to'ldirildi!")


SEED_LIBRARY = [
    {
        "type": "notes",
        "subject": "Matematik Analiz",
        "title": "Matematik Analiz — 1-semestr to'liq konspekti",
        "description": "Funksiya limiti, uzluksizlik, hosila va differensial hisob bo'yicha to'liq tartibli konspekt.",
        "content": """MATEMATIK ANALIZ — 1-SEMESTR TO'LIQ KONSPEKTI
Muallif: TDPU Matematika kafedrasi

1-Mavzu. Haqiqiy sonlar to'plami va ketma-ketliklar
- Chegaralangan to'plamlar, aniq yuqori va aniq quyi chegaralar (supremum, infimum).
- Ketma-ketlik limiti va uning xossalari. Veyershtrass teoremasi.

2-Mavzu. Funksiya limiti va uzluksizligi
- Koshi va Geyne bo'yicha funksiya limiti ta'rifi.
- Ajoyib limitlar: lim(x->0) sin(x)/x = 1 va lim(x->inf) (1 + 1/x)^x = e.
- Uzluksiz funksiyalarning asosiy teoremalari (Bolsano-Koshi, Veyershtrass).

3-Mavzu. Hosila va differensial
- Hosila ta'rifi va geometrik ma'nosi. Urinma tenglamasi: y - y0 = f'(x0)(x - x0).
- Differensiallash qoidalari: yig'indi, ko'paytma, bo'linma va murakkab funksiya hosilasi.
- Lopital qoidasi orqali 0/0 va inf/inf aniqmasliklarni ochish.

Konspekt imtihonlarga va oraliq nazoratlarga tayyorgarlik uchun tavsiya etiladi.""",
    },
    {
        "type": "midterm",
        "subject": "Dasturlash",
        "title": "Dasturlash (Python) — Oraliq Nazorat (ON) savollari va test biletlari",
        "description": "Oraliq nazorat uchun 20 ta rasmiy test savoli, kodli topshiriqlar va namunaviy yechimlar.",
        "content": """DASTURLASH (PYTHON) — ORALIQ NAZORAT (ON) BILETLARI
Kafedra: Axborot texnologiyalari va dasturlash

1-VARIANT
1-Savol. Python'da list va tuple orasidagi farq nima?
Javob: List o'zgaruvchan (mutable), tuple esa o'zgarmas (immutable). Tuple xotirada kam joy oladi va tezroq ishlaydi.

2-Savol. Quyidagi kod natijasi nima bo'ladi?
nums = [1, 2, 3, 4, 5]
print([x**2 for x in nums if x % 2 == 0])
Javob: [4, 16] (Faqat juft sonlarning kvadratlari).

3-Savol. *args va **kwargs vazifasi nima?
Javob: *args ixtiyoriy sondagi pozitsion argumentlarni tuple ko'rinishida, **kwargs esa nomlangan argumentlarni dict ko'rinishida qabul qiladi.

4-Amaliy masala: Berilgan satrdagi unli harflar sonini hisoblovchi funksiya yozing.
Yechim:
def count_vowels(s):
    vowels = "aeiouAEIOU"
    return sum(1 for ch in s if ch in vowels)

5-Nazorat topshirig'i: Rekursiya orqali faktorialni hisoblash:
def fact(n):
    return 1 if n <= 1 else n * fact(n - 1)""",
    },
    {
        "type": "final",
        "subject": "Fizika",
        "title": "Fizika — Yakuniy Nazorat (YaN) imtihon testlari va yechimlari",
        "description": "Yakuniy nazorat imtihoni uchun 25 ta tasdiqlangan nazariy savol va masalalar to'plami.",
        "content": """FIZIKA — YAKUNIY NAZORAT (YaN) SAVOLLAR VA YEChIMLAR TO'PLAMI
Bosqich: Yakuniy baholash (100 ballik tizim)

1. Nyutonning ikkinchi qonuni differensial shaklda: F = dp/dt. Agar massa o'zgarmas bo'lsa: F = m*a.
2. Energiya saqlanish qonuni: Yopiq tizimda to'liq mexanik energiya (Ek + Ep) o'zgarmas saqlanadi.
3. Termodinamikaning birinchi qonuni: Q = delta_U + A (Tizimga berilgan issiqlik ichki energiyani oshirishga va ish bajarishga sarflanadi).
4. Karno sikli F.I.K: eta = (T1 - T2) / T1.
5. Kulon qonuni: F = k * (|q1*q2|) / r^2.
6. Om qonuni to'liq zanjir uchun: I = E / (R + r).
7. Lorens kuchi: F_l = q * [v x B].
8. Elektromagnit induksiya qonuni (Faradey): E_i = -d(Phi)/dt.

Imtihon topshiruvchi talabalar formulalarning birliklari va qo'llanish sohalarini to'liq o'zlashtirishlari lozim.""",
    },
    {
        "type": "lectures",
        "subject": "Algebra",
        "title": "Algebra va Geometriya — Ma'ruzalar matni to'plami (1-12 ma'ruza)",
        "description": "Matritsalar, determinantlar, chiziqli fazolar va chiziqli almashtirishlar ma'ruza kursi.",
        "content": """ALGEBRA VA GEOMETRIYA — MA'RUZALAR MATNI
Kurs: 1-kurs talabalari uchun ma'ruza kursi

1-Ma'ruza. Matritsalar va ular ustida amallar
- Matritsa turlari: kvadrat, diagonal, birlik, simmetrik.
- Matritsalarni qo'shish va songa ko'paytirish xossalari.
- Matritsalar ko'paytmasi va uning no-kommutativligi (AB != BA).

2-Ma'ruza. Determinantlar nazariyasi
- 2 va 3-tartibli determinantlar, Sarrus qoidasi.
- Determinant xossalari: qatorlar almashtirilishi, proporsionallik, nollik.
- Minor va algebraik to'ldiruvchilar. Laplas teoremasi.

3-Ma'ruza. Chiziqli algebraik tenglamalar sistemasi (ChATS)
- Kramer qoidasi.
- Teskari matritsa usuli: X = A^(-1) * B.
- Gauss usuli va uning afzalliklari.

Barcha ma'ruzalar Oliy ta'lim vazirligi namunaviy o'quv dasturi asosida tuzilgan.""",
    },
    {
        "type": "lab",
        "subject": "Informatika",
        "title": "Informatika — Laboratoriya ishlari va hisobotlari to'plami",
        "description": "SQL ma'lumotlar bazasi, tarmoq protokollari va algoritmlar bo'yicha 6 ta laboratoriya ishi.",
        "content": """INFORMATIKA VA AXBOROT TEXNOLOGIYALARI — LABORATORIYA ISHLARI

1-Laboratoriya: Relyatsion ma'lumotlar bazasi loyihalash (ER-diagramma).
- Entity, Attribute, Primary Key va Foreign Key tushunchalari.
- 1-to-1, 1-to-many, many-to-many munosabatlarni o'rnatish.

2-Laboratoriya: SQL DDL va DML buyruqlari.
- CREATE TABLE, ALTER TABLE, DROP TABLE.
- INSERT, SELECT, UPDATE, DELETE amallari.
- JOIN turlari: INNER JOIN, LEFT JOIN, RIGHT JOIN.

3-Laboratoriya: Tarmoq asoslari va IP manzillash.
- OSI 7 qatlamli modeli.
- IPv4 va IPv6 arxitekturasi, subnet mask hisoblash.
- Ping, traceroute va nslookup yordamida diagnostika qilish.

Har bir laboratoriya ishi uchun hisobot namunasi va xulosalar keltirilgan.""",
    },
    {
        "type": "book",
        "subject": "Algebra",
        "title": "Algebra darsligi — 1-kurs kirish",
        "description": "Algebra fanidan kirish bo'limi: ko'phadlar, tenglamalar va tengsizliklar asoslari.",
        "content": """ALGEBRA — 1-KURS KIRISH BO'LIMI
1. Ko'phadlar
2. Chiziqli tenglamalar
3. Kvadrat tenglamalar va tengsizliklar.""",
    },
]


def seed_content_files(db: Session, admin: User) -> None:
    uploads_dir = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads"
    )
    os.makedirs(uploads_dir, exist_ok=True)

    uni = db.query(University).filter(University.short_name == "TDPU").first()
    if not uni:
        return
    if not admin:
        return

    for item in SEED_LIBRARY:
        exists = (
            db.query(File)
            .filter(File.title == item["title"])
            .first()
        )
        if exists:
            continue
        subject = db.query(Subject).filter(Subject.name == item["subject"]).first()
        if not subject:
            continue
        fname = item["title"].replace(" ", "_")[:40] + ".txt"
        fpath = os.path.join(uploads_dir, fname)
        with open(fpath, "w", encoding="utf-8") as f:
            f.write(item["content"])
        db.add(File(
            title=item["title"],
            description=item["description"],
            file_type=item["type"],
            file_path=fpath,
            file_size=os.path.getsize(fpath),
            university_id=uni.id,
            subject_id=subject.id,
            uploader_id=admin.id,
            downloads=1,
            views=5,
        ))
    db.commit()


if __name__ == "__main__":
    db = SessionLocal()
    try:
        seed(db)
    finally:
        db.close()