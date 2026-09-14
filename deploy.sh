#!/usr/bin/env bash
# ==============================================================================
# TalabaGo (StudentHUB) — Yagona Serverga O'rnatish Skripti (Single-Server Deploy)
# ==============================================================================

set -e

echo "======================================================================"
echo "    🚀 TalabaGo — Yagona Serverga O'rnatish va Ishga Tushirish"
echo "======================================================================"

# 1. Tekshiruv: Docker va Docker Compose
if ! command -v docker &> /dev/null; then
    echo "[-] Docker topilmadi. Docker o'rnatilmoqda..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    echo "[+] Docker muvaffaqiyatli o'rnatildi."
fi

# 2. .env faylini sozlash
if [ ! -f ".env" ]; then
    echo "[*] .env fayli topilmadi. .env.example asosida yangi .env yaratilmoqda..."
    cp .env.example .env
    
    # Xavfsiz random JWT secret generatsiya qilish
    RANDOM_SECRET=$(openssl rand -hex 32 2>/dev/null || date +%s%N | sha256sum | head -c 64)
    sed -i "s/your_super_secret_jwt_key_here/${RANDOM_SECRET}/g" .env
    
    echo "[+] .env fayli xavfsiz kalitlar bilan yaratildi."
    echo "[!] DIQQAT: .env faylini ochib, o'z sozlamalaringizni tekshiring (nano .env)!"
fi

# 3. Uploads papkasi va ruxsatlar
mkdir -p uploads
chmod -R 777 uploads

# 4. Konteynerlarni birgalikda yagona serverda ishga tushirish
echo "[*] Barcha xizmatlar (Database + Backend + Frontend + Nginx) yig'ilmoqda va ishga tushirilmoqda..."
docker compose down || true
docker compose up -d --build

echo "======================================================================"
echo "    ✅ Tizim yagona serverda muvaffaqiyatli ishga tushdi!"
echo "======================================================================"
echo "  * Veb-sayt (Frontend & Backend):  http://localhost (yoki server IP)"
echo "  * Admin Panel:                    http://localhost/admin"
echo "  * API Hujjatlari (Swagger):       http://localhost/docs"
echo "  * Nginx Proxy:                    Port 80 (Barcha so'rovlar yagona portda)"
echo "======================================================================"
echo "Loglarni ko'rish uchun: docker compose logs -f"
