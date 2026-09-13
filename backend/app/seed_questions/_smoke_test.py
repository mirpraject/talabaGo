import random

from app.seed_questions.base import QuestionBank
from app.seed_questions import (
    alg_gen, geom_gen, analyz_gen, fiz_gen, cs_gen, lang_gen, sci_gen,
)

cases = [
    ("algebra", alg_gen, 650),
    ("geometry", geom_gen, 650),
    ("analysis", analyz_gen, 650),
    ("physics", fiz_gen, 650),
    ("computer science", cs_gen, 650),
    ("english", None, 650),
    ("uzbek lang", None, 650),
    ("chemistry", None, 650),
    ("biology", None, 650),
]

total = 0
for name, mod, target in cases:
    bank = QuestionBank()
    rng = random.Random(name)
    if name == "english":
        lang_gen.generate_english(bank, rng, target)
    elif name == "uzbek lang":
        lang_gen.generate_uzbek(bank, rng, target)
    elif name == "chemistry":
        sci_gen.generate_kimyo(bank, rng, target)
    elif name == "biology":
        sci_gen.generate_biologiya(bank, rng, target)
    else:
        mod.generate(bank, rng, target)
    n = len(bank.items)
    total += n
    print(f"{name:>18}: {n:>5} unique questions")

print(f"sum: {total}")