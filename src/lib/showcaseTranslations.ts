import {
  ClipboardList,
  Wallet,
  Send,
  Code2,
  FileText,
  Bot,
} from "lucide-react";
import type { Lang } from "./translations";

export type ShowcaseTabItem = {
  id: "tests" | "coding" | "rewards" | "transfer" | "ai" | "files";
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  ctaText: string;
  ctaLink: string;
  icon: any;
  colorGradient: string;
  accentBorder: string;
  interactiveType: "test" | "calculator" | "transfer" | "code" | "ai" | "files";
};

export type ShowcaseLangData = {
  headerBadge: string;
  headerTitleStart: string;
  headerTitleHighlight: string;
  headerSubtitleUser: string;
  headerSubtitleGuest: string;
  userBanner: string;
  guestBanner: string;
  btnRegisterToUse: string;
  btnLogin: string;
  btnPremium: string;
  simTopTitleUser: string;
  simTopTitleGuest: string;
  simTopStatusUser: string;
  simTopStatusGuest: string;
  testQuestionTitle: string;
  testQuestionText: string;
  testSuccessFeedback: string;
  testErrorFeedback: string;
  testRegisterPrompt: string;
  codeRunnerComment: string;
  codeRunBtn: string;
  codeRunning: string;
  codeOutputSuccess: string;
  codeRegisterPrompt: string;
  codeFullLabLink: string;
  calcAmountLabel: string;
  calcReceiveLabel: string;
  calcCurrency: string;
  calcRateNotice: string;
  calcRegisterPrompt: string;
  transferIdLabel: string;
  transferReceiver: string;
  transferAmountLabel: string;
  transferNotice: string;
  transferRegisterPrompt: string;
  aiTopicLabel: string;
  aiTopicDefault: string;
  aiBtnGenerate: string;
  aiPlanTitle: string;
  aiPlanItems: string[];
  aiRegisterPrompt: string;
  filesData: { name: string; size: string; downloads: number }[];
  fileDownloadBtn: string;
  statTestsTitle: string;
  statTestsDesc: string;
  statCodingTitle: string;
  statCodingDesc: string;
  statPremiumTitle: string;
  statPremiumDesc: string;
  statOpenBadge: string;
  statRegisterBadge: string;
  tabs: ShowcaseTabItem[];
};

export const showcaseTranslations: Record<Lang, ShowcaseLangData> = {
  uz: {
    headerBadge: "Platforma Nima Beradi?",
    headerTitleStart: "TalabaGo-da ",
    headerTitleHighlight: "Nima Qila Olasiz?",
    headerSubtitleUser:
      "Barcha imkoniyatlar siz uchun ochiq: 1 754+ testlarni topshiring, Python & Django kod yozing va yulduzlar to'plang!",
    headerSubtitleGuest:
      "Bu oddiy sayt emas — bilimni sinash, dasturlashni amalda o'rganish, do'stlarga yulduz ulashish va bilimingiz orqali haqiqiy daromad olish ekotizimi!",
    userBanner: "Siz tizimdasiz: barcha 1 754+ testlar va laboratoriyadan foydalanishga to'liq ruxsat berilgan!",
    guestBanner:
      "Oddiy ko'rinish rejimi: Ro'yxatdan o'tmaganlarga cheklangan. Barcha testlar va imkoniyatlar ro'yxatdan o'tgach to'liq ochiladi.",
    btnRegisterToUse: "Foydalanish uchun Ro'yxatdan O'tish",
    btnLogin: "Kirish",
    btnPremium: "Premium (15 000 so'm)",
    simTopTitleUser: "Jonli Interaktiv Simulyator",
    simTopTitleGuest: "Oddiy Ko'rish Namunasi",
    simTopStatusUser: "Ruxsat berilgan",
    simTopStatusGuest: "Ro'yxatdan o'tish",
    testQuestionTitle: "1-Savol • Matematika (10-sinf Bilet)",
    testQuestionText: "2x + 14 = 50 tenglamasidan x ning qiymatini toping:",
    testSuccessFeedback: "🎉 Barakalla! To'g'ri javob: 18. Sizga +1.2 ⭐ berildi!",
    testErrorFeedback: "✕ Noto'g'ri javob. To'g'ri javob: C (18).",
    testRegisterPrompt: "Haqiqiy 1 754+ testlarni topshirish va yulduz to'plash uchun:",
    codeRunnerComment: `# Python 3.12 - TalabaGo Sandbox
def calculate_reward(correct_answers):
    rate = 1.2  # Premium koeffitsient
    return correct_answers * rate

stars = calculate_reward(15)
print(f"Topshiriq yakuni: {stars} yulduz qo'lga kiritildi!")`,
    codeRunBtn: "Kodni Ishga Tushirish",
    codeRunning: "Bajarilmoqda...",
    codeOutputSuccess: "Salom, TalabaGo Talabasi! 🚀\nHisob: 15 ta test to'g'ri yechildi.\nNatija: 18.0 ⭐ yulduz olindi!",
    codeRegisterPrompt: "Python & Django laboratoriyasida mustaqil kod yozish uchun:",
    codeFullLabLink: "To'liq Dasturlash Laboratoriyasiga o'tish →",
    calcAmountLabel: "Yulduzlar miqdori:",
    calcReceiveLabel: "Kartangizga tushadigan pul:",
    calcCurrency: "so'm",
    calcRateNotice: "Kurs: 100 yulduz = 10 000 so'm (UzCard / Humo)",
    calcRegisterPrompt: "Yulduzlaringizni naqd pulga yechib olish uchun ro'yxatdan o'ting:",
    transferIdLabel: "Do'stingizning Student ID raqami:",
    transferReceiver: "Jasur Rustamov (TATU)",
    transferAmountLabel: "Yuboriladigan yulduz:",
    transferNotice: "O'tkazma lahzada amalga oshadi va komissiya olinmaydi.",
    transferRegisterPrompt: "Kursdoshlarga yulduz yuborish uchun hisob oching:",
    aiTopicLabel: "Referat mavzusi:",
    aiTopicDefault: "Sun'iy intellektning ta'limdagi roli",
    aiBtnGenerate: "Referat Rejasini Tuzish",
    aiPlanTitle: "Generatsiya qilingan reja:",
    aiPlanItems: [
      "1. Kirish: Sun'iy intellektning bugungi holati",
      "2. Asosiy qism: Shaxsiylashtirilgan o'qitish",
      "3. Amaliy natijalar va istiqbollar",
      "4. Xulosa va foydalanilgan adabiyotlar",
    ],
    aiRegisterPrompt: "Cheksiz AI referatlar yaratish uchun ro'yxatdan o'ting:",
    filesData: [
      { name: "Matematik Analiz 1-kurs Ma'ruzalari.pdf", size: "4.2 MB", downloads: 1420 },
      { name: "Django REST Framework Mustaqil Ish.docx", size: "1.8 MB", downloads: 890 },
      { name: "Fizika Qonunlari & Masalalar To'plami.pptx", size: "8.5 MB", downloads: 2150 },
    ],
    fileDownloadBtn: "Yuklab olish",
    statTestsTitle: "1 754+ ta Test",
    statTestsDesc: "33 000+ ta sifatli savol va biletlar",
    statCodingTitle: "Python & Django",
    statCodingDesc: "Real vaqtda kod yozish laboratoriyasi",
    statPremiumTitle: "15 000 so'm / oyiga",
    statPremiumDesc: "Barcha VIP imtiyozlar va transfer",
    statOpenBadge: "Ochiq",
    statRegisterBadge: "Ro'yxatdan o'tish",
    tabs: [
      {
        id: "tests",
        badge: "1 750+ Testlar & Biletlar",
        badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
        title: "Bilimingizni sinang va Yulduz ishlang",
        subtitle: "Maktab, Universitet va DTM imtihon biletlari",
        description:
          "Har bir to'g'ri javob uchun 0.5⭐ (Premium a'zolarga 1.2⭐) yulduzcha beriladi. Barcha fanlar bo'yicha 33 000+ dan ortiq savollar bazasi va batafsil tahlillar.",
        highlights: [
          "Har bir to'g'ri javob uchun 0.5⭐ dan 1.2⭐ gacha",
          "5-11-sinf maktab va 1-4-kurs OTM biletlari",
          "Xatolaringiz ustida ishlash va to'liq yechim tahlili",
        ],
        ctaText: "Testlarni boshlash",
        ctaLink: "/tests",
        icon: ClipboardList,
        colorGradient: "from-indigo-600 via-blue-600 to-indigo-800",
        accentBorder: "border-indigo-500/40",
        interactiveType: "test",
      },
      {
        id: "coding",
        badge: "Dasturlash Laboratoriyasi",
        badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        title: "Sayt ichida Python & Django o'rganing",
        subtitle: "O'rnatishlarsiz to'g'ridan-to'g'ri brauzerda kod yozing",
        description:
          "Python asoslari, Django veb-freymvorki va Algoritmlarni amaliy mashqlar bilan bajaring. Kodni 'Run' tugmasi bilan ishga tushiring va real vaqtda natija oling.",
        highlights: [
          "Python, Django va Algoritmlar bo'yicha maxsus kurslar",
          "Brauzer ichidagi interaktiv terminal va avtomatik test",
          "Topshiriqlarni to'g'ri yechganingiz uchun bonus yulduzlar",
        ],
        ctaText: "Kod yozishni boshlash",
        ctaLink: "/learning",
        icon: Code2,
        colorGradient: "from-emerald-600 via-teal-600 to-emerald-800",
        accentBorder: "border-emerald-500/40",
        interactiveType: "code",
      },
      {
        id: "rewards",
        badge: "Yulduzlarni Pulga Aylantirish",
        badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        title: "Toplagan yulduzlaringizni naqd pulga yeching",
        subtitle: "100 ★ = 10 000 so'm (Karta yoki Telefon raqamiga)",
        description:
          "Platformada test topshirib yoki foydali materiallar ulashib to'plagan yulduzlaringizni bir necha daqiqada plastik kartangizga (UzCard / Humo) yechib oling.",
        highlights: [
          "Tezkor to'lovlar: UzCard, Humo va mobil balans",
          "Hech qanday yashirin komissiyalarsiz to'lov",
          "Shaffof ballar balansi va to'lovlar tarixi",
        ],
        ctaText: "Yulduzlar balansini ko'rish",
        ctaLink: "/rewards",
        icon: Wallet,
        colorGradient: "from-amber-500 via-orange-500 to-amber-700",
        accentBorder: "border-amber-500/40",
        interactiveType: "calculator",
      },
      {
        id: "transfer",
        badge: "Do'stlarga O'tkazish (Transfer)",
        badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
        title: "Yulduzlarni kursdoshlarga yuboring",
        subtitle: "Yagona Student ID raqami orqali lahzalik o'tkazma",
        description:
          "Kursdoshingizga yordam bermoqchimisiz? Uning Student ID raqamini kiriting va yulduzlarni bir zumda o'tkazib bering (Premium imtiyozi).",
        highlights: [
          "Student ID (masalan: T000002) orqali lahzalik o'tkazma",
          "Qabul qiluvchining ism-sharifi avtomatik tekshiriladi",
          "Har bir o'tkazmaga shaxsiy xabar (note) qoldirish imkoni",
        ],
        ctaText: "Do'stlarga yulduz yuborish",
        ctaLink: "/rewards",
        icon: Send,
        colorGradient: "from-cyan-600 via-blue-600 to-indigo-700",
        accentBorder: "border-cyan-500/40",
        interactiveType: "transfer",
      },
      {
        id: "ai",
        badge: "AI Yordamchi & Generator",
        badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
        title: "Sun'iy Intellekt bilan referat va test yarating",
        subtitle: "Bir necha soniyada akademik darajadagi hisobotlar",
        description:
          "Istalgan mavzuda to'liq reja, kirish, asosiy qism va xulosadan iborat referatlar generatsiya qiling yoki yangi test savollari tuzing.",
        highlights: [
          "Referatlar, taqdimotlar va mustaqil ishlar generatori",
          "Savollar bo'yicha 24/7 ishlaydigan aqlli repetitor",
          "Bir klikda Word / PDF formatida yuklab olish",
        ],
        ctaText: "AI bilan referat tuzish",
        ctaLink: "/tools/report",
        icon: Bot,
        colorGradient: "from-purple-600 via-fuchsia-600 to-indigo-800",
        accentBorder: "border-purple-500/40",
        interactiveType: "ai",
      },
      {
        id: "files",
        badge: "Akademik Fayllar Kutubxonasi",
        badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/30",
        title: "Minglab tayyor kurs ishlari va ma'ruzalar",
        subtitle: "O'zbekistonning barcha oliygohlari materiallari",
        description:
          "O'zbek va rus tillaridagi tasdiqlangan referatlar, slaydlar, kitoblar va oraliq nazorat javoblari bir joyda jamlangan.",
        highlights: [
          "Universitetlar va yo'nalishlar bo'yicha qulay katalog",
          "Virus va keraksiz reklamalardan 100% tozalangan fayllar",
          "O'z fayllaringizni yuklab reyting va yulduzlar to'plash",
        ],
        ctaText: "Fayllar bazasini ko'rish",
        ctaLink: "/files",
        icon: FileText,
        colorGradient: "from-rose-600 via-pink-600 to-red-700",
        accentBorder: "border-rose-500/40",
        interactiveType: "files",
      },
    ],
  },

  kaa: {
    headerBadge: "Platforma Ne Beredi?",
    headerTitleStart: "TalabaGo-ta ",
    headerTitleHighlight: "Ne Isley Alasız?",
    headerSubtitleUser:
      "Barlıq múmkinshilikler siz ushın ashıq: 1 754+ testlerdi tapsırıń, Python & Django kod jazıń hám juldız jıynań!",
    headerSubtitleGuest:
      "Bul ápiwayı sayt emes — bilimdi sınaq, programmalawdı ámelde úyreniw, doslarǵa juldız bólisiw hám bilimińiz arqalı haqıyqıy dáramat alıw ekosisteması!",
    userBanner: "Siz sistemadasız: barlıq 1 754+ testler hám laboratoriyadan paydalanıwǵa tolıq ruxsat berilgen!",
    guestBanner:
      "Ápiwayı kóriw tártibi: Dizimnen ótpegenlerge sheklengen. Barlıq testler hám múmkinshilikler dizimnen ótkennen soń tolıq ashıladı.",
    btnRegisterToUse: "Paydalanıw ushın Dizimnen Ótiw",
    btnLogin: "Kiriw",
    btnPremium: "Premium (15 000 som)",
    simTopTitleUser: "Janlı Interaktiv Simulyator",
    simTopTitleGuest: "Ápiwayı Kóriw Úlgisi",
    simTopStatusUser: "Ruxsat berilgen",
    simTopStatusGuest: "Dizimnen ótiw",
    testQuestionTitle: "1-Soraw • Matematika (10-klass Bilet)",
    testQuestionText: "2x + 14 = 50 teńlemesinen x mánisin tabıń:",
    testSuccessFeedback: "🎉 Berekella! Durıs jawap: 18. Sizge +1.2 ⭐ berildi!",
    testErrorFeedback: "✕ Qáte jawap. Durıs jawap: C (18).",
    testRegisterPrompt: "Haqıyqıy 1 754+ testlerdi tapsırıw hám juldız jıynaw ushın:",
    codeRunnerComment: `# Python 3.12 - TalabaGo Sandbox
def calculate_reward(correct_answers):
    rate = 1.2  # Premium koeffitsient
    return correct_answers * rate

stars = calculate_reward(15)
print(f"Topshırıq juwmaǵı: {stars} juldız qolǵa kiritildi!")`,
    codeRunBtn: "Kodtı Iske Túsiriw",
    codeRunning: "Orınlanbaqta...",
    codeOutputSuccess: "Salem, TalabaGo Talabası! 🚀\nEsap: 15 test durıs sheshildi.\nNátiyje: 18.0 ⭐ juldız alındı!",
    codeRegisterPrompt: "Python & Django laboratoriyasında ǵárezsiz kod jazıw ushın:",
    codeFullLabLink: "Tolıq Programmalaw Laboratoriyasına ótiw →",
    calcAmountLabel: "Juldızlar sanı:",
    calcReceiveLabel: "Kartańızǵa túsetuǵın aqsha:",
    calcCurrency: "som",
    calcRateNotice: "Kurs: 100 juldız = 10 000 som (UzCard / Humo)",
    calcRegisterPrompt: "Juldızlarıńızdı naq pulǵa sheship alıw ushın dizimnen ótiń:",
    transferIdLabel: "Dosıńızdıń Student ID nomeri:",
    transferReceiver: "Jasur Rustamov (TATU)",
    transferAmountLabel: "Jiberiletuǵın juldız:",
    transferNotice: "Ótkeriw dárriw ámelge asadı hám komissiya alınbaydı.",
    transferRegisterPrompt: "Kurslaslarǵa juldız jiberiw ushın akkaunt ashıń:",
    aiTopicLabel: "Referat teması:",
    aiTopicDefault: "Jasama intellekttiń bilimlendiriwdegi ornı",
    aiBtnGenerate: "Referat Rejesin Dúziw",
    aiPlanTitle: "Generatsiya etilgen reje:",
    aiPlanItems: [
      "1. Kirisiw: Jasama intellekttiń búgingi jaǵdayı",
      "2. Tiykarǵı bólim: Jekelestirilgen oqıtıw",
      "3. Ámeliy nátiyjeler hám keleshek",
      "4. Juwmaq hám paydalanılǵan ádebiyatlar",
    ],
    aiRegisterPrompt: "Sheksiz AI referatlar jaratıw ushın dizimnen ótiń:",
    filesData: [
      { name: "Matematikalıq Analiz 1-kurs Lektsiyaları.pdf", size: "4.2 MB", downloads: 1420 },
      { name: "Django REST Framework Óz betinshe Jumıs.docx", size: "1.8 MB", downloads: 890 },
      { name: "Fizika Nızamları & Maseleler Toplamı.pptx", size: "8.5 MB", downloads: 2150 },
    ],
    fileDownloadBtn: "Júklep alıw",
    statTestsTitle: "1 754+ Test",
    statTestsDesc: "33 000+ sapalı sorawlar hám biletler",
    statCodingTitle: "Python & Django",
    statCodingDesc: "Real waqıtta kod jazıw laboratoriyası",
    statPremiumTitle: "15 000 som / ayına",
    statPremiumDesc: "Barlıq VIP múmkinshilikler hám transfer",
    statOpenBadge: "Ashıq",
    statRegisterBadge: "Dizimnen ótiw",
    tabs: [
      {
        id: "tests",
        badge: "1 750+ Testler & Biletler",
        badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
        title: "Bilimińizdi sınań hám Juldız isleń",
        subtitle: "Mektep, Universitet hám DTM imtixan biletleri",
        description:
          "Hár bir durıs jawap ushın 0.5⭐ (Premium aǵzalarǵa 1.2⭐) juldız beriledi. Barlıq pánler boyınsha 33 000+ sorawlar bazası hám tolıq analiz.",
        highlights: [
          "Hár bir durıs jawap ushın 0.5⭐ den 1.2⭐ shekem",
          "5-11-klass mektep hám 1-4-kurs OTM biletleri",
          "Qátelerińiz ústinde islew hám tolıq analiz",
        ],
        ctaText: "Testlerdi baslaw",
        ctaLink: "/tests",
        icon: ClipboardList,
        colorGradient: "from-indigo-600 via-blue-600 to-indigo-800",
        accentBorder: "border-indigo-500/40",
        interactiveType: "test",
      },
      {
        id: "coding",
        badge: "Programmalaw Laboratoriyası",
        badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        title: "Sayt ishinde Python & Django úyreniń",
        subtitle: "Ornatıwlarsız tikkeley brauzerde kod jazıń",
        description:
          "Python tiykarları, Django veb-freymvorki hám Algoritmlerdi ámeliy shınıǵıwlar menen orınlań. 'Run' túymesi menen kodtı iske túsiriń.",
        highlights: [
          "Python, Django hám Algoritmler boyınsha arnawlı kurslar",
          "Brauzer ishindegi interaktiv terminal hám avtomat test",
          "Tapsırmalardı durıs sheshkenińiz ushın bonus juldızlar",
        ],
        ctaText: "Kod jazıwdı baslaw",
        ctaLink: "/learning",
        icon: Code2,
        colorGradient: "from-emerald-600 via-teal-600 to-emerald-800",
        accentBorder: "border-emerald-500/40",
        interactiveType: "code",
      },
      {
        id: "rewards",
        badge: "Juldızlardı Pulǵa Aylandırıw",
        badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        title: "Jıynaǵan juldızlarıńızdı naq pulǵa sheshiń",
        subtitle: "100 ★ = 10 000 som (Karta yamasa Telefonǵa)",
        description:
          "Test tapsırıp yamasa paydalı materiallar bólisip jıynaǵan juldızlarıńızdı plastik kartanıńızǵa (UzCard / Humo) sheship alıń.",
        highlights: [
          "Tez tólemler: UzCard, Humo hám mobil balans",
          "Esh qanday jasırın komissiyalarsız tólem",
          "Ashıq ballar balansı hám tólemler tariyxı",
        ],
        ctaText: "Juldızlar balansın kóriw",
        ctaLink: "/rewards",
        icon: Wallet,
        colorGradient: "from-amber-500 via-orange-500 to-amber-700",
        accentBorder: "border-amber-500/40",
        interactiveType: "calculator",
      },
      {
        id: "transfer",
        badge: "Doslarǵa Ótkeriw (Transfer)",
        badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
        title: "Juldızlardı kurslaslarǵa jiberiń",
        subtitle: "Student ID nomeri arqalı tez ótkeriw",
        description:
          "Kurslasıńızǵa járdem bermekshisiz be? Onıń Student ID nomerin kirgiziń hám juldızlardı dárriw ótkeriń (Premium múmkinshiligi).",
        highlights: [
          "Student ID (mısalı: T000002) arqalı tez ótkeriw",
          "Alıwshınıń atı-familiyası avtomat tekseriledi",
          "Hár bir ótkeriwge jeke xabar qaldırıw múmkinshiligi",
        ],
        ctaText: "Doslarǵa juldız jiberiw",
        ctaLink: "/rewards",
        icon: Send,
        colorGradient: "from-cyan-600 via-blue-600 to-indigo-700",
        accentBorder: "border-cyan-500/40",
        interactiveType: "transfer",
      },
      {
        id: "ai",
        badge: "AI Járdemshi & Generator",
        badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
        title: "Jasama Intellekt penen referat hám test jaratıń",
        subtitle: "Bir neshe sekundta akademiyalıq dárejedegi referatlar",
        description:
          "Qálegen temada tolıq reje, kirisiw, tiykarǵı bólim hám juwmaqtan ibarat referatlar generatsiya etiń yamasa jańa test sorawların dúziń.",
        highlights: [
          "Referatlar, prezentatsiyalar hám óz betinshe jumıslar generatorı",
          "Sorawlar boyınsha 24/7 isleytuǵın aqıllı repetitor",
          "Bir klikte Word / PDF formatında júklep alıw",
        ],
        ctaText: "AI menen referat dúziw",
        ctaLink: "/tools/report",
        icon: Bot,
        colorGradient: "from-purple-600 via-fuchsia-600 to-indigo-800",
        accentBorder: "border-purple-500/40",
        interactiveType: "ai",
      },
      {
        id: "files",
        badge: "Akademiyalıq Fayllar Kitapxanası",
        badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/30",
        title: "Mıńlaǵan tayar kurs jumısları hám lektsiyalar",
        subtitle: "Ózbekstannıń barlıq JOO materialları",
        description:
          "Tastıyıqlanǵan referatlar, slaydlar, kitaplar hám aralıq baqlaw jawapları bir jerde jamlanǵan.",
        highlights: [
          "Universitetler hám jónelisler boyınsha qolaylı katalog",
          "Virus hám kerek emes reklamalardan 100% tazalanǵan fayllar",
          "Óz fayllarıńızdı júklep reyting hám juldızlar jıynaw",
        ],
        ctaText: "Fayllar bazasın kóriw",
        ctaLink: "/files",
        icon: FileText,
        colorGradient: "from-rose-600 via-pink-600 to-red-700",
        accentBorder: "border-rose-500/40",
        interactiveType: "files",
      },
    ],
  },


  kr: {
    headerBadge: "Platforma Nima Beradi?",
    headerTitleStart: "TalabaGo-da ",
    headerTitleHighlight: "Nima Qila Olasiz?",
    headerSubtitleUser:
      "Barcha imkoniyatlar siz uchun ochiq: 1 754+ testlarni topshiring, Python & Django kod yozing va yulduzlar to'plang!",
    headerSubtitleGuest:
      "Bu oddiy sayt emas — bilimni sinash, dasturlashni amalda o'rganish, do'stlarga yulduz ulashish va bilimingiz orqali haqiqiy daromad olish ekotizimi!",
    userBanner: "Siz tizimdasiz: barcha 1 754+ testlar va laboratoriyadan foydalanishga to'liq ruxsat berilgan!",
    guestBanner:
      "Oddiy ko'rinish rejimi: Ro'yxatdan o'tmaganlarga cheklangan. Barcha testlar va imkoniyatlar ro'yxatdan o'tgach to'liq ochiladi.",
    btnRegisterToUse: "Foydalanish uchun Ro'yxatdan O'tish",
    btnLogin: "Kirish",
    btnPremium: "Premium (15 000 so'm)",
    simTopTitleUser: "Jonli Interaktiv Simulyator",
    simTopTitleGuest: "Oddiy Ko'rish Namunasi",
    simTopStatusUser: "Ruxsat berilgan",
    simTopStatusGuest: "Ro'yxatdan o'tish",
    testQuestionTitle: "1-Savol • Matematika (10-sinf Bilet)",
    testQuestionText: "2x + 14 = 50 tenglamasidan x ning qiymatini toping:",
    testSuccessFeedback: "🎉 Barakalla! To'g'ri javob: 18. Sizga +1.2 ⭐ berildi!",
    testErrorFeedback: "✕ Noto'g'ri javob. To'g'ri javob: C (18).",
    testRegisterPrompt: "Haqiqiy 1 754+ testlarni topshirish va yulduz to'plash uchun:",
    codeRunnerComment: `# Python 3.12 - TalabaGo Sandbox
def calculate_reward(correct_answers):
    rate = 1.2  # Premium koeffitsient
    return correct_answers * rate

stars = calculate_reward(15)
print(f"Topshiriq yakuni: {stars} yulduz qo'lga kiritildi!")`,
    codeRunBtn: "Kodni Ishga Tushirish",
    codeRunning: "Bajarilmoqda...",
    codeOutputSuccess: "Salom, TalabaGo Talabasi! 🚀\nHisob: 15 ta test to'g'ri yechildi.\nNatija: 18.0 ⭐ yulduz olindi!",
    codeRegisterPrompt: "Python & Django laboratoriyasida mustaqil kod yozish uchun:",
    codeFullLabLink: "To'liq Dasturlash Laboratoriyasiga o'tish →",
    calcAmountLabel: "Yulduzlar miqdori:",
    calcReceiveLabel: "Kartangizga tushadigan pul:",
    calcCurrency: "so'm",
    calcRateNotice: "Kurs: 100 yulduz = 10 000 so'm (UzCard / Humo)",
    calcRegisterPrompt: "Yulduzlaringizni naqd pulga yechib olish uchun ro'yxatdan o'ting:",
    transferIdLabel: "Do'stingizning Student ID raqami:",
    transferReceiver: "Jasur Rustamov (TATU)",
    transferAmountLabel: "Yuboriladigan yulduz:",
    transferNotice: "O'tkazma lahzada amalga oshadi va komissiya olinmaydi.",
    transferRegisterPrompt: "Kursdoshlarga yulduz yuborish uchun hisob oching:",
    aiTopicLabel: "Referat mavzusi:",
    aiTopicDefault: "Sun'iy intellektning ta'limdagi roli",
    aiBtnGenerate: "Referat Rejasini Tuzish",
    aiPlanTitle: "Generatsiya qilingan reja:",
    aiPlanItems: [
      "1. Kirish: Sun'iy intellektning bugungi holati",
      "2. Asosiy qism: Shaxsiylashtirilgan o'qitish",
      "3. Amaliy natijalar va istiqbollar",
      "4. Xulosa va foydalanilgan adabiyotlar",
    ],
    aiRegisterPrompt: "Cheksiz AI referatlar yaratish uchun ro'yxatdan o'ting:",
    filesData: [
      { name: "Matematik Analiz 1-kurs Ma'ruzalari.pdf", size: "4.2 MB", downloads: 1420 },
      { name: "Django REST Framework Mustaqil Ish.docx", size: "1.8 MB", downloads: 890 },
      { name: "Fizika Qonunlari & Masalalar To'plami.pptx", size: "8.5 MB", downloads: 2150 },
    ],
    fileDownloadBtn: "Yuklab olish",
    statTestsTitle: "1 754+ ta Test",
    statTestsDesc: "33 000+ ta sifatli savol va biletlar",
    statCodingTitle: "Python & Django",
    statCodingDesc: "Real vaqtda kod yozish laboratoriyasi",
    statPremiumTitle: "15 000 so'm / oyiga",
    statPremiumDesc: "Barcha VIP imtiyozlar va transfer",
    statOpenBadge: "Ochiq",
    statRegisterBadge: "Ro'yxatdan o'tish",
    tabs: [
      {
        id: "tests",
        badge: "1 750+ Testlar & Biletlar",
        badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
        title: "Bilimingizni sinang va Yulduz ishlang",
        subtitle: "Maktab, Universitet va DTM imtihon biletlari",
        description:
          "Har bir to'g'ri javob uchun 0.5⭐ (Premium a'zolarga 1.2⭐) yulduzcha beriladi. Barcha fanlar bo'yicha 33 000+ dan ortiq savollar bazasi va batafsil tahlillar.",
        highlights: [
          "Har bir to'g'ri javob uchun 0.5⭐ dan 1.2⭐ gacha",
          "5-11-sinf maktab va 1-4-kurs OTM biletlari",
          "Xatolaringiz ustida ishlash va to'liq yechim tahlili",
        ],
        ctaText: "Testlarni boshlash",
        ctaLink: "/tests",
        icon: ClipboardList,
        colorGradient: "from-indigo-600 via-blue-600 to-indigo-800",
        accentBorder: "border-indigo-500/40",
        interactiveType: "test",
      },
      {
        id: "coding",
        badge: "Dasturlash Laboratoriyasi",
        badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        title: "Sayt ichida Python & Django o'rganing",
        subtitle: "O'rnatishlarsiz to'g'ridan-to'g'ri brauzerda kod yozing",
        description:
          "Python asoslari, Django veb-freymvorki va Algoritmlarni amaliy mashqlar bilan bajaring. Kodni 'Run' tugmasi bilan ishga tushiring va real vaqtda natija oling.",
        highlights: [
          "Python, Django va Algoritmlar bo'yicha maxsus kurslar",
          "Brauzer ichidagi interaktiv terminal va avtomatik test",
          "Topshiriqlarni to'g'ri yechganingiz uchun bonus yulduzlar",
        ],
        ctaText: "Kod yozishni boshlash",
        ctaLink: "/learning",
        icon: Code2,
        colorGradient: "from-emerald-600 via-teal-600 to-emerald-800",
        accentBorder: "border-emerald-500/40",
        interactiveType: "code",
      },
      {
        id: "rewards",
        badge: "Yulduzlarni Pulga Aylantirish",
        badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        title: "Toplagan yulduzlaringizni naqd pulga yeching",
        subtitle: "100 ★ = 10 000 so'm (Karta yoki Telefon raqamiga)",
        description:
          "Platformada test topshirib yoki foydali materiallar ulashib to'plagan yulduzlaringizni bir necha daqiqada plastik kartangizga (UzCard / Humo) yechib oling.",
        highlights: [
          "Tezkor to'lovlar: UzCard, Humo va mobil balans",
          "Hech qanday yashirin komissiyalarsiz to'lov",
          "Shaffof ballar balansi va to'lovlar tarixi",
        ],
        ctaText: "Yulduzlar balansini ko'rish",
        ctaLink: "/rewards",
        icon: Wallet,
        colorGradient: "from-amber-500 via-orange-500 to-amber-700",
        accentBorder: "border-amber-500/40",
        interactiveType: "calculator",
      },
      {
        id: "transfer",
        badge: "Do'stlarga O'tkazish (Transfer)",
        badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
        title: "Yulduzlarni kursdoshlarga yuboring",
        subtitle: "Yagona Student ID raqami orqali lahzalik o'tkazma",
        description:
          "Kursdoshingizga yordam bermoqchimisiz? Uning Student ID raqamini kiriting va yulduzlarni bir zumda o'tkazib bering (Premium imtiyozi).",
        highlights: [
          "Student ID (masalan: T000002) orqali lahzalik o'tkazma",
          "Qabul qiluvchining ism-sharifi avtomatik tekshiriladi",
          "Har bir o'tkazmaga shaxsiy xabar (note) qoldirish imkoni",
        ],
        ctaText: "Do'stlarga yulduz yuborish",
        ctaLink: "/rewards",
        icon: Send,
        colorGradient: "from-cyan-600 via-blue-600 to-indigo-700",
        accentBorder: "border-cyan-500/40",
        interactiveType: "transfer",
      },
      {
        id: "ai",
        badge: "AI Yordamchi & Generator",
        badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
        title: "Sun'iy Intellekt bilan referat va test yarating",
        subtitle: "Bir necha soniyada akademik darajadagi hisobotlar",
        description:
          "Istalgan mavzuda to'liq reja, kirish, asosiy qism va xulosadan iborat referatlar generatsiya qiling yoki yangi test savollari tuzing.",
        highlights: [
          "Referatlar, taqdimotlar va mustaqil ishlar generatori",
          "Savollar bo'yicha 24/7 ishlaydigan aqlli repetitor",
          "Bir klikda Word / PDF formatida yuklab olish",
        ],
        ctaText: "AI bilan referat tuzish",
        ctaLink: "/tools/report",
        icon: Bot,
        colorGradient: "from-purple-600 via-fuchsia-600 to-indigo-800",
        accentBorder: "border-purple-500/40",
        interactiveType: "ai",
      },
      {
        id: "files",
        badge: "Akademik Fayllar Kutubxonasi",
        badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/30",
        title: "Minglab tayyor kurs ishlari va ma'ruzalar",
        subtitle: "O'zbekistonning barcha oliygohlari materiallari",
        description:
          "O'zbek va rus tillaridagi tasdiqlangan referatlar, slaydlar, kitoblar va oraliq nazorat javoblari bir joyda jamlangan.",
        highlights: [
          "Universitetlar va yo'nalishlar bo'yicha qulay katalog",
          "Virus va keraksiz reklamalardan 100% tozalangan fayllar",
          "O'z fayllaringizni yuklab reyting va yulduzlar to'plash",
        ],
        ctaText: "Fayllar bazasini ko'rish",
        ctaLink: "/files",
        icon: FileText,
        colorGradient: "from-rose-600 via-pink-600 to-red-700",
        accentBorder: "border-rose-500/40",
        interactiveType: "files",
      },
    ],
  },

  ru: {
    headerBadge: "Что Дает Платформа?",
    headerTitleStart: "На TalabaGo ",
    headerTitleHighlight: "Что Вы Можете Делать?",
    headerSubtitleUser:
      "Все возможности открыты для вас: решайте 1 754+ тестов, пишите код на Python & Django и зарабатывайте звезды!",
    headerSubtitleGuest:
      "Это не просто сайт — это экосистема для проверки знаний, практики программирования, перевода звезд друзьям и реального заработка своим умом!",
    userBanner: "Вы в системе: полный доступ ко всем 1 754+ тестам и лаборатории разрешен!",
    guestBanner:
      "Режим простого просмотра: ограничен для незарегистрированных. Все тесты и функции открываются после регистрации.",
    btnRegisterToUse: "Зарегистрироваться для доступа",
    btnLogin: "Войти",
    btnPremium: "Премиум (15 000 сум)",
    simTopTitleUser: "Интерактивный Симулятор Live",
    simTopTitleGuest: "Демо-версия без регистрации",
    simTopStatusUser: "Доступ открыт",
    simTopStatusGuest: "Регистрация",
    testQuestionTitle: "Вопрос 1 • Математика (Билет 10 класса)",
    testQuestionText: "Найдите значение x из уравнения: 2x + 14 = 50",
    testSuccessFeedback: "🎉 Отлично! Правильный ответ: 18. Вам начислено +1.2 ⭐!",
    testErrorFeedback: "✕ Неверный ответ. Правильный ответ: C (18).",
    testRegisterPrompt: "Чтобы сдавать реальные 1 754+ тестов и копить звезды:",
    codeRunnerComment: `# Python 3.12 - Песочница TalabaGo
def calculate_reward(correct_answers):
    rate = 1.2  # Премиум коэффициент
    return correct_answers * rate

stars = calculate_reward(15)
print(f"Итог задания: заработано {stars} звезд!")`,
    codeRunBtn: "Запустить Код",
    codeRunning: "Выполняется...",
    codeOutputSuccess: "Привет, студент TalabaGo! 🚀\nСчет: 15 тестов решено верно.\nРезультат: получено 18.0 ⭐ звезд!",
    codeRegisterPrompt: "Для написания своего кода в лаборатории Python & Django:",
    codeFullLabLink: "Перейти в полную Лабораторию Кода →",
    calcAmountLabel: "Количество звёзд:",
    calcReceiveLabel: "Сумма к получению на карту:",
    calcCurrency: "сум",
    calcRateNotice: "Курс: 100 звезд = 10 000 сум (UzCard / Humo)",
    calcRegisterPrompt: "Чтобы выводить заработанные звезды на карту, зарегистрируйтесь:",
    transferIdLabel: "Student ID вашего друга:",
    transferReceiver: "Жасур Рустамов (ТАТУ)",
    transferAmountLabel: "Переводимые звезды:",
    transferNotice: "Перевод происходит мгновенно и без комиссии.",
    transferRegisterPrompt: "Чтобы отправлять звезды сокурсникам, создайте аккаунт:",
    aiTopicLabel: "Тема реферата:",
    aiTopicDefault: "Роль искусственного интеллекта в образовании",
    aiBtnGenerate: "Составить План Реферата",
    aiPlanTitle: "Сгенерированный план:",
    aiPlanItems: [
      "1. Введение: Современное состояние искусственного интеллекта",
      "2. Основная часть: Персонализированное обучение",
      "3. Практические результаты и перспективы",
      "4. Заключение и список использованной литературы",
    ],
    aiRegisterPrompt: "Для неограниченной генерации рефератов с ИИ зарегистрируйтесь:",
    filesData: [
      { name: "Лекции по Математическому Анализу 1-курс.pdf", size: "4.2 MB", downloads: 1420 },
      { name: "Самостоятельная работа Django REST.docx", size: "1.8 MB", downloads: 890 },
      { name: "Законы физики и сборник задач.pptx", size: "8.5 MB", downloads: 2150 },
    ],
    fileDownloadBtn: "Скачать",
    statTestsTitle: "1 754+ Тестов",
    statTestsDesc: "33 000+ качественных вопросов и билетов",
    statCodingTitle: "Python & Django",
    statCodingDesc: "Лаборатория написания кода в реальном времени",
    statPremiumTitle: "15 000 сум / месяц",
    statPremiumDesc: "Все VIP привилегии и переводы",
    statOpenBadge: "Открыто",
    statRegisterBadge: "Регистрация",
    tabs: [
      {
        id: "tests",
        badge: "1 750+ Тестов и Билетов",
        badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
        title: "Проверьте знания и зарабатывайте Звезды",
        subtitle: "Билеты для школ, университетов и DTM",
        description:
          "За каждый правильный ответ начисляется 0.5⭐ (Премиум-пользователям 1.2⭐). База из 33 000+ вопросов по всем предметам с подробным разбором.",
        highlights: [
          "От 0.5⭐ до 1.2⭐ за каждый верный ответ",
          "Билеты для 5-11 классов школ и 1-4 курсов вузов",
          "Работа над ошибками и подробный разбор решений",
        ],
        ctaText: "Начать тесты",
        ctaLink: "/tests",
        icon: ClipboardList,
        colorGradient: "from-indigo-600 via-blue-600 to-indigo-800",
        accentBorder: "border-indigo-500/40",
        interactiveType: "test",
      },
      {
        id: "coding",
        badge: "Лаборатория Программирования",
        badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        title: "Изучайте Python & Django прямо на сайте",
        subtitle: "Пишите код в браузере без установки программ",
        description:
          "Основы Python, веб-фреймворк Django и Алгоритмы на практике. Запускайте код кнопкой 'Run' и мгновенно получайте результат в терминале.",
        highlights: [
          "Специальные курсы по Python, Django и Алгоритмам",
          "Интерактивный терминал и автоматическая проверка",
          "Бонусные звезды за правильное решение задач",
        ],
        ctaText: "Начать программировать",
        ctaLink: "/learning",
        icon: Code2,
        colorGradient: "from-emerald-600 via-teal-600 to-emerald-800",
        accentBorder: "border-emerald-500/40",
        interactiveType: "code",
      },
      {
        id: "rewards",
        badge: "Конвертация Звезд в Деньги",
        badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        title: "Выводите накопленные звезды на карту",
        subtitle: "100 ★ = 10 000 сум (На карту или телефон)",
        description:
          "Выводите заработанные за прохождение тестов и публикацию материалов звезды на пластиковые карты (UzCard / Humo) за считанные минуты.",
        highlights: [
          "Быстрые выплаты: UzCard, Humo и баланс телефона",
          "Вывод без скрытых комиссий",
          "Прозрачный баланс баллов и история операций",
        ],
        ctaText: "Посмотреть баланс звезд",
        ctaLink: "/rewards",
        icon: Wallet,
        colorGradient: "from-amber-500 via-orange-500 to-amber-700",
        accentBorder: "border-amber-500/40",
        interactiveType: "calculator",
      },
      {
        id: "transfer",
        badge: "Перевод Друзьям (Transfer)",
        badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
        title: "Отправляйте звезды однокурсникам",
        subtitle: "Мгновенный перевод по номеру Student ID",
        description:
          "Хотите помочь сокурснику? Введите его Student ID и переведите звезды без комиссии за одну секунду (Премиум привилегия).",
        highlights: [
          "Мгновенный перевод по Student ID (например: T000002)",
          "Имя и фамилия получателя проверяются автоматически",
          "Возможность прикрепить личное сообщение к переводу",
        ],
        ctaText: "Отправить звезды друзьям",
        ctaLink: "/rewards",
        icon: Send,
        colorGradient: "from-cyan-600 via-blue-600 to-indigo-700",
        accentBorder: "border-cyan-500/40",
        interactiveType: "transfer",
      },
      {
        id: "ai",
        badge: "AI Помощник и Генератор",
        badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
        title: "Создавайте рефераты и тесты с помощью ИИ",
        subtitle: "Академические работы за считанные секунды",
        description:
          "Генерируйте рефераты с планом, введением и заключением на любую тему или составляйте новые проверочные тесты.",
        highlights: [
          "Генератор рефератов, презентаций и самостоятельных",
          "Умный репетитор, доступный в режиме 24/7",
          "Скачивание в формате Word / PDF в один клик",
        ],
        ctaText: "Создать реферат с AI",
        ctaLink: "/tools/report",
        icon: Bot,
        colorGradient: "from-purple-600 via-fuchsia-600 to-indigo-800",
        accentBorder: "border-purple-500/40",
        interactiveType: "ai",
      },
      {
        id: "files",
        badge: "Академическая Библиотека Файлов",
        badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/30",
        title: "Тысячи готовых курсовых и лекций",
        subtitle: "Материалы ведущих университетов Узбекистана",
        description:
          "Проверенные рефераты, презентации, учебники и ответы на промежуточные/итоговые контроли в одном организованном каталоге.",
        highlights: [
          "Удобный каталог по университетам и направлениям",
          "Файлы, проверенные на 100% от вирусов и рекламы",
          "Возможность загружать свои файлы и копить рейтинг",
        ],
        ctaText: "Смотреть базу файлов",
        ctaLink: "/files",
        icon: FileText,
        colorGradient: "from-rose-600 via-pink-600 to-red-700",
        accentBorder: "border-rose-500/40",
        interactiveType: "files",
      },
    ],
  },

  en: {
    headerBadge: "What Does Platform Offer?",
    headerTitleStart: "On TalabaGo ",
    headerTitleHighlight: "What Can You Do?",
    headerSubtitleUser:
      "All features are unlocked for you: solve 1,754+ tests, write Python & Django code, and earn stars!",
    headerSubtitleGuest:
      "This is not just a website — it's an ecosystem to test your knowledge, practice coding, share stars with friends, and earn real income!",
    userBanner: "You are logged in: full access granted to 1,754+ tests and interactive laboratories!",
    guestBanner:
      "Preview Mode: restricted for guests. All tests and interactive tools unlock completely upon free registration.",
    btnRegisterToUse: "Register to Unlock Full Access",
    btnLogin: "Log In",
    btnPremium: "Premium (15,000 UZS)",
    simTopTitleUser: "Live Interactive Simulator",
    simTopTitleGuest: "Preview Sample Mode",
    simTopStatusUser: "Full Access",
    simTopStatusGuest: "Register",
    testQuestionTitle: "Question 1 • Mathematics (Grade 10 Exam)",
    testQuestionText: "Find the value of x from the equation: 2x + 14 = 50",
    testSuccessFeedback: "🎉 Well done! Correct answer: 18. You received +1.2 ⭐!",
    testErrorFeedback: "✕ Incorrect answer. The correct choice is C (18).",
    testRegisterPrompt: "To take 1,754+ real exam tests and collect real stars:",
    codeRunnerComment: `# Python 3.12 - TalabaGo Sandbox
def calculate_reward(correct_answers):
    rate = 1.2  # Premium coefficient
    return correct_answers * rate

stars = calculate_reward(15)
print(f"Task Completed: {stars} stars earned!")`,
    codeRunBtn: "Run Code Live",
    codeRunning: "Executing...",
    codeOutputSuccess: "Hello, TalabaGo Student! 🚀\nScore: 15 questions answered correctly.\nResult: 18.0 ⭐ stars awarded!",
    codeRegisterPrompt: "To write your own code freely in Python & Django lab:",
    codeFullLabLink: "Go to Full Coding Laboratory →",
    calcAmountLabel: "Stars Amount:",
    calcReceiveLabel: "Payout to Debit Card:",
    calcCurrency: "UZS",
    calcRateNotice: "Rate: 100 stars = 10,000 UZS (UzCard / Humo)",
    calcRegisterPrompt: "To withdraw your stars directly to cash, register now:",
    transferIdLabel: "Classmate's Student ID:",
    transferReceiver: "Jasur Rustamov (TUIT)",
    transferAmountLabel: "Stars to send:",
    transferNotice: "Transfer is instant with zero commission.",
    transferRegisterPrompt: "To transfer stars to your friends, create an account:",
    aiTopicLabel: "Report Topic:",
    aiTopicDefault: "The Role of Artificial Intelligence in Higher Education",
    aiBtnGenerate: "Generate Report Outline",
    aiPlanTitle: "Generated Outline:",
    aiPlanItems: [
      "1. Introduction: Current Landscape of Artificial Intelligence",
      "2. Core Chapter: Personalized Learning Ecosystems",
      "3. Empirical Findings and Future Horizons",
      "4. Conclusion and Academic References",
    ],
    aiRegisterPrompt: "To generate unlimited AI academic papers, register for free:",
    filesData: [
      { name: "Calculus & Mathematical Analysis Lectures.pdf", size: "4.2 MB", downloads: 1420 },
      { name: "Django REST Framework Term Project.docx", size: "1.8 MB", downloads: 890 },
      { name: "Physics Laws & Exercise Handbook.pptx", size: "8.5 MB", downloads: 2150 },
    ],
    fileDownloadBtn: "Download File",
    statTestsTitle: "1,754+ Tests",
    statTestsDesc: "33,000+ verified exam questions & tickets",
    statCodingTitle: "Python & Django",
    statCodingDesc: "Real-time browser coding laboratory",
    statPremiumTitle: "15,000 UZS / month",
    statPremiumDesc: "All VIP features & star transfers",
    statOpenBadge: "Open",
    statRegisterBadge: "Sign Up",
    tabs: [
      {
        id: "tests",
        badge: "1,750+ Tests & Exam Tickets",
        badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
        title: "Test Your Knowledge & Earn Stars",
        subtitle: "School, University and DTM exam tickets",
        description:
          "Earn 0.5⭐ (1.2⭐ for Premium members) for every correct answer. 33,000+ curated questions across all subjects with in-depth analysis.",
        highlights: [
          "Earn from 0.5⭐ up to 1.2⭐ per correct answer",
          "5th-11th grade school & 1st-4th year university tickets",
          "Comprehensive error analysis and step-by-step solutions",
        ],
        ctaText: "Start Testing",
        ctaLink: "/tests",
        icon: ClipboardList,
        colorGradient: "from-indigo-600 via-blue-600 to-indigo-800",
        accentBorder: "border-indigo-500/40",
        interactiveType: "test",
      },
      {
        id: "coding",
        badge: "Interactive Coding Lab",
        badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        title: "Learn Python & Django in Your Browser",
        subtitle: "Write code directly without installing any software",
        description:
          "Master Python fundamentals, Django framework, and Algorithms with interactive exercises. Run code live in the browser terminal.",
        highlights: [
          "Curated tracks in Python, Django and Algorithms",
          "Browser-based interactive terminal with automated testing",
          "Earn bonus stars for solving coding challenges",
        ],
        ctaText: "Start Coding",
        ctaLink: "/learning",
        icon: Code2,
        colorGradient: "from-emerald-600 via-teal-600 to-emerald-800",
        accentBorder: "border-emerald-500/40",
        interactiveType: "code",
      },
      {
        id: "rewards",
        badge: "Convert Stars to Real Cash",
        badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        title: "Withdraw Your Stars to Cash Card",
        subtitle: "100 ★ = 10,000 UZS (UzCard / Humo)",
        description:
          "Earn stars by passing tests and sharing resources, then withdraw directly to your UzCard or Humo debit card in minutes.",
        highlights: [
          "Instant payouts: UzCard, Humo and mobile balance",
          "Zero hidden commissions or deductions",
          "Transparent star balance and withdrawal logs",
        ],
        ctaText: "View Stars Balance",
        ctaLink: "/rewards",
        icon: Wallet,
        colorGradient: "from-amber-500 via-orange-500 to-amber-700",
        accentBorder: "border-amber-500/40",
        interactiveType: "calculator",
      },
      {
        id: "transfer",
        badge: "Transfer Stars to Friends",
        badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
        title: "Send Stars Instantly to Classmates",
        subtitle: "Instant transfer via unique Student ID",
        description:
          "Help your peers by entering their Student ID and sending stars with zero commission in seconds (Premium feature).",
        highlights: [
          "Instant transfer via Student ID (e.g. T000002)",
          "Recipient's full name verified automatically",
          "Attach personalized message notes to each transfer",
        ],
        ctaText: "Send Stars to Friends",
        ctaLink: "/rewards",
        icon: Send,
        colorGradient: "from-cyan-600 via-blue-600 to-indigo-700",
        accentBorder: "border-cyan-500/40",
        interactiveType: "transfer",
      },
      {
        id: "ai",
        badge: "AI Assistant & Generator",
        badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
        title: "Generate Reports and Tests with AI",
        subtitle: "Academic-grade research papers in seconds",
        description:
          "Generate complete term papers, outlines, and slides on any academic topic or create custom question banks.",
        highlights: [
          "Generator for research papers, presentations and homework",
          "24/7 intelligent academic AI tutor",
          "One-click download in Word / PDF format",
        ],
        ctaText: "Generate with AI",
        ctaLink: "/tools/report",
        icon: Bot,
        colorGradient: "from-purple-600 via-fuchsia-600 to-indigo-800",
        accentBorder: "border-purple-500/40",
        interactiveType: "ai",
      },
      {
        id: "files",
        badge: "Academic File Library",
        badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/30",
        title: "Thousands of Lecture Notes & Courseworks",
        subtitle: "Resources from top universities in Uzbekistan",
        description:
          "Verified lecture slides, textbooks, and exam solutions across Uzbek and Russian curricula, all in one place.",
        highlights: [
          "Intuitive catalog sorted by universities and majors",
          "100% virus-free and spam-free verified files",
          "Upload your own study materials to gain rank and stars",
        ],
        ctaText: "Browse Files Catalog",
        ctaLink: "/files",
        icon: FileText,
        colorGradient: "from-rose-600 via-pink-600 to-red-700",
        accentBorder: "border-rose-500/40",
        interactiveType: "files",
      },
    ],
  },
};
