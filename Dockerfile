# ==============================================================================
# TalabaGo v2.0 — Yagona Unified Container
# backend/ va frontend/ yo'q — hammasi ildizda
# Python (FastAPI) + Node.js (Next.js) — bitta server, bitta deploy
# ==============================================================================

FROM python:3.11-slim

# Tizim paketlari + Node.js 20
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    gcc \
    libpq-dev \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 1. Python paketlari (ildiz requirements.txt)
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# 2. Node.js paketlari (ildiz package.json)
COPY package*.json ./
RUN npm ci --prefer-offline

# 3. Butun loyiha nusxalash
COPY . .

# 4. Next.js production build (ildizdan)
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# 5. Uploads papkasi
RUN mkdir -p uploads && chmod -R 777 uploads
RUN chmod +x start.sh

ENV PORT=3000
EXPOSE 3000

CMD ["bash", "start.sh"]
