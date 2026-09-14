"""
TalabaGo — Yagona Birlashgan Ishga Tushiruvchi Skript
FastAPI (app/) va Next.js (src/) bitta papkada, yagona muhitda ishlaydi.
"""

import os
import sys
import time
import subprocess
import threading
import webbrowser

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

# Python executable aniqlash
VENV_PYTHON = os.path.join(ROOT_DIR, ".venv", "Scripts", "python.exe")
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
            print(f"\033[{color_code}m[{prefix}]\033[0m {line.rstrip()}")
    except Exception:
        pass

def run_backend():
    print("\033[94m[*] API server ishga tushirilmoqda (FastAPI: http://127.0.0.1:8000)...\033[0m")
    is_prod = os.environ.get("STUDENTHUB_PROD", "0") == "1"
    if is_prod:
        workers = str(max(2, os.cpu_count() or 4))
        cmd = [PYTHON_EXE, "-m", "uvicorn", "server.main:app", "--host", "127.0.0.1", "--port", "8000", "--workers", workers]
    else:
        cmd = [PYTHON_EXE, "-m", "uvicorn", "server.main:app", "--host", "127.0.0.1", "--port", "8000", "--reload"]
    proc = subprocess.Popen(
        cmd,
        cwd=ROOT_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
        encoding="utf-8",
        errors="replace",
    )
    processes.append(proc)
    threading.Thread(target=stream_output, args=(proc.stdout, "API", "94"), daemon=True).start()
    return proc

def run_frontend():
    print("\033[92m[*] Web interfeys ishga tushirilmoqda (Next.js: http://localhost:3000)...\033[0m")
    cmd = [NPM_CMD, "run", "dev"]
    proc = subprocess.Popen(
        cmd,
        cwd=ROOT_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
        encoding="utf-8",
        errors="replace",
    )
    processes.append(proc)
    threading.Thread(target=stream_output, args=(proc.stdout, "WEB", "92"), daemon=True).start()
    return proc

def open_browser():
    time.sleep(3)
    url = "http://localhost:3000"
    print(f"\033[95m[*] Brauzer ochilmoqda: {url}\033[0m")
    try:
        webbrowser.open(url)
    except Exception as e:
        print(f"Brauzerni ochishda xatolik: {e}")

def main():
    print("=" * 65)
    print("         TalabaGo — Yagona Birlashgan Platforma")
    print("=" * 65)
    print("  * Web sayt manzili:    http://localhost:3000")
    print("  * Admin Panel:         http://localhost:3000/admin")
    print("  * API Server:          http://127.0.0.1:8000")
    print("  * Ma'lumotlar bazasi:  SQLite (studenthub.db)")
    print("=" * 65)
    print("To'xtatish uchun klaviaturada Ctrl + C bosing.\n")

    run_backend()
    run_frontend()

    threading.Thread(target=open_browser, daemon=True).start()

    try:
        while True:
            time.sleep(1)
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
