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

# Educational curriculum data
CURRICULUM = [
    {
        "id": "python",
        "title": "Python Dasturlash Asoslari",
        "description": "Noldan professional darajagacha Python: sintaksis, ma'lumot turlari, funksiyalar va OOP.",
        "icon": "🐍",
        "lessons": [
            {
                "id": "py-1",
                "slug": "variables-and-data-types",
                "title": "1-Dars: O'zgaruvchilar va Ma'lumot turlari",
                "track": "python",
                "track_title": "Python Asoslari",
                "summary": "Python-da int, float, str, bool turlari bilan ishlash va f-string orqali formatlash.",
                "content": """# 1-Dars: O'zgaruvchilar va Ma'lumot turlari

Python - o'rganish oson, lekin nihoyatda kuchli dasturlash tili.

### 1. O'zgaruvchilar e'lon qilish:
```python
ism = "Ali"           # str (matn)
yosh = 20             # int (butun son)
stipendiya = 750.50   # float (haqiqiy son)
talabami = True       # bool (mantiqiy: True/False)
```

### 2. Formatlangan matn (f-strings):
```python
print(f"Salom, {ism}! Siz {yosh} yoshdasiz.")
```

---
### Amaliy vazifa:
Quyidagi maydonda 2 ta son yig'indisini hisoblang va natijani `Natija: <yig'indi>` ko'rinishida chop eting.
""",
                "exercises": [
                    {
                        "id": "py-ex-1",
                        "title": "Sonlar yig'indisi",
                        "difficulty": "oson",
                        "description": "a = 15 va b = 25 sonlarining yig'indisini toping va 'Natija: 40' deb print qiling.",
                        "initial_code": "a = 15\nb = 25\n# Yig'indini hisoblang va 'Natija: ...' ko'rinishida chop eting\n",
                        "test_cases": [
                            {"expected_output": "Natija: 40"}
                        ],
                        "hint": "print(f'Natija: {a + b}') dan foydalaning.",
                    }
                ],
            },
            {
                "id": "py-2",
                "slug": "control-flow",
                "title": "2-Dars: Shart operatorlari (if, elif, else)",
                "track": "python",
                "track_title": "Python Asoslari",
                "summary": "Dastur oqimini shartlar yordamida boshqarish va mantiqiy amallar.",
                "content": """# 2-Dars: Shart operatorlari (if, elif, else)

Dasturlashda qaror qabul qilish uchun `if`, `elif` va `else` kalit so'zlari ishlatiladi.

```python
ball = 85

if ball >= 90:
    print("A'lo (5)")
elif ball >= 70:
    print("Yaxshi (4)")
elif ball >= 60:
    print("Qoniqarli (3)")
else:
    print("Qoniqarsiz (2)")
```
""",
                "exercises": [
                    {
                        "id": "py-ex-2",
                        "title": "Juft yoki toq son",
                        "difficulty": "oson",
                        "description": "Berilgan son juft bo'lsa 'Juft', aks holda 'Toq' deb chiqaring. (n = 42)",
                        "initial_code": "n = 42\n# Shart operatori yordamida tekshiring:\n",
                        "test_cases": [
                            {"expected_output": "Juft"}
                        ],
                        "hint": "n % 2 == 0 bo'lsa 'Juft', aks holda 'Toq'.",
                    }
                ],
            },
            {
                "id": "py-3",
                "slug": "loops-and-lists",
                "title": "3-Dars: Sikllar va Ro'yxatlar (Loops & Lists)",
                "track": "python",
                "track_title": "Python Asoslari",
                "summary": "for, while sikllari va ro'yxat (list) metodlari.",
                "content": """# 3-Dars: Sikllar va Ro'yxatlar

Ro'yxatlar elementlar to'plamini saqlaydi:
```python
mevalar = ["olma", "anor", "shaftoli"]
for meva in mevalar:
    print(meva)
```
""",
                "exercises": [
                    {
                        "id": "py-ex-3",
                        "title": "Musbat sonlar yig'indisi",
                        "difficulty": "o'rta",
                        "description": "numbers = [10, -5, 20, -3, 15] ro'yxatidagi faqat musbat sonlar yig'indisini toping va chop eting.",
                        "initial_code": "numbers = [10, -5, 20, -3, 15]\n# Faqat musbat sonlar yig'indisini toping\n",
                        "test_cases": [
                            {"expected_output": "45"}
                        ],
                        "hint": "sum([x for x in numbers if x > 0]) yoki for siklidan foydalaning.",
                    }
                ],
            },
            {
                "id": "py-4",
                "slug": "functions",
                "title": "4-Dars: Funksiyalar va Qayta ishlatiluvchanlik",
                "track": "python",
                "track_title": "Python Asoslari",
                "summary": "def kalit so'zi, parametrlar, return va recursion.",
                "content": """# 4-Dars: Funksiyalar

Funksiyalar bir xil kodni qayta-qayta yozmaslik imkonini beradi:
```python
def kvadrat(x):
    return x * x
```
""",
                "exercises": [
                    {
                        "id": "py-ex-4",
                        "title": "Faktorial hisoblovchi funksiya",
                        "difficulty": "o'rta",
                        "description": "factorial(n) funksiyasini yarating va factorial(5) natijasini chop eting (120).",
                        "initial_code": "def factorial(n):\n    # kodingizni yozing\n    pass\n\nprint(factorial(5))\n",
                        "test_cases": [
                            {"expected_output": "120"}
                        ],
                        "hint": "n == 1 bo'lsa 1, aks holda n * factorial(n-1).",
                    }
                ],
            },
        ],
    },
    {
        "id": "algorithms",
        "title": "Algoritmlar va Ma'lumotlar Tuzilmalari",
        "description": "LeetCode va texnik intervyularga tayyorgarlik: Qidiruv, saralash, dinamik dasturlash.",
        "icon": "⚡",
        "lessons": [
            {
                "id": "algo-1",
                "slug": "binary-search",
                "title": "1-Dars: Ikkilik qidiruv (Binary Search)",
                "track": "algorithms",
                "track_title": "Algoritmlar",
                "summary": "Tartiblangan massivda O(log N) tezlikda element qidirish algoritmi.",
                "content": """# 1-Dars: Ikkilik qidiruv (Binary Search)

Tartiblangan massivda qidiruvni O(log N) vaqtda bajarishning eng samarali usuli. Har bir qadamda qidiruv maydoni ikkiga bo'linadi.

```python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
```
""",
                "exercises": [
                    {
                        "id": "algo-ex-1",
                        "title": "Binary Search implementatsiyasi",
                        "difficulty": "o'rta",
                        "description": "Berilgan nums = [1, 3, 5, 7, 9, 11, 13] ro'yxatidan 9 sonining indeksini toping va print qiling.",
                        "initial_code": "nums = [1, 3, 5, 7, 9, 11, 13]\ntarget = 9\n\n# Binary search yordamida indeksni toping va print qiling:\n",
                        "test_cases": [
                            {"expected_output": "4"}
                        ],
                        "hint": "Ikkilik qidiruv algoritmidan foydalaning.",
                    }
                ],
            },
            {
                "id": "algo-2",
                "slug": "two-pointers-and-sorting",
                "title": "2-Dars: Two Pointers texnikasi & Two Sum",
                "track": "algorithms",
                "track_title": "Algoritmlar",
                "summary": "O(N) vaqt murakkabligida massiv bilan ishlash texnikasi.",
                "content": """# 2-Dars: Two Pointers texnikasi

Ikki ko'rsatkich yordamida massivning boshi va oxiridan harakatlanish ko'plab masalalarni soddalashtiradi.
""",
                "exercises": [
                    {
                        "id": "algo-ex-2",
                        "title": "Two Sum (Ikki son yig'indisi)",
                        "difficulty": "o'rta",
                        "description": "nums = [2, 7, 11, 15] va target = 9. Yig'indisi 9 ga teng bo'lgan ikki son indekslarini [0, 1] ko'rinishida chop eting.",
                        "initial_code": "nums = [2, 7, 11, 15]\ntarget = 9\n\n# Indekslarni toping va print qiling (masalan: [0, 1])\n",
                        "test_cases": [
                            {"expected_output": "[0, 1]"}
                        ],
                        "hint": "Lug'at (hashmap) yoki ikki for siklidan foydalanishingiz mumkin.",
                    }
                ],
            },
            {
                "id": "algo-3",
                "slug": "stack-valid-parentheses",
                "title": "3-Dars: Stack ma'lumotlar tuzilmasi va Qavslar",
                "track": "algorithms",
                "track_title": "Algoritmlar",
                "summary": "LIFO (Last In First Out) prinsipi va amaliy qo'llanishi.",
                "content": """# 3-Dars: Stack (Navbat/Stek)

Stek - so'nggi kirgan element birinchi chiqadigan (LIFO) ma'lumot tuzilmasi.
""",
                "exercises": [
                    {
                        "id": "algo-ex-3",
                        "title": "To'g'ri qavslar ketma-ketligi",
                        "difficulty": "qiyin",
                        "description": "s = '()[]{}' qavslari to'g'ri yopilgan bo'lsa True, aks holda False chiqaring.",
                        "initial_code": "s = '()[]{}'\n\ndef is_valid(s: str) -> bool:\n    # Stack yordamida tekshiring\n    pass\n\nprint(is_valid(s))\n",
                        "test_cases": [
                            {"expected_output": "True"}
                        ],
                        "hint": "Ochuvchi qavslarni stack ga soling, yopuvchi kelganda mosligini tekshiring.",
                    }
                ],
            },
        ],
    },
    {
        "id": "django",
        "title": "Django Web Framework & REST API",
        "description": "Zamonaviy backend veb dasturlash: Modellar, ORM, APIView, Serializers va Autentifikatsiya.",
        "icon": "🌐",
        "lessons": [
            {
                "id": "dj-1",
                "slug": "models-and-orm",
                "title": "1-Dars: Django Modellar va ORM so'rovlari",
                "track": "django",
                "track_title": "Django Framework",
                "summary": "SQL yozmasdan ma'lumotlar bazasi bilan ishlash - Django ORM.",
                "content": """# 1-Dars: Django Modellar va ORM

Django ORM yordamida Python klasslari ma'lumotlar bazasi jadvallariga aylanadi.

```python
# Masalan:
class Student:
    def __init__(self, name, stars, is_premium=False):
        self.name = name
        self.stars = stars
        self.is_premium = is_premium
```
""",
                "exercises": [
                    {
                        "id": "dj-ex-1",
                        "title": "Django uslubida Model va Filter yaratish",
                        "difficulty": "o'rta",
                        "description": "Talabalar ro'yxatidan faqat is_premium=True bo'lgan talabalar ismlarini chop eting.",
                        "initial_code": "students = [\n    {'name': 'Jasur', 'stars': 50, 'is_premium': True},\n    {'name': 'Madina', 'stars': 20, 'is_premium': False},\n    {'name': 'Aziz', 'stars': 85, 'is_premium': True},\n]\n\n# Faqat premium talabalar ismlarini vergul bilan chop eting (masalan: 'Jasur, Aziz')\n",
                        "test_cases": [
                            {"expected_output": "Jasur, Aziz"}
                        ],
                        "hint": "filter yoki list comprehension: ', '.join([s['name'] for s in students if s['is_premium']])",
                    }
                ],
            },
            {
                "id": "dj-2",
                "slug": "api-serializers",
                "title": "2-Dars: Django REST Framework & Serializers",
                "track": "django",
                "track_title": "Django Framework",
                "summary": "Ma'lumotlarni JSON ko'rinishida formatlash va validatsiya qilish.",
                "content": """# 2-Dars: DRF Serializers

API yaratishda ma'lumotlarni tekshirish va JSON formatiga o'tkazish serializerlar orqali amalga oshiriladi.
""",
                "exercises": [
                    {
                        "id": "dj-ex-2",
                        "title": "JSON Response generatsiyasi",
                        "difficulty": "o'rta",
                        "description": "import json yordamida {'status': 'success', 'code': 200} lug'atini JSON satriga aylantirib chop eting.",
                        "initial_code": "import json\n\ndata = {'status': 'success', 'code': 200}\n# JSON string ko'rinishida chop eting:\n",
                        "test_cases": [
                            {"expected_output": '{"status": "success", "code": 200}'}
                        ],
                        "hint": "json.dumps(data) dan foydalaning.",
                    }
                ],
            },
        ],
    },
]


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


# Security guard for code execution
FORBIDDEN_KEYWORDS = [
    "import os",
    "from os",
    "import subprocess",
    "from subprocess",
    "import sys",
    "from sys",
    "shutil",
    "__import__",
    "eval(",
    "exec(",
    "open(",
    "socket",
    "requests",
    "urllib",
    "rmtree",
]


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
                detail="Dasturlash amaliy laboratoriyasi (Python, Django, Algoritmlar) faqat Premium obunachilar uchun ochiq! Obunani atigi 15 000 so'mga faollashtiring.",
            )

    code = payload.code
    # Basic security check
    for bad in FORBIDDEN_KEYWORDS:
        if bad in code:
            return CodeRunResponse(
                stdout="",
                stderr=f"Xavfsizlik qoidasi: '{bad}' ishlatish taqiqlangan!",
                exit_code=1,
                success=False,
                exercise_completed=False,
                feedback="Kodda xavfli amallar aniqlandi.",
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
