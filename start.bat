@echo off
chcp 65001 > nul
title TalabaGo — Yagona Akademik Platforma
cd /d "%~dp0"

echo =======================================================
echo          TALABAGO — YAGONA AKADEMIK PLATFORMA
echo =======================================================
echo.

rem ---- 1. Python virtual muhitini tekshirish ----
echo [1/3] Python muhitini sozlash...
if not exist ".venv\Scripts\python.exe" (
    echo Python virtual muhiti yaratilmoqda...
    python -m venv .venv
)

echo Kutubxonalarni tekshirish...
.venv\Scripts\python.exe -m pip install -q -r requirements.txt

rem ---- 2. FastAPI backend serverini ishga tushirish ----
echo [2/3] API server ishga tushirilmoqda (http://127.0.0.1:8000)...
start "TalabaGo API" cmd /k "cd /d ""%~dp0"" && .venv\Scripts\python.exe -m uvicorn server.main:app --host 127.0.0.1 --port 8000 --reload"

rem ---- 3. Frontend paketlari va Next.js ishga tushirish ----
echo [3/3] Web interfeys sozlanmoqda...
if not exist "node_modules" (
    echo Paketlar o'rnatilmoqda (npm install)...
    call npm install
)

echo Next.js ishga tushirilmoqda (http://localhost:3000)...
start "TalabaGo Web" cmd /k "cd /d ""%~dp0"" && npm run dev -- -p 3000"

rem ---- Brauzerda ochish ----
timeout /t 3 /nobreak > nul
echo.
echo =======================================================
echo  TalabaGo muvaffaqiyatli ishga tushdi!
echo  Sayt ochilmoqda: http://localhost:3000
echo =======================================================
start http://localhost:3000
