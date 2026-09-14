"""Ingliz tili — maktab (5-11 sinf)."""
import random
from .base import q, _add, TARGET_PER_GRADE


_EN_VOCAB = [
    ("book", "kitob", ["qalam", "stol", "deraza"]),
    ("pen", "qalam", ["kitob", "stol", "deraza"]),
    ("table", "stol", ["kitob", "qalam", "deraza"]),
    ("window", "deraza", ["kitob", "qalam", "stol"]),
    ("house", "uy", ["maktab", "daryo", "tog'"]),
    ("school", "maktab", ["uy", "daryo", "tog'"]),
    ("water", "suv", ["yong'in", "shamol", "qor"]),
    ("fire", "yong'in", ["suv", "shamol", "qor"]),
    ("friend", "do'st", ["dushman", "ona", "aka"]),
    ("mother", "ona", ["do'st", "dushman", "aka"]),
    ("father", "aka/o'zi", ["ona", "do'st", "dushman"]),
    ("cat", "mushuk", ["it", "qush", "baliq"]),
    ("dog", "it", ["mushuk", "qush", "baliq"]),
    ("bird", "qush", ["mushuk", "it", "baliq"]),
    ("fish", "baliq", ["mushuk", "it", "qush"]),
    ("apple", "olma", ["nok", "banan", "uzum"]),
    ("bread", "non", ["suv", "sut", "shakar"]),
    ("milk", "sut", ["non", "suv", "shakar"]),
    ("tree", "daraxt", ["gul", "o't", "beton"]),
    ("sun", "quyosh", ["oy", "yulduz", "bulut"]),
]

_EN_VERBS = [
    ("read", "o'qish", ["yozish", "yugurish", "o'ynash"]),
    ("write", "yozish", ["o'qish", "yugurish", "o'ynash"]),
    ("run", "yugurish", ["o'qish", "yozish", "o'ynash"]),
    ("play", "o'ynash", ["o'qish", "yozish", "yugurish"]),
    ("eat", "yemoq", ["ichmoq", "ko'rmok", "eshitmok"]),
    ("drink", "ichmoq", ["yemoq", "ko'rmok", "eshitmok"]),
    ("see", "ko'rmok", ["yemoq", "ichmoq", "eshitmok"]),
    ("hear", "eshitmok", ["yemoq", "ichmoq", "ko'rmok"]),
    ("speak", "gapirmoq", ["eshitmok", "ko'rmok", "o'qimoq"]),
    ("go", "bormoq", ["kelmoq", "yugurmoq", "o'tirmoq"]),
    ("come", "kelmoq", ["bormoq", "yugurmoq", "o'tirmoq"]),
    ("sit", "o'tirmoq", ["bormoq", "kelmoq", "yugurmoq"]),
]

_EN_SENTENCES = [
    ("I ___ a book every day.", "read", ["writes", "runs", "plays"]),
    ("She ___ to school.", "goes", ["go", "going", "goed"]),
    ("They ___ football.", "play", ["plays", "played", "playing"]),
    ("He ___ water.", "drinks", ["drink", "drinking", "drinked"]),
    ("We ___ English.", "speak", ["speaks", "speaking", "speaked"]),
    ("I ___ happy.", "am", ["is", "are", "be"]),
    ("She ___ a teacher.", "is", ["am", "are", "be"]),
    ("They ___ students.", "are", ["is", "am", "be"]),
    ("He ___ not like coffee.", "does", ["do", "is", "has"]),
    ("I ___ to the park yesterday.", "went", ["go", "goes", "going"]),
]


def gen_english(target=350):
    items, seen = [], set()

    # Vocabulary
    for _ in range(target):
        if len(items) >= target:
            break
        en, uz, wrongs = random.choice(_EN_VOCAB)
        _add(items, seen,
             f"«{en}» so'zining o'zbekchasi?",
             uz, list(wrongs))

    # Verbs
    for _ in range(target):
        if len(items) >= target:
            break
        v, uz, wrongs = random.choice(_EN_VERBS)
        _add(items, seen,
             f"«{v}» fe'lining o'zbekchasi?",
             uz, list(wrongs))

    # Sentence completion
    for _ in range(target):
        if len(items) >= target:
            break
        sent, ans, wrongs = random.choice(_EN_SENTENCES)
        _add(items, seen, sent, ans, list(wrongs))

    # Plural
    plurals = [
        ("cat", "cats", ["cates", "caties", "caties"]),
        ("dog", "dogs", ["doges", "dogies", "dogies"]),
        ("book", "books", ["bookes", "bookies", "bookies"]),
        ("box", "boxes", ["boxs", "boxies", "boxies"]),
        ("child", "children", ["childs", "childes", "childies"]),
        ("mouse", "mice", ["mouses", "micees", "mouse"]),
        ("foot", "feet", ["foots", "feetes", "foots"]),
        ("tooth", "teeth", ["tooths", "teeths", "toothes"]),
        ("man", "men", ["mans", "menes", "manes"]),
        ("woman", "women", ["womans", "womans", "womens"]),
    ]
    for _ in range(target):
        if len(items) >= target:
            break
        sg, pl, wrongs = random.choice(plurals)
        _add(items, seen,
             f"«{sg}» ning ko'plik shakli?",
             pl, list(wrongs))

    # Opposites
    opposites = [
        ("big", "small", ["tall", "long", "wide"]),
        ("hot", "cold", ["warm", "cool", "nice"]),
        ("good", "bad", ["nice", "fine", "well"]),
        ("happy", "sad", ["glad", "mad", "bad"]),
        ("fast", "slow", ["quick", "rapid", "nice"]),
        ("young", "old", ["new", "nice", "big"]),
    ]
    for _ in range(target):
        if len(items) >= target:
            break
        w, opp, wrongs = random.choice(opposites)
        _add(items, seen,
             f"«{w}» so'zining teskarisi?",
             opp, list(wrongs))

    # ── Zamon ──
    tenses = [
        ("I ___ a book yesterday.", "read", ["reads", "reading", "will read"]),
        ("She ___ her homework now.", "is doing", ["does", "will do", "did"]),
        ("We ___ to the cinema tomorrow.", "will go", ["go", "went", "going"]),
        ("He ___ in Tashkent for 5 years.", "has lived", ["live", "lives", "will live"]),
        ("They ___ football last Sunday.", "played", ["play", "plays", "will play"]),
        ("Look! It ___ now.", "is raining", ["rains", "rained", "will rain"]),
        ("I ___ this movie before.", "have seen", ["see", "saw", "will see"]),
        ("She ___ English since 2019.", "has studied", ["study", "studies", "studied"]),
        ("Tom ___ to school at 8 every day.", "goes", ["go", "went", "has gone"]),
        ("What ___ you doing right now?", "are", ["is", "am", "do"]),
    ]
    for _ in range(target):
        if len(items) >= target:
            break
        sent, ans, wrongs = random.choice(tenses)
        _add(items, seen, sent, ans, list(wrongs))

    # ── Prepositions ──
    preps = [
        ("I live ___ Tashkent.", "in", ["on", "at", "from"]),
        ("The book is ___ the table.", "on", ["in", "at", "of"]),
        ("She goes to school ___ bus.", "by", ["on", "in", "at"]),
        ("We have dinner ___ 7 o'clock.", "at", ["in", "on", "by"]),
        ("He is good ___ math.", "at", ["on", "in", "of"]),
        ("The cat is ___ the bed.", "under", ["on", "at", "in"]),
        ("I usually get up ___ 6 a.m.", "at", ["in", "on", "of"]),
        ("This gift is ___ my friend.", "for", ["from", "of", "to"]),
    ]
    for _ in range(target):
        if len(items) >= target:
            break
        sent, ans, wrongs = random.choice(preps)
        _add(items, seen, sent, ans, list(wrongs))

    # ── Pronouns ──
    pronouns = [
        ("___ am a student.", "I", ["He", "She", "They"]),
        ("___ is my sister.", "She", ["I", "We", "You"]),
        ("___ are from Uzbekistan.", "We", ["He", "She", "It"]),
        ("Give ___ the book, please.", "me", ["I", "my", "mine"]),
        ("This is ___ car.", "my", ["I", "me", "mine"]),
        ("___ book is on the desk.", "His", ["He", "Him", "Him"]),
        ("They talk to ___ every day.", "us", ["we", "our", "ours"]),
        ("I know ___ well.", "him", ["he", "his", "hism"]),
    ]
    for _ in range(target):
        if len(items) >= target:
            break
        sent, ans, wrongs = random.choice(pronouns)
        _add(items, seen, sent, ans, list(wrongs))

    # ── Time / Numbers ──
    time_words = [
        ("Monday", "Dushanba", ["Seshanba", "Chorshanba", "Payshanba"]),
        ("Sunday", "Yakshanba", ["Dushanba", "Seshanba", "Juma"]),
        ("January", "yanvar", ["fevral", "mart", "aprel"]),
        ("May", "may", ["iyun", "iyul", "avgust"]),
        ("Winter", "qish", ["yoz", "bahor", "kuz"]),
        ("Spring", "bahor", ["qish", "yoz", "kuz"]),
        ("Summer", "yoz", ["qish", "bahor", "kuz"]),
        ("Autumn", "kuz", ["qish", "bahor", "yoz"]),
        ("Today", "bugun", ["kecha", "ertaga", "hozir"]),
        ("Yesterday", "kecha", ["bugun", "ertaga", "hozir"]),
    ]
    for _ in range(target):
        if len(items) >= target:
            break
        en, uz, wrongs = random.choice(time_words)
        _add(items, seen,
             f"«{en}» so'zining o'zbekchasi?",
             uz, list(wrongs))

    # ── Adjectives comparative ──
    comps = [
        ("big", "bigger", ["bigest", "more big", "most big"]),
        ("small", "smaller", ["smallest", "more small", "most small"]),
        ("good", "better", ["more good", "gooder", "best"]),
        ("bad", "worse", ["more bad", "bader", "worst"]),
        ("happy", "happier", ["happyer", "more happy", "most happy"]),
        ("fast", "faster", ["fastest", "more fast", "most fast"]),
    ]
    for _ in range(target):
        if len(items) >= target:
            break
        adj, comp, wrongs = random.choice(comps)
        _add(items, seen,
             f"«{adj}» so'zining qiyosiy darajasi?",
             comp, list(wrongs))

    return items[:target]
