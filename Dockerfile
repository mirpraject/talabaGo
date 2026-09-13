# ==============================================================================
# TalabaGo — All-in-One Single-Server Container (Python 3.11 + Node.js 20)
# Railway, Render, Fly.io, VPS uchun yagona konteyner
# ==============================================================================

FROM python:3.11-slim

# Tizim paketlari va Node.js 20 o'rnatish
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    gcc \
    libpq-dev \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 1. Backend bog'liqliklarini o'rnatish (system Python ga)
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r ./backend/requirements.txt

# 2. Frontend bog'liqliklarini o'rnatish
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# 3. Butun loyiha kodlarini nusxalash
COPY . .

# 4. Frontend Next.js build (production)
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN cd frontend && npm run build

# 5. Uploads papkasi va ruxsatlar
RUN mkdir -p backend/uploads && chmod -R 777 backend/uploads
RUN chmod +x start.sh

# Railway standarti: $PORT muhit o'zgaruvchisi orqali port boshqariladi
ENV PORT=3000
EXPOSE 3000

CMD ["bash", "start.sh"]
