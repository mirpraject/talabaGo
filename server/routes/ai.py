import json
import re
from urllib.parse import quote

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy import or_
from sqlalchemy.orm import Session

from ..ai_client import chat_completion
from ..config import settings
from ..database import get_db
from ..models import File, Subject, Test, TestQuestion, User
from ..report_export import build_docx, build_pdf, sanitize_filename
from ..schemas import (
    ChatRequest,
    ChatResponse,
    GenerateReportRequest,
    GenerateReportResponse,
    GenerateTestRequest,
    GenerateTestResponse,
    ReportExportRequest,
)
from .auth import get_current_user

router = APIRouter(prefix="/api/ai", tags=["ai"])

TYPE_LABELS = {
    "uz": {"notes": "Konspekt", "tests": "Test", "lectures": "Ma'ruza", "lab": "Laboratoriya", "book": "Darslik", "exercise": "Mashq"},
    "en": {"notes": "Notes", "tests": "Tests", "lectures": "Lecture", "lab": "Lab", "book": "Textbook", "exercise": "Exercise"},
    "ru": {"notes": "Конспект", "tests": "Тест", "lectures": "Лекция", "lab": "Лабораторная", "book": "Учебник", "exercise": "Упражнение"},
}


def parse_json_response(raw: str):
    """Markdown kod bloklarini olib tashlab, JSON obyektni parse qiladi."""
    text = raw.strip()
    if text.startswith("```"):
        lines = text.split("\n")
        if lines and lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]
        text = "\n".join(lines).strip()
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        text = text[start : end + 1]
    return json.loads(text)


def find_relevant(db: Session, query: str, limit: int = 5) -> list[File]:
    words = [
        w for w in query.lower().replace(",", " ").split()
        if len(w.strip()) > 2
    ]
    q = db.query(File)
    if words:
        conds = []
        for w in words:
            conds.append(File.title.ilike(f"%{w}%"))
            conds.append(File.description.ilike(f"%{w}%"))
            conds.append(File.subject.has(Subject.name.ilike(f"%{w}%")))
        q = q.filter(or_(*conds))
    return q.order_by(File.rating.desc(), File.downloads.desc()).limit(limit).all()


def build_local_answer(message: str, files: list[File], lang: str = "uz") -> str:
    msg = message.lower()
    greeting = any(k in msg for k in ["salom", "assalom", "hello", "hi ", "привет", "zdravstvuy", "салам"])
    if greeting:
        return (
            "Salom! 👋 Men StudentHUB AI yordamchisiman. "
            "Menga fan nomi yoki imtihon mavzusini yozing, masalan: "
            "«Matematik analiz testlari» — men kerakli materiallarni topib beraman."
        )

    if not files:
        return (
            "Izlagan mavzuda hozircha material topilmadi. 📭 "
            "So'zni boshqacha yozib ko'ring yoki o'zingiz yangi material yuklang "
            "— saytning o'ng yuqori burchagidagi «Fayl yuklash» tugmasi orqali bo'ladi."
        )

    labels = TYPE_LABELS.get(lang, TYPE_LABELS["uz"])
    lines = [f"Topdim! 🎯 Izlaganingizga eng mos {len(files)} ta material:"]
    for i, f in enumerate(files, 1):
        label = labels.get(f.file_type, f.file_type)
        uni = f.university.short_name if f.university else ""
        rating = f.rating or 0
        lines.append(
            f"{i}. 📄 {f.title} — {label}"
            f"{f' ({uni})' if uni else ''} "
            f"★{rating} | {f.downloads} ta yuklab olingan"
        )
    lines.append("Batafsil ko'rish va yuklab olish: «Fayllar» bo'limiga o'ting.")
    return "\n".join(lines)


def build_prompt(db: Session, message: str) -> str:
    files = find_relevant(db, message, limit=8)
    context_lines = []
    for f in files:
        uni = f.university.short_name if f.university else "-"
        subj = f.subject.name if f.subject else "-"
        context_lines.append(
            f"- {f.title} | tur: {f.file_type} | fan: {subj} | universitet: {uni} "
            f"| reyting: {f.rating or 0} | yuklab olingan: {f.downloads}"
        )
    context = "\n".join(context_lines) if context_lines else "(mos material topilmadi)"
    return (
        "Siz StudentHUB akademik materiallar platformasining AI yordamchisisiz. "
        "Foydalanuvchi savoliga O'ZBEK tilida qisqa va foydali javob bering.\n\n"
        "Mavjud materiallar (kontekst):\n"
        f"{context}\n\n"
        "Foydalanuvchi savoli: {message}"
    )


@router.post("/chat", response_model=ChatResponse)
async def chat(
    data: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    files = find_relevant(db, data.message)
    reply = build_local_answer(data.message, files)

    if settings.has_ai_key:
        ai_reply = await chat_completion(
            build_prompt(db, data.message), data.message
        )
        if ai_reply:
            reply = ai_reply

    return ChatResponse(
        reply=reply,
        files=[{"id": f.id, "title": f.title} for f in files],
    )


# ---------- Referat (report) generation ----------

LANG_FALLBACK = {
    "uz": (
        "mavzu bo'yicha akademik referat. Kirish, asosiy qism (kamida 3 bo'lim), "
        "xulosa va foydalanilgan adabiyotlar bo'lsin. O'zbek tilida."
    ),
    "ru": (
        "академический реферат по теме. Введение, основная часть (не менее 3 разделов), "
        "заключение и список литературы. На русском языке."
    ),
    "en": (
        "academic essay on the topic. Introduction, body (at least 3 sections), "
        "conclusion and references. In English."
    ),
}

LENGTH_WORDS = {"short": 250, "medium": 600, "long": 1200}


def local_report(topic: str, length: str) -> GenerateReportResponse:
    words = LENGTH_WORDS.get(length, 600)
    title = topic.strip().capitalize()
    intro = (
        f"{title} bugungi kunda dolzarb mavzulardan biri hisoblanadi. "
        "Ushbu referatda mazkur mavzu har tomonlama o'rganiladi va tahlil qilinadi."
    )
    sections = [
        ("1. Kirish va umumiy tushuncha", f"{title} haqida asosiy ma'lumotlar, predmeti va ahamiyati bayon etiladi."),
        ("2. Asosiy qism", f"{title}ning asosiy jihatlari, turlari va xususiyatlari ko'rib chiqiladi."),
        ("3. Amaliy ahamiyati", f"{title}ning kundalik hayotda va o'quv jarayonidagi amaliy qo'llanilishi tahlil qilinadi."),
        ("4. Zamonaviy yondashuvlar", f"{title} bo'yicha so'nggi ilmiy yondashuvlar va yutuqlar yoritiladi."),
    ]
    body_parts = [intro]
    for heading, text in sections:
        body_parts.append(f"\n{heading}\n{text}")
    summary = f"Xulosa: {title} mavzusi akademik va amaliy jihatdan muhim ahamiyatga ega, uni o'rganish davom etadi."
    body_parts.append(f"\nXulosa\n{summary}")
    body_parts.append("\nFoydalanilgan adabiyotlar\n1. O'quv qo'llanma. 2. Ilmiy maqolalar. 3. Internet resurslari.")
    return GenerateReportResponse(title=title, content="\n".join(body_parts), summary=summary)


@router.post("/report", response_model=GenerateReportResponse)
async def generate_report(
    data: GenerateReportRequest,
    current_user: User = Depends(get_current_user),
):
    if not settings.has_ai_key:
        return local_report(data.topic, data.length)

    system = "Siz professional talaba va o'quvchilarga referat yozishda yordam beruvchi AI yordamchisisiz."
    user = f"Quyidagi mavzuda {LANG_FALLBACK.get(data.language, LANG_FALLBACK['uz'])}: {data.topic}"
    raw = await chat_completion(system, user, temperature=0.7)
    if not raw:
        return local_report(data.topic, data.length)

    try:
        parsed = parse_json_response(raw)
        return GenerateReportResponse(
            title=parsed.get("title", data.topic),
            content=parsed.get("content", raw),
            summary=parsed.get("summary", ""),
        )
    except (json.JSONDecodeError, TypeError, ValueError):
        return GenerateReportResponse(title=data.topic, content=raw, summary="")


@router.post("/report/export")
async def export_report(
    data: ReportExportRequest,
    current_user: User = Depends(get_current_user),
):
    base = sanitize_filename(data.title)
    if data.format == "docx":
        payload = build_docx(data.title, data.content)
        media = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        filename = f"{base}.docx"
    else:
        payload = build_pdf(data.title, data.content)
        media = "application/pdf"
        filename = f"{base}.pdf"

    headers = {
        "Content-Disposition": (
            "attachment; "
            f"filename=\"{re.sub(r'[^\\x00-\\x7F]', '_', filename)}\"; "
            f"filename*=UTF-8''{quote(filename)}"
        )
    }
    return StreamingResponse(
        iter([payload]),
        media_type=media,
        headers=headers,
    )


# ---------- Test generation ----------

TEST_LANG_SYSTEM = {
    "uz": (
        "Javob variantlari A, B, C, D bo'lgan test savollarini yarating. "
        "Har bir savolda 'correct' maydoni to'g'ri variant harfi (A/B/C/D) bo'lsin. "
        "Til: o'zbek."
    ),
    "ru": (
        "Создайте тестовые вопросы с вариантами A, B, C, D. У каждого вопроса поле "
        "'correct' — буква правильного варианта (A/B/C/D). Язык: русский."
    ),
    "en": (
        "Create test questions with options A, B, C, D. Each question has a "
        "'correct' field with the correct letter (A/B/C/D). Language: English."
    ),
}


def local_test(topic: str, count: int) -> list[dict]:
    questions = []
    base_questions = [
        (f"{topic} — bu nima?", "Fanga oid asosiy atama", "Umumiy tushuncha", "Ilmiy yo'nalish", "Hammasi to'g'ri", "D"),
        (f"{topic}ning asosiy xususiyati qaysi?", "Aynan bittasi yo'q", "Murakkablik", "Soddalik", "Bilim talab qiladi", "B"),
        (f"{topic} qayerda qo'llaniladi?", "Faqat maktabda", "Faqat universitetda", "Har joyda", "Hech qayerda", "C"),
        (f"{topic}ni o'rganishdan maqsad?", "Bilim oshirish", "Vaqt o'tkazish", "Imtihon", "Hammasi", "A"),
        (f"{topic} bo'yicha bilim qaysi fanlarga bog'liq?", "Matematika", "Tarix", "Geografiya", "Barchasiga", "D"),
        (f"{topic}ning ahamiyati?", "Juda katta", "Kichik", "Yo'q", "Noma'lum", "A"),
        (f"{topic} nimalardan iborat?", "Bir nechta qismdan", "Bitta qismdan", "Hech narsadan", "Faqat nazariyadan", "A"),
        (f"{topic} qachon o'rganiladi?", "O'rta maktabda", "Oliy o'quv yurtida", "Hamma bosqichda", "Faqat bo'sh paytda", "C"),
        (f"{topic} masalalarni yechish uchun nima kerak?", "Amaliyot", "Nazariya", "Ikkalasi", "Hech narsa kerak emas", "C"),
        (f"{topic} haqida kim o'rganadi?", "Talabalar", "O'quvchilar", "Olimlar", "Hammasi", "D"),
    ]
    for i in range(count):
        q = base_questions[i % len(base_questions)]
        idx = i // len(base_questions)
        question_text = q[0] if idx == 0 else f"{q[0]} ({idx + 1})"
        questions.append({
            "question": question_text,
            "options": [q[1], q[2], q[3], q[4]],
            "correct": q[5],
            "explanation": "To'g'ri javob asoslangan holda tanlandi.",
        })
    return questions[:count]


@router.post("/test", response_model=GenerateTestResponse)
async def generate_test(
    data: GenerateTestRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    questions = local_test(data.topic, data.question_count)

    subject = None
    if data.subject_id:
        subject = db.query(Subject).filter(Subject.id == data.subject_id).first()
    if subject is None:
        topic_clean = data.topic.strip().lower()
        subject = (
            db.query(Subject)
            .filter(Subject.name.ilike(f"%{topic_clean}%"))
            .first()
        )

    if settings.has_ai_key:
        system = f"{TEST_LANG_SYSTEM.get(data.language, TEST_LANG_SYSTEM['uz'])}. Natijani quyidagi JSON formatda qaytaring: {{\"questions\":[{{\"question\":\"...\",\"options\":[\"a\",\"b\",\"c\",\"d\"],\"correct\":\"A\",\"explanation\":\"...\"}}]}}"
        user = f"«{data.topic}» mavzusida {data.question_count} ta test savoli yarating."
        raw = await chat_completion(system, user, temperature=0.8)
        if raw:
            try:
                parsed = parse_json_response(raw)
                qs = parsed.get("questions", [])
                if qs and isinstance(qs, list):
                    normalized = []
                    for q in qs:
                        opts = q.get("options") or []
                        normalized.append({
                            "question": q.get("question", ""),
                            "options": (opts + ["", "", "", ""])[:4],
                            "correct": (q.get("correct") or "A").upper(),
                            "explanation": q.get("explanation", ""),
                        })
                    if normalized:
                        questions = normalized
            except (json.JSONDecodeError, TypeError, ValueError, AttributeError):
                pass

    # Save generated test to DB
    test = Test(
        title=f"{data.topic} — Test",
        subject_id=subject.id if subject else None,
        description=f"AI tomonidan «{data.topic}» mavzusida yaratilgan test",
        level=data.level or current_user.level or "school",
        grade=data.grade if data.grade is not None else (current_user.grade or 9),
        is_ai_generated=True,
        created_by=current_user.id,
    )
    db.add(test)
    db.flush()
    for q in questions:
        opts = q.get("options") or []
        db.add(TestQuestion(
            test_id=test.id,
            question_text=q.get("question", ""),
            option_a=opts[0] if len(opts) > 0 else None,
            option_b=opts[1] if len(opts) > 1 else None,
            option_c=opts[2] if len(opts) > 2 else None,
            option_d=opts[3] if len(opts) > 3 else None,
            correct_answer=q.get("correct", "A"),
            explanation=q.get("explanation", ""),
        ))
    db.commit()

    return GenerateTestResponse(title=f"{data.topic} — Test", questions=questions)