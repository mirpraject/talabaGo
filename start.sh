#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "======================================================="
echo "         STUDENTHUB — SERVER ISHGA TUSHIRISH"
echo "======================================================="

# 1. Backend sozlash
echo "[1/3] Backend sozlanmoqda..."
if [ ! -d "backend/.venv" ]; then
    python3 -m venv backend/.venv
fi
backend/.venv/bin/pip install -q -r backend/requirements.txt

# 2. Frontend build
echo "[2/3] Frontend tayyorlanmoqda..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
fi
npm run build
cd ..

# 3. Serverlarni ishga tushirish
echo "[3/3] Serverlar ishga tushirilmoqda..."
# Backendni orqa fonda ishga tushirish
backend/.venv/bin/uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Frontendni ishga tushirish
cd frontend
npm run start -- -p 3000 &
FRONTEND_PID=$!

echo "======================================================="
echo " StudentHUB muvaffaqiyatli ishga tushdi!"
echo " Frontend: http://localhost:3000"
echo " Backend API: http://localhost:8000"
echo "======================================================="

trap "kill $BACKEND_PID $FRONTEND_PID" SIGINT SIGTERM
wait
