import sys
import subprocess
import tempfile
import os
from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User
from ..schemas.learning import (
    TrackOut,
    LessonOut,
    ExerciseOut,
    CodeRunRequest,
    CodeRunResponse,
)
from ..premium_utils import is_user_premium
from .auth import get_current_user

router = APIRouter(prefix="/api/learning", tags=["learning"])

from ..curriculum_data import CURRICULUM


@router.get("/tracks", response_model=list[TrackOut])
def get_tracks():
    out = []
    for t in CURRICULUM:
        lessons_out = []
        for l in t["lessons"]:
            exercises_out = [
                ExerciseOut(
                    id=e["id"],
                    title=e["title"],
                    difficulty=e["difficulty"],
                    description=e["description"],
                    initial_code=e["initial_code"],
                    test_cases=e.get("test_cases", []),
                    hint=e.get("hint"),
                )
                for e in l.get("exercises", [])
            ]
            lessons_out.append(
                LessonOut(
                    id=l["id"],
                    slug=l["slug"],
                    title=l["title"],
                    track=l["track"],
                    track_title=l["track_title"],
                    summary=l["summary"],
                    content=l["content"],
                    exercises=exercises_out,
                )
            )
        out.append(
            TrackOut(
                id=t["id"],
                title=t["title"],
                description=t["description"],
                icon=t["icon"],
                lessons_count=len(t["lessons"]),
                lessons=lessons_out,
            )
        )
    return out


@router.get("/lesson/{track_id}/{slug}", response_model=LessonOut)
def get_lesson(track_id: str, slug: str):
    for t in CURRICULUM:
        if t["id"] == track_id:
            for l in t["lessons"]:
                if l["slug"] == slug:
                    exercises_out = [
                        ExerciseOut(
                            id=e["id"],
                            title=e["title"],
                            difficulty=e["difficulty"],
                            description=e["description"],
                            initial_code=e["initial_code"],
                            test_cases=e.get("test_cases", []),
                            hint=e.get("hint"),
                        )
                        for e in l.get("exercises", [])
                    ]
                    return LessonOut(
                        id=l["id"],
                        slug=l["slug"],
                        title=l["title"],
                        track=l["track"],
                        track_title=l["track_title"],
                        summary=l["summary"],
                        content=l["content"],
                        exercises=exercises_out,
                    )
    raise HTTPException(status_code=404, detail="Dars topilmadi")


# ==============================================================================
# Kod bajarish xavfsizlik qatlami — Ko'p darajali himoya
# ==============================================================================

# 1-qatlam: To'g'ridan-to'g'ri taqiqlangan kalit so'zlar va funksiya chaqiruvlari
_FORBIDDEN_PATTERNS = [
    # Tizim modullari
    "import os",      "from os",        "import sys",     "from sys",
    "import subprocess", "from subprocess", "import shutil",  "from shutil",
    "import socket",  "from socket",    "import requests", "from requests",
    "import urllib",  "from urllib",    "import http",    "from http",
    "import ftplib",  "from ftplib",    "import smtplib", "from smtplib",
    "import pathlib", "from pathlib",   "import glob",    "from glob",
    "import tempfile","from tempfile",  "import pickle",  "from pickle",
    "import marshal", "from marshal",   "import ctypes",  "from ctypes",
    "import cffi",    "from cffi",      "import mmap",    "from mmap",
    "import pty",     "import tty",     "import termios",
    "import signal",  "from signal",    "import resource",
    "import threading","from threading", "import multiprocessing",
    "import asyncio", "from asyncio",   "import concurrent",
    # Xavfli built-in funksiyalar
    "__import__(",    "eval(",          "exec(",          "compile(",
    "open(",          "globals(",       "locals(",        "vars(",
    "dir(",           "delattr(",       "setattr(",       "getattr(",
    "__builtins__",   "__class__",      "__bases__",      "__subclasses__",
    "__dict__",       "__code__",       "__globals__",    "__module__",
    "__reduce__",     "__reduce_ex__",  "__getattribute__",
    # Fayl tizimi
    "rmtree",         "remove(",        "unlink(",        "chmod(",
    "chown(",         "mkdir(",         "makedirs(",      "rename(",
    # Tarmoq
    "socket(",        "urlopen(",       "urlretrieve(",   "Request(",
    "urlopen(",       "connect(",       "bind(",          "listen(",
    # Shell bajarish
    "Popen(",         "call(",          "check_call(",    "check_output(",
    "system(",        "popen(",         "spawn",          "fork(",
    # Kodlash bilan bypass
    "chr(",           "ord(",           "bytes(",         "bytearray(",
    "base64",         "codecs",         "zlib",           "gzip",
    # Refleksiya / introspeksiya
    "type(",          "isinstance(",    "issubclass(",    "hasattr(",
    # Maxsus atributlar orqali bypass
    ".__",
]

# 2-qatlam: regex asosida xavfli naqshlar
import re as _re

_DANGEROUS_REGEX = [
    # Obfuskatsiya: getattr(obj, "os") yoki similar
    _re.compile(r'getattr\s*\(', _re.IGNORECASE),
    # __import__("os") yoki __import__('subprocess')
    _re.compile(r'__import__\s*\(', _re.IGNORECASE),
    # open() faylga kirish
    _re.compile(r'\bopen\s*\(', _re.IGNORECASE),
    # chr() bilan string qurish
    _re.compile(r'chr\s*\(\s*\d+', _re.IGNORECASE),
    # Hex yoki octal yordamida import bypass
    _re.compile(r'\\x[0-9a-f]{2}', _re.IGNORECASE),
    # Subclasses orqali bypass: ().__class__.__mro__
    _re.compile(r'__class__\s*\.\s*__', _re.IGNORECASE),
    _re.compile(r'__subclasses__\s*\(', _re.IGNORECASE),
    _re.compile(r'__mro__', _re.IGNORECASE),
    # exec(compile(...))
    _re.compile(r'\bexec\s*\(', _re.IGNORECASE),
    _re.compile(r'\beval\s*\(', _re.IGNORECASE),
    _re.compile(r'\bcompile\s*\(', _re.IGNORECASE),
]

# Ruxsat etilgan stdlib modullari (whitelist)
_ALLOWED_IMPORTS = {
    "math", "random", "datetime", "time", "collections",
    "itertools", "functools", "string", "re", "json",
    "fractions", "decimal", "statistics", "heapq", "bisect",
    "copy", "pprint", "textwrap", "enum", "dataclasses",
    "typing", "abc", "operator",
}

_IMPORT_RE = _re.compile(r'^\s*(?:import|from)\s+(\w+)', _re.MULTILINE)

MAX_CODE_LENGTH = 4096   # 4 KB — ortiqcha uzun kod xavfli
MAX_CODE_LINES = 150     # 150 qatordan oshmasin


def _scan_code_safety(code: str) -> str | None:
    """
    Kodda xavfli elementlar borligini tekshiradi.
    Topilsa xatolik xabarini qaytaradi, aks holda None.
    """
    # Hajm chegarasi
    if len(code) > MAX_CODE_LENGTH:
        return f"Kod juda uzun (max {MAX_CODE_LENGTH} belgi ruxsat etiladi)."
    if code.count("\n") > MAX_CODE_LINES:
        return f"Kod juda ko'p qatordan iborat (max {MAX_CODE_LINES} qator)."

    # 1-qatlam: oddiy string qidiruv
    lower_code = code.lower()
    for pattern in _FORBIDDEN_PATTERNS:
        if pattern.lower() in lower_code:
            safe_pat = pattern.strip().replace("\n", "")
            return f"Xavfsizlik qoidasi: '{safe_pat}' ishlatish taqiqlangan!"

    # 2-qatlam: regex qidiruv
    for regex in _DANGEROUS_REGEX:
        if regex.search(code):
            return "Xavfli kod naqshi aniqlandi (eval/exec/getattr/subclasses va h.k.)."

    # 3-qatlam: import whitelist
    for match in _IMPORT_RE.finditer(code):
        mod = match.group(1).lower()
        if mod not in _ALLOWED_IMPORTS:
            return (
                f"'{mod}' moduli ruxsat etilmagan. "
                f"Faqat ruxsat etilganlar: {', '.join(sorted(_ALLOWED_IMPORTS))}."
            )

    return None  # xavfsiz


@router.post("/run", response_model=CodeRunResponse)
def execute_code(
    payload: CodeRunRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Premium check: Dasturlash platformasida amaliy mashqlarni to'liq bajarish Premium xususiyat!
    # Lekin birinchi dars bepul tanishuv sifatida ruxsat etiladi; boshqalari Premium talab qiladi.
    is_prem = is_user_premium(current_user)
    if not is_prem and not current_user.is_admin:
        # Check if requested exercise is beyond preview
        if payload.exercise_id and payload.exercise_id not in {"py-ex-1"}:
            raise HTTPException(
                status_code=403,
                detail="Dasturlash amaliy laboratoriyasi (Python, Django, Algoritmlar) TalabaGo Plus va Plus+ obunachilari uchun ochiq! Obunani faollashtiring (TalabaGo Plus: 40 000 so'm yoki Plus+: 65 000 so'm).",
            )

    code = payload.code
    # Ko'p darajali xavfsizlik tekshiruvi
    safety_error = _scan_code_safety(code)
    if safety_error:
        return CodeRunResponse(
            stdout="",
            stderr=safety_error,
            exit_code=1,
            success=False,
            exercise_completed=False,
            feedback="Kodda xavfli amallar aniqlandi. Faqat sof Python algoritmlarini yozing.",
        )


    # Execute code in temp file with timeout
    try:
        with tempfile.NamedTemporaryFile("w", suffix=".py", delete=False, encoding="utf-8") as f:
            f.write(code)
            temp_name = f.name

        proc = subprocess.run(
            [sys.executable, temp_name],
            input=payload.input_data or "",
            capture_output=True,
            text=True,
            timeout=5,
        )
        stdout = proc.stdout.strip()
        stderr = proc.stderr.strip()
        exit_code = proc.returncode
    except subprocess.TimeoutExpired:
        return CodeRunResponse(
            stdout="",
            stderr="Vaqt chegarasi oshib ketdi (Timeout: 5 soniya). Cheksiz sikl bo'lishi mumkin.",
            exit_code=124,
            success=False,
            exercise_completed=False,
            feedback="Kodingiz belgilangan vaqt ichida yakunlanmadi.",
        )
    except Exception as e:
        return CodeRunResponse(
            stdout="",
            stderr=str(e),
            exit_code=1,
            success=False,
            exercise_completed=False,
            feedback="Ijroda kutilmagan xatolik yuz berdi.",
        )
    finally:
        if "temp_name" in locals() and os.path.exists(temp_name):
            try:
                os.remove(temp_name)
            except Exception:
                pass

    # Check test cases if exercise_id provided
    exercise_completed = False
    feedback = None

    if payload.exercise_id:
        target_ex = None
        for t in CURRICULUM:
            for l in t["lessons"]:
                for e in l.get("exercises", []):
                    if e["id"] == payload.exercise_id:
                        target_ex = e
                        break

        if target_ex and target_ex.get("test_cases"):
            expected = target_ex["test_cases"][0].get("expected_output", "").strip()
            if stdout == expected or (expected in stdout):
                exercise_completed = True
                feedback = "Barakalla! Topshiriq to'liq va to'g'ri bajarildi! 🎉"
                # Give a small star reward for completing an exercise if premium
                current_user.stars = round(float(current_user.stars or 0.0) + 1.0, 2)
                db.commit()
            else:
                exercise_completed = False
                feedback = f"Kutilgan natija: '{expected}', lekin sizning chiqishingiz: '{stdout}'"

    return CodeRunResponse(
        stdout=stdout,
        stderr=stderr,
        exit_code=exit_code,
        success=(exit_code == 0),
        exercise_completed=exercise_completed,
        feedback=feedback,
    )
