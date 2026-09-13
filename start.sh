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
PYTHON_RUN="$PYTHON_CMD"

if ! $PYTHON_CMD -c "import uvicorn, fastapi" &>/dev/null; then
    echo "[*] Paketlar o'rnatilmoqda..."
    if [ -f "backend/.venv/bin/python" ]; then
        PYTHON_RUN="backend/.venv/bin/python"
    else
        $PYTHON_CMD -m pip install -q -r backend/requirements.txt || pip install -q -r backend/requirements.txt || true
    fi
fi

# Bazani birlamchi ma'lumotlar bilan to'ldirish
$PYTHON_RUN backend/seed.py || true

# 3. Frontendni sozlash va tayyorlash
echo "[2/3] Frontend tekshirilmoqda..."
if [ ! -d "frontend/.next" ]; then
    echo "[*] Next.js loyiha yig'ilmoqda (build)..."
    cd frontend
    [ ! -d "node_modules" ] && npm install
    npm run build
    cd ..
fi

# 4. Serverlarni yagona tizim sifatida ishga tushirish
PUBLIC_PORT="${PORT:-3000}"
echo "[3/3] Serverlar ishga tushirilmoqda..."

# Backend FastAPI (ichki 127.0.0.1:8000 da ishlaydi)
$PYTHON_RUN -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

# Frontend Next.js (tashqi $PUBLIC_PORT da tinglaydi va /api so'rovlarini 8000 ga proksi qiladi)
cd frontend
npx next start -p "$PUBLIC_PORT" -H 0.0.0.0 &
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
