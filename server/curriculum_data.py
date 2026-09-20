"""TalabaGo — Keng qamrovli Dasturlash Ta'lim Dasturi
Python Asoslari (8 dars), Django Backend (8 dars), Algoritmlar va Data Structures (8 dars).
Jami 24 ta to'liq amaliy masterklass darslari.
"""

CURRICULUM = [
    {
        "id": "python",
        "title": "Python Dasturlash Asoslari",
        "description": "Noldan professional darajagacha: Sintaksis, ma'lumot turlari, funksiyalar, xatoliklar va OOP.",
        "icon": "🐍",
        "lessons": [
            {
                "id": "py-1",
                "slug": "variables-and-data-types",
                "title": "1-Dars: O'zgaruvchilar va Ma'lumot turlari",
                "track": "python",
                "track_title": "Python Asoslari",
                "summary": "int, float, str, bool turlari va f-string orqali formatlash.",
                "content": """# 1-Dars: O'zgaruvchilar va Ma'lumot turlari

Python — dunyodagi eng ommabop, tushunarli va kuchli dasturlash tillaridan biri.

### 1. Asosiy ma'lumot turlari:
```python
ism = "Ali"           # str (matn/string)
yosh = 20             # int (butun son)
stipendiya = 750.50   # float (o'nlik/haqiqiy son)
talabami = True       # bool (mantiqiy: True yoki False)
```

### 2. Formatlangan matn (f-strings):
Python 3.6+ da matn ichida o'zgaruvchilarni qulay joylash uchun `f"..."` ishlatiladi:
```python
print(f"Salom, {ism}! Siz {yosh} yoshdasiz.")
```

---
### Amaliy topshiriq:
`a = 15` va `b = 25` sonlari berilgan. Ularning yig'indisini hisoblab, ekranga `Natija: 40` ko'rinishida chop eting.
""",
                "exercises": [
                    {
                        "id": "py-ex-1",
                        "title": "Sonlar yig'indisi",
                        "difficulty": "oson",
                        "description": "a = 15 va b = 25 sonlarining yig'indisini hisoblang va 'Natija: 40' deb print qiling.",
                        "initial_code": "a = 15\nb = 25\n# Yig'indini hisoblang va 'Natija: ...' deb chop eting:\n",
                        "test_cases": [{"expected_output": "Natija: 40"}],
                        "hint": "print(f'Natija: {a + b}') yozing.",
                    }
                ],
            },
            {
                "id": "py-2",
                "slug": "conditions-and-logic",
                "title": "2-Dars: Shart operatorlari (if, elif, else)",
                "track": "python",
                "track_title": "Python Asoslari",
                "summary": "Dastur oqimini shartlar orqali boshqarish va mantiqiy amallar.",
                "content": """# 2-Dars: Shart operatorlari (if, elif, else)

Dasturlashda qaror qabul qilish va tarmoqlanish uchun `if`, `elif` va `else` ishlatiladi.

### Sintaksis:
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

### Juft va toq sonni tekshirish:
Sonning 2 ga qoldiqsiz bo'linishini tekshirish uchun `%` (modul) amali qo'llaniladi:
```python
if son % 2 == 0:
    print("Juft")
else:
    print("Toq")
```
""",
                "exercises": [
                    {
                        "id": "py-ex-2",
                        "title": "Juft yoki Toq sonni aniqlash",
                        "difficulty": "oson",
                        "description": "Berilgan n = 42 sonini tekshiring. Juft bo'lsa 'Juft', toq bo'lsa 'Toq' deb chiqaring.",
                        "initial_code": "n = 42\n# n juft bo'lsa 'Juft', aks holda 'Toq' deb chiqaring:\n",
                        "test_cases": [{"expected_output": "Juft"}],
                        "hint": "if n % 2 == 0: print('Juft') else: print('Toq')",
                    }
                ],
            },
            {
                "id": "py-3",
                "slug": "loops-and-lists",
                "title": "3-Dars: Ro'yxatlar (Lists) va Sikllar (Loops)",
                "track": "python",
                "track_title": "Python Asoslari",
                "summary": "for va while sikllari, list metodlari va range() funksiyasi.",
                "content": """# 3-Dars: Ro'yxatlar va Sikllar

Ro'yxat (`list`) bir nechta qiymatni ketma-ket tartibda saqlash imkonini beradi.

```python
baholar = [85, 92, 78, 90, 88]
baholar.append(95)  # Yangi element qo'shish

# for sikli orqali aylanib chiqish:
for b in baholar:
    if b >= 90:
        print(f"Yuqori ball: {b}")
```

### List comprehension (Qisqa usul):
```python
musbat = [x for x in numbers if x > 0]
```
""",
                "exercises": [
                    {
                        "id": "py-ex-3",
                        "title": "Musbat sonlar yig'indisi",
                        "difficulty": "o'rta",
                        "description": "numbers = [10, -5, 20, -3, 15] ro'yxatidagi faqat musbat sonlar yig'indisini toping va chop eting.",
                        "initial_code": "numbers = [10, -5, 20, -3, 15]\n# Faqat musbat sonlar yig'indisini hisoblab chop eting:\n",
                        "test_cases": [{"expected_output": "45"}],
                        "hint": "sum([x for x in numbers if x > 0]) yoki for siklidan foydalaning.",
                    }
                ],
            },
            {
                "id": "py-4",
                "slug": "dictionaries-and-sets",
                "title": "4-Dars: Lug'atlar (Dictionaries) va To'plamlar (Sets)",
                "track": "python",
                "track_title": "Python Asoslari",
                "summary": "Kalit-qiymat (Key-Value) juftliklari bilan ishlash va unikal to'plamlar.",
                "content": """# 4-Dars: Lug'atlar (dict) va To'plamlar (set)

### Lug'at (`dict`):
Kalit va qiymat ko'rinishida ma'lumot saqlash:
```python
talaba = {
    "ism": "Jasur",
    "kurs": 3,
    "fakultet": "Dasturiy injiniring"
}
print(talaba["ism"])  # 'Jasur'
```

### To'plam (`set`):
Takrorlanmas (unikal) elementlar to'plami:
```python
unikal = set([1, 2, 2, 3, 3, 4])  # {1, 2, 3, 4}
```
""",
                "exercises": [
                    {
                        "id": "py-ex-4",
                        "title": "O'rtacha ballni hisoblash",
                        "difficulty": "o'rta",
                        "description": "grades = {'matematika': 90, 'fizika': 80, 'ingliz': 100}. Fanlarning o'rtacha ballini butun son ko'rinishida (int) chop eting (90).",
                        "initial_code": "grades = {'matematika': 90, 'fizika': 80, 'ingliz': 100}\n# O'rtacha ballni hisoblab chop eting:\n",
                        "test_cases": [{"expected_output": "90"}],
                        "hint": "values = list(grades.values()); print(int(sum(values) / len(values)))",
                    }
                ],
            },
            {
                "id": "py-5",
                "slug": "functions-and-args",
                "title": "5-Dars: Funksiyalar va Parametrlar",
                "track": "python",
                "track_title": "Python Asoslari",
                "summary": "def operatori, return, default argumentlar va lambda.",
                "content": """# 5-Dars: Funksiyalar

Funksiya — ma'lum bir vazifani bajaruvchi qayta ishlatiluvchi kod bloki.

```python
def daraja(asos, daraja_son=2):
    return asos ** daraja_son

print(daraja(5))     # 25
print(daraja(2, 3))  # 8
```

### Rekursiv funksiya:
Funksiya o'z-o'zini chaqirishi rekursiya deyiladi (masalan, faktorial).
""",
                "exercises": [
                    {
                        "id": "py-ex-5",
                        "title": "Faktorial hisoblovchi funksiya",
                        "difficulty": "o'rta",
                        "description": "factorial(n) funksiyasini yozing va factorial(5) natijasini chop eting (120).",
                        "initial_code": "def factorial(n):\n    # Kodingizni yozing:\n    pass\n\nprint(factorial(5))\n",
                        "test_cases": [{"expected_output": "120"}],
                        "hint": "if n <= 1: return 1 else: return n * factorial(n - 1)",
                    }
                ],
            },
            {
                "id": "py-6",
                "slug": "string-manipulation",
                "title": "6-Dars: Matn (String) Metodlari va Formatlash",
                "track": "python",
                "track_title": "Python Asoslari",
                "summary": "split(), join(), replace(), strip() va slice amallari.",
                "content": """# 6-Dars: String Metodlari

Matnlar bilan ishlash backend va ma'lumotlarni tahlil qilishda eng ko'p qo'llaniladi.

```python
matn = "  Python, Django, FastAPI  "
toza = matn.strip()  # Bo'sh joylarni tozalash
tillar = [t.strip() for t in toza.split(",")]  # ['Python', 'Django', 'FastAPI']
birlashgan = " -> ".join(tillar)
```
""",
                "exercises": [
                    {
                        "id": "py-ex-6",
                        "title": "So'zlarni teskari tartibda birlashtirish",
                        "difficulty": "o'rta",
                        "description": "sentence = 'TalabaGo platformasida dasturlash'. So'zlarni teskari tartibda joylashtirib: 'dasturlash platformasida TalabaGo' ko'rinishida chop eting.",
                        "initial_code": "sentence = 'TalabaGo platformasida dasturlash'\n# So'zlarni teskari tartibda birlashtirib chop eting:\n",
                        "test_cases": [{"expected_output": "dasturlash platformasida TalabaGo"}],
                        "hint": "words = sentence.split(); print(' '.join(words[::-1]))",
                    }
                ],
            },
            {
                "id": "py-7",
                "slug": "error-handling",
                "title": "7-Dars: Xatoliklar bilan ishlash (Exceptions)",
                "track": "python",
                "track_title": "Python Asoslari",
                "summary": "try, except, else va finally bloklari orqali xatoliklarni oldini olish.",
                "content": """# 7-Dars: Xatoliklarni boshqarish (Exceptions)

Dastur to'xtab qolmasligi uchun kutilmagan vaziyatlarni `try-except` bilan tutish kerak.

```python
try:
    son = int("123")
    natija = 10 / 2
except ZeroDivisionError:
    print("Nolga bo'lish mumkin emas!")
except ValueError:
    print("Noto'g'ri qiymat kiritildi!")
finally:
    print("Amal yakunlandi.")
```
""",
                "exercises": [
                    {
                        "id": "py-ex-7",
                        "title": "Xavfsiz bo'lish (Safe Divide)",
                        "difficulty": "o'rta",
                        "description": "safe_divide(a, b) funksiyasini yarating. Nolga bo'linganda 'Xatolik: Nolga bolinmaydi' qaytarsin, aks holda a/b natijasini qaytarsin. safe_divide(10, 0) ni chop eting.",
                        "initial_code": "def safe_divide(a, b):\n    # try-except orqali xatolikni tuting:\n    pass\n\nprint(safe_divide(10, 0))\n",
                        "test_cases": [{"expected_output": "Xatolik: Nolga bolinmaydi"}],
                        "hint": "try: return a / b except ZeroDivisionError: return 'Xatolik: Nolga bolinmaydi'",
                    }
                ],
            },
            {
                "id": "py-8",
                "slug": "oop-classes-and-inheritance",
                "title": "8-Dars: Obyektga Yo'naltirilgan Dasturlash (OOP)",
                "track": "python",
                "track_title": "Python Asoslari",
                "summary": "Klasslar, obyektlar, __init__, metodlar va merosxo'rlik (Inheritance).",
                "content": """# 8-Dars: OOP (Klasslar va Merosxo'rlik)

OOP dasturni real hayotdagi obyektlar ko'rinishida modellashtirish imkonini beradi.

```python
class Foydalanuvchi:
    def __init__(self, ism, email):
        self.ism = ism
        self.email = email

    def salom(self):
        return f"Salom, men {self.ism}man!"

class Talaba(Foydalanuvchi):
    def __init__(self, ism, email, kurs):
        super().__init__(ism, email)
        self.kurs = kurs
```
""",
                "exercises": [
                    {
                        "id": "py-ex-8",
                        "title": "Talaba klassi va baholash metodi",
                        "difficulty": "o'rta",
                        "description": "Talaba nomli klass yarating (__init__ ichida ism, ball qabul qilsin). status() metodi ball >= 60 bo'lsa 'Otdi', aks holda 'Yiqildi' qaytarsin. t = Talaba('Ali', 85) yaratib, print(t.status()) qiling.",
                        "initial_code": "class Talaba:\n    # Klass va status metodini yozing:\n    pass\n\nt = Talaba('Ali', 85)\nprint(t.status())\n",
                        "test_cases": [{"expected_output": "Otdi"}],
                        "hint": "def status(self): return 'Otdi' if self.ball >= 60 else 'Yiqildi'",
                    }
                ],
            },
        ],
    },
    {
        "id": "django",
        "title": "Django Web Framework & REST API",
        "description": "Professional backend veb dasturlash: MVT, Modellar, ORM, Serializers, APIView va JWT.",
        "icon": "🌐",
        "lessons": [
            {
                "id": "dj-1",
                "slug": "mvt-and-architecture",
                "title": "1-Dars: Django MVT Arxitekturasi va Loyiha Tuzilishi",
                "track": "django",
                "track_title": "Django Framework",
                "summary": "Model-View-Template tamoyili, settings.py va apps strukturasi.",
                "content": """# 1-Dars: Django MVT Arxitekturasi

Django — dunyoning eng mashhur veb ramkalaridan biri (Instagram, Pinterest, Spotify uni ishlatadi).

### MVT qanday ishlaydi?
1. **Model:** Ma'lumotlar bazasi jadvallari va ma'lumotlar tuzilishi (Python klasslari).
2. **View:** Biznes mantiq — foydalanuvchi so'rovini qabul qilib, ma'lumotni qaytaradi.
3. **Template:** Foydalanuvchiga ko'rsatiladigan vizual sahifa (HTML yoki REST API da JSON).

Django loyihasida barcha ilovalar `INSTALLED_APPS` ro'yxatida ro'yxatdan o'tishi shart.
""",
                "exercises": [
                    {
                        "id": "dj-ex-1",
                        "title": "Django App konfiguratsiyasi",
                        "difficulty": "oson",
                        "description": "apps = ['django.contrib.auth', 'core.apps.CoreConfig', 'api']. Ro'yxatdan 'api' mavjudligini tekshirib, agar bo'lsa 'API ilovasi faol' deb chop eting.",
                        "initial_code": "apps = ['django.contrib.auth', 'core.apps.CoreConfig', 'api']\n# 'api' mavjud bo'lsa 'API ilovasi faol' deb chiqaring:\n",
                        "test_cases": [{"expected_output": "API ilovasi faol"}],
                        "hint": "if 'api' in apps: print('API ilovasi faol')",
                    }
                ],
            },
            {
                "id": "dj-2",
                "slug": "models-and-orm",
                "title": "2-Dars: Django Modellar va ORM So'rovlari",
                "track": "django",
                "track_title": "Django Framework",
                "summary": "models.Model, maydon turlari, objects.filter() va QuerySets.",
                "content": """# 2-Dars: Django Modellar va ORM

Django ORM (Object-Relational Mapping) SQL so'rovlarini to'g'ridan-to'g'ri Python kodida yozish imkonini beradi.

```python
from django.db import models

class Kitob(models.Model):
    nomi = models.CharField(max_length=200)
    muallif = models.CharField(max_length=100)
    narx = models.IntegerField()
    faol = models.BooleanField(default=True)
```

### ORM so'rovlari:
- `Kitob.objects.all()` — barcha kitoblar
- `Kitob.objects.filter(faol=True)` — faqat faol kitoblar
- `Kitob.objects.get(id=1)` — bitta kitobni olish
""",
                "exercises": [
                    {
                        "id": "dj-ex-2",
                        "title": "ORM uslubida filtrlash",
                        "difficulty": "o'rta",
                        "description": "books = [{'nomi': 'Python', 'faol': True}, {'nomi': 'Java', 'faol': False}, {'nomi': 'Django', 'faol': True}]. Faqat faol kitoblar sonini chop eting (2).",
                        "initial_code": "books = [{'nomi': 'Python', 'faol': True}, {'nomi': 'Java', 'faol': False}, {'nomi': 'Django', 'faol': True}]\n# Faol kitoblar sonini hisoblab chop eting:\n",
                        "test_cases": [{"expected_output": "2"}],
                        "hint": "faol_soni = len([b for b in books if b['faol']]); print(faol_soni)",
                    }
                ],
            },
            {
                "id": "dj-3",
                "slug": "model-relationships",
                "title": "3-Dars: Bog'langan Modellar (ForeignKey & ManyToMany)",
                "track": "django",
                "track_title": "Django Framework",
                "summary": "Bir-biriga bog'langan jadvallar: ForeignKey, OneToOneField, ManyToManyField.",
                "content": """# 3-Dars: Bog'langan modellar (Relationships)

Haqiqiy loyihalarda jadvallar bir-biri bilan bog'lanadi:
- **ForeignKey (1:N):** Bitta Universitetda ko'plab Talabalar o'qiydi.
- **ManyToManyField (M:N):** Bitta Talaba ko'plab Kurslarga yozilishi mumkin.
- **OneToOneField (1:1):** Har bir Talabaning bitta Profili bo'ladi.

```python
class Universitet(models.Model):
    nomi = models.CharField(max_length=100)

class Talaba(models.Model):
    ism = models.CharField(max_length=100)
    universitet = models.ForeignKey(Universitet, on_delete=models.CASCADE, related_name='talabalar')
```
""",
                "exercises": [
                    {
                        "id": "dj-ex-3",
                        "title": "ForeignKey bog'liqlik hisobi",
                        "difficulty": "o'rta",
                        "description": "talabalar = [{'ism': 'Ali', 'uni_id': 1}, {'ism': 'Vali', 'uni_id': 1}, {'ism': 'Olim', 'uni_id': 2}]. uni_id == 1 bo'lgan universitet talabalari ismlarini vergul bilan chop eting ('Ali, Vali').",
                        "initial_code": "talabalar = [{'ism': 'Ali', 'uni_id': 1}, {'ism': 'Vali', 'uni_id': 1}, {'ism': 'Olim', 'uni_id': 2}]\n# uni_id == 1 talabalari ismlarini vergul bilan chiqaring:\n",
                        "test_cases": [{"expected_output": "Ali, Vali"}],
                        "hint": "names = [t['ism'] for t in talabalar if t['uni_id'] == 1]; print(', '.join(names))",
                    }
                ],
            },
            {
                "id": "dj-4",
                "slug": "views-and-urls",
                "title": "4-Dars: Views va URL Marshrutlash (Routing)",
                "track": "django",
                "track_title": "Django Framework",
                "summary": "urls.py path(), HttpRequest, HttpResponse va JsonResponse bilan ishlash.",
                "content": """# 4-Dars: Views va URLs

View — foydalanuvchi so'rovini (`request`) olib, unga mos javob (`response`) qaytaruvchi funksiya yoki klass.

```python
from django.http import JsonResponse
from django.urls import path

def salom_view(request):
    return JsonResponse({"xabar": "Xush kelibsiz!"})

urlpatterns = [
    path('api/salom/', salom_view, name='salom'),
]
```
""",
                "exercises": [
                    {
                        "id": "dj-ex-4",
                        "title": "JsonResponse yaratish",
                        "difficulty": "o'rta",
                        "description": "import json yordamida {'status': 'ok', 'kod': 200} lug'atini JSON satriga aylantirib chop eting.",
                        "initial_code": "import json\n\ndata = {'status': 'ok', 'kod': 200}\n# JSON string ko'rinishida chop eting:\n",
                        "test_cases": [{"expected_output": '{"status": "ok", "kod": 200}'}],
                        "hint": "print(json.dumps(data))",
                    }
                ],
            },
            {
                "id": "dj-5",
                "slug": "drf-serializers",
                "title": "5-Dars: Django REST Framework (DRF) & Serializers",
                "track": "django",
                "track_title": "Django Framework",
                "summary": "Serializers orqali Python obyektlarini JSON formatiga o'tkazish va validatsiya.",
                "content": """# 5-Dars: DRF Serializers

Serializerlar ikki asosiy vazifani bajaradi:
1. **Serialization:** Murakkab Model obyektlarini JSON ko'rinishiga o'tkazish.
2. **Deserialization & Validation:** Foydalanuvchi yuborgan JSON ma'lumotlarni tekshirib, bazaga saqlash.

```python
from rest_framework import serializers

class TalabaSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    ism = serializers.CharField(max_length=100)
    stipendiya = serializers.FloatField()
```
""",
                "exercises": [
                    {
                        "id": "dj-ex-5",
                        "title": "Serializer validatsiyasi",
                        "difficulty": "o'rta",
                        "description": "data = {'email': 'test@talabago.uz', 'age': 19}. Agar age >= 18 bo'lsa 'Valid', aks holda 'Invalid' deb chiqaring.",
                        "initial_code": "data = {'email': 'test@talabago.uz', 'age': 19}\n# Yosh 18 dan katta yoki tengligini tekshiring:\n",
                        "test_cases": [{"expected_output": "Valid"}],
                        "hint": "print('Valid' if data.get('age', 0) >= 18 else 'Invalid')",
                    }
                ],
            },
            {
                "id": "dj-6",
                "slug": "drf-apiview",
                "title": "6-Dars: DRF Class-Based Views va APIView",
                "track": "django",
                "track_title": "Django Framework",
                "summary": "APIView, get(), post(), put(), delete() metodlari va Response obyekti.",
                "content": """# 6-Dars: DRF APIView

Class-Based Views yordamida HTTP metodlarini (GET, POST, PUT, DELETE) alohida metodlar ko'rinishida yozish osonlashadi:

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class TalabaListAPIView(APIView):
    def get(self, request):
        talabalar = Talaba.objects.all()
        serializer = TalabaSerializer(talabalar, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = TalabaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```
""",
                "exercises": [
                    {
                        "id": "dj-ex-6",
                        "title": "HTTP Metod taqsimlagich",
                        "difficulty": "o'rta",
                        "description": "method = 'GET'. Agar method == 'GET' bo'lsa '200 OK', 'POST' bo'lsa '201 Created' deb chiqaring.",
                        "initial_code": "method = 'GET'\n# HTTP metodiga mos javob kodini chiqaring:\n",
                        "test_cases": [{"expected_output": "200 OK"}],
                        "hint": "print('200 OK' if method == 'GET' else '201 Created')",
                    }
                ],
            },
            {
                "id": "dj-7",
                "slug": "drf-viewsets-and-routers",
                "title": "7-Dars: ViewSets va Routers (Avtomatik CRUD)",
                "track": "django",
                "track_title": "Django Framework",
                "summary": "ModelViewSet yordamida 5 qator kod bilan to'liq CRUD API yaratish.",
                "content": """# 7-Dars: ModelViewSet va DefaultRouter

`ModelViewSet` barcha 5 ta standart CRUD amallarini bitta klassda birlashtiradi:
1. `list` — barchasini olish (GET /api/talabalar/)
2. `create` — yangi qo'shish (POST /api/talabalar/)
3. `retrieve` — bittasini olish (GET /api/talabalar/1/)
4. `update` — tahrirlash (PUT /api/talabalar/1/)
5. `destroy` — o'chirish (DELETE /api/talabalar/1/)

```python
from rest_framework.viewsets import ModelViewSet
from rest_framework.routers import DefaultRouter

class TalabaViewSet(ModelViewSet):
    queryset = Talaba.objects.all()
    serializer_class = TalabaSerializer

router = DefaultRouter()
router.register('talabalar', TalabaViewSet)
```
""",
                "exercises": [
                    {
                        "id": "dj-ex-7",
                        "title": "CRUD amallari ro'yxati",
                        "difficulty": "o'rta",
                        "description": "actions = ['list', 'create', 'retrieve', 'update', 'destroy']. Jami CRUD amallari sonini chop eting (5).",
                        "initial_code": "actions = ['list', 'create', 'retrieve', 'update', 'destroy']\n# Amallar sonini chop eting:\n",
                        "test_cases": [{"expected_output": "5"}],
                        "hint": "print(len(actions))",
                    }
                ],
            },
            {
                "id": "dj-8",
                "slug": "jwt-and-permissions",
                "title": "8-Dars: JWT Autentifikatsiya va Ruxsatlar (Permissions)",
                "track": "django",
                "track_title": "Django Framework",
                "summary": "JSON Web Token (JWT), IsAuthenticated, IsAdminUser va xavfsizlik.",
                "content": """# 8-Dars: JWT va Ruxsatlar (Security)

Zamonaviy veb ilovalarda foydalanuvchini autentifikatsiya qilish uchun JWT (Access va Refresh tokenlar) ishlatiladi.

```python
from rest_framework.permissions import IsAuthenticated, IsAdminUser

class MaxfiyAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"foydalanuvchi": request.user.username})
```
""",
                "exercises": [
                    {
                        "id": "dj-ex-8",
                        "title": "Autentifikatsiya tekshiruvi",
                        "difficulty": "o'rta",
                        "description": "user = {'is_authenticated': True, 'username': 'talaba'}. Agar is_authenticated True bo'lsa 'Ruxsat berildi: talaba', aks holda '401 Unauthorized' chiqaring.",
                        "initial_code": "user = {'is_authenticated': True, 'username': 'talaba'}\n# Tekshirib chop eting:\n",
                        "test_cases": [{"expected_output": "Ruxsat berildi: talaba"}],
                        "hint": "print(f\"Ruxsat berildi: {user['username']}\" if user.get('is_authenticated') else '401 Unauthorized')",
                    }
                ],
            },
        ],
    },
    {
        "id": "algorithms",
        "title": "Algoritmlar va Ma'lumotlar Tuzilmalari",
        "description": "LeetCode va texnik intervyularga tayyorgarlik: Qidiruv, saralash, stek, navbat, rekursiya va DP.",
        "icon": "⚡",
        "lessons": [
            {
                "id": "algo-1",
                "slug": "big-o-notation",
                "title": "1-Dars: Big-O Notatsiyasi va Vaqt Murakkabligi",
                "track": "algorithms",
                "track_title": "Algoritmlar",
                "summary": "O(1), O(log N), O(N), O(N log N) va O(N^2) murakkabliklarini tushunish.",
                "content": """# 1-Dars: Big-O Notatsiyasi

Big-O algoritmlarning tezligi va xotira sarfini baholash uchun xalqaro standartdir.

| Notatsiya | Nomlanishi | Misol |
|---|---|---|
| **O(1)** | Doimiy (Constant) | Massiv elementini indeks orqali olish |
| **O(log N)** | Logarifmik | Ikkilik qidiruv (Binary Search) |
| **O(N)** | Chiziqli (Linear) | Massivni bitta for siklida aylanib chiqish |
| **O(N log N)** | Chiziqli-logarifmik | QuickSort, MergeSort |
| **O(N^2)** | Kvadratik | Ichma-ich ikkita for sikli |
""",
                "exercises": [
                    {
                        "id": "algo-ex-1",
                        "title": "Maksimal elementni O(N) da topish",
                        "difficulty": "oson",
                        "description": "nums = [14, 52, 88, 31, 99, 45]. Massivdagi eng katta elementni toping va chop eting (99).",
                        "initial_code": "nums = [14, 52, 88, 31, 99, 45]\n# Eng katta sonni toping va chop eting:\n",
                        "test_cases": [{"expected_output": "99"}],
                        "hint": "max_val = nums[0]; for x in nums: if x > max_val: max_val = x; print(max_val)",
                    }
                ],
            },
            {
                "id": "algo-2",
                "slug": "binary-search",
                "title": "2-Dars: Ikkilik Qidiruv (Binary Search)",
                "track": "algorithms",
                "track_title": "Algoritmlar",
                "summary": "Tartiblangan massivda O(log N) tezlikda element qidirish algoritmi.",
                "content": """# 2-Dars: Ikkilik Qidiruv (Binary Search)

Tartiblangan massivda qidiruvni O(log N) vaqtda bajarishning eng optimal usuli. Har bir qadamda qidiruv maydoni teng ikkiga qisqaradi.

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
                        "id": "algo-ex-2",
                        "title": "Binary Search implementatsiyasi",
                        "difficulty": "o'rta",
                        "description": "nums = [1, 3, 5, 7, 9, 11, 13] va target = 9. 9 sonining indeksini binary search yordamida toping va print qiling (4).",
                        "initial_code": "nums = [1, 3, 5, 7, 9, 11, 13]\ntarget = 9\n# Binary search orqali indeksni topib chop eting:\n",
                        "test_cases": [{"expected_output": "4"}],
                        "hint": "Ikkilik qidiruv orqali indeks 4 ekanligini toping.",
                    }
                ],
            },
            {
                "id": "algo-3",
                "slug": "two-pointers-two-sum",
                "title": "3-Dars: Two Pointers Texnikasi & Two Sum",
                "track": "algorithms",
                "track_title": "Algoritmlar",
                "summary": "O(N) vaqtda massiv bilan ishlash — LeetCode #1 Two Sum masalasi.",
                "content": """# 3-Dars: Two Pointers & Two Sum

Two Pointers — massivning boshi va oxiridan ikkita ko'rsatkich yordamida harakatlanish texnikasi.

### Two Sum masalasi:
Berilgan massivdan yig'indisi maqsadli songa teng bo'lgan ikki son indeksini topish.
Eng tezkor usul — `hashmap` (lug'at) ishlatish:
```python
seen = {}
for i, num in enumerate(nums):
    diff = target - num
    if diff in seen:
        return [seen[diff], i]
    seen[num] = i
```
""",
                "exercises": [
                    {
                        "id": "algo-ex-3",
                        "title": "Two Sum yechimi",
                        "difficulty": "o'rta",
                        "description": "nums = [2, 7, 11, 15] va target = 9. Yig'indisi 9 bo'lgan elementlar indekslarini [0, 1] ko'rinishida chop eting.",
                        "initial_code": "nums = [2, 7, 11, 15]\ntarget = 9\n# Indekslarni [0, 1] ko'rinishida topib chop eting:\n",
                        "test_cases": [{"expected_output": "[0, 1]"}],
                        "hint": "seen = {}; for i, n in enumerate(nums): if target - n in seen: print([seen[target-n], i]); break; seen[n] = i",
                    }
                ],
            },
            {
                "id": "algo-4",
                "slug": "sorting-algorithms",
                "title": "4-Dars: Saralash Algoritmlari (QuickSort & BubbleSort)",
                "track": "algorithms",
                "track_title": "Algoritmlar",
                "summary": "O(N^2) dan O(N log N) gacha: Elementlarni saralash mexanizmlari.",
                "content": """# 4-Dars: Saralash Algoritmlari

### QuickSort (Tezkor saralash):
Bo'lib tashla va hukmronlik qil (Divide and Conquer) tamoyiliga asoslangan eng tezkor saralash usullaridan biri.

```python
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)
```
""",
                "exercises": [
                    {
                        "id": "algo-ex-4",
                        "title": "Massivni saralash",
                        "difficulty": "o'rta",
                        "description": "nums = [64, 34, 25, 12, 22, 11, 90]. Massivni o'sish tartibida saralab, [11, 12, 22, 25, 34, 64, 90] ko'rinishida chop eting.",
                        "initial_code": "nums = [64, 34, 25, 12, 22, 11, 90]\n# Saralangan massivni chop eting:\n",
                        "test_cases": [{"expected_output": "[11, 12, 22, 25, 34, 64, 90]"}],
                        "hint": "print(sorted(nums)) yoki quicksort funksiyasidan foydalaning.",
                    }
                ],
            },
            {
                "id": "algo-5",
                "slug": "stack-data-structure",
                "title": "5-Dars: Stack (Stek - LIFO) va To'g'ri Qavslar",
                "track": "algorithms",
                "track_title": "Algoritmlar",
                "summary": "Last In First Out (LIFO) printsipi va LeetCode Valid Parentheses masalasi.",
                "content": """# 5-Dars: Stack (Stek)

Stek — oxirgi kirgan element birinchi chiqadigan (LIFO) ma'lumotlar tuzilmasi.
Klassik misol: Brauzerning 'Orqaga' (Back) tugmasi yoki matn muharrirlaridagi 'Undo' amali.

### Qavslar ketma-ketligi (Valid Parentheses):
```python
def is_valid(s):
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    return not stack
```
""",
                "exercises": [
                    {
                        "id": "algo-ex-5",
                        "title": "To'g'ri qavslar ketma-ketligi",
                        "difficulty": "o'rta",
                        "description": "s = '()[]{}'. Qavslar to'g'ri yopilgan bo'lsa True, aks holda False deb chop eting.",
                        "initial_code": "s = '()[]{}'\n# Qavslar to'g'riligini tekshiring:\n",
                        "test_cases": [{"expected_output": "True"}],
                        "hint": "Ochuvchi qavslarni stackga soling, yopuvchi kelganda mosligini tekshiring.",
                    }
                ],
            },
            {
                "id": "algo-6",
                "slug": "queue-and-bfs",
                "title": "6-Dars: Navbat (Queue - FIFO) va Kenglik Qidiruv (BFS)",
                "track": "algorithms",
                "track_title": "Algoritmlar",
                "summary": "First In First Out (FIFO) va graf/daraxtlarni qatlamlar bo'yicha qidirish.",
                "content": """# 6-Dars: Navbat (Queue) va BFS

Navbat — birinchi kirgan element birinchi chiqadigan (FIFO) tuzilma.
Python-da samarali navbat uchun `collections.deque` ishlatiladi (`popleft()` amali O(1)).

```python
from collections import deque

queue = deque(["Ali", "Vali", "Gani"])
queue.append("Jasur")
birinchi = queue.popleft()  # 'Ali'
```
""",
                "exercises": [
                    {
                        "id": "algo-ex-6",
                        "title": "Queue simulyatsiyasi",
                        "difficulty": "oson",
                        "description": "from collections import deque yordamida q = deque([1, 2, 3]) yarating. q.popleft() bajargandan so'ng navbatdagi elementlar ro'yxatini [2, 3] deb chop eting.",
                        "initial_code": "from collections import deque\n# q = deque([1, 2, 3]) yarating va popleft() qilib list(q) ni chop eting:\n",
                        "test_cases": [{"expected_output": "[2, 3]"}],
                        "hint": "q = deque([1, 2, 3]); q.popleft(); print(list(q))",
                    }
                ],
            },
            {
                "id": "algo-7",
                "slug": "recursion-and-backtracking",
                "title": "7-Dars: Rekursiya va Backtracking Asoslari",
                "track": "algorithms",
                "track_title": "Algoritmlar",
                "summary": "Baza holat (base case), rekursiv qadam va barcha kombinatsiyalarni izlash.",
                "content": """# 7-Dars: Rekursiya

Rekursiya — funksiyaning o'zini-o'zi kichikroq parametr bilan qayta chaqirishi.
Ikkita asosiy qoidasi:
1. **Baza holat (Base Case):** Rekursiya qachon to'xtashini belgilaydi.
2. **Rekursiv qadam:** Muammoni soddaroq ko'rinishga keltirish.

```python
def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)
```
""",
                "exercises": [
                    {
                        "id": "algo-ex-7",
                        "title": "Fibonachchi soni",
                        "difficulty": "o'rta",
                        "description": "n = 6 bo'lganda 6-Fibonachchi sonini hisoblang va chop eting (8). [0, 1, 1, 2, 3, 5, 8...]",
                        "initial_code": "def fib(n):\n    # Rekursiv yoki iterativ hisoblang:\n    pass\n\nprint(fib(6))\n",
                        "test_cases": [{"expected_output": "8"}],
                        "hint": "if n <= 1: return n else: return fib(n-1) + fib(n-2)",
                    }
                ],
            },
            {
                "id": "algo-8",
                "slug": "dynamic-programming",
                "title": "8-Dars: Dinamik Dasturlash (Dynamic Programming - DP)",
                "track": "algorithms",
                "track_title": "Algoritmlar",
                "summary": "Memoization (eslab qolish) va Tabulation orqali O(2^N) dan O(N) ga optimallashtirish.",
                "content": """# 8-Dars: Dinamik Dasturlash (DP)

Dinamik dasturlash — katta muammoni kichik bo'laklarga bo'lib, har bir bo'lak natijasini keshda (xotirada) saqlash orqali qayta hisoblashdan qochish usuli.

### Zina masalasi (Climbing Stairs):
N ta pog'onali zinaga chiqish kerak. Har qadamda 1 yoki 2 ta pog'ona ko'tarilish mumkin.
N ta pog'onaga chiqish usullari soni:
```python
def climb_stairs(n):
    if n <= 2:
        return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b
```
""",
                "exercises": [
                    {
                        "id": "algo-ex-8",
                        "title": "Zina pog'onalari (Climbing Stairs)",
                        "difficulty": "qiyin",
                        "description": "n = 5 ta pog'onali zinaga chiqish usullari sonini hisoblang va chop eting (8).",
                        "initial_code": "def climb_stairs(n):\n    # DP orqali hisoblang:\n    pass\n\nprint(climb_stairs(5))\n",
                        "test_cases": [{"expected_output": "8"}],
                        "hint": "climb_stairs(5) natijasi 8 ga teng.",
                    }
                ],
            },
        ],
    },
]
