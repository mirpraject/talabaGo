"""
TalabaGo — Ma'lumotlar Bazasini Dastlabki To'ldirish (Database Seeder)
GitHub'dan loyiha klon qilinganda yoki yangi serverga o'rnatilganda 
birlamchi admin va asosiy ma'lumotlarni bazaga yozadi.

Ishga tushirish:
    python seed.py
"""

import sys
import os

# Backend ildiz yo'lini qo'shish
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, init_db
from app.models import User, University, Faculty, Subject, Announcement
from app.security import hash_password


def seed_database():
    print("=" * 60)
    print("   🌱 TalabaGo — Ma'lumotlar bazasini to'ldirish (Seeding)")
    print("=" * 60)

    # 1. Jadvallarni yaratish
    init_db()
    db = SessionLocal()

    admin_username = os.environ.get("ADMIN_USERNAME", "admin")
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    admin_fullname = os.environ.get("ADMIN_FULLNAME", "Bosh Administrator")

    try:
        # 2. Bosh Adminni tekshirish yoki yaratish
        admin = db.query(User).filter(User.username == admin_username).first()
        if not admin:
            admin = User(
                username=admin_username,
                full_name=admin_fullname,
                student_id="T000001",
                hashed_password=hash_password(admin_password),
                is_admin=True,
                is_premium=True,
                is_active=True,
                is_blocked=False,
                stars=100.0,
                avatar_url="https://api.dicebear.com/7.x/bottts/svg?seed=T000001",
            )
            db.add(admin)
            print(f"[+] Administrator yaratildi: {admin_username}")
        else:
            admin.is_admin = True
            admin.is_premium = True
            admin.is_active = True
            admin.is_blocked = False
            print(f"[*] Administrator '{admin_username}' bazada mavjud.")

        # 4. Asosiy Universitetlar
        unis_data = [
            ("Toshkent axborot texnologiyalari universiteti", "TATU", "Toshkent"),
            ("Mirzo Ulug'bek nomidagi O'zbekiston Milliy universiteti", "O'zMU", "Toshkent"),
            ("Toshkent davlat iqtisodiyot universiteti", "TDIU", "Toshkent"),
            ("Samarqand davlat universiteti", "SamDU", "Samarqand"),
            ("Farg'ona davlat universiteti", "FarDU", "Farg'ona"),
        ]

        created_unis = {}
        for name, short, city in unis_data:
            existing = db.query(University).filter(University.short_name == short).first()
            if not existing:
                u = University(name=name, short_name=short, city=city)
                db.add(u)
                db.flush()
                created_unis[short] = u
                print(f"[+] Universitet qo'shildi: {short}")
            else:
                created_unis[short] = existing

        # 5. Namunaviy Fanlar
        subjects_data = [
            "Dasturlash asoslari (Python / C++)",
            "Algoritmlar va ma'lumotlar tuzilmalari",
            "Ma'lumotlar bazasi (SQL / PostgreSQL)",
            "Oliy matematika va Ehtimollar nazariyasi",
            "Kiberxavfsizlik asoslari",
            "Iqtisodiyot nazariyasi",
            "Falsafa va Mantiq",
        ]
        for sub_name in subjects_data:
            existing_sub = db.query(Subject).filter(Subject.name == sub_name).first()
            if not existing_sub:
                s = Subject(name=sub_name)
                db.add(s)
                print(f"[+] Fan qo'shildi: {sub_name}")

        # 6. E'lonlar va Ticker
        announcements_data = [
            ("TalabaGo 2.0 ishga tushdi — 100 000+ o'quv materiallari va testlar!", "news", "YANGILIK", "/files"),
            ("Foydali konspekt yuklang va har bir yuklab olish uchun pul ishlang!", "ad", "REKLAMA", "/rewards"),
            ("AI referat va slayd tayyorlash vositasi ishga tushirildi!", "update", "YANGILANISH", "/tools/report"),
        ]
        for title, atype, badge, link in announcements_data:
            existing_ann = db.query(Announcement).filter(Announcement.title == title).first()
            if not existing_ann:
                a = Announcement(title=title, type=atype, badge_text=badge, link_url=link, is_active=True, priority=1)
                db.add(a)

        db.commit()
        print("=" * 60)
        print("   ✅ Ma'lumotlar bazasi muvaffaqiyatli tayyorlandi!")
        print(f"   Administrator hisobi: {admin_username}")
        print("   Parol: ADMIN_PASSWORD muhit o'zgaruvchisida belgilangan")
        print("=" * 60)

    except Exception as e:
        db.rollback()
        print(f"[-] Xatolik: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
