"""IT, Dasturlash va DTM yo'nalishlari bo'yicha katta test banklari generatori."""
import random
from typing import List, Dict

def q(question: str, correct: str, wrong: List[str], exp: str = "") -> Dict:
    return {"question": question, "correct": correct, "wrong": wrong, "exp": exp}

def gen_python_questions(target: int = 400) -> List[Dict]:
    items = []
    
    # 1. Core Syntax & Data types
    core_questions = [
        q("Python-da o'zgarmas (immutable) ma'lumot turi qaysi?", "tuple", ["list", "dict", "set"], "Tuple elementlarini yaratilgandan keyin o'zgartirib bo'lmaydi."),
        q("Python-da ro'yxat (list) oxiriga yangi element qo'shish metodi qaysi?", "append()", ["add()", "push()", "insert()"], "append() metodi yangi elementni ro'yxat oxiriga qo'shadi."),
        q("Lug'atda (dict) mavjud bo'lmagan kalit chaqirilganda xatolik bermasdan standart qiymat qaytaruvchi metod?", "get()", ["fetch()", "find()", "lookup()"], "dict.get(key, default) kalit topilmasa xato chiqarmay default qiymat qaytaradi."),
        q("Quyidagi qator natijasi nima: `bool([])` ?", "False", ["True", "None", "Error"], "Bo'sh ro'yxat, qator yoki lug'at mantiqiy False hisoblanadi."),
        q("Python-da funksiya argumentlariga noma'lum sondagi pozitsion argumentlarni uzatish uchun nima ishlatiladi?", "*args", ["**kwargs", "*argv", "params"], "*args istalgancha pozitsion argumentlarni tuple ko'rinishida qabul qiladi."),
        q("Nomlanmagan (anonim) funksiyalarni yaratish kalit so'zi qaysi?", "lambda", ["def", "anon", "function"], "lambda argumentlar: ifoda orqali bir qatorli anonim funksiya yoziladi."),
        q("List comprehension orqali juft sonlarni filtrlash qaysi javobda to'g'ri?", "[x for x in range(10) if x % 2 == 0]", ["[x if x % 2 == 0 for x in range(10)]", "[for x in range(10) where x % 2 == 0]", "[x in range(10) if x % 2 == 0]"], "To'g'ri sintaksis: [ifoda for element in ketma_ketlik if shart]"),
        q("Pythonda xotirani boshqaruvchi avtomatik mexanizm nima deb ataladi?", "Garbage Collector", ["Memory Allocator", "Defragmenter", "Buffer Manager"], "Garbage Collector ishlatilmay qolgan ob'ektlarni avtomatik tozalaydi."),
        q("Qaysi kalit so'z istisnolarni majburiy ko'tarish (tashlash) uchun ishlatiladi?", "raise", ["throw", "catch", "except"], "raise ValueError('Xatolik') ko'rinishida istisno ko'tariladi."),
        q("Python-da obyekt turini tekshirish uchun qaysi funksiya tavsiya etiladi?", "isinstance()", ["typeof()", "typecheck()", "check()"], "isinstance(obj, class) vorislikni ham hisobga oladi."),
        q("Python interpretatori xotirada qatorlarni keshlashi qanday ataladi?", "String Interning", ["String Caching", "String Buffering", "String Memo"], "Qisqa va maxsus qatorlar String Interning orqali yagona xotirada saqlanadi."),
        q("Generatordan keyingi qiymatni olish uchun qaysi funksiya ishlatiladi?", "next()", ["step()", "yield()", "get()"], "next(generator) generatorning navbatdagi elementini hisoblaydi."),
        q("`is` va `==` operatorlarining farqi nimada?", "`is` xotira manzilini (id), `==` esa qiymatni tekshiradi", ["Ikkalasi ham mutlaqo bir xil", "`==` tezroq ishlaydi", "`is` faqat sonlarni solishtiradi"], "is operatori id(a) == id(b) ni tekshiradi."),
        q("Klass konstruktori sifatida ishlatiladigan dunder metod?", "__init__", ["__new__", "__construct__", "__start__"], "__init__ yangi obyekt yaratilganda xususiyatlarni boshlang'ichlashtiradi."),
        q("Decorator Python-da qanday belgi bilan belgilanadi?", "@", ["#", "$", "&"], "@decorator_name sintaksisi orqali funksiya o'raladi."),
    ]
    items.extend(core_questions)

    # Parametric generator
    rng = random.Random(101)
    for i in range(target - len(items)):
        mode = rng.randint(1, 6)
        if mode == 1:
            a, b = rng.randint(2, 20), rng.randint(2, 10)
            res = a // b
            items.append(q(
                f"Python-da `{a} // {b}` amali natijasi nechaga teng?",
                str(res),
                [str(res + 1), str(res - 1 if res > 0 else res + 2), str(round(a / b, 1))],
                f"// operatori butun bo'lishni ifodalaydi: {a} // {b} = {res}"
            ))
        elif mode == 2:
            a, b = rng.randint(5, 30), rng.randint(2, 7)
            rem = a % b
            items.append(q(
                f"Python-da `{a} % {b}` amali natijasi nechaga teng?",
                str(rem),
                [str((rem + 1) % b), str((rem + 2) % b), str(a // b)],
                f"% operatori qoldiqni hisoblaydi: {a} % {b} = {rem}"
            ))
        elif mode == 3:
            s = rng.choice(["StudentHub", "Algoritm", "Dasturlash", "PythonDeveloper", "FastAPI"])
            idx = rng.randint(0, len(s) - 1)
            char = s[idx]
            items.append(q(
                f"`s = '{s}'` berilgan bo'lsa, `s[{idx}]` ifodasi nimani qaytaradi?",
                f"'{char}'",
                [f"'{s[(idx + 1) % len(s)]}'", f"'{s[(idx - 1) % len(s)]}'", f"'{s.upper()}'"],
                f"Python indeksatsiyasi 0 dan boshlanadi, shuning uchun {idx}-indeks '{char}'."
            ))
        elif mode == 4:
            n = rng.randint(2, 8)
            p = rng.randint(2, 4)
            val = n ** p
            items.append(q(
                f"Python-da `{n} ** {p}` amali natijasi nechaga teng?",
                str(val),
                [str(val + n), str(val - n), str(n * p)],
                f"** operatori darajaga ko'tarish: {n}^{p} = {val}"
            ))
        elif mode == 5:
            words = ["olma", "anor", "behi", "uzum", "anjir", "nok"]
            sample = rng.sample(words, 4)
            rev = sample[::-1]
            items.append(q(
                f"`lst = {sample}` ro'yxatini `lst[::-1]` ko'rinishida kesish natijasi?",
                str(rev),
                [str(sample), str(sorted(sample)), str(sample[1:])],
                "[::-1] kesmasi ro'yxatni teskari tartibda qaytaradi."
            ))
        else:
            code_num = rng.randint(10, 99)
            items.append(q(
                f"`f'Kod: {{{code_num} * 2}}'` f-string ifodasi nimaga teng?",
                f"Kod: {code_num * 2}",
                [f"Kod: {code_num}", f"Kod: {{{code_num} * 2}}", f"Kod: {code_num}2"],
                "f-string jingalak qavs ichidagi amallarni hisoblab joylashtiradi."
            ))

    return items[:target]

def gen_django_questions(target: int = 400) -> List[Dict]:
    items = []
    base_questions = [
        q("Django loyihasini yaratish konsol buyrug'i qaysi?", "django-admin startproject <name>", ["django create-project <name>", "python manage.py newproject", "django-cli init"], "Loyihani boshlash uchun 'django-admin startproject' ishlatiladi."),
        q("Django-da yangi ilova (app) yaratish buyrug'i qaysi?", "python manage.py startapp <name>", ["django-admin createapp", "python manage.py makeapp", "django new app"], "startapp buyrug'i yangi ilova katalogi va modullarini yaratadi."),
        q("Ma'lumotlar bazasiga o'zgarishlarni qo'llash buyrug'i qaysi?", "python manage.py migrate", ["python manage.py makemigrations", "python manage.py db-sync", "python manage.py push"], "migrate buyrug'i migratsiya fayllarini DB ga qo'llaydi."),
        q("Django arxitekturasi qaysi shablon asosida tuzilgan?", "MVT (Model-View-Template)", ["MVC (Model-View-Controller)", "MVVM", "Microservices"], "Django MVT (Model, View, Template) me'morchiligiga tayanadi."),
        q("Django ORM-da barcha yozuvlarni olish metodi qaysi?", "Model.objects.all()", ["Model.get_all()", "Model.select()", "Model.find_all()"], "objects.all() berilgan modelning barcha qatorlarini QuerySet ko'rinishida qaytaradi."),
        q("Django-da bitta yozuvni aniq shart bilan olish va topilmasa DoesNotExist xatosini beruvchi metod?", "get()", ["find()", "first()", "filter()"], "get() faqat bitta element qaytaradi, topilmasa DoesNotExist tashlaydi."),
        q("Tashqi kalit (Foreign Key) bog'lanishida ota yozuv o'chirilganda bola yozuvlarni ham o'chirish qoidasi?", "models.CASCADE", ["models.PROTECT", "models.SET_NULL", "models.DO_NOTHING"], "CASCADE ota yozuv o'chirilganda unga bog'liq yozuvlarni ham o'chiradi."),
        q("Django REST Framework-da modellarni JSON ga va teskarisiga aylantiruvchi sinf?", "Serializer / ModelSerializer", ["JsonParser", "DataTransformer", "ObjectMapper"], "Serializer ma'lumotlarni validatsiya qilish va JSON ga serializatsiya qilish uchun javobgar."),
        q("Django ma'murlari panelini sozlash fayli qaysi?", "admin.py", ["models.py", "views.py", "manage.py"], "admin.py faylida modellar admin interfeysiga ro'yxatdan o'tkaziladi."),
        q("Django-da xavfsizlik uchun so'rovlarni soxtalashtirishdan himoya qiluvchi token?", "CSRF token", ["JWT", "SessionID", "Bearer Token"], "CSRF (Cross-Site Request Forgery) tokenni tekshirish orqali soxta POST so'rovlari bloklanadi."),
        q("Django ORM-da SQL JOIN operatsiyasini minimallashtirib, N+1 muammosini hal qiluvchi metodlar?", "select_related() va prefetch_related()", ["join() va merge()", "filter() va exclude()", "eager() va lazy()"], "select_related 1:1 va FK uchun, prefetch_related esa M2M uchun N+1 ni oldini oladi."),
        q("Django-da statik fayllarni bitta katalogga yig'ish buyrug'i?", "python manage.py collectstatic", ["django-admin gatherstatic", "python manage.py buildstatic", "npm run build"], "Production uchun barcha statik fayllar collectstatic yordamida jamlanadi."),
    ]
    items.extend(base_questions)

    rng = random.Random(202)
    models_pool = ["User", "Product", "Article", "Student", "Course", "Order", "Category", "Review"]
    fields_pool = [
        ("CharField", "max_length talab qilinadi", ["max_length talab qilinmaydi", "faqat son saqlaydi", "xotiradan ko'p joy oladi"]),
        ("IntegerField", "butun sonlarni saqlash", ["matnlarni saqlash", "haqiqiy sonlarni saqlash", "vaqtni saqlash"]),
        ("BooleanField", "True/False mantiqiy qiymat", ["faqat 0 va 1", "matnli javob", "sanani saqlash"]),
        ("DateTimeField", "sana va vaqtni birga saqlash", ["faqat soat", "faqat yil", "faqat matn"]),
        ("TextField", "katta hajmli matnlarni cheklovsiz saqlash", ["faqat 255 ta belgi", "faqat sonlar", "parollarni saqlash"]),
    ]

    while len(items) < target:
        m = rng.choice(models_pool)
        field_type, correct_exp, wrong_exps = rng.choice(fields_pool)
        items.append(q(
            f"Django modelida `models.{field_type}` qanday maqsadda ishlatiladi?",
            correct_exp,
            wrong_exps,
            f"models.{field_type} tipi ma'lumotlar bazasida tegishli ustunni hosil qiladi."
        ))

    return items[:target]

def gen_algorithm_questions(target: int = 400) -> List[Dict]:
    items = []
    base_questions = [
        q("Tartiblangan massivda Ikkilik qidiruv (Binary Search) algoritmining vaqt murakkabligi qanday?", "O(log N)", ["O(N)", "O(N^2)", "O(1)"], "Har bir qadamda qidiruv sohasi ikkiga bo'lingani uchun O(log N)."),
        q("Eng tez ishlaydigan o'rtacha murakkablikka ega saralash algoritmlaridan biri?", "QuickSort - O(N log N)", ["Bubble Sort - O(N^2)", "Insertion Sort - O(N^2)", "Linear Sort - O(N)"], "QuickSort va MergeSort o'rtacha O(N log N) vaqtda ishlaydi."),
        q("LIFO (Last In, First Out) tamoyili asosida ishlaydigan ma'lumotlar tuzilmasi?", "Stack", ["Queue", "Array", "Linked List"], "Stack oxirgi kirgan element birinchi chiqadigan tamoyilda ishlaydi."),
        q("FIFO (First In, First Out) tamoyili asosida ishlaydigan ma'lumotlar tuzilmasi?", "Queue", ["Stack", "Tree", "Graph"], "Queue (Navbat) birinchi kelgan birinchi chiqadigan tizim."),
        q("Hash jadvalida (Hash Map) elementni kalit bo'yicha qidirishning o'rtacha vaqt murakkabligi?", "O(1)", ["O(log N)", "O(N)", "O(N^2)"], "Xesh funksiyasi orqali manzil darhol aniqlangani sababli O(1)."),
        q("Daraxt (Tree) tuzilmasida eng yuqori bo'g'in nima deb ataladi?", "Ildiz (Root)", ["Barg (Leaf)", "Novda (Branch)", "Tugun (Edge)"], "Daraxtning eng yuqori, ota tuguni ildiz (root) deyiladi."),
        q("Kenglik bo'yicha qidiruv (BFS - Breadth-First Search) da qaysi ma'lumotlar tuzilmasi ishlatiladi?", "Queue (Navbat)", ["Stack", "Priority Heap", "Binary Tree"], "BFS qavatma-qavat harakatlangani uchun navbatdan (Queue) foydalanadi."),
        q("Chuqurlik bo'yicha qidiruv (DFS - Depth-First Search) qaysi usul yoki tuzilma orqali oson amalga oshiriladi?", "Stack yoki Rekursiya", ["Queue", "Hash Table", "Double Linked List"], "DFS ichkariga kirib borish uchun rekursiv stekdan foydalanadi."),
        q("Ikkilik qidiruv daraxtida (BST) chap tugunning qiymati ota tugunga nisbatan qanday bo'ladi?", "Kichik bo'ladi", ["Katta bo'ladi", "Teng bo'lishi shart", "Ixtiyoriy"], "BST qoidasi: chap tugun < ota < o'ng tugun."),
        q("Dinamik dasturlash (Dynamic Programming) ning asosiy g'oyasi nima?", "Kichik qism-masalalar natijalarini saqlab, qayta hisoblamaslik (Memoization)", ["Faqat tasodifiy qidiruv qilish", "Har doim brute-force qo'llash", "Barcha holatlarni qayta-qayta hisoblash"], "Dinamik dasturlash oraliq natijalarni saqlab, eksponentsial murakkablikni polinomialga tushiradi."),
    ]
    items.extend(base_questions)

    rng = random.Random(303)
    complexities = [
        ("Massivdan indeks bo'yicha element olish `arr[i]`", "O(1)", ["O(N)", "O(log N)", "O(N^2)"]),
        ("Uzunligi N bo'lgan tartiblanmagan massivdan chiziqli qidiruv", "O(N)", ["O(1)", "O(log N)", "O(N log N)"]),
        ("N x N o'lchamli matritsani ikkita ichma-ich sikl bilan aylanish", "O(N^2)", ["O(N)", "O(N log N)", "O(2^N)"]),
        ("MergeSort (birlashtirib saralash) algoritmi eng yomon holatda", "O(N log N)", ["O(N^2)", "O(N)", "O(1)"]),
        ("Fibonachchini sodda rekursiya bilan hisoblash (memoization bo'lmaganda)", "O(2^N)", ["O(N)", "O(N^2)", "O(1)"]),
    ]

    while len(items) < target:
        desc, correct, wrong = rng.choice(complexities)
        items.append(q(
            f"Quyidagi amalning vaqt murakkabligi qanday: {desc}?",
            correct,
            wrong,
            f"Bu operatsiyaning asimptotik vaqt murakkabligi {correct} bo'ladi."
        ))

    return items[:target]

def gen_dtm_questions(target: int = 400) -> List[Dict]:
    items = []
    base_questions = [
        q("Amir Temur nechanchi yilda tavallud topgan?", "1336-yil 9-aprel", ["1340-yil 5-may", "1332-yil 12-iyun", "1350-yil 1-sentabr"], "Amir Temur 1336-yil 9-aprelda Kesh (Shahrisabz) yaqinidagi Xo'ja Ilg'or qishlog'ida tug'ilgan."),
        q("O'zbekiston Respublikasining Davlat mustaqilligi to'g'risidagi Qonun qachon qabul qilingan?", "1991-yil 31-avgust", ["1991-yil 1-sentabr", "1992-yil 8-dekabr", "1990-yil 24-mart"], "1991-yil 31-avgustda mustaqillik e'lon qilingan."),
        q("O'zbekiston Respublikasi Konstitutsiyasi qachon qabul qilingan?", "1992-yil 8-dekabr", ["1991-yil 1-sentabr", "1993-yil 2-iyul", "1994-yil 1-iyul"], "Konstitutsiya 1992-yil 8-dekabrda 12-chaqiriq Oliy Kengash sessiyasida qabul qilingan."),
        q("Alisher Navoiy qachon va qayerda tug'ilgan?", "1441-yil Hirotda", ["1436-yil Samarqandda", "1445-yil Buxoroda", "1430-yil Mashhadda"], "Buyuk shoir va mutafakkir 1441-yil 9-fevralda Hirot shahrida tug'ilgan."),
        q("O'zbek tiliga Davlat tili maqomi qachon berilgan?", "1989-yil 21-oktabr", ["1991-yil 1-sentabr", "1990-yil 20-iyun", "1992-yil 8-dekabr"], "1989-yil 21-oktabrda 'Davlat tili haqida'gi Qonun qabul qilingan."),
        q("Zahiriddin Muhammad Bobur qaysi yirik imperiyaga asos solgan?", "Boburiylar (Buyuk Mo'g'ullar) saltanati", ["Usmoniylar saltanati", "Temuriylar saltanati", "Saljuqiylar davlati"], "Bobur 1526-yilda Hindistonda Boburiylar saltanatiga asos soldi."),
        q("Jadidchilik harakati yetakchilaridan biri, 'Turkiy guliston yoxud axloq' asari muallifi kim?", "Abdulla Avloniy", ["Mahmudxo'ja Behbudiy", "Munavvarqori Abdurashidxonov", "Abdurauf Fitrat"], "Abdulla Avloniy ma'rifatparvar jadid adibi hisoblanadi."),
    ]
    items.extend(base_questions)

    rng = random.Random(404)
    dtm_math = [
        ("Bir sonning 20% i 50 ga teng bo'lsa, bu sonning o'zi nechaga teng?", "250", ["200", "300", "150"]),
        ("To'g'ri to'rtburchakning bo'yi 12 sm, eni 5 sm bo'lsa, uning perimetri nechaga teng?", "34 sm", ["60 sm", "28 sm", "40 sm"]),
        ("Uchburchakning ichki burchaklari yig'indisi necha gradusga teng?", "180°", ["360°", "90°", "270°"]),
        ("2x + 10 = 34 tenglamasidan x ni toping.", "12", ["14", "10", "16"]),
        ("Avtomobil 60 km/soat tezlik bilan 3.5 soatda necha km masofani bosib o'tadi?", "210 km", ["180 km", "240 km", "200 km"]),
    ]

    while len(items) < target:
        q_text, ans, wrg = rng.choice(dtm_math)
        items.append(q(q_text, ans, wrg, "DTM majburiy fanlar bloki standarti."))

    return items[:target]
