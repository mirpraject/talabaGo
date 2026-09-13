#!/usr/bin/env bash
# ==============================================================================
# TalabaGo — Yagona Server Ishga Tushirish Skripti (start.sh)
# Backend (FastAPI: 8000) + Frontend (Next.js: $PORT)
# ==============================================================================

# set -e OLIB TASHLANDI — bir jarayon xatosi boshqasini to'xtatmasin

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "======================================================="
echo "         TALABAGO -- SERVER ISHGA TUSHIRISH"
echo "======================================================="

# 1. Python buyrug'ini aniqlash
PYTHON_CMD=""
if command -v python3 >/dev/null 2>&1; then
    PYTHON_CMD="python3"
elif command -v python >/dev/null 2>&1; then
    PYTHON_CMD="python"
else
    echo "[-] XATOLIK: Python topilmadi!"
    exit 1
fi

echo "[*] Python: $($PYTHON_CMD --version 2>&1)"

# 2. Paketlarni tekshirish va o'rnatish (agar kerak bo'lsa)
echo "[1/3] Backend sozlanmoqda..."

if ! $PYTHON_CMD -c "import uvicorn, fastapi, sqlalchemy" >/dev/null 2>&1; then
    echo "[*] Kerakli paketlar o'rnatilmoqda..."
    $PYTHON_CMD -m pip install --quiet -r "$DIR/backend/requirements.txt" || true
fi

# 3. Ma'lumotlar bazasini ishga tayyorlash
echo "[*] Baza tayyorlanmoqda..."
cd "$DIR/backend"
$PYTHON_CMD -c "
import sys, os
sys.path.insert(0, os.getcwd())
try:
    from app.init_db import init_db
    init_db()
    print('[*] Schema muvaffaqiyatli tayyorlandi.')
except Exception as e:
    print(f'[!] Schema xatolik: {e}')
" || true

# Admin va boshlangich ma'lumotlarni yaratish
$PYTHON_CMD -c "
import sys, os
sys.path.insert(0, os.getcwd())
try:
    from app.database import SessionLocal
    from app.models import User, University
    from app.security import hash_password
    
    admin_user = os.environ.get('ADMIN_USERNAME', 'admin')
    admin_pass = os.environ.get('ADMIN_PASSWORD', 'Admin123!')
    
    db = SessionLocal()
    admin = db.query(User).filter(User.username == admin_user).first()
    if not admin:
        admin = User(
            username=admin_user,
            full_name='Bosh Administrator',
            student_id='T000001',
            hashed_password=hash_password(admin_pass),
            is_admin=True, is_premium=True, is_active=True, is_blocked=False,
            stars=100.0,
            avatar_url='https://api.dicebear.com/7.x/bottts/svg?seed=T000001',
        )
        db.add(admin)
        db.commit()
        print(f'[+] Admin yaratildi: {admin_user}')
    else:
        admin.is_admin = True
        admin.is_active = True
        admin.is_blocked = False
        db.commit()
        print(f'[*] Admin mavjud: {admin_user}')
    db.close()
except Exception as e:
    print(f'[!] Seed xatolik (ahamiyatsiz): {e}')
" || true

cd "$DIR"

# 4. Frontend Build tekshirish
echo "[2/3] Frontend tekshirilmoqda..."
if [ ! -d "$DIR/frontend/.next" ]; then
    echo "[*] Next.js build qilinmoqda..."
    cd "$DIR/frontend"
    [ ! -d "node_modules" ] && npm install --quiet
    npm run build
    cd "$DIR"
fi

# 5. Serverlarni ishga tushirish
PUBLIC_PORT="${PORT:-3000}"
echo "[3/3] Serverlar ishga tushirilmoqda..."
echo "    Backend  -> 127.0.0.1:8000"
echo "    Frontend -> 0.0.0.0:$PUBLIC_PORT"

# Backend uvicorn (backend papkasidan ishga tushiriladi)
cd "$DIR/backend"
$PYTHON_CMD -m uvicorn app.main:app \
    --host 127.0.0.1 \
    --port 8000 \
    --log-level info \
    --workers 1 &
BACKEND_PID=$!
cd "$DIR"

# Backend tayyor bo'lishini kutish (max 30 soniya)
echo "[*] Backend tayyor bo'lishini kutilmoqda..."
for i in $(seq 1 30); do
    if $PYTHON_CMD -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/health')" >/dev/null 2>&1; then
        echo "[*] Backend tayyor! ($i soniya)"
        break
    fi
    sleep 1
done

# Frontend Next.js
cd "$DIR/frontend"
npx next start -p "$PUBLIC_PORT" -H 0.0.0.0 &
FRONTEND_PID=$!
cd "$DIR"

echo "======================================================="
echo " [OK] TalabaGo muvaffaqiyatli ishga tushdi!"
echo " Sayt manzili: http://0.0.0.0:$PUBLIC_PORT"
echo " Backend API:  http://127.0.0.1:8000/api"
echo "======================================================="

# Jarayonlarni kuzatish va to'g'ri yopish
cleanup() {
    echo "[*] Server to'xtatilmoqda..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit 0
}
trap cleanup SIGINT SIGTERM EXIT

wait $BACKEND_PID $FRONTEND_PID
