#!/bin/bash
# ==============================================================================
# TalabaGo — Yagona Server Ishga Tushirish Skripti
# Backend (FastAPI) ichki 127.0.0.1:8000
# Frontend (Next.js) tashqi $PORT da — asosiy process
# ==============================================================================

# set -e olib tashlandi: xato bo'lsa ham davom etsin

APP_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "======================================================="
echo "  TALABAGO -- SERVER ISHGA TUSHIRISH"
echo "  Dir: $APP_DIR"
echo "======================================================="

# 1. Python buyrug'ini aniqlash
if command -v python3 >/dev/null 2>&1; then
    PY="python3"
elif command -v python >/dev/null 2>&1; then
    PY="python"
else
    echo "XATOLIK: Python topilmadi!"
    exit 1
fi
echo "[*] Python: $($PY --version 2>&1)"

# 2. Backend pakettlarini tekshirish
if ! $PY -c "import uvicorn" >/dev/null 2>&1; then
    echo "[*] uvicorn topilmadi, o'rnatilmoqda..."
    $PY -m pip install --quiet -r "$APP_DIR/backend/requirements.txt" || true
fi

# 3. Ma'lumotlar bazasini yaratish / yangilash
echo "[1/3] Baza tayyorlanmoqda..."
(
    cd "$APP_DIR/backend"
    $PY -c "
import sys
sys.path.insert(0, '.')
try:
    from app.init_db import init_db
    init_db()
    print('[DB] Schema tayyor.')
except Exception as e:
    print(f'[DB] Xatolik: {e}')

admin_user = __import__('os').environ.get('ADMIN_USERNAME', 'admin')
admin_pass = __import__('os').environ.get('ADMIN_PASSWORD', 'Admin123!')
try:
    from app.database import SessionLocal
    from app.models.user import User
    from app.security import hash_password
    db = SessionLocal()
    admin = db.query(User).filter(User.username == admin_user).first()
    if not admin:
        admin = User(
            username=admin_user, full_name='Administrator',
            student_id='T000001', hashed_password=hash_password(admin_pass),
            is_admin=True, is_premium=True, is_active=True, is_blocked=False,
            stars=100.0, avatar_url='https://api.dicebear.com/7.x/bottts/svg?seed=T000001',
        )
        db.add(admin)
        db.commit()
        print(f'[DB] Admin yaratildi: {admin_user}')
    else:
        admin.is_admin = True
        admin.is_active = True
        db.commit()
        print(f'[DB] Admin mavjud: {admin_user}')
    db.close()
except Exception as e:
    print(f'[DB] Admin xatolik: {e}')
" 2>&1
) || true

# 4. Frontend build tekshirish
echo "[2/3] Frontend tekshirilmoqda..."
if [ ! -d "$APP_DIR/frontend/.next" ]; then
    echo "[*] Next.js build qilinmoqda..."
    cd "$APP_DIR/frontend"
    [ ! -d "node_modules" ] && npm install --quiet 2>&1
    npm run build 2>&1
fi

# 5. Backend uvicorn ishga tushirish (fon jarayoni)
echo "[3/3] Backend ishga tushirilmoqda..."
cd "$APP_DIR/backend"
nohup $PY -m uvicorn app.main:app \
    --host 0.0.0.0 \
    --port 8000 \
    --log-level info \
    --workers 1 > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
cd "$APP_DIR"
echo "[*] Backend PID: $BACKEND_PID"

# Backend tayyor bo'lishini kutish (max 20 soniya)
echo "[*] Backend tayyor bo'lishini kutilmoqda..."
READY=0
for i in $(seq 1 20); do
    sleep 1
    if $PY -c "
import urllib.request, urllib.error
try:
    urllib.request.urlopen('http://127.0.0.1:8000/health', timeout=2)
    exit(0)
except:
    exit(1)
" >/dev/null 2>&1; then
        echo "[*] Backend tayyor! (${i}s)"
        READY=1
        break
    fi
done

if [ $READY -eq 0 ]; then
    echo "[!] Backend 20s da tayyor bo'lmadi! Loglar:"
    cat /tmp/backend.log 2>/dev/null || true
fi

# 6. Frontend ASOSIY PROCESS sifatida ishga tushirish (exec)
PUBLIC_PORT="${PORT:-3000}"
echo "======================================================="
echo "  Backend:  http://127.0.0.1:8000"
echo "  Frontend: http://0.0.0.0:$PUBLIC_PORT"
echo "======================================================="

cd "$APP_DIR/frontend"
exec npx next start -p "$PUBLIC_PORT" -H 0.0.0.0
