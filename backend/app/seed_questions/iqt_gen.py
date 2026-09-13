"""Iqtisodiyot — takrorlanmaydigan savollar generatori."""

import random

from .base import QuestionBank


def _o4(correct, raw):
    """4 tadan ortiq bo'lmagan, aniq 4 ta ajralib turadigan variant qaytaradi."""
    opts = [correct]
    seen = {correct}
    for o in raw:
        if o not in seen and len(opts) < 4:
            seen.add(o)
            opts.append(o)
    return opts

# ---------------------------------------------------------------------------
# 1. Atama → Ta'rif (forward)
# ---------------------------------------------------------------------------
_IQT_FORWARD = [
    ("Talab", "Ma'lum bir narx darajasida iste'molchilar tomonidan xarid qilishga tayyor bo'lgan mahsulot miqdori.", "Talab — bu narx va miqdor o'rtasidagi bog'liqlik."),
    ("Taklif", "Ma'lum narx darajasida ishlab chiqaruvchilar tomonidan sotishga tayyor bo'lgan mahsulot miqdori.", "Taklif — bu narx oshganda miqdor oshishi tendentsiyasini ko'rsatadi."),
    ("Bozor", "Sotuvchilar va xaridorlar o'rtasidagi iqtisodiy munosabatlar tizimi.", "Bozor iqtisodiyotining asosi — erkin narx shakllanishi."),
    ("Narx", "Mahsulotning puldagi qiymati, ya'ni taklif va talab muvozanatidagi qiymat.", "Narx taklif va talab ta'sirida shakllanadi."),
    ("Foyda", "Daromadning xarajatdan ortiq qismi.", "Foyda = Umumiy daromad - Umumiy xarajat."),
    ("Zarar", "Xarajatning daromaddan ko'p qismi, ya'fi moddiy yo'qotish.", "Zarar = Umumiy xarajat - Umumiy daromad (agar manfiy)."),
    ("Daromad", "Tadbirkor yoki korxona faoliyati natijasida qo'lga kiritgan puli.", "Daromad — bu iqtisodiy foydalanish manbai."),
    ("Kapital", "Ishlab chiqarish jarayonida foydalaniladigan moddiy va moliyaviy resurslar.", "Kapital — bu ishlab chiqarish omili."),
    ("Sarmoya", "Daromad olish maqsadida qilinayotgan moliyaviy yoki moddiy qo'yilmalar.", "Sarmoya — bu kelajakda foyda keltiradigan investitsiya."),
    ("Inflyatsiya", "Umumiy narxlar darajasining doimiy o'sishi.", "Inflyatsiya pulning qadriga ta'sir qiladi."),
    ("Deflyatsiya", "Umumiy narxlar darajasining pasayishi.", "Deflyatsiya — inflyatsiyaning teskarisi."),
    ("Byudjet", "Davlatning daromad va xarajatlari rejamasi.", "Byudjet davlat moliyasining asosiy hujjati."),
    ("Soliq", "Davlat tomonidan yig'iladigan majburiy to'lov.", "Soliq davlat xarajatlarini moliyalashtirish manbai."),
    ("Kredit", "Moliyaviy muassasa tomonidan ma'lum foiz evaziga beriladigan qarz.", "Kredit iqtisodiyotni rivojlantirish vositasi."),
    ("Depozit", "Bankka qo'yilgan va foiz oladigan mablag'.", "Depozit — bu xavfsiz pul saqlash usuli."),
    ("Nominal daromad", "Pulda ifodalangan daromad miqdori, narxlar darajasi hisobga olinmagan.", "Nominal daromad haqiqiy daromaddan farq qilishi mumkin."),
    ("Real daromad", "Narxlar darajasi hisobga olingan haqiqiy quvvatga ega daromad.", "Real daromad = Nominal daromad / Narxlar indeksi × 100."),
    ("Monopoliya", "Bozorda bitta sotuvchi (ishlab chiqaruvchi) ning ustunligi.", "Monopoliyada raqobat yo'q, narxni sotuvchi belgilaydi."),
    ("Oligopoliya", "Bozorda oz sonli sotuvchilar (2-10) ning ustunligi.", "Oligopoliyada firmalar bir-biriga bog'liq."),
    ("Raqobat", "Bozorda ko'plab sotuvchilar o'rtasidagi kurash.", "Raqobat sifat va narxni yaxshilashga olib keladi."),
    ("Ishlab chiqarish", "Mehnat vositalari yordamida moddiy boyliklar yaratish jarayoni.", "Ishlab chiqarish — iqtisodiyotning asosiy jarayoni."),
    ("Mehnat unumdorligi", "Bir ishchi tomonidan bir soatda yaratilgan mahsulot miqdori.", "Mehnat unumdorligi texnika rivojlanishi bilan o'sadi."),
    ("Likvidlik", "Aktivlarni tezda pulga aylantirish qobiliyati.", "Naqd pul — eng likvid aktiv."),
    ("Valyuta", "Pul birligi, chet el valyutalari bilan almashinadigan.", "Valyuta kursi — bir valyutaning boshqa valyutaga nisbati."),
    ("Almashuv kursi", "Bir valyuta boshqasiga nisbatan qiymati.", "Almashuv kursi bozorda shakllanadi yoki markazlashgan."),
    ("YaIM", "Mamlakat chegarasida ishlab chiqarilgan tayyor mahsulotlar yig'indisi.", "YaIM — iqtisodiy rivojlanishning asosiy ko'rsatkichi."),
    ("Davlat budjeti", "Davlatning yillik daromad va xarajatlari rejasini aks ettiruvchi hujjat.", "Davlat budjeti byudjet tizimining asosiy tarkibiy qismi."),
    ("Fiskal siyosat", "Davlat tomonidan soliq va xarajatlar orqali iqtisodiyotni boshqarish.", "Fiskal siyosat byudjet yo'nalishini belgilaydi."),
    ("Monetar siyosat", "Markaziy bank tomonidan pul massasi va foiz stavkalarini boshqarish.", "Monetar siyosat inflyatsiyani nazorat qilish vositasi."),
    ("Pul massasi", "Mamlakatda aylanib yurgan umumiy pul miqdori.", "Pul massasi o'sishi inflyatsiyaga olib kelishi mumkin."),
    ("Foiz stavkasi", "Kredit uchun to'lanadigan yillik foiz miqdori.", "Foiz stavkasi pulning narxi deb ataladi."),
    ("Moliyaviy bozor", "Pul mablag'larining aylanish tizimi.", "Moliyaviy bozor bank, fond va sug'urta bozorlaridan iborat."),
    ("Fond bozori", "Aksiya va obligatsiyalar bilan savdo qilinadigan bozor.", "Fond bozori uzoq muddatli investitsiya manbai."),
    ("Inflatsiya", "Narxlarning umumiy o'sish sur'ati.", "Inflatsiya darajasi yillik foizlarda o'lchanadi."),
    ("Tovar", "Sotish uchun ishlab chiqarilgan mahsulot.", "Tovar — bozor munosabatlarining ob'ekti."),
    ("Xizmat", "Moddiy shakldagi mahsulot emas, ko'rsatilgan foydali faoliyat.", "Xizmat ko'rsatish iqtisodiyotning muhim tarmog'i."),
    ("Renta", "Tabiiy resurslardan foydalanish uchun to'lanadigan haq.", "Renta — yer, kon va boshqa resurslar uchun to'lanadi."),
    ("Ish haqi", "Ishchiga uning mehnati evaziga to'lanadigan pul.", "Ish haqi — mehnat munosabatlarining asosiy shakli."),
    ("Narx indeksi", "Narxlar darajasini o'lchash uchun ishlatiladigan ko'rsatkich.", "Narx indeksi inflyatsiya darajasini ko'rsatadi."),
    ("Valyuta zaxirasi", "Markaziy bankda saqlangan chet el valyutalari miqdori.", "Valyuta zaxirasi milliy valyuta barqarorligini ta'minlaydi."),
    ("Tijorat banki", "Jamg'armalarni qabul qiluvchi va kredit beruvchi tashkilot.", "Tijorat banki — moliyaviy xizmat ko'rsatuvchi muassasa."),
    ("Markaziy bank", "Davlatning pul-kredit tizimini boshqaruvchi muassasa.", "Markaziy bank valyuta siyosatini yuritadi."),
    ("Sug'urta", "Xavf-yoy paydo bo'lganda moddiy zararni qoplash tizimi.", "Sug'urta — xavflarni boshqarish usuli."),
    ("Eksport", "Mahsulotlarni chet elga sotish.", "Eksport — valyuta kirib kelish manbai."),
    ("Import", "Chet eldan mahsulot olish.", "Import — valyuta chiqish sababi."),
    ("Tarazovka", "Eksport va import o'rtasidagi farq.", "Ijobiy tarazovka — eksport importdan ko'p."),
    ("Ishsizlik", "Ish qidirayotgan, lekin ish topa olmagan aholi qismi.", "Ishsizlik darajasi iqtisodiyotning muhim ko'rsatkichi."),
    ("JTSH", "Jami mahsulotlar va xizmatlar yig'indisini pulda ifodalash.", "JTSH — iqtisodiy o'sishni o'lchash usuli."),
    ("Tadbirkor", "Tavakkali o'z hisobiga ish yurituvchi shaxs.", "Tadbirkor — yangilik va ish o'rinlari yaratuvchi."),
    ("Ishlab chiqarish omillari", "Mehnat, yer, kapital va tadbirkorlik.", "Ishlab chiqarish omillari — iqtisodiyotning asosi."),
    ("Mehnat", "Insonning mehnat qobiliyati va faoliyati.", "Mehnat — eng muhim ishlab chiqarish omili."),
    ("Yer", "Ishlab chiqarish jarayonida foydalaniladigan tabiiy resurs.", "Yer — cheklangan ishlab chiqarish omili."),
    ("Tadbirkorlik", "Yangi g'oya asosida ish yuritish, tashkil etish.", "Tadbirkorlik iqtisodiy o'sishni rag'batlantiradi."),
    ("Bozor iqtisodiyoti", "Taklif va talab asosida boshqariladigan iqtisodiyot tizimi.", "Bozor iqtisodiyotida erkin raqobat ustunlik qiladi."),
    ("Rejalashtirilgan iqtisodiyot", "Davlat tomonidan markazlashgan tarzda boshqariladigan iqtisodiyot.", "Rejalashtirilgan iqtisodiyotda narxni davlat belgilaydi."),
    ("Aralash iqtisodiyot", "Bozor va davlat boshqaruvi aralashmasidan iborat tizim.", "Aralash iqtisodiyotda ikkala tizimning afzalliklari qo'llaniladi."),
    ("Xususiy mulk", "Shaxslarga tegishli bo'lgan ishlab chiqarish vositalari.", "Xususiy mulk bozor iqtisodiyotining asosi."),
    ("Davlat mulki", "Davlatga tegishli bo'lgan ishlab chiqarish vositalari.", "Davlat mulki strategik sohalarda ustunlik qiladi."),
    ("Yalpi mahsulot", "Mamlakatda ishlab chiqarilgan yakuniy mahsulotlar yig'indisi.", "Yalpi mahsulot iqtisodiy kuchni ko'rsatadi."),
    ("Moliya", "Pul munosabatlari va mablag'lar taqsimoti tizimi.", "Moliya — iqtisodiyotning pul yo'nalishi."),
    ("Iqtisodiyot", "Jamiyatning moddiy boyliklarini ishlab chiqarish, taqsimlash va iste'mol qilish jarayoni.", "Iqtisodiyot — jamiyat hayotining moddiy asosi."),
    ("Inqiroz", "Iqtisodiyotdagi keskin pasayish, ishsizlikning oshishi.", "Iqitsodiy inqiroz davriy ravishda yuz berishi mumkin."),
    ("Qishloq xo'jaligi", "O'simlik va hayvonot dunyosini yetishtirish tarmog'i.", "Qishloq xo'jaligi — iqtisodiyotning asosiy tarmog'i."),
    ("Sanoat", "Tovar ishlab chiqarish tarmog'i.", "Sanoat — iqtisodiy rivojlanishning dvigateli."),
    ("Savdo", "Tovarlarni sotib olish va sotish faoliyati.", "Savdo iqtisodiyotning muhim tarkibiy qismi."),
    ("Ekonomika", "Xo'jalik yuritish, moddiy manbalardan foydalanish.", "Ekonomika — bu iqtisodiyotning umumiy atamasi."),
    ("Mol-mulk", "Shaxsga tegishli moddiy boyliklar.", "Mol-mulk huquqiy himoyaga ega."),
    ("Soliq tizimi", "Soliqlarni yig'ish va boshqarish tartibi.", "Soliq tizimi davlat daromadlarining manbai."),
    ("Soliq stavkasi", "Soliq miqdorini belgilovchi foiz yoki summa.", "Soliq stavkasi soliqqa tortiladigan summadan hisoblanadi."),
    ("Soliqdor", "Soliq to'lash majburiyati bor shaxs yoki tashkilot.", "Soliqdor soliq qonunchiligiga bo'ysunadi."),
    ("Daromad solig'i", "Shaxsning daromadidan olinadigan soliq.", "Daromad solig'i progressiv stavkada bo'lishi mumkin."),
    ("QQS", "Qo'shilgan qiymat solig'i, har bir qadamda olinadigan soliq.", "QQS — iste'mol solig'i shakli."),
    ("Bojxona", "Davlat chegarasida tovarlar nazoratini amalga oshirish tizimi.", "Bojxona — davlat manfaatini himoya qiladi."),
    ("Resurslar", "Ishlab chiqarish uchun kerak bo'lgan tabiiy va mehnat manbalari.", "Resurslar cheklangan, ehtiyojsiz cheksiz."),
    ("Ochiq ishsizlik", "Rasmiy ravishda ish izlayotgan ishsizlar soni.", "Ochiq ishsizlik darajasi iqtisodiy holatni ko'rsatadi."),
    ("Yashirin ishsizlik", "Rasmiy ro'yxatdan o'tmagan ishsizlik.", "Yashirin ishsizlik rasmiy ko'rsatkichlardan yuqori bo'lishi mumkin."),
    ("Ish o'rinlari", "Ichki mehnat bozoridagi talab va taklif.", "Ish o'rinlari soni iqtisodiy o'sishga bog'liq."),
    ("Ko'chmas mulk", "Yer, uy, bino va inshootlar.", "Ko'chmas mulk investitsiya manbai sifatida mashhur."),
    ("Aksiya", "Korxona kapitalining bir qismini tasdiqlovchi qimmatli qog'oz.", "Aksiya — fond bozorida savdo qilinadi."),
    ("Obligatsiya", "Qarz majburiyatini tasdiqlovchi qimmatli qog'oz.", "Obligatsiya — barqaror daromad manbai."),
    ("Dividend", "Aksiya egaliga to'lanadigan foyda qismi.", "Dividend korxona foydasidan taqsimlanadi."),
    ("Risk", "Iqtisodiy faoliyatda yo'qotish xavfi.", "Risk — sarmoyaning ajralmas xususiyati."),
    ("Iqtisodiy o'sish", "Yalpi mahsulotning yillik o'sish sur'ati.", "Iqtisodiy o'sish standartini 3-5% tashkil qiladi."),
    ("Tabiiy monopoliya", "Bitta korxona butun bozorni qamrab olishi kerak bo'lgan soha.", "Tabiiy monopoliya — kommunal xizmatlarda uchraydi."),
    ("Antimonopoliya siyosati", "Monopoliyaning salbiy ta'sirini cheklash choralari.", "Antimonopoliya qonunchilik bozor raqobatini himoya qiladi."),
    ("Mehnat bozori", "Mehnat resurslari bilan bog'liq talab va taklif munosabatlari.", "Mehnat bozori ish haqi darajasini belgilaydi."),
    ("Kapital bozori", "Uzoq muddatli mablag'lar almashinuvi tizimi.", "Kapital bozori investitsiya manbai."),
    ("Sug'urta bozori", "Sug'urta xizmatlari taqdim etiladigan bozor.", "Sug'urta bozori xavflarni taqsimlaydi."),
    ("Valyuta bozori", "Chet el valyutalari bilan savdo qilinadigan bozor.", "Valyuta bozori kurslarni shakllantiradi."),
    ("Elektron bozor", "Internet orqali tovar va xizmatlar savdosi.", "Elektron bozor tez o'sayotgan soha."),
    ("Taklif qonuni", "Narx oshganda taklif miqdori oshadi.", "Taklif qonuni bozor iqtisodiyotining asosiy qonuni."),
    ("Talab qonuni", "Narx oshganda talab miqdori kamayadi.", "Talab qonuni iste'molchi xulqini tushuntiradi."),
    ("Narx elastikligi", "Talab yoki taklif narx o'zgarishiga qancha ta'sir qilishini ko'rsatadi.", "Elastiklik darajasi 0 dan 1 gacha yoki 1 dan yuqori bo'lishi mumkin."),
    ("Equilibrium", "Talab va taklif teng bo'lgan holat.", "Equilibriumda ortiqcha yoki yetishmovchilik yo'q."),
    ("Xarajat", "Ishlab chiqarish yoki iste'mol uchun sarflangan mablag'.", "Xarajat — iqtisodiy faoliyatning ajralmas qismi."),
    ("Samaradorlik", "Kam xarajat ko'p mahsulot olish qobiliyati.", "Samaradorlik iqtisodiy rivojlanish kaliti."),
    ("Bo'lib to'lash", "Mahsulot narxini bir necha qismga bo'lib to'lash.", "Bo'lib to'lash iste'molni rag'batlantiradi."),
    ("Kafolat", "Mahsulot sifati uchun berilgan kafolat muddati.", "Kafolat iste'molchi huquqini himoya qiladi."),
    ("Reklama", "Mahsulotni targ'ib qilish, sotishni oshirish vositasi.", "Reklama bozor raqobatida muhim rol o'ynaydi."),
    ("Tovar belgisi", "Mahsulotni boshqalardan ajratuvchi belgi.", "Tovar belgisi huquqan himoyalangan."),
    ("Iste'molchi", "Tovar va xizmatlarni shaxsiy foydalanish uchun xarid qiluvchi.", "Iste'molchi — bozor iqtisodiyotining markazi."),
    ("Ishlab chiqaruvchi", "Tovar va xizmatlarni yaratuvchi tashkilot yoki shaxs.", "Ishlab chiqaruvchi talabni qondiradi."),
    ("Birja", "Qimmatli qog'ozlar va tovarlar bilan savdo qilish joyi.", "Birja moliyaviy bozorning muhim tarkibiy qismi."),
    ("Ombor", "Mahsulotlarni saqlash joyi.", "Ombor logistikaning muhim qismi."),
    ("Transport", "Tovarlarni bir joydan boshqa joyga ko'chirish.", "Transport — iqtisodiy aloqalarni ta'minlaydi."),
    ("Logistika", "Tovarlar yetkazib berish tizimini boshqarish.", "Logistika samaradorlikni oshiradi."),
    ("Xalqaro savdo", "Davlatlar o'rtasidagi tovar almashinuvi.", "Xalqaro savdo iqtisodiy hamkorlikning shakli."),
    ("Tarif", "Import qilinadigan tovarlarga olinadigan soliq.", "Tarif mahalliy ishlab chiqaruvchilarni himoya qiladi."),
    ("Kvota", "Import qilinadigan tovar miqdoridagi cheklov.", "Kvota — savdo cheklov shakli."),
    ("Subsidiya", "Davlat tomonidan beriladigan moliyaviy yordam.", "Subsidiya mahalliy ishlab chiqaruvchilarni qo'llab-quvvatlaydi."),
    ("Dumping", "Mahsulotni xarajatdan past narxda chet elga sotish.", "Dumping xalqaro savdoda nofair raqobat shakli."),
]

# ---------------------------------------------------------------------------
# 2. Ta'rif → Atama (reverse)
# ---------------------------------------------------------------------------
_IQT_REVERSE = [
    ("Ma'lum narx darajasida iste'molchilar tomonidan xarid qilishga tayyor bo'lgan mahsulot miqdori qanday ataladi?", "Talab", "Talab — bozor iqtisodiyotining asosiy tushunchalaridan biri."),
    ("Narx oshganda taklif miqdorining oshish tendentsiyasi qanday qonun bilan belgilanadi?", "Taklif qonuni", "Taklif qonuni: narx ↑ → taklif ↑."),
    ("Sotuvchilar va xaridorlar o'rtasidagi iqtisodiy munosabatlar tizimi nima deb ataladi?", "Bozor", "Bozor — iqtisodiy erkinlikning ramzi."),
    ("Mahsulotning puldagi qiymati nimani bildiradi?", "Narx", "Narx taklif va talab muvozanatida shakllanadi."),
    ("Daromadning xarajatdan ortiq qismi nimaga teng?", "Foyda", "Foyda = Daromad − Xarajat."),
    ("Narxlarning umumiy o'sish sur'ati nimaga deyiladi?", "Inflyatsiya", "Inflyatsiya darajasi yillik foizlarda o'lchanadi."),
    ("Narxlarning umumiy pasayishi nimaga deyiladi?", "Deflyatsiya", "Deflyatsiya — inflyatsiyaning teskarisi."),
    ("Davlatning daromad va xarajatlari rejamasi nimani anglatadi?", "Byudjet", "Byudjet — davlat moliyasining asosiy hujjati."),
    ("Davlat tomonidan yig'iladigan majburiy to'lov nima?", "Soliq", "Soliq — davlat xarajatlarini moliyalashtiradi."),
    ("Ma'lum foiz evaziga beriladigan qarz nima deb ataladi?", "Kredit", "Kredit — pulni vaqtincha foydalanish imkoniyati."),
    ("Bankka qo'yilgan va foiz oladigan mablag' nima?", "Depozit", "Depozit — xavfsiz saqlash usuli."),
    ("Pulda ifodalangan, narxlar hisobga olinmagan daromad nima?", "Nominal daromad", "Nominal daromad — ko'rinadigan daromad miqdori."),
    ("Narxlar darajasi hisobga olingan haqiqiy quvvatga ega daromad nima?", "Real daromad", "Real daromad — xarid qobiliyatini ko'rsatadi."),
    ("Bozorda bitta sotuvchi ustunligi qanday holat?", "Monopoliya", "Monopoliyada raqobat yo'q."),
    ("Bozorda oz sonli sotuvchilar ustunligi qanday holat?", "Oligopoliya", "Oligopoliyada firmalar bir-biriga bog'liq."),
    ("Mamlakat chegarasida ishlab chiqarilgan tayyor mahsulotlar yig'indisi nima?", "YaIM", "YaIM — iqtisodiy rivojlanishning asosiy ko'rsatkichi."),
    ("Bir valyutaning boshqasiga nisbatan qiymati nimani bildiradi?", "Almashuv kursi", "Almashuv kursi bozorda shakllanadi."),
    ("Mehnat vositalari yordamida moddiy boyliklar yaratish jarayoni nima?", "Ishlab chiqarish", "Ishlab chiqarish — iqtisodiyotning asosi."),
    ("Bir ishchi tomonidan bir soatda yaratilgan mahsulot miqdori nimaga deyiladi?", "Mehnat unumdorligi", "Unumdorlik texnika rivojlanishi bilan o'sadi."),
    ("Aktivlarni tezda pulga aylantirish qobiliyati nimani anglatadi?", "Likvidlik", "Naqd pul — eng likvid aktiv."),
    ("Mamlakatda aylanib yurgan umumiy pul miqdori nima?", "Pul massasi", "Pul massasi o'sishi inflyatsiyaga sabab bo'ladi."),
    ("Kredit uchun to'lanadigan yillik foiz miqdori nimani bildiradi?", "Foiz stavkasi", "Foiz stavkasi pulning narxi."),
    ("Tavakkali o'z hisobiga ish yurituvchi shaxs kim?", "Tadbirkor", "Tadbirkor — yangilik va ish o'rinlari yaratuvchi."),
    ("Mehnat, yer, kapital va tadbirkorlik nimaga deyiladi?", "Ishlab chiqarish omillari", "Ushbu omillar iqtisodiyotning asosi."),
    ("Tabiiy resurslardan foydalanish uchun to'lanadigan haq nima?", "Renta", "Renta — yer va resurslar uchun to'lov."),
    ("Xavf-yoy paydo bo'lganda moddiy zararni qoplash tizimi nima?", "Sug'urta", "Sug'urta — xavflarni boshqarish usuli."),
    ("Mahsulotlarni chet elga sotish nimaga deyiladi?", "Eksport", "Eksport — valyuta kirish manbai."),
    ("Chet eldan mahsulot olish nimaga deyiladi?", "Import", "Import — valyuta chiqish sababi."),
    ("Yangi g'oya asosida ish yuritish qobiliyati nimani bildiradi?", "Tadbirkorlik", "Tadbirkorlik iqtisodiy o'sishni rag'batlantiradi."),
    ("Taklif va talab asosida boshqariladigan iqtisodiyot tizimi nima?", "Bozor iqtisodiyoti", "Bozor iqtisodiyotida erkin raqobat ustunlik qiladi."),
    ("Davlat tomonidan markazlashgan tarzda boshqariladigan iqtisodiyot nima?", "Rejalashtirilgan iqtisodiyot", "Rejalashtirilgan iqtisodiyotda narxni davlat belgilaydi."),
    ("Bozor va davlat boshqaruvi aralashmasi nimani anglatadi?", "Aralash iqtisodiyot", "Aralash iqtisodiyotda ikkala tizim qo'llaniladi."),
    ("Shaxslarga tegishli ishlab chiqarish vositalari nima?", "Xususiy mulk", "Xususiy mulk bozor iqtisodiyotining asosi."),
    ("Pul munosabatlari va mablag'lar taqsimoti tizimi nima?", "Moliya", "Moliya — iqtisodiyotning pul yo'nalishi."),
    ("Iqtisodiyotdagi keskin pasayish nima deb ataladi?", "Inqiroz", "Inqiroz davriy ravishda yuz berishi mumkin."),
    ("O'simlik va hayvonot dunyosini yetishtirish tarmog'i nima?", "Qishloq xo'jaligi", "Qishloq xo'jaligi — iqtisodiyotning asosiy tarmog'i."),
    ("Tovar ishlab chiqarish tarmog'i nima?", "Sanoat", "Sanoat — iqtisodiy rivojlanishning dvigateli."),
    ("Tovarlarni sotib olish va sotish faoliyati nima?", "Savdo", "Savdo iqtisodiyotning muhim qismi."),
    ("Soliq miqdorini belgilovchi foiz yoki summa nima?", "Soliq stavkasi", "Soliq stavkasi soliqqa tortiladigan summadan hisoblanadi."),
    ("Har bir qadamda olinadigan soliq nima deb ataladi?", "QQS", "QQS — iste'mol solig'i shakli."),
    ("Davlat chegarasida tovarlar nazoratini amalga oshirish tizimi nima?", "Bojxona", "Bojxona — davlat manfaatini himoya qiladi."),
    ("Korxona kapitalining bir qismini tasdiqlovchi qimmatli qog'oz nima?", "Aksiya", "Aksiya — fond bozorida savdo qilinadi."),
    ("Qarz majburiyatini tasdiqlovchi qimmatli qog'oz nima?", "Obligatsiya", "Obligatsiya — barqaror daromad manbai."),
    ("Aksiya egaliga to'lanadigan foyda qismi nima?", "Dividend", "Dividend korxona foydasidan taqsimlanadi."),
    ("Yalpi mahsulotning yillik o'sish sur'ati nimani anglatadi?", "Iqtisodiy o'sish", "Iqtisodiy o'sish — iqtisodiyotning rivojlanish darajasi."),
    ("Mahsulotni boshqalardan ajratuvchi belgi nima?", "Tovar belgisi", "Tovar belgisi huquqan himoyalangan."),
    ("Tovar va xizmatlarni shaxsiy foydalanish uchun xarid qiluvchi kim?", "Iste'molchi", "Iste'molchi — bozor iqtisodiyotining markazi."),
    ("Tovar va xizmatlarni yaratuvchi tashkilot yoki shaxs kim?", "Ishlab chiqaruvchi", "Ishlab chiqaruvchi talabni qondiradi."),
    ("Import qilinadigan tovarlarga olinadigan soliq nima?", "Tarif", "Tarif mahalliy ishlab chiqaruvchilarni himoya qiladi."),
    ("Import qilinadigan tovar miqdoridagi cheklov nima?", "Kvota", "Kvota — savdo cheklov shakli."),
    ("Davlat tomonidan beriladigan moliyaviy yordam nima?", "Subsidiya", "Subsidiya mahalliy ishlab chiqaruvchilarni qo'llab-quvvatlaydi."),
]

# ---------------------------------------------------------------------------
# 3. Kategoriyaga ajratish
# ---------------------------------------------------------------------------
_IQT_CATEGORY = [
    ("Quyidagi resurslardan qaysi biri ishlab chiqarish omili EMAS?", "Yer usti chiqindisi", "Ishlab chiqarish omillari: mehnat, yer, kapital, tadbirkorlik. Chiqindi emas.", ["Mehnat", "Kapital", "Yer usti chiqindisi", "Tadbirkorlik"]),
    ("Qaysi iqtisodiyot tizimida narxni davlat belgilaydi?", "Rejalashtirilgan iqtisodiyot", "Rejalashtirilgan iqtisodiyotda narxni davlat belgilaydi.", ["Bozor iqtisodiyoti", "Rejalashtirilgan iqtisodiyot", "Aralash iqtisodiyot", "Global iqtisodiyot"]),
    ("Qaysi tizimda erkin raqobat ustunlik qiladi?", "Bozor iqtisodiyoti", "Bozor iqtisodiyotining asosi — erkin raqobat.", ["Rejalashtirilgan iqtisodiyot", "Monopoliya", "Bozor iqtisodiyoti", "Oligopoliya"]),
    ("Bozor iqtisodiyotining asosiy mexanizmi nima?", "Taklif va talab", "Taklif va talab — bozor narxini belgilovchi kuch.", ["Soliq va subvensiya", "Reja va topshiriq", "Taklif va talab", "Moral va axloq"]),
    ("Davlat moliyasining asosiy hujjati qaysi?", "Byudjet", "Byudjet — davlatning daromad va xarajatlari rejasidir.", ["Kredit", "Byudjet", "Dividend", "Tarif"]),
    ("Quyidagi qaysi tarmoq xizmat ko'rsatish sohasiga kiradi?", "Ta'lim", "Ta'lim — xizmat tarmog'iga kiradi.", ["Qishloq xo'jaligi", "Sanoat", "Ta'lim", "Energetika"]),
    ("Eksportning asosiy maqsadi nima?", "Valyuta jalb qilish", "Eksport — valyuta kirib kelish manbai.", ["Soliq yig'ish", "Valyuta jalb qilish", "Ishsizlikni oshirish", "Importni kamaytirish"]),
    ("Monopoliyaning asosiy salbiy tomoni nimada?", "Narxni erkin belgilash", "Monopoliyada raqobat yo'q, sotuvchi narxni belgilaydi.", ["Samaradorlik", "Narxni erkin belgilash", "Innovatsiya", "Ish o'rinlari yaratish"]),
    ("Foiz stavkasini kim belgilaydi?", "Markaziy bank", "Markaziy bank monetar siyosatini yuritadi.", ["Tijorat banki", "Markaziy bank", "Hukumat", "Xalqaro valyuta fondi"]),
    ("Inflyatsiya paytida pulning qadr-qimmati qanday o'zgaradi?", "Kamayadi", "Inflyatsiya — pulning qadriga salbiy ta'sir qiladi.", ["Oshadi", "Kamayadi", "O'zgarmaydi", "Avval oshadi, keyin kamayadi"]),
    ("Fiskal siyosat qaysi organ tomonidan yuritiladi?", "Hukumat", "Fiskal siyosat — davlat byudjet siyosati.", ["Markaziy bank", "Hukumat", "Xalqaro valyuta fondi", "Soliq qo'mitasi"]),
    ("Monetar siyosatning asosiy vositasi nima?", "Pul massasini boshqarish", "Monetar siyosat — pul massasi va foiz stavkalarini nazorat.", ["Soliq stavkasini o'zgartirish", "Pul massasini boshqarish", "Tariflarni oshirish", "Subsidiyani kamaytirish"]),
    ("Qaysi shakl mulkiyat turiga kiradi?", "Ko'chmas mulk", "Ko'chmas mulk — yer, uy, bino va inshootlar.", ["Aksiya", "Ko'chmas mulk", "Depozit", "Kredit"]),
    ("Qaysi qimmatli qog'oz qarz majburiyatini bildiradi?", "Obligatsiya", "Obligatsiya — qarz qaytarish va'dasini tasdiqlaydi.", ["Aksiya", "Obligatsiya", "Dividend", "Veksel"]),
    ("Ishlab chiqarish omillaridan qaysi biri inson resursi?", "Mehnat", "Mehnat — eng muhim ishlab chiqarish omili.", ["Yer", "Kapital", "Mehnat", "Tadbirkorlik"]),
    ("Tabiiy monopoliya qaysi sohalarda ko'proq uchraydi?", "Kommunal xizmatlarda", "Tabiiy monopoliya — suv, gaz, elektr ta'minoti.", ["Oziq-ovqat", "Kommunal xizmatlarda", "Matajlik", "Savdo"]),
    ("Xalqaro savdoda tovarni xarajatdan past narxda sotish nimaga deyiladi?", "Dumping", "Dumping — nofair raqobat shakli.", ["Subsidiya", "Tarif", "Dumping", "Kvota"]),
    ("Bo'lib to'lash nimani anglatadi?", "Mahsulot narxini bir necha qismga bo'lish", "Bo'lib to'lash iste'molni rag'batlantiradi.", ["Mahsulotni qaytarish", "Mahsulot narxini bir necha qismga bo'lish", "Mahsulotni reklama qilish", "Mahsulotni saqlash"]),
    ("Raqobatning asosiy afzalligi nimada?", "Sifat va narxning yaxshilanishi", "Raqobat iste'molchiga foyda keltiradi.", ["Monopoliyani kuchaytirish", "Sifat va narxning yaxshilanishi", "Davlat nazoratini kuchaytirish", "Pul massasini kamaytirish"]),
    ("Iqtisodiy inqirozning asosiy belgisi nima?", "Ishsizlikning oshishi", "Inqiroz — iqtisodiyotdagi keskin pasayish.", ["Narxlarning pasayishi", "Ishsizlikning oshishi", "Eksportning oshishi", "Valyuta zaxirasining oshishi"]),
    ("Soliq qo'shilgan qiymat (QQS) nimani anglatadi?", "Har bir ishlab chiqarish qadamida olinadigan soliq", "QQS — iste'mol solig'i shakli.", ["Daromad solig'i", "Har bir ishlab chiqarish qadamida olinadigan soliq", "Bojxona solig'i", "Yer solig'i"]),
    ("Dividend nimani bildiradi?", "Aksiya egasiga to'lanadigan foyda qismi", "Dividend korxona foydasidan taqsimlanadi.", ["Kredit foizi", "Aksiya egasiga to'lanadigan foyda qismi", "Soliq to'lovi", "Obligatsiya narxi"]),
    ("Iqtisodiy o'sishning asosiy ko'rsatkichi nima?", "YaIM o'sishi", "YaIM — iqtisodiy rivojlanishning asosiy ko'rsatkichi.", ["Inflatsiya darajasi", "YaIM o'sishi", "Soliq stavkasi", "Pul massasi"]),
    ("Qaysi tashkilot valyuta siyosatini yuritadi?", "Markaziy bank", "Markaziy bank — pul-kredit tizimini boshqaradi.", ["Hukumat", "Markaziy bank", "Xalqaro valyuta fondi", "Tijorat banki"]),
    ("Ishlab chiqarishning eng muhim omili nimani anglatadi?", "Mehnat qobiliyati", "Mehnat — moddiy boylik yaratuvchi kuch.", ["Yer", "Kapital", "Mehnat qobiliyati", "Texnologiya"]),
]

# ---------------------------------------------------------------------------
# 4. To'g'ri / Noto'g'ri (True/False style)
# ---------------------------------------------------------------------------
_IQT_TRUE_FALSE = [
    ("Bozor iqtisodiyotida narxni davlat belgilaydi.", "Noto'g'ri", "Bozor iqtisodiyotida narxni taklif va talab belgilaydi."),
    ("Inflyatsiya — bu narxlarning umumiy pasayishi.", "Noto'g'ri", "Inflyatsiya — narxlarning umumiy o'sishi."),
    ("Monopoliyada bozorda bitta sotuvchi ustunlik qiladi.", "To'g'ri", "Monopoliyaning asosiy xususiyati — bitta sotuvchi."),
    ("Eksport — chet eldan mahsulot olish.", "Noto'g'ri", "Eksport — mahsulotlarni chet elga sotish."),
    ("Kapital — bu mehnat vositalari va moddiy resurslar.", "To'g'ri", "Kapital ishlab chiqarish vositalarini o'z ichiga oladi."),
    ("Daromad solig'i progressiv stavkada bo'lishi mumkin.", "To'g'ri", "Progressiv soliq — daromad ortgan sari stavka oshadi."),
    ("Sug'urta — xavflarni boshqarish usuli.", "To'g'ri", "Sug'urta moddiy zararni qoplash tizimi."),
    ("Nominal daromad — narxlar hisobga olingan daromad.", "Noto'g'ri", "Nominal daromad — narxlar hisobga olinmagan daromad."),
    ("Markaziy bank foiz stavkasini belgilaydi.", "To'g'ri", "Markaziy bank monetar siyosatini yuritadi."),
    ("Ishlab chiqarish omillari: mehnat, yer, kapital, inflyatsiya.", "Noto'g'ri", "Ishlab chiqarish omillari: mehnat, yer, kapital, tadbirkorlik."),
    ("Bozor iqtisodiyotida erkin raqobat mavjud.", "To'g'ri", "Erkin raqobat — bozor iqtisodiyotining asosi."),
    ("QQS — bu daromad solig'i.", "Noto'g'ri", "QQS — qo'shilgan qiymat solig'i, iste'mol solig'i."),
    ("Obligatsiya qarz majburiyatini bildiradi.", "To'g'ri", "Obligatsiya — qarz qaytarish va'dasi."),
    ("Dividend — bu kredit foizi.", "Noto'g'ri", "Dividend — aksiya egasiga to'lanadigan foyda."),
    ("Inqiroz — iqtisodiyotning o'sishi.", "Noto'g'ri", "Inqiroz — iqtisodiyotning keskin pasayishi."),
    ("Valyuta kursi — bir valyutaning boshqasiga nisbati.", "To'g'ri", "Valyuta kursi bozorda yoki markazlashgan tartibda belgilanadi."),
    ("Subsidiya — davlat tomonidan beriladigan soliq.", "Noto'g'ri", "Subsidiya — davlat tomonidan beriladigan moliyaviy yordam."),
    ("Tarif — import qilinadigan tovarlarga olinadigan soliq.", "To'g'ri", "Tarif — savdo himoyasi vositasi."),
    ("Depozit — bankka qo'yilgan va foiz oladigan mablag'.", "To'g'ri", "Depozit xavfsiz pul saqlash usuli."),
    ("Oligopoliyada ko'plab sotuvchilar mavjud.", "Noto'g'ri", "Oligopoliyada oz sonli sotuvchilar (2-10) mavjud."),
    ("Real daromad = Nominal daromad / Narxlar indeksi × 100.", "To'g'ri", "Real daromad — xarid qobiliyatini ko'rsatadi."),
    ("Fond bozorida depozitlar bilan savdo qilinadi.", "Noto'g'ri", "Fond bozorida aksiya va obligatsiyalar bilan savdo qilinadi."),
    ("Tadbirkor — tavakkali o'z hisobiga ish yurituvchi shaxs.", "To'g'ri", "Tadbirkorlik — yangilik va ish o'rinlari yaratish."),
    ("Fiskal siyosat — pul massasini boshqarish.", "Noto'g'ri", "Fiskal siyosat — soliq va xarajatlar orqali boshqarish."),
    ("Monetar siyosat — soliq stavkasini o'zgartirish.", "Noto'g'ri", "Monetar siyosat — pul massasi va foiz stavkalarini boshqarish."),
    ("Tabiiy monopoliya — kommunal xizmatlarda uchraydi.", "To'g'ri", "Suvi, gaz, elektr ta'minoti tabiiy monopoliya."),
    ("Kvota — import qilinadigan tovar miqdoridagi cheklov.", "To'g'ri", "Kvota — savdo cheklov shakli."),
    ("Xususiy mulk — davlatga tegishli ishlab chiqarish vositalari.", "Noto'g'ri", "Xususiy mulk — shaxslarga tegishli vositalar."),
    ("Samaradorlik — kam xarajat ko'p mahsulot olish qobiliyati.", "To'g'ri", "Samaradorlik iqtisodiy rivojlanish kaliti."),
    ("Logistika — tovarlarni bir joydan boshqa joyga ko'chirish.", "To'g'ri", "Logistika — yetkazib berish tizimini boshqarish."),
]

# ---------------------------------------------------------------------------
# Numeric templates
# ---------------------------------------------------------------------------

def _template_profit(bank, rng):
    daromad = rng.randint(500, 50000)
    xarajat = rng.randint(100, daromad - 10)
    foyda = daromad - xarajat
    q = f"Tadbirkorning daromadi {daromad:,} so'm, xarajatlari {xarajat:,} so'm. Foydasi qancha?".replace(",", " ")
    opts = [f"{foyda:,} so'm", f"{foyda + 100:,} so'm", f"{foyda - 100:,} so'm", f"{xarajat:,} so'm".replace(",", " ")]
    opts = [o.replace(",", " ") for o in opts]
    correct = opts[0]
    bank.add(q, _o4(correct, opts), correct,
             f"Foyda = Daromad - Xarajat = {daromad} - {xarajat} = {foyda} so'm.")


def _template_loss(bank, rng):
    xarajat = rng.randint(500, 50000)
    daromad = rng.randint(100, xarajat - 10)
    zarar = xarajat - daromad
    q = f"Korxona xarajatlari {xarajat:,} so'm, daromadi {daromad:,} so'm. Zarar qancha?".replace(",", " ")
    opts = [f"{zarar:,} so'm", f"{zarar + 50:,} so_m", f"{zarar - 50:,} so_m", f"{xarajat:,} so_m".replace(",", " ")]
    opts = [o.replace(",", " ") for o in opts]
    opts[1] = opts[1].replace("_", "'")
    opts[2] = opts[2].replace("_", "'")
    opts[3] = opts[3].replace("_", "'")
    correct = opts[0]
    bank.add(q, _o4(correct, opts), correct,
             f"Zarar = Xarajat - Daromad = {xarajat} - {daromad} = {zarar} so'm.")


def _template_discount(bank, rng):
    narx = rng.choice([100, 200, 250, 400, 500, 800, 1000, 1500, 2000])
    chegirma_foiz = rng.choice([5, 10, 15, 20, 25, 30, 40, 50])
    if narx * chegirma_foiz % 100 != 0:
        return
    chegirma_sum = narx * chegirma_foiz // 100
    yangi_narx = narx - chegirma_sum
    q = f"Narxi {narx} so'm bo'lgan mahsulotga {chegirma_foiz}% chegirma berildi. Yangi narx qancha?"
    correct = f"{yangi_narx} so'm"
    opts = [correct, f"{chegirma_sum} so'm", f"{narx + chegirma_sum} so'm", f"{yangi_narx + 10} so_m"]
    opts[3] = opts[3].replace("_", "'")
    bank.add(q, _o4(correct, opts), correct,
             f"Chegirma = {narx} × {chegirma_foiz}% = {chegirma_sum} so'm. Yangi narx = {narx} - {chegirma_sum} = {yangi_narx} so'm.")


def _template_interest(bank, rng):
    P = rng.choice([100000, 200000, 500000, 1000000, 2000000, 5000000])
    r = rng.choice([5, 8, 10, 12, 15, 20])
    t = rng.choice([1, 2, 3, 6, 12])
    foiz = P * r * t // 100
    jami = P + foiz
    q = f"{P:,} so'm depozitga {r}% foiz stavkasida {t} oyga qo'yildi. Foiz miqdori qancha?".replace(",", " ")
    correct = f"{foiz:,} so_m".replace(",", " ").replace("_", "'")
    opts = [correct, f"{jami:,} so_m", f"{foiz + P // 10:,} so_m", f"{foiz // 2:,} so_m".replace(",", " ")]
    opts = [o.replace("_", "'") for o in opts]
    bank.add(q, _o4(correct, opts), correct,
             f"S = P·r·t/100 = {P}·{r}·{t}/100 = {foiz} so'm.")


def _template_price_increase(bank, rng):
    narx = rng.choice([500, 800, 1000, 1200, 2000, 2500, 4000, 5000])
    foiz = rng.choice([5, 10, 15, 20, 25, 30])
    yangi = narx * (100 + foiz) // 100
    q = f"Mahsulot narxi {narx} so'mdan {foiz}% ga oshirildi. Yangi narx qancha?"
    correct = f"{yangi} so_m".replace("_", "'")
    opts = [correct, f"{narx + foiz} so_m", f"{yangi + 10} so_m", f"{narx * (100 - foiz) // 100} so_m"]
    opts = [o.replace("_", "'") for o in opts]
    bank.add(q, _o4(correct, opts), correct,
             f"Yangi narx = {narx} × (100 + {foiz})/100 = {yangi} so'm.")


def _template_price_decrease(bank, rng):
    narx = rng.choice([500, 1000, 1500, 2000, 3000, 4000, 5000])
    foiz = rng.choice([5, 10, 15, 20, 25, 30, 40])
    yangi = narx * (100 - foiz) // 100
    q = f"Mahsulot narxi {narx} so'mdan {foiz}% ga tushirildi. Yangi narx qancha?"
    correct = f"{yangi} so_m".replace("_", "'")
    opts = [correct, f"{narx - foiz} so_m", f"{yangi + 5} so_m", f"{narx * (100 + foiz) // 100} so_m"]
    opts = [o.replace("_", "'") for o in opts]
    bank.add(q, _o4(correct, opts), correct,
             f"Yangi narx = {narx} × (100 - {foiz})/100 = {yangi} so'm.")


def _template_cost_price(bank, rng):
    xom = rng.choice([1000, 2000, 3000, 5000, 8000])
    mehnat = rng.choice([500, 1000, 1500, 2000, 3000])
    boshqa = rng.choice([200, 300, 500, 1000])
    tannarx = xom + mehnat + boshqa
    q = f"Mahsulot tannarxi: xom ashyo {xom} so'm, mehnat haqi {mehnat} so'm, boshqa xarajatlar {boshqa} so'm. Umumiy tannarx qancha?"
    correct = f"{tannarx} so_m".replace("_", "'")
    opts = [correct, f"{xom + mehnat} so_m", f"{tannarx + 100} so_m", f"{tannarx - 100} so_m"]
    opts = [o.replace("_", "'") for o in opts]
    bank.add(q, _o4(correct, opts), correct,
             f"Tannarx = {xom} + {mehnat} + {boshqa} = {tannarx} so'm.")


def _template_avg_price(bank, rng):
    n = rng.choice([3, 4, 5])
    prices = sorted([rng.randint(500, 5000) for _ in range(n)])
    umumiy = sum(prices)
    if umumiy % n != 0:
        return
    ortacha = umumiy // n
    q = f"{n} ta mahsulotning narxlari: {', '.join(str(p) for p in prices)} so'm. O'rtacha narx qancha?"
    correct = f"{ortacha} so_m".replace("_", "'")
    opts = [correct, f"{ortacha + 50} so_m", f"{ortacha - 50} so_m", f"{umumiy} so_m"]
    opts = [o.replace("_", "'") for o in opts]
    bank.add(q, _o4(correct, opts), correct,
             f"O'rtacha narx = {umumiy}/{n} = {ortacha} so'm.")


def _template_currency(bank, rng):
    kurs = rng.choice([8000, 9000, 10000, 10500, 11000, 11500, 12000, 12500, 13000])
    miqdor = rng.choice([1, 2, 3, 5, 10, 20, 50, 100, 200, 500, 1000])
    natija = kurs * miqdor
    q = f"1 USD = {kurs:,} so'm bo'lsa, {miqdor} USD nech so'mga teng?".replace(",", " ")
    correct = f"{natija:,} so_m".replace(",", " ").replace("_", "'")
    opts = [correct, f"{natija + kurs:,} so_m", f"{natija - kurs:,} so_m", f"{natija // 10:,} so_m".replace(",", " ")]
    opts = [o.replace("_", "'") for o in opts]
    bank.add(q, _o4(correct, opts), correct,
             f"{miqdor} × {kurs} = {natija} so'm.")


def _template_currency_reverse(bank, rng):
    kurs = rng.choice([8000, 9000, 10000, 10500, 11000, 12000, 12500, 13000])
    usd = rng.choice([1, 2, 3, 5, 10, 20, 50, 100])
    umumiy_som = kurs * usd
    yana_usd = rng.choice([u for u in [1, 2, 3, 5, 10, 20] if u != usd])
    q = f"{umumiy_som:,} so'mni 1 USD = {kurs:,} so'm kursi bilan dollarga aylantiring. Necha USD?".replace(",", " ")
    correct = f"{usd} USD"
    opts = [correct, f"{usd + 1} USD", f"{usd - 1 if usd > 1 else usd} USD", f"{yana_usd} USD"]
    bank.add(q, _o4(correct, opts), correct,
             f"{umumiy_som} / {kurs} = {usd} USD.")


def _template_tax(bank, rng):
    summa = rng.choice([100000, 200000, 300000, 500000, 750000, 1000000, 1500000, 2000000])
    stavka = rng.choice([5, 8, 10, 12, 15, 20])
    soliq = summa * stavka // 100
    q = f"Tadbirkor {summa:,} so'm daromad olgan. Daromad solig'i stavkasi {stavka}%. Soliq miqdori qancha?".replace(",", " ")
    correct = f"{soliq:,} so_m".replace(",", " ").replace("_", "'")
    opts = [correct, f"{soliq + summa // 20:,} so_m", f"{soliq - summa // 50:,} so_m", f"{stavka} so_m"]
    opts = [o.replace("_", "'") for o in opts]
    bank.add(q, _o4(correct, opts), correct,
             f"Soliq = {summa} × {stavka}% = {soliq} so'm.")


def _template_interest_total(bank, rng):
    P = rng.choice([500000, 1000000, 2000000, 3000000, 5000000])
    r = rng.choice([6, 8, 10, 12, 15])
    t = rng.choice([1, 2, 3, 6, 12])
    foiz = P * r * t // 100
    jami = P + foiz
    q = f"{P:,} so'm {t} oyga {r}% bilan qo'yildi. Depozit oxirida qancha pul bo'ladi?".replace(",", " ")
    correct = f"{jami:,} so_m".replace(",", " ").replace("_", "'")
    opts = [correct, f"{foiz:,} so_m", f"{P:,} so_m".replace(",", " "), f"{jami + foiz:,} so_m".replace(",", " ")]
    opts = [o.replace("_", "'") for o in opts]
    bank.add(q, _o4(correct, opts), correct,
             f"Jami = P + S = {P} + {P}×{r}×{t}/100 = {P} + {foiz} = {jami} so'm.")


def _template_margin(bank, rng):
    tannarx = rng.choice([5000, 8000, 10000, 12000, 15000, 20000, 25000])
    marja_foiz = rng.choice([10, 15, 20, 25, 30, 40, 50])
    sotish_narxi = tannarx * (100 + marja_foiz) // 100
    q = f"Mahsulot tannarxi {tannarx} so'm, marja {marja_foiz}%. Sotish narxi qancha?"
    correct = f"{sotish_narxi} so_m".replace("_", "'")
    opts = [correct, f"{tannarx + marja_foiz} so_m", f"{sotish_narxi + 100} so_m", f"{tannarx * (100 - marja_foiz) // 100} so_m"]
    opts = [o.replace("_", "'") for o in opts]
    bank.add(q, _o4(correct, opts), correct,
             f"Sotish narxi = {tannarx} × (100 + {marja_foiz})/100 = {sotish_narxi} so'm.")


def _template_profit_margin(bank, rng):
    tannarx = rng.choice([3000, 5000, 7000, 10000, 12000, 15000])
    sotish = rng.choice([4000, 6000, 8000, 10000, 12000, 15000, 18000, 20000])
    if sotish <= tannarx:
        return
    foyda = sotish - tannarx
    q = f"Mahsulot tannarxi {tannarx} so'm, sotish narxi {sotish} so'm. Foyda miqdori qancha?"
    correct = f"{foyda} so_m".replace("_", "'")
    opts = [correct, f"{foyda + 200} so_m", f"{tannarx} so_m", f"{sotish + foyda} so_m"]
    opts = [o.replace("_", "'") for o in opts]
    bank.add(q, _o4(correct, opts), correct,
             f"Foyda = {sotish} - {tannarx} = {foyda} so'm.")


def _template_yaim(bank, rng):
    iste = rng.choice([100, 200, 300, 500, 800])
    invest = rng.choice([50, 100, 150, 200, 300])
    davlat_xarajat = rng.choice([30, 50, 80, 100, 150])
    savdo_balans = rng.choice([-20, -10, 10, 20, 30])
    yaim = iste + invest + davlat_xarajat + savdo_balans
    q = (f"Mamlakat YaIM tarkibida: iste'mol {iste}, investitsiya {invest}, "
         f"davlat xarajatlari {davlat_xarajat}, tashqi savdo balansi {savdo_balans} mlrd so'm. "
         f"YaIM qiymatini toping.")
    correct = f"{yaim} mlrd so_m".replace("_", "'")
    opts = [correct, f"{iste + invest} mlrd so_m", f"{yaim + 50} mlrd so_m", f"{yaim - 50} mlrd so_m"]
    opts = [o.replace("_", "'") for o in opts]
    bank.add(q, _o4(correct, opts), correct,
             f"YaIM = {iste} + {invest} + {davlat_xarajat} + ({savdo_balans}) = {yaim} mlrd so'm.")


def _template_budget(bank, rng):
    daromadlar = rng.choice([500, 800, 1000, 1500, 2000, 3000])
    xarajatlar = rng.randint(100, daromadlar - 50)
    balans = daromadlar - xarajatlar
    q = f"Davlat budjetining daromadlari {daromadlar} mlrd so'm, xarajatlari {xarajatlar} mlrd so'm. Budjet balansi qancha?"
    correct = f"{balans} mlrd so_m".replace("_", "'")
    opts = [correct, f"{daromadlar + xarajatlar} mlrd so_m", f"{-balans} mlrd so_m", f"{xarajatlar} mlrd so_m"]
    opts = [o.replace("_", "'") for o in opts]
    bank.add(q, _o4(correct, opts), correct,
             f"Balans = {daromadlar} - {xarajatlar} = {balans} mlrd so'm.")


def _template_exchange(bank, rng):
    som_soni = rng.choice([10000, 20000, 50000, 100000, 200000, 500000])
    kurs = rng.choice([9000, 10000, 10500, 11000, 12000, 12500])
    if som_soni % kurs != 0:
        return
    usd = som_soni // kurs
    q = f"{som_soni:,} so'mni 1 USD = {kurs:,} so'm kursi bilan dollarga aylantiring. Nechta USD?".replace(",", " ")
    correct = f"{usd} USD"
    opts = [correct, f"{usd + 1} USD", f"{usd - 1 if usd > 1 else usd} USD", f"{usd * 2} USD"]
    bank.add(q, _o4(correct, opts), correct,
             f"{som_soni} / {kurs} = {usd} USD.")


def _template_interest_monthly(bank, rng):
    P = rng.choice([100000, 200000, 500000, 1000000])
    r = rng.choice([12, 15, 18, 20, 24])
    oy = rng.choice([3, 6, 9, 12])
    yillik = P * r // 100
    if yillik % 12 != 0:
        return
    oylik = yillik // 12
    umumiy = oylik * oy
    q = f"{P:,} so'm {r}% yillik stavkada {oy} oyga qo'yildi. {oy} oylik umumiy foiz qancha?".replace(",", " ")
    correct = f"{umumiy} so_m".replace("_", "'")
    opts = [correct, f"{yillik} so_m", f"{oylik} so_m", f"{umumiy + 1000} so_m"]
    opts = [o.replace("_", "'") for o in opts]
    bank.add(q, _o4(correct, opts), correct,
             f"Yillik foiz = {P}×{r}/100 = {yillik}. Oylik = {yillik}/12 = {oylik}. "
             f"{oy} oy = {oylik}×{oy} = {umumiy} so'm.")


def _template_exchange_multi(bank, rng):
    kurs = rng.choice([9000, 10000, 11000, 12000, 13000])
    miqdor = rng.choice([100, 200, 500, 1000, 2000])
    natija = kurs * miqdor
    q = f"1 USD = {kurs:,} so'm bo'lsa, {miqdor} USD nech so'mga teng?".replace(",", " ")
    correct = f"{natija:,} so_m".replace(",", " ").replace("_", "'")
    opts = [correct, f"{natija + 1000:,} so_m", f"{natija - 1000:,} so_m", f"{kurs} so_m"]
    opts = [o.replace(",", " ").replace("_", "'") for o in opts]
    bank.add(q, _o4(correct, opts), correct,
             f"{miqdor} USD × {kurs} = {natija} so'm.")


def _template_unit_cost(bank, rng):
    umumiy = rng.choice([100000, 200000, 300000, 500000, 750000])
    miqdor = rng.choice([50, 100, 200, 250, 500])
    if umumiy % miqdor != 0:
        return
    birlik = umumiy // miqdor
    q = f"{miqdor} dona mahsulot ishlab chiqarish umumiy {umumiy:,} so'mga tushdi. Birlik tannarxi qancha?".replace(",", " ")
    correct = f"{birlik} so_m".replace("_", "'")
    opts = [correct, f"{birlik + 100} so_m", f"{birlik - 100 if birlik > 100 else birlik} so_m", f"{umumiy} so_m"]
    opts = [o.replace("_", "'") for o in opts]
    bank.add(q, _o4(correct, opts), correct,
             f"Birlik tannarx = {umumiy}/{miqdor} = {birlik} so'm.")


def _template_revenue(bank, rng):
    narx = rng.choice([500, 1000, 1500, 2000, 3000, 5000])
    miqdor = rng.choice([100, 200, 300, 500, 1000, 2000])
    daromad = narx * miqdor
    q = f"Narxi {narx} so'm bo'lgan mahsulotdan {miqdor} dona sotildi. Umumiy daromad qancha?"
    correct = f"{daromad:,} so_m".replace(",", " ").replace("_", "'")
    opts = [correct, f"{daromad + narx:,} so_m", f"{narx + miqdor:,} so_m", f"{daromad // 10:,} so_m".replace(",", " ")]
    opts = [o.replace(",", " ").replace("_", "'") for o in opts]
    bank.add(q, _o4(correct, opts), correct,
             f"Daromad = {narx} × {miqdor} = {daromad} so'm.")


def _template_break_even(bank, rng):
    doimiy_xarajat = rng.choice([50000, 100000, 200000, 300000, 500000])
    o_zgaruvchan = rng.choice([5, 10, 15, 20, 25, 50])
    sotish_narxi = rng.choice([20, 30, 40, 50, 60, 100])
    if sotish_narxi <= o_zgaruvchan:
        return
    if doimiy_xarajat % (sotish_narxi - o_zgaruvchan) != 0:
        return
    break_even = doimiy_xarajat // (sotish_narxi - o_zgaruvchan)
    q = (f"Korxonaning doimiy xarajatlari {doimiy_xarajat:,} so'm, bitta mahsulotning o'zgaruvchan xarajati "
         f"{o_zgaruvchan} so'm, sotish narxi {sotish_narxi} so'm. "
         f"Zararsizlik nuqtasida nechta mahsulot sotilishi kerak?".replace(",", " "))
    correct = f"{break_even} dona"
    opts = [correct, f"{break_even + 10} dona", f"{break_even - 10 if break_even > 10 else break_even} dona", f"{break_even * 2} dona"]
    bank.add(q, _o4(correct, opts), correct,
             f"Zararsizlik: {doimiy_xarajat} / ({sotish_narxi} - {o_zgaruvchan}) = {break_even} dona.")


def _template_growth_rate(bank, rng):
    old = rng.choice([100, 200, 300, 500, 800, 1000])
    yangi = old + rng.choice([10, 20, 30, 50, 80, 100, 150, 200])
    if (yangi - old) * 100 % old != 0:
        return
    o_sish = (yangi - old) * 100 // old
    q = f"Mamlakat YaIM o'tgan yili {old} mlrd so'm, bu yili {yangi} mlrd so'm bo'ldi. O'sish sur'ati necha %?"
    correct = f"{o_sish}%"
    opts = [correct, f"{o_sish + 2}%", f"{o_sish - 2 if o_sish > 2 else o_sish}%", f"{yangi}%"]
    bank.add(q, _o4(correct, opts), correct,
             f"O'sish = ({yangi} - {old})/{old} × 100 = {o_sish}%.")


def _template_import_export(bank, rng):
    eks = rng.choice([500, 800, 1000, 1500, 2000, 3000])
    imp = rng.choice([300, 600, 800, 1200, 1800, 2500])
    balans = eks - imp
    q = f"Mamlakat eksporti {eks} mlrd so'm, importi {imp} mlrd so'm. Xalqaro savdo balansi qancha?"
    correct = f"{balans} mlrd so_m".replace("_", "'")
    opts = [correct, f"{eks + imp} mlrd so_m", f"{-balans} mlrd so_m", f"{eks} mlrd so_m"]
    opts = [o.replace("_", "'") for o in opts]
    bank.add(q, _o4(correct, opts), correct,
             f"Balans = Eksport - Import = {eks} - {imp} = {balans} mlrd so'm.")


def _template_tariff(bank, rng):
    narx = rng.choice([1000, 2000, 3000, 5000, 8000, 10000])
    stavka = rng.choice([5, 10, 15, 20, 25, 30])
    boj = narx * stavka // 100
    jami = narx + boj
    q = f"100 ta import mahsulotining umumiy narxi {narx:,} so'm. Bojxona stavkasi {stavka}%. Jami to'lov qancha?".replace(",", " ")
    correct = f"{jami:,} so_m".replace(",", " ").replace("_", "'")
    opts = [correct, f"{boj:,} so_m", f"{narx:,} so_m".replace(",", " "), f"{jami + 500:,} so_m".replace(",", " ")]
    opts = [o.replace("_", "'") for o in opts]
    bank.add(q, _o4(correct, opts), correct,
             f"Boj = {narx}×{stavka}/100 = {boj}. Jami = {narx} + {boj} = {jami} so'm.")


def _template_ssi(bank, rng):
    ish = rng.choice([800000, 1000000, 1200000, 1500000, 2000000, 2500000])
    stavka = rng.choice([12, 15, 20, 25, 30])
    ish_ssi = ish * stavka // 100
    q = f"Ishchi {ish:,} so'm ish haqi oladi. Ijtimoiy sug'urta badali stavkasi {stavka}%. Badal miqdori qancha?".replace(",", " ")
    correct = f"{ish_ssi:,} so_m".replace(",", " ").replace("_", "'")
    opts = [correct, f"{ish_ssi + 5000:,} so_m", f"{ish_ssi - 5000:,} so_m", f"{ish} so_m"]
    opts = [o.replace(",", " ").replace("_", "'") for o in opts]
    bank.add(q, _o4(correct, opts), correct,
             f"ISSB = {ish}×{stavka}/100 = {ish_ssi} so'm.")


def _template_contract(bank, rng):
    narx = rng.choice([5000000, 10000000, 15000000, 20000000, 50000000])
    boshqa = rng.choice([1000000, 2000000, 3000000, 5000000])
    muddat = rng.choice([6, 12, 18, 24])
    if (narx + boshqa) % muddat != 0:
        return
    oylik = (narx + boshqa) // muddat
    q = f"Qurilma narxi {narx:,} so'm, qo'shimcha xarajatlar {boshqa:,} so'm. {muddat} oyga bo'lib to'lasa, oylik to'lov qancha?".replace(",", " ")
    correct = f"{oylik:,} so_m".replace(",", " ").replace("_", "'")
    opts = [correct, f"{narx // muddat:,} so_m", f"{oylik + 10000:,} so_m", f"{oylik - 10000:,} so_m".replace(",", " ")]
    opts = [o.replace(",", " ").replace("_", "'") for o in opts]
    bank.add(q, _o4(correct, opts), correct,
             f"Oylik = ({narx} + {boshqa})/{muddat} = {oylik} so'm.")


def _template_discount_amount(bank, rng):
    narx = rng.choice([2000, 3000, 5000, 8000, 10000, 15000, 20000])
    chegirma = rng.choice([5, 10, 15, 20, 25, 30])
    chegirma_sum = narx * chegirma // 100
    q = f"Narxi {narx:,} so'm bo'lgan mahsulotga {chegirma}% chegirma berildi. Chegirma summasi qancha?".replace(",", " ")
    correct = f"{chegirma_sum} so_m".replace("_", "'")
    opts = [correct, f"{narx} so_m", f"{narx - chegirma_sum} so_m", f"{chegirma} so_m"]
    opts = [o.replace("_", "'") for o in opts]
    bank.add(q, _o4(correct, opts), correct,
             f"Chegirma = {narx}×{chegirma}/100 = {chegirma_sum} so'm.")


def _template_dividend(bank, rng):
    kapital = rng.choice([1000000, 2000000, 5000000, 10000000])
    foyda = rng.choice([500000, 1000000, 1500000, 2000000, 3000000])
    taqsim = rng.choice([30, 40, 50, 60, 70])
    dividend = foyda * taqsim // 100
    q = f"Korxona foydasi {foyda:,} so'm. Foydaning {taqsim}% i dividend sifatida taqsimlanadi. Umumiy dividend miqdori qancha?".replace(",", " ")
    correct = f"{dividend:,} so_m".replace(",", " ").replace("_", "'")
    opts = [correct, f"{foyda:,} so_m".replace(",", " "), f"{dividend + 50000:,} so_m", f"{kapital:,} so_m".replace(",", " ")]
    opts = [o.replace(",", " ").replace("_", "'") for o in opts]
    bank.add(q, _o4(correct, opts), correct,
             f"Dividend = {foyda}×{taqsim}/100 = {dividend} so'm.")


def _template_inflation(bank, rng):
    old_narx = rng.choice([1000, 2000, 3000, 5000, 8000])
    yangi_narx = old_narx + rng.choice([100, 200, 300, 500, 800, 1000])
    if (yangi_narx - old_narx) * 100 % old_narx != 0:
        return
    inflyatsiya = (yangi_narx - old_narx) * 100 // old_narx
    q = f"O'tgan yili non narxi {old_narx} so'm, bu yili {yangi_narx} so'm bo'ldi. Narxlar o'sish foizi qancha?"
    correct = f"{inflyatsiya}%"
    opts = [correct, f"{inflyatsiya + 3}%", f"{inflyatsiya - 3 if inflyatsiya > 3 else inflyatsiya}%", f"{yangi_narx}%"]
    bank.add(q, _o4(correct, opts), correct,
             f"O'sish = ({yangi_narx} - {old_narx})/{old_narx}×100 = {inflyatsiya}%.")


def _template_purchasing_power(bank, rng):
    narx = rng.choice([1000, 1500, 2000, 2500, 3000])
    daromad = rng.choice([500000, 750000, 1000000, 1500000, 2000000])
    miqdor = daromad // narx
    q = f"Tadbirkor {narx} so'mlik mahsulotdan {daromad:,} so'mlik sotib ola oladi?".replace(",", " ")
    correct = f"{miqdor} dona"
    opts = [correct, f"{miqdor + 10} dona", f"{miqdor - 10 if miqdor > 10 else miqdor} dona", f"{daromad // (narx + 500)} dona"]
    bank.add(q, _o4(correct, opts), correct,
             f"Miqdor = {daromad}/{narx} = {miqdor} dona.")


def _template_net_profit(bank, rng):
    daromad = rng.choice([100000, 200000, 500000, 1000000])
    soliq_stavka = rng.choice([5, 10, 12, 15, 20])
    xarajat = rng.randrange(50000, daromad - 10000, 100)
    daromad2 = daromad - xarajat
    if daromad2 * soliq_stavka % 100 != 0:
        return
    old_soliq = daromad - xarajat
    soliq = old_soliq * soliq_stavka // 100
    sof_foyda = old_soliq - soliq
    q = (f"Korxona daromadi {daromad:,} so'm, xarajatlari {xarajat:,} so'm. "
         f"Daromad solig'i stavkasi {soliq_stavka}%. Sof foyda qancha?".replace(",", " "))
    correct = f"{sof_foyda:,} so_m".replace(",", " ").replace("_", "'")
    opts = [correct, f"{old_soliq:,} so_m", f"{sof_foyda + soliq:,} so_m", f"{daromad:,} so_m".replace(",", " ")]
    opts = [o.replace(",", " ").replace("_", "'") for o in opts]
    bank.add(q, _o4(correct, opts), correct,
             f"Sof foyda = ({daromad} - {xarajat}) × (1 - {soliq_stavka}/100) = {old_soliq} - {soliq} = {sof_foyda} so'm.")


def _template_labor_productivity(bank, rng):
    mahsulot = rng.choice([100, 200, 300, 500, 800, 1000])
    ishchilar = rng.choice([5, 10, 20, 25, 40, 50])
    soat = rng.choice([8, 16, 40, 160])
    if mahsulot % ishchilar != 0:
        return
    unum = mahsulot // ishchilar
    q = f"{ishchilar} ishchi {soat} soat davomida {mahsulot} dona mahsulot ishlab chiqardi. Bitta ishchining unumdorligi qancha?"
    correct = f"{unum} dona"
    opts = [correct, f"{unum + 5} dona", f"{mahsulot} dona", f"{unum - 2 if unum > 2 else unum} dona"]
    bank.add(q, _o4(correct, opts), correct,
             f"Unumdorlik = {mahsulot}/{ishchilar} = {unum} dona/ishchi.")


def _template_interest_simple(bank, rng):
    P = rng.choice([100000, 200000, 300000, 500000, 700000])
    r = rng.choice([8, 10, 12, 15, 18, 20])
    t = rng.choice([1, 2, 3, 6])
    foiz = P * r * t // 100
    q = f"{P:,} so'm {t} oyga {r}% oddiy foiz stavkasida qo'yildi. Foiz miqdori?".replace(",", " ")
    correct = f"{foiz} so_m".replace("_", "'")
    opts = [correct, f"{P + foiz} so_m", f"{foiz // 2} so_m", f"{foiz + P // 10} so_m"]
    opts = [o.replace("_", "'") for o in opts]
    bank.add(q, _o4(correct, opts), correct,
             f"S = P×r×t/100 = {P}×{r}×{t}/100 = {foiz} so'm.")


def _template_marketing(bank, rng):
    tannarx = rng.choice([3000, 5000, 8000, 10000, 15000])
    ortiqcha = rng.choice([10, 15, 20, 25, 30, 40, 50])
    narx = tannarx * (100 + ortiqcha) // 100
    q = f"Mahsulot tannarxi {tannarx} so'm. Sotish narxiga {ortiqcha}% qo'shildi. Sotish narxi qancha?"
    correct = f"{narx} so_m".replace("_", "'")
    opts = [correct, f"{tannarx + ortiqcha} so_m", f"{narx + 100} so_m", f"{tannarx * (100 - ortiqcha) // 100} so_m"]
    opts = [o.replace("_", "'") for o in opts]
    bank.add(q, _o4(correct, opts), correct,
             f"Narx = {tannarx}×(100+{ortiqcha})/100 = {narx} so'm.")


def _template_nominal_real(bank, rng):
    nominal = rng.choice([1000000, 1500000, 2000000, 3000000, 5000000])
    inflyatsiya = rng.choice([5, 8, 10, 12, 15, 20])
    real = nominal * 100 // (100 + inflyatsiya)
    q = f"Ishchining nominal daromadi {nominal:,} so'm. Inflyatsiya {inflyatsiya}%. Real daromad qancha (qisqartirilgan)?".replace(",", " ")
    correct = f"{real:,} so_m".replace(",", " ").replace("_", "'")
    opts = [correct, f"{nominal} so_m", f"{nominal + 10000:,} so_m", f"{real - 10000:,} so_m".replace(",", " ")]
    opts = [o.replace(",", " ").replace("_", "'") for o in opts]
    bank.add(q, _o4(correct, opts), correct,
             f"Real daromad ≈ {nominal}/(1+{inflyatsiya}/100) = {real} so'm.")


def _template_qqs(bank, rng):
    narx = rng.choice([100000, 200000, 500000, 1000000, 2000000])
    stavka = rng.choice([10, 12, 15, 20])
    qqs = narx * stavka // 100
    jami = narx + qqs
    q = f"Mahsulot narxi {narx:,} so'm (QQS hisobga olinmagan). QQS stavkasi {stavka}%. QQS bilan jami narx qancha?".replace(",", " ")
    correct = f"{jami:,} so_m".replace(",", " ").replace("_", "'")
    opts = [correct, f"{qqs:,} so_m", f"{narx:,} so_m".replace(",", " "), f"{jami + 5000:,} so_m".replace(",", " ")]
    opts = [o.replace("_", "'") for o in opts]
    bank.add(q, _o4(correct, opts), correct,
             f"QQS = {narx}×{stavka}/100 = {qqs}. Jami = {narx} + {qqs} = {jami} so'm.")


def _template_interest_compare(bank, rng):
    P = rng.choice([1000000, 2000000, 3000000, 5000000])
    r1 = rng.choice([8, 10, 12])
    r2 = rng.choice([15, 18, 20, 24])
    t = rng.choice([6, 12])
    f1 = P * r1 * t // 100
    f2 = P * r2 * t // 100
    farq = f2 - f1
    q = (f"{P:,} so'mni {t} oyga: 1) {r1}%, 2) {r2}% stavkalarda qo'ydilar. "
         f"Farq qancha?".replace(",", " "))
    correct = f"{farq:,} so_m".replace(",", " ").replace("_", "'")
    opts = [correct, f"{f1:,} so_m", f"{f2:,} so_m".replace(",", " "), f"{farq + 1000:,} so_m".replace(",", " ")]
    opts = [o.replace(",", " ").replace("_", "'") for o in opts]
    bank.add(q, _o4(correct, opts), correct,
             f"F1={f1}, F2={f2}. Farq = {f2} - {f1} = {farq} so'm.")


def _template_subsidy(bank, rng):
    tannarx = rng.choice([5000, 8000, 10000, 15000, 20000])
    sotish = rng.choice([3000, 5000, 6000, 8000, 10000])
    miqdor = rng.choice([100, 200, 500, 1000])
    zarar = (tannarx - sotish) * miqdor
    q = (f"Davlat {miqdor} dona mahsulotni tannarx ({tannarx} so'm) dan arzonroq ({sotish} so'm) sotishni buyurdi. "
         f"Davlat qancha zarar ko'radi?")
    correct = f"{zarar:,} so_m".replace(",", " ").replace("_", "'")
    opts = [correct, f"{zarar // 2:,} so_m", f"{tannarx * miqdor:,} so_m".replace(",", " "), f"{zarar + 50000:,} so_m".replace(",", " ")]
    opts = [o.replace(",", " ").replace("_", "'") for o in opts]
    bank.add(q, _o4(correct, opts), correct,
             f"Zarar = ({tannarx} - {sotish})×{miqdor} = {zarar} so'm.")


def _template_ppp(bank, rng):
    kurs = rng.choice([8000, 9000, 10000, 11000, 12000])
    narx_usd = rng.choice([5, 10, 15, 20, 30, 50])
    narx_som = narx_usd * kurs
    mahalliy = rng.choice([20000, 50000, 80000, 100000, 150000])
    q = (f"iPhone narxi AQShda {narx_usd} USD, O'zbekistonda {mahalliy:,} so'm. "
         f"1 USD = {kurs:,} so'm. Qaysi mamlakatda arzonroq?".replace(",", " "))
    if narx_som < mahalliy:
        correct = "AQShda"
        opts = correct, "O'zbekistonda", "Har ikki mamlakatda teng", "Ma'lumot yetarli emas"
    else:
        correct = "O'zbekistonda"
        opts = correct, "AQShda", "Har ikki mamlakatda teng", "Ma'lumot yetarli emas"
    bank.add(q, list(opts), correct,
             f"AQShda: {narx_usd}×{kurs} = {narx_som:,} so'm vs {mahalliy:,} so'm. "
             f"{'AQShda arzonroq' if narx_som < mahalliy else 'O''zbekistonda arzonroq'}.".replace(",", " "))


def _template_reserve(bank, rng):
    import_kun = rng.choice([500, 800, 1000, 1500, 2000])
    zaxira = rng.choice([50000, 80000, 100000, 150000, 200000, 300000])
    if zaxira % import_kun != 0:
        return
    kun = zaxira // import_kun
    q = f"Mamlakatning valyuta zaxirasi {zaxira:,} USD, kunlik import {import_kun:,} USD. Zaxira necha kunlik importni ta'minlaydi?".replace(",", " ")
    correct = f"{kun} kun"
    opts = [correct, f"{kun + 10} kun", f"{kun - 10 if kun > 10 else kun} kun", f"{kun * 2} kun"]
    bank.add(q, _o4(correct, opts), correct,
             f"Kun = {zaxira}/{import_kun} = {kun} kun.")


_TEMPLATES = [
    _template_profit, _template_loss, _template_discount, _template_interest,
    _template_price_increase, _template_price_decrease, _template_cost_price,
    _template_avg_price, _template_currency, _template_currency_reverse,
    _template_tax, _template_interest_total, _template_margin,
    _template_profit_margin, _template_yaim, _template_budget,
    _template_exchange, _template_interest_monthly, _template_exchange_multi,
    _template_unit_cost, _template_revenue, _template_break_even,
    _template_growth_rate, _template_import_export, _template_tariff,
    _template_ssi, _template_contract, _template_discount_amount,
    _template_dividend, _template_inflation, _template_purchasing_power,
    _template_net_profit, _template_labor_productivity, _template_interest_simple,
    _template_marketing, _template_nominal_real, _template_qqs,
    _template_interest_compare, _template_subsidy, _template_ppp,
    _template_reserve,
]

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def generate_iqtisodiyot(bank: QuestionBank, rng: random.Random, target: int) -> None:
    # Forward term -> definition
    for term, defn, expl in _IQT_FORWARD:
        q = f"'{term}' tushunchasining to'g'ri ta'rifi qaysi?"
        bank.add(q, [defn,
                      "Noto'g'ri ta'rif 1 — bu iqtisodiyot tushunchasi emas.",
                      "Noto'g'ri ta'rif 2 — bu boshqa atamaga mos keladi.",
                      "Noto'g'ri ta'rif 3 — bu umuman noto'g'ri."],
                 defn, expl)

    # Reverse definition -> term
    for q_text, ans, expl in _IQT_REVERSE:
        bank.add(q_text,
                 [ans, "Boshqa atama 1", "Boshqa atama 2", "Boshqa atama 3"],
                 ans, expl)

    # Category questions (pre-built)
    for q_text, ans, expl, opts in _IQT_CATEGORY:
        bank.add(q_text, opts, ans, expl)

    # True / False style (with 4 options: To'g'ri, but need to rephrase)
    for q_text, tf, expl in _IQT_TRUE_FALSE:
        if tf == "To'g'ri":
            correct = "To'g'ri"
            opts = ["To'g'ri", "Noto'g'ri", "Qisman to'g'ri", "Ma'lumot yetarli emas"]
        else:
            correct = "Noto'g'ri"
            opts = ["Noto'g'ri", "To'g'ri", "Qisman to'g'ri", "Ma'lumot yetarli emas"]
        bank.add(q_text, opts, correct, expl)

    # Numeric templates loop
    attempts = 0
    while len(bank.items) < target and attempts < target * 6:
        attempts += 1
        order = _TEMPLATES.copy()
        rng.shuffle(order)
        for t in order:
            if len(bank.items) >= target:
                break
            try:
                t(bank, rng)
            except (AssertionError, ZeroDivisionError, ValueError):
                continue
