"""Ingliz tili va Ona tili va adabiyot — takrorlanmaydigan savollar generatori."""

import random

from .base import QuestionBank

# ---------- INGLIZ TILI ----------

ENG_VOCAB = [
    ("book", "kitob"), ("pen", "ruchka"), ("house", "uy"), ("water", "suv"),
    ("apple", "olma"), ("teacher", "o'qituvchi"), ("student", "talaba"),
    ("school", "maktab"), ("friend", "do'st"), ("family", "oila"),
    ("mother", "ona"), ("father", "ota"), ("brother", "aka/uka"), ("sister", "opa/singil"),
    ("dog", "it"), ("cat", "mushuk"), ("bird", "qush"), ("fish", "baliq"),
    ("table", "stol"), ("chair", "stul"), ("door", "eshik"), ("window", "deraza"),
    ("car", "mashina"), ("bus", "avtobus"), ("train", "poezd"), ("plane", "samolyot"),
    ("bread", "non"), ("milk", "sut"), ("meat", "go'sht"), ("fruit", "meva"),
    ("tea", "choy"), ("coffee", "qahva"), ("sugar", "shakar"), ("salt", "tuz"),
    ("morning", "ertalab"), ("evening", "kechqurun"), ("night", "tun"), ("day", "kun"),
    ("week", "hafta"), ("month", "oy (vaqt)"), ("year", "yil"), ("today", "bugun"),
    ("tomorrow", "ertaga"), ("yesterday", "kecha"), ("red", "qizil"), ("blue", "ko'k"),
    ("green", "yashil"), ("yellow", "sariq"), ("black", "qora"), ("white", "oq"),
    ("big", "katta"), ("small", "kichik"), ("long", "uzun"), ("short", "qisqa"),
    ("good", "yaxshi"), ("bad", "yomon"), ("new", "yangi"), ("old", "eski"),
    ("hot", "issiq"), ("cold", "sovuq"), ("happy", "baxtli"), ("sad", "g'amgin"),
    ("money", "pul"), ("work", "ish"), ("time", "vaqt"), ("school", "maktab"),
    ("street", "ko'cha"), ("city", "shahar"), ("village", "qishloq"), ("park", "park"),
    ("run", "yugurmoq"), ("walk", "yurmoq"), ("eat", "yemoq"), ("drink", "ichmoq"),
    ("read", "o'qimoq"), ("write", "yozmoq"), ("speak", "gapirmoq"), ("listen", "tinglamoq"),
    ("see", "ko'rmoq"), ("look", "qaramoq"), ("go", "bormoq"), ("come", "kelmoq"),
    ("sleep", "uxlamoq"), ("live", "yashamoq"), ("learn", "o'rganmoq"), ("play", "o'ynamoq"),
    ("help", "yordam bermoq"), ("buy", "sotib olmoq"), ("sell", "sotmoq"), ("open", "ochmoq"),
    ("close", "yopmoq"), ("give", "bermoq"), ("take", "olmoq"), ("make", "yasamoq"),
    ("summer", "yoz (fasl)"), ("winter", "qish"), ("spring", "bahor"), ("autumn", "kuz"),
    ("sun", "quyosh"), ("moon", "oy (samo jisim)"), ("star", "yulduz"), ("sky", "osmon"),
    ("earth", "yer"), ("cloud", "bulut"), ("rain", "yomg'ir"), ("snow", "qor"),
    ("nice", "yoqimli"), ("kind", "mehribon"), ("smart", "aqlli"), ("strong", "kuchli"),
    ("fast", "tez"), ("slow", "sekin"), ("easy", "oson"), ("difficult", "qiyin"),
    ("near", "yaqin"), ("far", "uzoq"), ("always", "doim"), ("never", "hech qachon"),
    ("often", "tez-tez"), ("sometimes", "ba'zan"), ("soon", "tez orada"), ("again", "yana"),
]

THEME_GROUPS = {
    "Mevalar": ["apple", "banana", "grape", "strawberry", "peach", "plum"],
    "Hayvonlar": ["dog", "cat", "bird", "fish", "horse", "cow", "sheep"],
    "Ranglar": ["red", "blue", "green", "yellow", "black", "white", "orange"],
    "Uy-ro'zg'or": ["table", "chair", "door", "window", "bed", "lamp"],
    "Transport": ["car", "bus", "train", "plane", "bicycle", "ship", "taxi"],
    "Kunlar": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    "Oylar": ["January", "March", "May", "July", "September", "November"],
    "Vaqt": ["morning", "day", "evening", "night", "week", "month", "year"],
}
THEME_NAMES = list(THEME_GROUPS)

PLURAL_PAIRS = [
    ("cat", "cats"), ("book", "books"), ("bus", "buses"), ("box", "boxes"),
    ("baby", "babies"), ("city", "cities"), ("child", "children"),
    ("man", "men"), ("woman", "women"), ("tooth", "teeth"), ("foot", "feet"),
    ("mouse", "mice"), ("sheep", "sheep"), ("fish", "fish"),
    ("day", "days"), ("key", "keys"), ("photo", "photos"), ("potato", "potatoes"),
]

ARTICLES = [
    ("apple", "an"), ("orange", "an"), ("elephant", "an"), ("hour", "an"),
    ("umbrella", "an"), ("egg", "an"), ("ice-cream", "an"),
    ("book", "a"), ("dog", "a"), ("car", "a"), ("table", "a"),
    ("university", "a"), ("house", "a"), ("yellow", "a"), ("boy", "a"),
]


def _eng_vocab(bank, rng):
    en, uz = rng.choice(ENG_VOCAB)
    if rng.random() < 0.5:
        q = f"Inglizcha «{en}» so'zining ma'nosi nima?"
        correct = uz
        wrongs = rng.sample([u for (e, u) in ENG_VOCAB if u != uz], 3)
        expl = f"«{en}» o'zbekchada «{uz}» degani."
    else:
        q = f"«{uz}» so'zining inglizchasi qaysi?"
        correct = en
        wrongs = rng.sample([e for (e, u) in ENG_VOCAB if e != en], 3)
        expl = f"«{uz}» inglizchada «{en}»."
    bank.add(q, [correct] + wrongs, correct, expl)


def _eng_theme(bank, rng):
    theme = rng.choice(THEME_NAMES)
    word = rng.choice(THEME_GROUPS[theme])
    q = f"Inglizcha {word} so'zi qaysi mavzuga kiradi?"
    correct = theme
    wrongs = rng.sample([t for t in THEME_NAMES if t != theme], 3)
    bank.add(q, [correct] + wrongs, correct,
            f"{word} so'zi {theme} guruhiga kiradi.")
    # Form 2: berilgan mavzuga qaysi so'z kiradi
    q2 = f"Quyidagi so'zlardan qaysi biri {theme} mavzusiga kiradi?"
    correct2 = rng.choice(THEME_GROUPS[theme])
    others = rng.sample(
        [w for t in THEME_NAMES if t != theme for w in THEME_GROUPS[t]], 3
    )
    bank.add(q2, [correct2] + others, correct2,
            f"{correct2} — {theme} mavzusiga kiradi.")


def _eng_plural(bank, rng):
    sg, pl = rng.choice(PLURAL_PAIRS)
    q = f"«{sg}» so'zining ko'plik shakli qaysi?"
    correct = pl
    wrongs = rng.sample([p for (s, p) in PLURAL_PAIRS if p != pl], 3)
    bank.add(q, [correct] + wrongs, correct,
            f"{sg} → ko'plikda {pl} (qoidaga yoki maxsus shaklga ko'ra).")


def _eng_article(bank, rng):
    w, art = rng.choice(ARTICLES)
    q = f"Quyidagi gap qaysi biri grammatik jihatdan to'g'ri?"
    good = f"{art} {w}"
    bad1 = f"{'an' if art == 'a' else 'a'} {w}"
    bad2 = f"{art} {w}s"
    bad3 = f"a {w} an"
    bank.add(q, [good, bad1, bad2, bad3], good,
            f"{w} unli tovush bilan boshlanadi → «an», undosh bilan → «a».")

# ---------- ONA TILI VA ADABIYOT ----------

AUTHOR_WORKS = [
    ("Alisher Navoiy", "Xamsa"),
    ("Alisher Navoiy", "Lison ut-tayr"),
    ("Abdulla Qodiriy", "O'tkan kunlar"),
    ("Abdulla Qodiriy", "Mehrobdan chayon"),
    ("Cho'lpon", "Kecha va kunduz"),
    ("Oybek", "Qutlug' qon"),
    ("Oybek", "Navoiy"),
    ("G'afur G'ulom", "Oq kema"),
    ("G'afur G'ulom", "Shum bola"),
    ("G'afur G'ulom", "Mening o'g'rigina bolam"),
    ("Abdulla Qahhor", "Sinchalak"),
    ("Abdulla Qahhor", "O'tmishdan ertaklar"),
    ("Sadriddin Ayniy", "Sudxo'rning xotirasi"),
    ("Hamza Hakimzoda Niyoziy", "Boy ila xizmatchi"),
    ("Usmon Nosir", "She'rlar to'plami"),
    ("Zulfiya", "Hijron kunlarida"),
    ("Erkin Vohidov", "Yoshlik davrlarim"),
    ("Abdulla Oripov", "Yurtim shamoli"),
    ("Said Ahmad", "Ufq"),
    ("Said Ahmad", "Kiprikda qolgan gaplar"),
    ("Pirimqul Qodirov", "Yulduzli tunlar"),
    ("Asqad Muxtor", "Chinor"),
    ("Tog'ay Murod", "Otamdan qolgan dalalar"),
    ("Tog'ay Murod", "Yulduzlar mangu yonadi"),
    ("O'tkir Hoshimov", "Dunyoning ishlari"),
    ("O'tkir Hoshimov", "Ikki eshik orasi"),
    ("Xurshid Do'stmuhammad", "Jannat ostonasidagi odam"),
    ("Mahmud Qoshg'ariy", "Devonu lug'otit turk"),
    ("Ahmad Yassaviy", "Devoni hikmat"),
    ("Bobur", "Boburnoma"),
    ("Bobur", "Devon"),
    ("Lutfly", "Gul va Navro'z"),
    ("Ogahiy", "Devoni Ogahiy"),
    ("Muhammad Rizo Ogahiy", "Tavorixi guzida"),
    ("Furqat", "Iskandar Noma"),
    ("Muqimiy", "Tanobchilar"),
    ("Zokirjon Furqat", "Zamonaviy she'rlar"),
    ("Hamid Olimjon", "Oygul va Baxtiyor"),
    ("Hamza", "Maysara ishi"),
    ("G'ayratiy", "Shoshilmang, xokisor"),
    ("Uvaysiy", "Devoni"),
    ("Nodira", "Devoni Nodira"),
    ("Shoira Zulfiya", "Vodiylar guvohi"),
    ("Sirojiddin Sayyid", "Osmon atalmish xiyobon"),
    ("Shukur Xolmirzayev", "Oltin zanglamas"),
    ("Nazar Eshonqul", "Qora kitob"),
    ("Ulug'bek Hamdam", "Sabr va sabr"),
    ("Abduqahhor Qodiriy", "Diniy asarlar"),
    ("Alisher Navoiy", "Muhabbatnoma"),
    ("Boborahim Mashrab", "Devoni Mashrab"),
]

GENRES = [
    ("Doston", "Qahramonlik yoki sevgi mavzusidagi yirik she'riy asar"),
    ("Hikoya", "Qisqa nasriy asar, bitta voqea"),
    ("Roman", "Yirik nasriy asar, ko'p qahramon va voqea"),
    ("Poeziya", "She'riy (misra) shaklidagi adabiyot"),
    ("Masal", "Axloqiy ibrat beruvchi qisqa asar"),
    ("Qissa", "Roman va hikoya o'rtasidagi nasriy asar"),
    ("Epyopeya", "Milliy hudud bo'ylab yirik nasriy asar"),
    ("Tragediya", "Achinish uyg'otadigan dramatik asar"),
    ("Komediya", "Kulgili dramatik asar"),
    ("Lyrika", "His-tuyg'ularni ifodalovchi she'r"),
]

WORDS_SPELLING = [
    ("maktab", "maktab"), ("kitob", "kitob"), ("o'quvchi", "o'quvchi"),
    ("daraxt", "daraxt"), ("maktub", "maktub"), ("so'z", "so'z"),
    ("yulduz", "yulduz"), ("osmon", "osmon"), ("kapalak", "kapalak"),
    ("ta'lim", "ta'lim"), ("ilm", "ilm"), ("gul", "gul"),
    ("suhbat", "suhbat"), ("mulohaza", "mulohaza"), ("fikr", "fikr"),
]


def _uz_author(bank, rng):
    author, work = rng.choice(AUTHOR_WORKS)
    other_works = [w for (a, w) in AUTHOR_WORKS if a != author]
    reverse = rng.random() < 0.5
    if reverse:
        q = f"«{work}» asarining muallifi kim?"
        correct = author
        wrongs = rng.sample([a for (a, w) in AUTHOR_WORKS if a != author], 3)
        expl = f"«{work}» asarini {author} yozgan."
    else:
        q = f"{author}ning asari qaysi?"
        correct = work
        wrongs = rng.sample(other_works, 3)
        expl = f"{author} — «{work}» asari muallifi."
    bank.add(q, [correct] + wrongs, correct, expl)


def _uz_genre(bank, rng):
    name, desc = rng.choice(GENRES)
    q = f"«{name}» adabiy janrining ta'rifini toping:"
    correct = desc
    wrongs = rng.sample([d for (n, d) in GENRES if d != desc], 3)
    bank.add(q, [correct] + wrongs, correct,
            f"{name} — {desc}.")


def _uz_genre_reverse(bank, rng):
    name, desc = rng.choice(GENRES)
    q = f"«{desc}» — qaysi adabiy janr?"
    correct = name
    wrongs = rng.sample([n for (n, d) in GENRES if d != desc], 3)
    bank.add(q, [correct] + wrongs, correct,
            f"{desc} → janr nomi {name}.")


def _uz_spelling(bank, rng):
    word = rng.choice([w for (w, _junk) in WORDS_SPELLING])
    d1 = word + "а"
    d2 = word.replace("o'", "о").replace("g'", "г")
    d3 = word[:-1] + ("r" if word[-1] != "r" else "n")
    variants = [word, d1, d2, d3]
    variants = list(dict.fromkeys(variants))
    while len(variants) < 4:
        variants.append(word + str(len(variants)))
    q = "Quyidagi imlo (yozuv) variantidan to'g'risini tanlang:"
    bank.add(q, variants[:4], word,
            f"To'g'ri yozilishi — «{word}».")


TEMPLATES = [_eng_vocab, _eng_theme, _eng_plural, _eng_article,
             _uz_author, _uz_genre, _uz_genre_reverse, _uz_spelling]
TEMPLATES_ENG = [_eng_vocab, _eng_theme, _eng_plural, _eng_article]
TEMPLATES_UZ = [_uz_author, _uz_genre, _uz_genre_reverse, _uz_spelling]


def _run_templates(bank: QuestionBank, rng: random.Random, target: int,
                   templates: list) -> None:
    attempts = 0
    while len(bank.items) < target and attempts < target * 6:
        attempts += 1
        order = templates.copy()
        rng.shuffle(order)
        for t in order:
            if len(bank.items) >= target:
                break
            try:
                t(bank, rng)
            except (AssertionError, ZeroDivisionError, ValueError):
                continue


def generate(bank: QuestionBank, rng: random.Random, target: int) -> None:
    _run_templates(bank, rng, target, TEMPLATES)


def generate_english(bank: QuestionBank, rng: random.Random, target: int) -> None:
    _run_templates(bank, rng, target, TEMPLATES_ENG)


def generate_uzbek(bank: QuestionBank, rng: random.Random, target: int) -> None:
    _run_templates(bank, rng, target, TEMPLATES_UZ)