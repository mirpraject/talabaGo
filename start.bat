@echo off
chcp 65001 > nul
title StudentHUB — Akademik Platforma
cd /d "%~dp0"

echo =======================================================
echo          STUDENTHUB — AKADEMIK PLATFORMA
echo =======================================================
echo.

rem ---- 1. Backend Python muhitini tekshirish va sozlash ----
echo [1/3] Backend muhitini sozlash...
if not exist "backend\.venv\Scripts\python.exe" (
    echo Python virtual muhiti yaratilmoqda...
    python -m venv backend\.venv
)

echo Backend kutubxonalarini tekshirish...
backend\.venv\Scripts\python.exe -m pip install -q -r backend\requirements.txt

rem ---- 2. FastAPI backend serverini ishga tushirish ----
echo [2/3] FastAPI backend ishga tushirilmoqda (http://localhost:8000)...
start "StudentHUB Backend (FastAPI)" cmd /k "cd /d ""%~dp0backend"" && .venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

rem ---- 3. Frontend bog'liqliklarini tekshirish va ishga tushirish ----
echo [3/3] Frontend sozlanmoqda...
if not exist "frontend\node_modules" (
    echo Frontend paketlari o'rnatilmoqda (npm install)...
    cd frontend
    call npm install
    cd ..
)

echo Next.js frontend ishga tushirilmoqda (http://localhost:3000)...
start "StudentHUB Frontend (Next.js)" cmd /k "cd /d ""%~dp0frontend"" && npm run dev -- -p 3000"

rem ---- Saytni brauzerda ochish ----
timeout /t 3 /nobreak > nul
echo.
echo =======================================================
echo  StudentHUB muvaffaqiyatli ishga tushdi!
echo  Brauzer ochilmoqda: http://localhost:3000
echo =======================================================
start http://localhost:3000
