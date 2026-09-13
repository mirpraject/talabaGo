"""
StudentHUB — Yagona Ishga Tushiruvchi Skript (Unified Runner)
Bu skript orqali backend (FastAPI) va frontend (Next.js) bitta buyruq bilan birgalikda ishga tushadi.
"""

import os
import sys
import time
import subprocess
import threading
import webbrowser

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")
FRONTEND_DIR = os.path.join(ROOT_DIR, "frontend")

# Python executable aniqlash
VENV_PYTHON = os.path.join(BACKEND_DIR, ".venv", "Scripts", "python.exe")
if os.path.exists(VENV_PYTHON):
    PYTHON_EXE = VENV_PYTHON
else:
    PYTHON_EXE = sys.executable

# NPM executable aniqlash (Windows)
NPM_CMD = "npm.cmd" if os.name == "nt" else "npm"

processes = []

def stream_output(pipe, prefix, color_code):
    try:
        for line in iter(pipe.readline, ''):
            if not line:
                break
            # Rangli prefix bilan konsolga chiqarish
            print(f"\033[{color_code}m[{prefix}]\033[0m {line.rstrip()}")
    except Exception:
        pass

def run_backend():
    print("\033[94m[*] Backend ishga tushirilmoqda (FastAPI: http://127.0.0.1:8000)...\033[0m")
    is_prod = os.environ.get("STUDENTHUB_PROD", "0") == "1"
    if is_prod:
        workers = str(max(2, os.cpu_count() or 4))
        print(f"\033[94m[*] Ishga tushirish: Yuqori yuklama rejimi ({workers} ta Uvicorn worker)...\033[0m")
        cmd = [PYTHON_EXE, "-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "8000", "--workers", workers]
    else:
        cmd = [PYTHON_EXE, "-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "8000", "--reload"]
    proc = subprocess.Popen(
        cmd,
        cwd=BACKEND_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
        encoding="utf-8",
        errors="replace",
    )
    processes.append(proc)
    threading.Thread(target=stream_output, args=(proc.stdout, "BACKEND", "94"), daemon=True).start()
    return proc

def run_frontend():
    print("\033[92m[*] Frontend ishga tushirilmoqda (Next.js: http://localhost:3000)...\033[0m")
    cmd = [NPM_CMD, "run", "dev"]
    proc = subprocess.Popen(
        cmd,
        cwd=FRONTEND_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
        encoding="utf-8",
        errors="replace",
    )
    processes.append(proc)
    threading.Thread(target=stream_output, args=(proc.stdout, "FRONTEND", "92"), daemon=True).start()
    return proc

def open_browser():
    time.sleep(4)
    url = "http://localhost:3000"
    print(f"\033[95m[*] Brauzer ochilmoqda: {url}\033[0m")
    try:
        webbrowser.open(url)
    except Exception as e:
        print(f"Brauzerni ochishda xatolik: {e}")

def main():
    print("=" * 65)
    print("         TalabaGo — Birlashgan Yagona Platforma")
    print("=" * 65)
    print("  * Sayt manzili:        http://localhost:3000")
    print("  * Admin Panel:         http://localhost:3000/admin")
    print("  * Backend API:         http://127.0.0.1:8000")
    print("  * Ma'lumotlar bazasi:  SQLite (backend/studenthub.db)")
    print("=" * 65)
    print("To'xtatish uchun klaviaturada Ctrl + C bosing.\n")

    run_backend()
    run_frontend()

    threading.Thread(target=open_browser, daemon=True).start()

    try:
        while True:
            time.sleep(1)
            # Agar birorta jarayon to'xtab qolsa
            for p in processes:
                if p.poll() is not None:
                    print(f"Jarayon to'xtadi (kod: {p.returncode})")
                    break
    except KeyboardInterrupt:
        print("\n[!] Barcha serverlar to'xtatilmoqda...")
        for p in processes:
            try:
                p.terminate()
            except Exception:
                pass
        print("[OK] Tizim muvaffaqiyatli to'xtatildi.")

if __name__ == "__main__":
    main()
