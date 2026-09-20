#!/bin/bash
# ==============================================================================
# TalabaGo v2.0 — Yagona Server (Unified, backend/ va frontend/ yo'q)
# FastAPI  → ichki port 8000  (app/ papkasidan)
# Next.js  → tashqi $PORT    (src/ papkasidan, ildizda build)
# ==============================================================================

APP_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "======================================================="
echo "  TALABAGO v2.0 — UNIFIED"
echo "  Dir: $APP_DIR"
echo "======================================================="

# Python versiyasini aniqlash
if command -v python3 >/dev/null 2>&1; then
    PY="python3"
elif command -v python >/dev/null 2>&1; then
    PY="python"
else
    echo "XATOLIK: Python topilmadi!"
    exit 1
fi
echo "[*] $($PY --version 2>&1)"
echo "[*] Node $(node --version 2>&1)"

# Python paketlari (ildiz requirements.txt)
if ! $PY -c "import uvicorn" >/dev/null 2>&1; then
    echo "[*] Paketlar o'rnatilmoqda..."
    $PY -m pip install --quiet -r "$APP_DIR/requirements.txt" || true
fi

# ─── 1. Baza tayyorlash ────────────────────────────────────────
echo "[1/3] Baza tayyorlanmoqda..."
cd "$APP_DIR"
$PY -c "
import sys
sys.path.insert(0, '.')
try:
    from server.init_db import init_db
    init_db()
    print('[DB] Schema tayyor.')
except Exception as e:
    print(f'[DB] Schema xatolik: {e}')

import os
admin_user = os.environ.get('ADMIN_USERNAME', 'admin')
admin_pass = os.environ.get('ADMIN_PASSWORD', 'admin123')
try:
    from server.database import SessionLocal
    from server.models.user import User
    from server.security import hash_password
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
        admin.is_blocked = False
        admin.hashed_password = hash_password(admin_pass)
        db.commit()
        print(f'[DB] Admin yangilandi: {admin_user}')
    db.close()
except Exception as e:
    print(f'[DB] Admin xatolik: {e}')
" 2>&1 || true

# ─── 2. Next.js build tekshirish ──────────────────────────────
echo "[2/3] Frontend tekshirilmoqda..."
if [ ! -d "$APP_DIR/.next" ]; then
    echo "[*] Next.js build topilmadi, build qilinmoqda..."
    cd "$APP_DIR"
    if [ ! -d "node_modules" ]; then
        echo "[*] npm install..."
        npm ci 2>&1 || npm install 2>&1
    fi
    NODE_ENV=production npm run build 2>&1
fi
cd "$APP_DIR"

# ─── 3. FastAPI uvicorn fon jarayoni ──────────────────────────
PUBLIC_PORT="${PORT:-8080}"
BACKEND_PORT="${BACKEND_PORT:-8000}"

# Agar tashqi port va ichki backend port bir xil bo'lib qolsa, to'qnashuv bo'lmasligi uchun backendni 8001 ga ko'chiramiz
if [ "$PUBLIC_PORT" = "$BACKEND_PORT" ]; then
    BACKEND_PORT="8001"
fi

export INTERNAL_API_URL="http://127.0.0.1:$BACKEND_PORT"
export BACKEND_PORT="$BACKEND_PORT"
export PYTHONPATH="$APP_DIR:$PYTHONPATH"

echo "[3/3] FastAPI ishga tushirilmoqda (ichki port $BACKEND_PORT)..."
cd "$APP_DIR"
$PY -m uvicorn server.main:app \
    --host 0.0.0.0 \
    --port "$BACKEND_PORT" \
    --log-level info \
    --workers 1 &
BACKEND_PID=$!
echo "[*] FastAPI PID: $BACKEND_PID"

# Backend tayyor bo'lishini kutish (max 30s)
READY=0
for i in $(seq 1 30); do
    sleep 1
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        echo "[XATOLIK] FastAPI jarayoni to'xtab qoldi (PID: $BACKEND_PID)!"
        break
    fi
    if $PY -c "
import urllib.request
try:
    urllib.request.urlopen('http://127.0.0.1:$BACKEND_PORT/health', timeout=2)
    exit(0)
except:
    exit(1)
" >/dev/null 2>&1; then
        echo "[OK] FastAPI muvaffaqiyatli tayyor! (${i}s, port: $BACKEND_PORT)"
        READY=1
        break
    fi
done
[ $READY -eq 0 ] && echo "[!] FastAPI kutish yakunlandi, davom etilmoqda..."

# ─── 4. Next.js asosiy jarayon ────────────────────────────────
echo "======================================================="
echo "  FastAPI:  http://127.0.0.1:$BACKEND_PORT  (ichki)"
echo "  Next.js:  http://0.0.0.0:$PUBLIC_PORT  (tashqi)"
echo "======================================================="

cleanup() {
    echo "[*] To'xtatilmoqda..."
    kill -TERM $BACKEND_PID 2>/dev/null || true
    exit 0
}
trap cleanup SIGINT SIGTERM EXIT

echo "[OK] TalabaGo v2.0 ishga tushdi!"
cd "$APP_DIR"
exec npx next start -p "$PUBLIC_PORT" -H 0.0.0.0
