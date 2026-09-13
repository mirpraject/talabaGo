# 🎓 TalabaGo — O'zbekiston Talabalari uchun Yagona Akademik Platforma

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?style=flat&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%20%2F%20SQLite-336791?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Deploy-Docker%20Compose-2496ED?style=flat&logo=docker)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**TalabaGo** — O'zbekiston oliy va o'rta maxsus ta'lim talabalari uchun konspektlar, laboratoriya ishlari, oraliq/yakuniy nazorat savollari, onlayn testlar, AI referat generatori va yulduzlar (mukofot) tizimini o'z ichiga olgan zamonaviy akademik ekotizim.

---

## 🌟 Asosiy Imkoniyatlar

- 📚 **Akademik Resurslar Bazasi:** OTM, fakultet, fan va kurslar bo'yicha saralangan 100 000+ o'quv materiallari.
- ⚡ **2-Qatorli Zamonaviy Navigatsiya:** Kategoriyalar, e'lonlar lentasi (NewsTicker) va qulay sub-menyu.
- 🧠 **AI Yordamchi:** Referatlar, slaydlar va avtomatik test savollari generatori (Gemini / GPT).
- ⭐ **Yulduzlar & Mukofot Tizimi:** Foydali konspekt yuklagan talabalarga yulduzlar berish va pul yechib olish.
- 👑 **VIP Premium Obuna:** Eksklyuziv materiallar va tezkor yuklab olish imkoniyati.
- 🛡️ **Zamonaviy Admin Boshqaruv Markazi:**
  - Foydalanuvchilar hisobini **Muzlatish (Freeze)** va **Faollashtirish (Unfreeze)**.
  - Qoidabuzarlarni sabab ko'rsatgan holda **Bloklash (Block)** va **Blokdan chiqarish**.
  - Foydalanuvchi va bog'liq fayllarni **Xavfsiz O'chirish (Delete)**.
  - Talabalar balansi va yulduzlarini boshqarish (`± Yulduz`).
  - Talaba ID orqali to'liq faoliyat inspektori (yuklagan fayllari, pul yechishlari).

---

## 🚀 1. Yagona Serverga O'rnatish (Production Single-Server Deploy)

Loyihada **Backend (FastAPI)**, **Frontend (Next.js)**, **Ma'lumotlar Bazasi (PostgreSQL)** va **Nginx Reverse Proxy** bitta serverda yaxlit holda ishlaydi. 

### 1-Usul: Docker Compose (Tavsiya etiladi)

Yangi VPS (Ubuntu/Debian) serverda:

```bash
# 1. Loyihani yuklab oling
git clone https://github.com/USERNAME/talabago.git
cd talabago

# 2. Muhit sozlamalarini tayyorlang
cp .env.example .env
nano .env # (Kerakli parollarni o'zgartiring)

# 3. Yagona serverda ishga tushiring
docker compose up -d --build
```

Yoki avtomatik skript orqali:
```bash
chmod +x deploy.sh
./deploy.sh
```

Barcha xizmatlar yagona **`80`** portida (yoki SSL o'rnatilgach `443` da) ishlaydi:
- **Veb-sayt va Admin:** `http://SERVER_IP`
- **Backend API:** `http://SERVER_IP/api`
- **API Hujjatlari:** `http://SERVER_IP/docs`

---

## 💻 2. Mahalliy Dasturchi Rejimida Ishga Tushirish (Local Development)

### 1-usul: Birlashgan Skript Orqali (1 ta buyruq)

```bash
# Windows / Linux / macOS
python run.py
```
*(Windows foydalanuvchilari `start.bat` faylini ikki marta bosishlari ham mumkin).*

### 2-usul: Alohida Ishga Tushirish

#### Backend (FastAPI):
```bash
cd backend
python -m venv .venv
# Windows:
.\.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env

# Bazani birlamchi ma'lumotlar bilan to'ldirish
python seed.py

# Serverni ishga tushirish
uvicorn app.main:app --port 8000 --reload
```

#### Frontend (Next.js):
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

---

## 🔑 Administrator Hisobi

Birlamchi administrator hisobi `.env` faylidagi `ADMIN_USERNAME` va `ADMIN_PASSWORD` orqali yoki bazani ishga tushirishda (`python backend/seed.py`) avtomatik sozlanadi:

- **Kirish manzili:** [http://localhost:3000/admin](http://localhost:3000/admin) (yoki `http://localhost:3000/login`)
- **Standart login:** `.env` da belgilangan login (masalan: `admin`)
- **Standart parol:** `.env` da belgilangan parol (masalan: `admin123`)
- **Xavfsizlik eslatmasi:** Ishlab chiqarish (Production) serveriga o'rnatilgach, parolni darhol o'zgartiring!

---

## ⚙️ Muhit Sozlamalari (.env)

Xavfsizlik uchun maxfiy kalitlar GitHub'ga yuklanmaydi. `.env.example` faylidan nusxa oling:

| O'zgaruvchi | Tavsif | Standart qiymat |
|-------------|--------|-----------------|
| `DATABASE_URL` | Ma'lumotlar bazasi ulanish manzili | `sqlite:///studenthub.db` yoki PostgreSQL |
| `SECRET_KEY` | JWT token shifrlash kaliti | *(Productionda o'zgartiring!)* |
| `ALGORITHM` | Shifrlash algoritmi | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Sessiya muddati (daqiqa) | `1440` (24 soat) |
| `OPENAI_API_KEY` | Google Gemini yoki OpenAI API kaliti | `—` |
| `OPENAI_BASE_URL` | AI API provayder manzili | `https://generativelanguage.googleapis.com/v1beta/openai` |
| `OPENAI_MODEL` | AI modeli | `gemini-2.5-flash` |
| `NEXT_PUBLIC_API_URL` | Frontend API manzili | Nginx uchun bo'sh, local uchun `http://127.0.0.1:8000` |

---

## 🔒 Xavfsizlik Qoidalari (Security)

1. Hech qachon `.env`, `.env.local` yoki `.env.production` fayllarini GitHub'ga yubormang (`.gitignore` himoyalangan).
2. SQLite fayllari (`*.db`, `*.sqlite`) `.gitignore` ga kiritilgan. Yangi bazani to'ldirish uchun `python backend/seed.py` dan foydalaning.
3. Serverda `RateLimiterMiddleware` va `RequestSizeLimiterMiddleware` (50MB) doimiy ravishda DoS hujumlaridan himoya qiladi.

---

## 📄 Litsenziya

MIT License. O'zbekiston ta'limini rivojlantirish maqsadida ochiq kodli yaratilgan.