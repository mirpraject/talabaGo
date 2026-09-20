"use client";

import { motion } from "framer-motion";
import {
  Search, Zap, ArrowRightLeft, Bot, Shield, Star, Code2, Crown
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const featuresDict = {
  uz: {
    badge: "⚡ Imkoniyatlar",
    title: "Platformada nima qila olasiz?",
    subtitle: "TalabaGo — shunchaki fayl ombori emas. Bu talabalarga mo'ljallangan to'liq ekosistema.",
    items: [
      { title: "1 soniyada qidirish", desc: "Universitet, fakultet, kurs va semestr bo'yicha kerakli materialni Telegram spam va reklamasiz toping." },
      { title: "Onlayn testlar", desc: "Haqiqiy imtihon biletlari bo'yicha interaktiv test ishlab, xatolarni tahlil qiling." },
      { title: "Student ID orqali o'tkazma", desc: "Kursdoshingizning Student ID raqamini kiritib, yulduzlarni bir soniyada yuborib bering." },
      { title: "AI Referat yozuvchi", desc: "Sun'iy intellekt yordamida daqiqalar ichida ilmiy referat, kurs ishi tayyorlang." },
      { title: "Xavfsiz platforma", desc: "Barcha fayllar moderatsiyadan o'tgan. Spam, reklama va zararli kontent yo'q." },
      { title: "Real daromad", desc: "Faollik uchun yulduz to'plang. 100 ★ = 10 000 so'm. Kartangizga to'g'ridan-to'g'ri." },
      { title: "Dasturlash kurslari", desc: "Python, JavaScript, SQL va boshqa dasturlash tillari bo'yicha interaktiv darslar." },
      { title: "Premium imkoniyatlar", desc: "VIP obuna bilan cheksiz yuklash, prioritet AI yordami va maxsus materiallar." },
    ],
  },
  kaa: {
    badge: "⚡ Múmkinshilikler",
    title: "Platformada ne qıla alasız?",
    subtitle: "TalabaGo — tek fayl saqlaw ornı emes. Bul studentler ushın tolıq ekosistema.",
    items: [
      { title: "1 sekundta izlew", desc: "Universitet, fakultet, kurs hám semestr boyınsha kerekli materialdı Telegram spamı hám reklamasız tabıń." },
      { title: "Onlayn testler", desc: "Haqıyqıy imtixan biletleri boyınsha interaktiv test islep, qáteliklerdi analiz etiń." },
      { title: "Student ID arqalı ótkeriw", desc: "Kurslasıńızdıń Student ID nomerin kiritip, juldızlardı bir sekundta jiberiń." },
      { title: "AI Referat jazıwshı", desc: "Jasama intellekt járdeminde minutlar ishinde ilimiy referat, kurs jumısın tayarlań." },
      { title: "Qáwipsiz platforma", desc: "Barlıq fayllar moderaciyadan ótken. Spam, reklama hám ziyanlı kontent joq." },
      { title: "Real tabıs", desc: "Aktivlik ushın juldız toplań. 100 ★ = 10 000 som. Kartańızǵa tuwrıdan-tuwrı." },
      { title: "Programmalaw kursları", desc: "Python, JavaScript, SQL hám basqa programmalaw dilleri boyınsha interaktiv sabaqlar." },
      { title: "Premium múmkinshilikler", desc: "VIP jazılıw menen sheksiz júklew, prioritetti AI járdemi hám arnawlı materiallar." },
    ],
  },
  kr: {
    badge: "⚡ Имкониятлар",
    title: "Платформада нима қила оласиз?",
    subtitle: "TalabaGo — шунчаки файл омбори эмас. Бу талабаларга мўлжалланган тўлиқ экосистема.",
    items: [
      { title: "1 сонияда қидириш", desc: "Университет, факультет, курс ва семестр бўйича керакли материални Telegram спам ва рекламасиз топинг." },
      { title: "Онлайн тестлар", desc: "Ҳақиқий имтиҳон билетлари бўйича интерактив тест ишлаб, хатоларни таҳлил қилинг." },
      { title: "Student ID орқали ўтказма", desc: "Курсдошингизнинг Student ID рақамини киритиб, юлдузларни бир сонияда юбориб беринг." },
      { title: "AI Реферат ёзувчи", desc: "Сунъий интеллект ёрдамида дақиқалар ичида илмий реферат, курс иши тайёрланг." },
      { title: "Хавфсиз платформа", desc: "Барча файллар модерациядан ўтган. Спам, реклама ва зарарли контент йўқ." },
      { title: "Реал даромад", desc: "Фаоллик учун юлдуз тўпланг. 100 ★ = 10 000 сўм. Картангизга тўғридан-тўғри." },
      { title: "Дастурлаш курслари", desc: "Python, JavaScript, SQL ва бошқа дастурлаш тиллари бўйича интерактив дарслар." },
      { title: "Премиум имкониятлар", desc: "VIP обуна билан чексиз юклаш, приоритет AI ёрдами ва махсус материаллар." },
    ],
  },
  ru: {
    badge: "⚡ Возможности",
    title: "Что вы можете делать на платформе?",
    subtitle: "TalabaGo — это не просто хранилище файлов, а полноценная академическая экосистема для студентов.",
    items: [
      { title: "Поиск за 1 секунду", desc: "Быстрый поиск нужных материалов по университету, курсу и предмету без рекламы и спама из Telegram." },
      { title: "Онлайн тесты", desc: "Проходите интерактивные тесты по реальным билетам и анализируйте свои ошибки." },
      { title: "Перевод по Student ID", desc: "Отправляйте заработанные звёзды друзьям по их Student ID моментально." },
      { title: "AI Генератор рефератов", desc: "Создавайте качественные рефераты и курсовые работы за минуты с помощью искусственного интеллекта." },
      { title: "Безопасная платформа", desc: "Все файлы проверены модераторами. Никакого спама, вирусов или рекламы." },
      { title: "Реальный доход", desc: "Зарабатывайте звёзды за активность. 100 ★ = 10 000 сум с прямым выводом на карту." },
      { title: "Курсы программирования", desc: "Интерактивные практические уроки по Python, Django, SQL и алгоритмам." },
      { title: "Премиум возможности", desc: "VIP статус с безлимитными тестами, приоритетным AI и золотым профилем." },
    ],
  },
  en: {
    badge: "⚡ Features",
    title: "What can you do on the platform?",
    subtitle: "TalabaGo is not just a file repository. It's a complete ecosystem built for university students.",
    items: [
      { title: "1-Second Search", desc: "Find essential materials by university, faculty and semester without Telegram spam or ads." },
      { title: "Online Tests", desc: "Practice interactive exam tests and review your knowledge with detailed analytics." },
      { title: "Student ID Transfers", desc: "Send stars to fellow students in an instant using their unique Student ID." },
      { title: "AI Report Writer", desc: "Create scientific reports and coursework in minutes with built-in artificial intelligence." },
      { title: "Secure Platform", desc: "All files are verified. Clean, spam-free and safe academic environment." },
      { title: "Real Earnings", desc: "Earn stars for participation. 100 ★ = 10,000 UZS directly to your bank card." },
      { title: "Coding Academy", desc: "Interactive lessons covering Python, Django, Web dev and Data Structures & Algorithms." },
      { title: "Premium Benefits", desc: "VIP subscription unlocking unlimited tests, priority AI support and Gold profile status." },
    ],
  },
};

const featureIcons = [
  { icon: Search, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  { icon: Zap, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  { icon: ArrowRightLeft, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
  { icon: Bot, color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
  { icon: Shield, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
  { icon: Star, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  { icon: Code2, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
  { icon: Crown, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: "easeOut" as const },
  }),
};

export default function Features() {
  const { lang } = useLanguage();
  const c = featuresDict[lang] || featuresDict.uz;

  return (
    <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Section header */}
      <div className="text-center mb-14">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="badge badge-purple text-xs mb-4">{c.badge}</span>
          <h2 className="heading-display heading-lg text-white mt-4 mb-4">
            {c.title}
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base">
            {c.subtitle}
          </p>
        </motion.div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {featureIcons.map((f, idx) => {
          const Icon = f.icon;
          const item = c.items[idx] || c.items[0];
          return (
            <motion.div
              key={idx}
              custom={idx}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className={`bento-card border ${f.bg} group cursor-default`}
            >
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${f.bg} transition-transform group-hover:scale-110`}>
                <Icon className={`w-5 h-5 ${f.color}`} />
              </div>
              <h3 className="text-sm font-bold text-slate-100 mb-2">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}