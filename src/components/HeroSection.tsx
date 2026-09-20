"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  ClipboardList,
  Bot,
  Coins,
  ArrowRight,
  Zap,
  Search,
  Star,
  ShieldCheck,
  Sparkles,
  FileText,
  GraduationCap,
  Users,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

const heroDict = {
  uz: {
    badge: "O'zbekiston OTMlari uchun №1 akademik platforma",
    title1: "Telegram guruhlarda",
    titleHighlight: "sarson bo'lmang",
    title2: "— barchasi bu yerda",
    subtitle: "Konspektlar, oraliq/yakuniy nazorat testlari, AI yordamchi va yulduzlar tizimi — hammasi bitta platformada, xavfsiz va bepul.",
    btnFiles: "Materiallarni ko'rish",
    btnTests: "Onlayn Testlar",
    btnRegister: "Bepul ro'yxatdan o'tish",
    btnLogin: "Tizimga kirish",
    viewBtn: "Ko'rish",
    trustFree: "100% Bepul va Xavfsiz",
    trustSpam: "Telegram spam yo'q",
    trustStars: "Student ID va Yulduzlar tizimi",
    trustAi: "Jonli AI Yordamchi",
    bento: [
      { title: "Konspektlar", desc: "50 000+ tasdiqlangan akademik material", stat: "50K+" },
      { title: "Oraliq & Yakuniy", desc: "Haqiqiy imtihon biletlari va test savollari", stat: "100%" },
      { title: "AI Yordamchi", desc: "Referat, kurs ishi va mustaqil ishlarni daqiqada tayyorlang", stat: "AI" },
      { title: "Yulduzlar Tizimi", desc: "100 ★ = 10 000 so'm — kartangizga to'g'ridan-to'g'ri", stat: "★" },
    ],
    stats: ["Faol Talabalar", "Akademik Fayllar", "Universitetlar", "Muvaffaqiyat"],
  },
  kaa: {
    badge: "Ózbekstan JOO-ları ushın №1 akademiyalıq platforma",
    title1: "Telegram gruppalarda",
    titleHighlight: "sarson bolmań",
    title2: "— bárshasi bul jerde",
    subtitle: "Konspektler, aralıq/juwmaqlawshı qadaǵalaw testleri, AI járdemshi hám juldızlar sisteması — bári bir platformada, qáwipsiz hám biypul.",
    btnFiles: "Materiallardı kóriw",
    btnTests: "Onlayn Testler",
    btnRegister: "Biypul dizimnen ótiw",
    btnLogin: "Tizimge kiriw",
    viewBtn: "Kóriw",
    trustFree: "100% Biypul hám Qáwipsiz",
    trustSpam: "Telegram spamı joq",
    trustStars: "Student ID hám Juldızlar sisteması",
    trustAi: "Janlı AI Járdemshi",
    bento: [
      { title: "Konspektler", desc: "50 000+ tastıyıqlanǵan akademiyalıq material", stat: "50K+" },
      { title: "Aralıq & Juwmaqlawshı", desc: "Haqıyqıy imtixan biletleri hám test sorawları", stat: "100%" },
      { title: "AI Járdemshi", desc: "Referat, kurs jumısı hám ǵárezsiz jumıslardı tayarlań", stat: "AI" },
      { title: "Juldızlar Sisteması", desc: "100 ★ = 10 000 som — kartańızǵa tuwrıdan-tuwrı", stat: "★" },
    ],
    stats: ["Aktiv Studentler", "Akademiyalıq Fayllar", "Universitetler", "Tabıs"],
  },
  kr: {
    badge: "Ўзбекистон ОТМлари учун №1 академик платформа",
    title1: "Telegram гуруҳларда",
    titleHighlight: "сарсон бўлманг",
    title2: "— барчаси бу ерда",
    subtitle: "Конспектлар, оралиқ/якуний назорат тестлари, AI ёрдамчи ва юлдузлар тизими — ҳаммаси битта платформада, хавфсиз ва бепул.",
    btnFiles: "Материалларни кўриш",
    btnTests: "Онлайн Тестлар",
    btnRegister: "Бепул рўйхатдан ўтиш",
    btnLogin: "Тизимга кириш",
    viewBtn: "Кўриш",
    trustFree: "100% Бепул ва Хавфсиз",
    trustSpam: "Telegram спам йўқ",
    trustStars: "Student ID ва Юлдузлар тизими",
    trustAi: "Жонли AI Ёрдамчи",
    bento: [
      { title: "Конспектлар", desc: "50 000+ тасдиқланган академик материал", stat: "50K+" },
      { title: "Оралиқ & Якуний", desc: "Ҳақиқий имтиҳон билетлари ва тест саволлари", stat: "100%" },
      { title: "AI Ёрдамчи", desc: "Реферат, курс иши ва мустақил ишларни дақиқада тайёрланг", stat: "AI" },
      { title: "Юлдузлар Тизими", desc: "100 ★ = 10 000 сўм — картангизга тўғридан-тўғри", stat: "★" },
    ],
    stats: ["Фаол Талабалар", "Академик Файллар", "Университетлар", "Муваффақият"],
  },
  ru: {
    badge: "Академическая платформа №1 для студентов вузов Узбекистана",
    title1: "Не тратьте время",
    titleHighlight: "в Telegram группах",
    title2: "— всё в одном месте",
    subtitle: "Конспекты, тесты промежуточного/итогового контроля, AI помощник и система звёзд — всё на единой платформе, безопасно и бесплатно.",
    btnFiles: "Смотреть материалы",
    btnTests: "Онлайн тесты",
    btnRegister: "Бесплатная регистрация",
    btnLogin: "Войти в систему",
    viewBtn: "Открыть",
    trustFree: "100% Бесплатно и Безопасно",
    trustSpam: "Без спама из Telegram",
    trustStars: "Student ID и система звёзд",
    trustAi: "Живой AI Помощник",
    bento: [
      { title: "Конспекты", desc: "50 000+ проверенных академических материалов", stat: "50K+" },
      { title: "Экзамены & Тесты", desc: "Реальные билеты и экзаменационные вопросы", stat: "100%" },
      { title: "AI Помощник", desc: "Рефераты, курсовые и самостоятельные работы за минуты", stat: "AI" },
      { title: "Система Звёзд", desc: "100 ★ = 10 000 сум — прямой вывод на вашу карту", stat: "★" },
    ],
    stats: ["Активных студентов", "Академических файлов", "Университетов", "Успешность"],
  },
  en: {
    badge: "#1 Academic Platform for Uzbek University Students",
    title1: "Stop searching",
    titleHighlight: "Telegram groups",
    title2: "— everything is here",
    subtitle: "Lecture notes, exam questions, AI assistant and star rewards system — all on one unified platform, secure and free.",
    btnFiles: "Browse Materials",
    btnTests: "Online Tests",
    btnRegister: "Sign up for free",
    btnLogin: "Log In",
    viewBtn: "View",
    trustFree: "100% Free & Secure",
    trustSpam: "No Telegram spam",
    trustStars: "Student ID & Star Rewards",
    trustAi: "Live AI Assistant",
    bento: [
      { title: "Lecture Notes", desc: "50,000+ verified academic study materials", stat: "50K+" },
      { title: "Exams & Tests", desc: "Actual exam questions and tests bank", stat: "100%" },
      { title: "AI Assistant", desc: "Generate reports, coursework and assignments in minutes", stat: "AI" },
      { title: "Star Rewards", desc: "100 ★ = 10,000 UZS — withdraw directly to card", stat: "★" },
    ],
    stats: ["Active Students", "Academic Files", "Universities", "Success Rate"],
  },
};

const bentoMeta = [
  {
    icon: BookOpen,
    color: "text-blue-400",
    bg: "from-blue-600/10 to-blue-500/5",
    border: "border-blue-500/20",
    href: "/files?type=notes",
    span: "lg:col-span-1",
  },
  {
    icon: ClipboardList,
    color: "text-emerald-400",
    bg: "from-emerald-600/10 to-emerald-500/5",
    border: "border-emerald-500/20",
    href: "/tests",
    span: "lg:col-span-1",
  },
  {
    icon: Bot,
    color: "text-violet-400",
    bg: "from-violet-600/10 to-violet-500/5",
    border: "border-violet-500/20",
    href: "/tools/report",
    span: "lg:col-span-1",
  },
  {
    icon: Coins,
    color: "text-amber-400",
    bg: "from-amber-600/10 to-amber-500/5",
    border: "border-amber-500/20",
    href: "/rewards",
    span: "lg:col-span-1",
  },
];

const statMeta = [
  { icon: Users, value: "10 000+", color: "text-blue-400" },
  { icon: FileText, value: "50 000+", color: "text-emerald-400" },
  { icon: GraduationCap, value: "100+", color: "text-violet-400" },
  { icon: TrendingUp, value: "99%", color: "text-amber-400" },
];

export default function HeroSection() {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const c = heroDict[lang] || heroDict.uz;

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 pb-16 px-4 sm:px-6 lg:px-8">

      {/* ── Badge ────────────────────────────────────────────── */}
      <motion.div
        custom={0} variants={fadeUp} initial="hidden" animate="show"
        className="mb-8"
      >
        <div className="inline-flex items-center gap-2 glass border border-violet-500/30 rounded-full px-4 py-2 text-xs font-semibold text-violet-300">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          {c.badge}
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </motion.div>

      {/* ── Heading ──────────────────────────────────────────── */}
      <motion.h1
        custom={1} variants={fadeUp} initial="hidden" animate="show"
        className="heading-display heading-xl text-center max-w-4xl mx-auto mb-6"
      >
        {c.title1}{" "}
        <span className="gradient-text text-glow">{c.titleHighlight}</span>
        <br />
        {c.title2}
      </motion.h1>

      {/* ── Subtitle ─────────────────────────────────────────── */}
      <motion.p
        custom={2} variants={fadeUp} initial="hidden" animate="show"
        className="text-slate-400 text-base sm:text-lg max-w-2xl text-center mb-10 leading-relaxed"
      >
        {c.subtitle}
      </motion.p>

      {/* ── CTA Buttons ──────────────────────────────────────── */}
      <motion.div
        custom={3} variants={fadeUp} initial="hidden" animate="show"
        className="flex flex-col sm:flex-row items-center gap-3 mb-16"
      >
        {user ? (
          <>
            <Link href="/files" className="btn btn-primary btn-lg glow-sm-purple">
              <BookOpen className="w-5 h-5" />
              {c.btnFiles}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/tests" className="btn btn-secondary btn-lg">
              <Zap className="w-5 h-5 text-emerald-400" />
              {c.btnTests}
            </Link>
          </>
        ) : (
          <>
            <Link href="/register" className="btn btn-primary btn-lg glow-sm-purple">
              <Star className="w-5 h-5" />
              {c.btnRegister}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/login" className="btn btn-secondary btn-lg">
              {c.btnLogin}
            </Link>
          </>
        )}
      </motion.div>

      {/* ── Bento Grid ───────────────────────────────────────── */}
      <motion.div
        custom={4} variants={fadeUp} initial="hidden" animate="show"
        className="w-full max-w-5xl mx-auto"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {bentoMeta.map((meta, idx) => {
            const Icon = meta.icon;
            const item = c.bento[idx] || c.bento[0];
            return (
              <motion.div
                key={idx}
                custom={5 + idx} variants={fadeUp} initial="hidden" animate="show"
              >
                <Link
                  href={meta.href}
                  className={`bento-card block group h-full ${meta.span} bg-gradient-to-br ${meta.bg} border ${meta.border}`}
                >
                  {/* Icon + Stat */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-white/[0.05] border ${meta.border} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${meta.color}`} />
                    </div>
                    <span className={`text-2xl font-black ${meta.color}`}>{item.stat}</span>
                  </div>
                  {/* Text */}
                  <h3 className="text-sm font-bold text-slate-100 mb-1.5">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  {/* Arrow */}
                  <div className={`mt-4 flex items-center gap-1 text-xs font-semibold ${meta.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                    {c.viewBtn} <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* ── Stats Row ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {statMeta.map((s, idx) => {
            const Icon = s.icon;
            const label = c.stats[idx] || "";
            return (
              <motion.div
                key={idx}
                custom={9 + idx} variants={fadeUp} initial="hidden" animate="show"
                className="bento-card text-center py-5"
              >
                <Icon className={`w-5 h-5 ${s.color} mx-auto mb-2`} />
                <div className={`text-2xl font-black ${s.color} mb-0.5`}>{s.value}</div>
                <div className="text-xs text-slate-500 font-medium">{label}</div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Trust strip ─────────────────────────────────────── */}
      {!user && (
        <motion.div
          custom={14} variants={fadeUp} initial="hidden" animate="show"
          className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium"
        >
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            {c.trustFree}
          </span>
          <span className="flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-400" />
            {c.trustSpam}
          </span>
          <span className="flex items-center gap-2">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            {c.trustStars}
          </span>
          <span className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-violet-400" />
            {c.trustAi}
          </span>
        </motion.div>
      )}
    </section>
  );
}