#!/usr/bin/env bash
# ==============================================================================
# TalabaGo — Yagona Server Ishga Tushirish Skripti (Start Script)
# Backend (FastAPI: 8000) + Frontend (Next.js: $PORT)
# ==============================================================================

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "======================================================="
echo "         TALABAGO — SERVER ISHGA TUSHIRISH"
echo "======================================================="

# 1. Python buyrug'ini aniqlash yoki avtomatik o'rnatish
PYTHON_CMD=""
if command -v python3 &>/dev/null; then
    PYTHON_CMD="python3"
elif command -v python &>/dev/null; then
    PYTHON_CMD="python"
else
    echo "[!] Python topilmadi. Avtomatik o'rnatilmoqda..."
    if command -v apt-get &>/dev/null; then
        apt-get update && apt-get install -y python3 python3-pip python3-venv
        PYTHON_CMD="python3"
    elif command -v apk &>/dev/null; then
        apk add --no-cache python3 py3-pip py3-virtualenv
        PYTHON_CMD="python3"
    else
        echo "[-] Xatolik: Tizimda Python topilmadi. Iltimos, serverga Python 3 o'rnating yoki Docker'dan foydalaning."
        exit 1
    fi
fi

echo "[*] Python aniqlandi: $($PYTHON_CMD --version)"

# 2. Backend muhitini sozlash
echo "[1/3] Backend sozlanmoqda..."
if [ ! -d "backend/.venv" ]; then
    echo "[*] Virtual muhit yaratilmoqda..."
    $PYTHON_CMD -m venv backend/.venv || true
fi

if [ -f "backend/.venv/bin/pip" ]; then
    PIP_BIN="backend/.venv/bin/pip"
    UVICORN_BIN="backend/.venv/bin/uvicorn"
    PYTHON_RUN="backend/.venv/bin/python"
else
    PIP_BIN="pip3"
    UVICORN_BIN="uvicorn"
    PYTHON_RUN="$PYTHON_CMD"
fi

$PIP_BIN install -q -r backend/requirements.txt || pip install -q -r backend/requirements.txt || true

# Bazani birlamchi ma'lumotlar bilan to'ldirish (agar mavjud bo'lmasa)
$PYTHON_RUN backend/seed.py || python3 backend/seed.py || true

# 3. Frontendni sozlash va tayyorlash
echo "[2/3] Frontend tayyorlanmoqda..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
fi

# Build (agar .next papkasi mavjud bo'lmasa)
if [ ! -d ".next" ]; then
    echo "[*] Next.js loyiha yig'ilmoqda (build)..."
    npm run build
fi
cd ..

# 4. Serverlarni yagona tizim sifatida ishga tushirish
PUBLIC_PORT="${PORT:-3000}"
echo "[3/3] Serverlar ishga tushirilmoqda..."

# Backend FastAPI (ichki 127.0.0.1:8000 da ishlaydi)
$UVICORN_BIN app.main:app --app-dir backend --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

# Frontend Next.js (tashqi $PUBLIC_PORT da tinglaydi va /api so'rovlarini 8000 ga proksi qiladi)
cd frontend
npm run start -- -p "$PUBLIC_PORT" -H 0.0.0.0 &
FRONTEND_PID=$!
cd ..

echo "======================================================="
echo " ✅ TalabaGo muvaffaqiyatli ishga tushdi!"
echo " Asosiy manzil:  http://0.0.0.0:$PUBLIC_PORT"
echo " Backend API:    http://127.0.0.1:8000/api"
echo "======================================================="

# To'xtatilganda ikkala jarayonni ham toza yopish
trap "kill $BACKEND_PID $FRONTEND_PID" SIGINT SIGTERM
wait
