"""Dasturlash va Informatika — takrorlanmaydigan savollar generatori."""

import random

from .base import QuestionBank

# Python code-parcha savollari uchun kichik yordamchi
def _trace_loop(bank, rng):
    n = rng.randint(3, 8)
    start = rng.randint(0, 2)
    step = 1
    # for i in range(start, n): print(i, end=" ")
    out = " ".join(str(i) for i in range(start, n, step))
    q = (f"Python'da quyidagi kod natijasini toping:\n\n"
         f"for i in range({start}, {n}):\n    print(i, end=' ')\n")
    correct = f"{out}"
    w1 = " ".join(str(i) for i in range(start, n + 1))
    w2 = " ".join(str(i) for i in range(start - 1, n))
    opts = [correct, w1, w2, f"{out} |"]
    bank.add(q, opts, correct,
            f"range({start}, {n}) — {start} dan {n - 1} gacha (oxirgi son kirmaydi): "
            f"{out}.")


def _trace_while(bank, rng):
    x = rng.randint(1, 5)
    k = rng.randint(2, 3)
    # while x < limit: x = x * k; count++
    limit = x * k * k * k
    steps = 0
    xx = x
    vals = []
    while xx < limit:
        xx *= k
        steps += 1
        vals.append(str(xx))
    q = (f"Python'da quyidagi kod necha marta qaytariladi?\n\n"
         f"x = {x}\ncount = 0\nwhile x < {limit}:\n    x = x * {k}\n    count += 1\n")
    correct = f"{steps}"
    opts = [correct, f"{steps + 1}", f"{steps - 1}", f"{steps + k}"]
    bank.add(q, opts, correct,
            f"x ketma-ketligi: {x} → {' → '.join(vals)}; {limit} chegarasiga "
            f"{steps} qadamda yetadi.")


def _literal_types(bank, rng):
    cases = [
        ('5', 'int'),
        ('5.0', 'float'),
        ('"hello"', 'str'),
        ('True', 'bool'),
        ('[1, 2, 3]', 'list'),
        ('(1, 2)', 'tuple'),
        ('{"a": 1}', 'dict'),
        ('{1, 2}', 'set'),
    ]
    val, typ = rng.choice(cases)
    q = f"Python tilida {val} qiymati qaysi turga (type) kiradi?"
    options = ["int", "float", "str", "bool", "list", "tuple", "dict", "set"]
    wrongs = rng.sample([o for o in options if o != typ], 3)
    opts = [typ] + wrongs
    bank.add(q, opts, typ,
            f"{val} qiymati {typ} turiga kiradi.")


def _operator(bank, rng):
    a = rng.randint(2, 6)
    b = rng.randint(1, 5)
    op = rng.choice(["//", "%", "**", "/"])
    if op == "//":
        res = a // b
        q = f"{a} // {b} natijasini toping."
        expl = f"// — butun bo'lish. {a} // {b} = {res}."
    elif op == "%":
        res = a % b
        q = f"{a} % {b} natijasini toping."
        expl = f"% — qoldiq. {a} % {b} = {res}."
    elif op == "**":
        res = a ** b
        q = f"{a} ** {b} natijasini toping."
        expl = f"** — daraja. {a}^{b} = {res}."
    else:
        res = a / b
        res_str = f"{res}"
        q = f"{a} / {b} natijasining turi qaysi?"
        opts = ["float", "int", "str", "bool"]
        bank.add(q, opts, "float",
                f"Python 3'da / har doim float qaytaradi: {a}/{b} = {a / b}.")
        return
    correct = f"{res}"
    opts = [correct, f"{res + 1}", f"{res - 1}", f"{res * 2}"]
    bank.add(q, opts, correct, expl)


def _string_methods(bank, rng):
    w = rng.choice(["salom", "Hello", "PYTHON", "dasturlash"])
    op = rng.choice(["lower", "upper", "len", "strip_count"])
    if op == "lower":
        q = f"'{w}'.lower() natijasi qanday?"
        correct = f"'{w.lower()}'"
        opts = [correct, f"'{w.upper()}'", f"'{w}'", f"'{w.title()}'"]
        expl = ".lower() — barcha harflarni kichik qiladi."
    elif op == "upper":
        q = f"'{w}'.upper() natijasi qanday?"
        correct = f"'{w.upper()}'"
        opts = [correct, f"'{w.lower()}'", f"'{w}'", f"'{w.capitalize()}'"]
        expl = ".upper() — barcha harflarni katta qiladi."
    elif op == "len":
        correct = f"{len(w)}"
        q = f"len('{w}') natijasi qanday?"
        opts = [correct, f"{len(w) + 1}", f"{len(w) - 1}", f"'{w}'"]
        expl = f"len() satr uzunligini (belgilar sonini) qaytaradi: {len(w)}."
    else:
        s = "python"
        chars = len(s) - s.count(" ")
        q = f"{s} so'zida nechta harf bor?"
        correct = f"{len(s)}"
        opts = [correct, f"{len(s) + 1}", f"{len(s) - 1}", f"{len(set(s))}"]
        expl = f"'{s}' → {len(s)} belgi."
    bank.add(q, opts, correct, expl)


def _logic(bank, rng):
    a = rng.random() < 0.5
    b = rng.random() < 0.5
    ops = [
        ("and", a and b),
        ("or", a or b),
        (f"not ({'True' if a else 'False'})", not a),
    ]
    opname, res = rng.choice(ops)
    qt = f"Python operatori baholang: {opname} → ?"
    if opname == "and":
        q = f"if {a} and {b}: — qanday natija? (True/False {a} and {b})"
        q = f"Python: `{a} and {b}` ifoda qiymati?"
    elif opname == "or":
        q = f"Python: `{a} or {b}` ifoda qiymati?"
    else:
        q = f"Python: `not {a}` ifoda qiymati?"
    correct = str(res)
    opts = ["True", "False", "None", "0"]
    opts = [o for o in opts if o != correct] + [correct]
    bank.add(q, opts, correct,
            f"and — ikkalasi to'g'ri bo'lsa True; or — biri to'g'ri bo'lsa True; "
            f"not — teskari. Natija: {res}.")


def _list_index(bank, rng):
    lst = rng.sample(range(0, 20), 5)
    i = rng.randint(-4, 4)
    val = lst[i]
    q = f"Python: lst = {lst}; lst[{i}] qiymati?"
    correct = f"{val}"
    opts = [correct, f"{val + 1}", f"{val - 1}", f"{lst[(i + 1) % 5]}"]
    bank.add(q, opts, correct,
            f"Indeks {i} dan boshlanadi; manfiy indeks oxiridan sanaydi: "
            f"lst[{i}] = {val}.")


def _variable_rules(bank, rng):
    pairs = [
        ("my_var", "Yaroqli"),
        ("1var", "Yaroqsiz"),
        ("my-var", "Yaroqsiz"),
        ("_name", "Yaroqli"),
        ("var name", "Yaroqsiz"),
        ("myVar2", "Yaroqli"),
    ]
    v, res = rng.choice(pairs)
    q = f"Python o'zgaruvchi nomi sifatida quyidagilardan qaysi biri to'g'ri?"
    wrongs = rng.sample(["my_var2", "2var", "var_2", "var-2", "var name"], 2)
    opts = [v] + wrongs
    bank.add(q, opts, v,
            "O'zgaruvchi nomi harf yoki _ bilan boshlanadi, raqam bilan "
            "boshlanishi va probellar bo'lishi mumkin emas.")


def _func_call(bank, rng):
    a = rng.randint(1, 4)
    b = rng.randint(2, 5)
    c = a + b
    q = f"def f(x, y):\n    return x + y\n\nf({a}, {b}) natijasi?"
    correct = f"{c}"
    opts = [correct, f"{c + 1}", f"{c - 1}", f"{a * b}"]
    bank.add(q, opts, correct,
            f"Funksiya return x + y: {a} + {b} = {c}.")


def _binary_data(bank, rng):
    n = rng.randint(1, 15)
    bits = bin(n)[2:]
    q = (f"Informatika: {n} sonining ikkilik ko'rinishi qaysi?")
    correct = f"{bits}"
    wrong1 = bin(n - 1)[2:]
    wrong2 = bin(n + 1)[2:]
    wrong3 = f"{n}{n}"
    opts = [correct, wrong1, wrong2, wrong3]
    bank.add(q, opts, correct,
            f"{n} = {bits} (2-lik): eng katta darajalardan boshlanadi.")


def _hex_binary(bank, rng):
    h = rng.choice(["A", "B", "C", "D", "E", "F", "1F", "10", "FF", "2A", "7B"])
    dec = int(h, 16)
    q = f"O'n oltilik {h}₍₁₆₎ soni o'nlikda qancha?"
    correct = f"{dec}"
    opts = [correct, f"{dec - 1}", f"{dec + 1}", f"{dec // 2}"]
    bank.add(q, opts, correct,
            f"0x{h} = {h}₁₆ → {dec}₁₀ (16-lik → 10-lik).")


def _storage_units(bank, rng):
    pairs = [
        ("1 bit", "0 yoki 1 eng kichik axborot birligi"),
        ("1 bayt = ?", "8 bit"),
        ("1 KB = ?", "1024 bayt"),
        ("1 MB = ?", "1024 KB"),
        ("1 GB = ?", "1024 MB"),
        ("1 TB = ?", "1024 GB"),
        ("1 byte nechta bit?", "8"),
    ]
    unit, conv = rng.choice(pairs)
    wrongs = ["1000 bayt", "1024 bit", "1000 KB", "1 000 000 bayt"]
    q = unit + " — to'g'ri javobni tanlang:"
    opts = [conv, *(lambda x: [y for y in wrongs if y != x][:3])("")]
    bank.add(q, opts, conv,
            f"{unit} = {conv}. (Kompyuterdagi birliklar 1024 nisbatda).")


TEMPLATES = [
    _trace_loop,
    _trace_while,
    _literal_types,
    _operator,
    _string_methods,
    _logic,
    _list_index,
    _variable_rules,
    _func_call,
    _binary_data,
    _hex_binary,
    _storage_units,
]


def generate(bank: QuestionBank, rng: random.Random, target: int) -> None:
    attempts = 0
    while len(bank.items) < target and attempts < target * 6:
        attempts += 1
        order = TEMPLATES.copy()
        rng.shuffle(order)
        for t in order:
            if len(bank.items) >= target:
                break
            try:
                t(bank, rng)
            except (AssertionError, ZeroDivisionError, ValueError):
                continue