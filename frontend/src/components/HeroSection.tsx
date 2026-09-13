"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  BookOpen,
  ClipboardList,
  Coins,
  Bot,
  Layers,
  ArrowRightLeft,
  CheckCircle2,
  Zap,
  Gift,
  Star,
  LogIn,
  UserPlus,
  GraduationCap,
  FileText,
  HelpCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function HeroSection() {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const router = useRouter();
  // Multilingual hook data
  const hookContent = {
    uz: {
      badge: "🎓 O'zbekiston OTMlari uchun yagona akademik platforma",
      title_start: "Telegram guruhlarda izlab sarson bo'lmang — ",
      title_highlight: "TalabaGo platformasi!",
      subtitle:
        "TalabaGo — O'zbekiston OTMlaridagi talabalar uchun yagona akademik platforma. Konspektlar, oraliq/yakuniy nazorat testlari va ma'ruza materiallarini Telegram guruhlardan qidirmasdan, tartibli va xavfsiz ko'rinishda topasiz.",
      search_placeholder: "Konspekt, oraliq nazorat (ON), yakuniy nazorat (YaN), ma'ruza yoki test qidirish...",
      search_btn: "Qidirish",
      quick_filters: [
        { label: "📑 Konspektlar", href: "/files?type=notes" },
        { label: "📝 Oraliq nazorat (ON)", href: "/files?type=midterm" },
        { label: "🎯 Yakuniy nazorat (YaN)", href: "/files?type=final" },
        { label: "🎙️ Ma'ruzalar", href: "/files?type=lectures" },
        { label: "⚡ Onlayn testlar", href: "/tests" },
        { label: "🤖 AI Referat", href: "/tools/report" },
      ],
      what_you_get_title: "Platformada siz nima olasiz?",
      what_you_get_badge: "🎁 Siz nima olasiz?",
      get_items: [
        {
          icon: BookOpen,
          color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
          title: "Tartibli konspekt va ma'ruza slaydlari",
          desc: "OTM fanlari bo'yicha toza, saralangan va tekshirilgan o'quv qo'llanmalari va laboratoriya hisobotlari.",
        },
        {
          icon: ClipboardList,
          color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          title: "Oraliq va yakuniy nazorat test biletlari",
          desc: "Haqiqiy imtihon savollari, ON/YaN biletlari va to'g'ri javoblari to'plami bilan imtihonga 100% tayyor bo'ling.",
        },
        {
          icon: Layers,
          color: "text-red-400 bg-red-500/10 border-red-500/20",
          title: "Shaxsiy Student ID va Avatar",
          desc: "Har bir talabaga unikal identifikator (masalan, T000001) va robotik individual profil avatari beriladi.",
        },
        {
          icon: Coins,
          color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
          title: "Yulduzlar (Stars) va Real Daromad",
          desc: "Har bir faollik uchun yulduz to'plang (100 ★ = 10 000 so'm) va mablag'ni kartangizga to'g'ridan-to'g'ri yechib oling.",
        },
      ],
      what_you_can_do_title: "Platformada nima qila olasiz?",
      what_you_can_do_badge: "⚡ Nima qila olasiz?",
      can_do_items: [
        {
          icon: Search,
          color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
          title: "1 soniyada qidirish va bepul yuklab olish",
          desc: "Universitet, fakultet, kurs va semestr bo'yicha kerakli materialni Telegramdagi spam va reklamasiz toping.",
        },
        {
          icon: Zap,
          color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          title: "Onlayn nazorat testlarini topshirish",
          desc: "Haqiqiy imtihon biletlari bo'yicha interaktiv test ishlab, xatolarni tahlil qiling va reytingda yetakchi bo'ling.",
        },
        {
          icon: ArrowRightLeft,
          color: "text-red-400 bg-red-500/10 border-red-500/20",
          title: "Student ID orqali yulduz o'tkazish",
          desc: "Kursdoshingizning Student ID raqamini kiritib, to'plagan yulduzlaringizni bir soniyada unga sovg'a qiling.",
        },
        {
          icon: Bot,
          color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
          title: "AI bilan referat va mustaqil ish tayyorlash",
          desc: "Sun'iy intellekt yordamida daqiqalar ichida ilmiy referat, kurs ishi va prezentatsiyalarni shakllantiring.",
        },
      ],
      btn_register: "Bepul ro'yxatdan o'tish",
      btn_login: "Tizimga kirish",
      btn_files: "Materiallarni ko'rish",
      trust_free: "100% Bepul va Xavfsiz",
      trust_files: "50 000+ Akademik Fayllar",
      trust_id: "Student ID & Yulduzlar Tizimi",
      trust_ai: "Jonli AI Yordamchi",
    },
    kaa: {
      badge: "🎓 Ózbekstan JOO-ları ushın birden-bir akademiyalıq platforma",
      title_start: "Telegram gruppalarda izlep waqıt joytpań — ",
      title_highlight: "TalabaGo platforması!",
      subtitle:
        "TalabaGo — Ózbekstan JOO-larındaǵı studentler ushın birden-bir akademiyalıq platforma. Konspektler, aralıq/juwmaqlawshı qadaǵalaw testleri hám lektsiya materialların Telegram gruppalardan izlemey, tártipli hám qáwipsiz túrde tabasız.",
      search_placeholder: "Konspekt, aralıq baqlaw, juwmaqlawshı test yamasa lektsiya izlew...",
      search_btn: "Izlew",
      quick_filters: [
        { label: "📑 Konspektler", href: "/files?type=notes" },
        { label: "📝 Aralıq baqlaw (AB)", href: "/files?type=midterm" },
        { label: "🎯 Juwmaqlawshı (JB)", href: "/files?type=final" },
        { label: "🎙️ Lektsiyalar", href: "/files?type=lectures" },
        { label: "⚡ Onlayn testler", href: "/tests" },
        { label: "🤖 AI Referat", href: "/tools/report" },
      ],
      what_you_get_title: "Platformada siz ne alasız?",
      what_you_get_badge: "🎁 Ne alasız?",
      get_items: [
        {
          icon: BookOpen,
          color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
          title: "Tayar konspekt hám lektsiyalar",
          desc: "JOO pánleri boyınsha tártipli, tekserilgen oqıw qollanbaları hám laboratoriyalar.",
        },
        {
          icon: ClipboardList,
          color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          title: "Aralıq hám juwmaqlawshı test biletleri",
          desc: "Haqıyqıy imtixan sorawları menen imtixanlarǵa 100% tayın bolıń.",
        },
        {
          icon: Layers,
          color: "text-red-400 bg-red-500/10 border-red-500/20",
          title: "Jeke Student ID hám Avatar",
          desc: "Hár bir studentke unikal identifikator (T000001) hám robotik avatar beriledi.",
        },
        {
          icon: Coins,
          color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
          title: "Juldızlar (Stars) hám Real Dáramat",
          desc: "Hár bir belsendilik ushın juldız jıynań (100 ★ = 10 000 som) hám kartanıńızǵa aqsha qılıp sheshiń.",
        },
      ],
      what_you_can_do_title: "Platformada ne isley alasız?",
      what_you_can_do_badge: "⚡ Múmkinshiliklerińiz",
      can_do_items: [
        {
          icon: Search,
          color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
          title: "1 sekundta izlew hám júklep alıw",
          desc: "Universitet, fakultet, kurs hám semestr boyınsha kerekli materialdı dárriw tabıń.",
        },
        {
          icon: Zap,
          color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          title: "Onlayn test tapsırıp bilimdi sınaq",
          desc: "Biletler boyınsha interaktiv test islep, nátiyjeni analiz etiń hám reytingte aldınǵı bolıń.",
        },
        {
          icon: ArrowRightLeft,
          color: "text-red-400 bg-red-500/10 border-red-500/20",
          title: "Student ID arqalı juldız ótkeriw",
          desc: "Doslarıńızdıń Student ID nomerine juldızlardı tez hám ańsat ótkeriń.",
        },
        {
          icon: Bot,
          color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
          title: "AI menen referat hám óz betinshe jumıs",
          desc: "Jasalma intellekt járdeminde minutlar ishinde ilimiy hisabatlar jaratıń.",
        },
      ],
      btn_register: "Biypul dizimnen ótiw",
      btn_login: "Kiriw",
      btn_files: "Materiallardı kóriw",
      trust_free: "100% Biypul hám Qáwipsiz",
      trust_files: "50 000+ Akademiyalıq Fayllar",
      trust_id: "Student ID & Juldızlar Sisteması",
      trust_ai: "Janlı AI Járdemshi",
    },
    en: {
      badge: "🎓 Unified Academic Platform for Uzbekistan's Universities",
      title_start: "Stop hunting Telegram channels — ",
      title_highlight: "Welcome to TalabaGo!",
      subtitle:
        "TalabaGo — The single academic platform for students across Uzbekistan. Find verified lecture notes, midterm/final exam tests, and course materials neatly organized and secure without digging through Telegram groups.",
      search_placeholder: "Search notes, midterm exam tickets, final tests or lectures...",
      search_btn: "Search",
      quick_filters: [
        { label: "📑 Lecture Notes", href: "/files?type=notes" },
        { label: "📝 Midterms (ON)", href: "/files?type=midterm" },
        { label: "🎯 Finals (YaN)", href: "/files?type=final" },
        { label: "🎙️ Lectures", href: "/files?type=lectures" },
        { label: "⚡ Online Tests", href: "/tests" },
        { label: "🤖 AI Essay Maker", href: "/tools/report" },
      ],
      what_you_get_title: "What do you get on the platform?",
      what_you_get_badge: "🎁 What You Get",
      get_items: [
        {
          icon: BookOpen,
          color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
          title: "Organized Lecture Notes & Slides",
          desc: "Curated, high-quality academic materials, lab reports, and textbooks for university disciplines.",
        },
        {
          icon: ClipboardList,
          color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          title: "Midterm & Final Exam Tickets",
          desc: "Practice with real exam questions and official ticket simulations with verified answers.",
        },
        {
          icon: Layers,
          color: "text-red-400 bg-red-500/10 border-red-500/20",
          title: "Personal Student ID & Robot Avatar",
          desc: "Unique student identifier (e.g. T000001) and custom robotic student avatar for every member.",
        },
        {
          icon: Coins,
          color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
          title: "Star Rewards & Real Cashout",
          desc: "Earn stars for participation and cash them out directly to your card (100 ★ = 10,000 UZS).",
        },
      ],
      what_you_can_do_title: "What can you do on the platform?",
      what_you_can_do_badge: "⚡ Your Capabilities",
      can_do_items: [
        {
          icon: Search,
          color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
          title: "Instant Search & Safe Download",
          desc: "Filter by university, faculty, course, and semester in 1 second without spam or broken links.",
        },
        {
          icon: Zap,
          color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          title: "Take Online Practice Tests",
          desc: "Solve interactive test tickets, analyze mistakes, and climb the republic-wide leaderboard.",
        },
        {
          icon: ArrowRightLeft,
          color: "text-red-400 bg-red-500/10 border-red-500/20",
          title: "Transfer Stars by Student ID",
          desc: "Send stars directly to classmates and study partners in seconds by entering their Student ID.",
        },
        {
          icon: Bot,
          color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
          title: "AI Report & Research Assistant",
          desc: "Generate academic essays and research papers formatted to university standards in 2 minutes.",
        },
      ],
      btn_register: "Sign Up for Free",
      btn_login: "Log In",
      btn_files: "Browse Materials",
      trust_free: "100% Free & Secure",
      trust_files: "50,000+ Academic Files",
      trust_id: "Student ID & Star Transfers",
      trust_ai: "Real-time AI Assistant",
    },
    ru: {
      badge: "🎓 Единая академическая платформа для вузов Узбекистана",
      title_start: "Хватит искать по Telegram-каналам — ",
      title_highlight: "Платформа TalabaGo!",
      subtitle:
        "TalabaGo — Единая академическая платформа для студентов вузов Узбекистана. Конспекты, промежуточные и итоговые экзаменационные тесты, лекции без поиска по Telegram-группам — в структурированном и безопасном виде.",
      search_placeholder: "Поиск конспектов, билетов промежуточного (ON) и итогового контроля (YaN)...",
      search_btn: "Найти",
      quick_filters: [
        { label: "📑 Конспекты", href: "/files?type=notes" },
        { label: "📝 Промежуточные (ON)", href: "/files?type=midterm" },
        { label: "🎯 Итоговые тесты (YaN)", href: "/files?type=final" },
        { label: "🎙️ Лекции", href: "/files?type=lectures" },
        { label: "⚡ Онлайн тесты", href: "/tests" },
        { label: "🤖 AI Рефераты", href: "/tools/report" },
      ],
      what_you_get_title: "Что вы получаете на платформе?",
      what_you_get_badge: "🎁 Что получаете?",
      get_items: [
        {
          icon: BookOpen,
          color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
          title: "Структурированные конспекты и лекции",
          desc: "Отобранные и проверенные учебные пособия для вузов, лабораторные работы и слайды.",
        },
        {
          icon: ClipboardList,
          color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          title: "Промежуточные и итоговые тесты",
          desc: "Подготовьтесь к экзаменам на 100% по реальным вопросам, билетам и проверенным ответам.",
        },
        {
          icon: Layers,
          color: "text-red-400 bg-red-500/10 border-red-500/20",
          title: "Личный Student ID и Аватар",
          desc: "Каждому студенту присваивается уникальный ID (например, T000001) и роботический аватар.",
        },
        {
          icon: Coins,
          color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
          title: "Звезды (Stars) и реальный доход",
          desc: "Копите звезды за активность (100 ★ = 10 000 сум) и выводите деньги прямо на свою карту.",
        },
      ],
      what_you_can_do_title: "Что вы можете делать на платформе?",
      what_you_can_do_badge: "⚡ Ваши возможности",
      can_do_items: [
        {
          icon: Search,
          color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
          title: "Поиск и скачивание за 1 секунду",
          desc: "Мгновенно находите файлы по вузу, факультету, курсу и семестру без спама и рекламы в Telegram.",
        },
        {
          icon: Zap,
          color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          title: "Онлайн тестирование знаний",
          desc: "Решайте интерактивные экзаменационные билеты, анализируйте ошибки и лидируйте в рейтинге.",
        },
        {
          icon: ArrowRightLeft,
          color: "text-red-400 bg-red-500/10 border-red-500/20",
          title: "Перевод звезд по Student ID",
          desc: "Переводите накопленные звезды сокурсникам в секунды, просто указав их Student ID.",
        },
        {
          icon: Bot,
          color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
          title: "AI помощник для рефератов",
          desc: "Генерируйте рефераты и самостоятельные работы по стандартам вуза за 2 минуты.",
        },
      ],
      btn_register: "Бесплатная регистрация",
      btn_login: "Войти",
      btn_files: "Смотреть материалы",
      trust_free: "100% Бесплатно и безопасно",
      trust_files: "50 000+ Академических файлов",
      trust_id: "Student ID и переводы звезд",
      trust_ai: "Живой AI ассистент",
    },
  };

  const c = hookContent[lang] || hookContent.uz;

  return (
    <section className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden py-14 sm:py-20 border-b border-slate-800">
      {/* Dynamic Background Glows & Accent Colors: Blue, Green, Red, White */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        {/* Electric Blue Orb */}
        <motion.div
          className="absolute -top-10 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[130px]"
          animate={{ y: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Emerald Green Orb */}
        <motion.div
          className="absolute top-1/3 right-10 w-80 h-80 bg-emerald-500/15 rounded-full blur-[120px]"
          animate={{ y: [0, -40, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Crimson Red Orb */}
        <motion.div
          className="absolute bottom-10 left-10 w-80 h-80 bg-red-500/10 rounded-full blur-[120px]"
          animate={{ y: [0, 35, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Subtle grid mesh */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Hook Intro */}
        <div className="text-center max-w-4xl mx-auto mb-10 sm:mb-14">
          {/* 3D Brand Badge / Mascot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center mb-6"
          >
            <div className="relative group cursor-pointer inline-flex">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 opacity-60 blur-md group-hover:opacity-100 transition duration-500 group-hover:scale-105" />
              <div className="relative px-4 py-2 bg-slate-900/90 ring-1 ring-white/20 rounded-2xl flex items-center gap-3 backdrop-blur-xl shadow-2xl">
                <img
                  src="/brand/talabago_icon.jpg"
                  alt="TalabaGo 3D"
                  className="w-10 h-10 rounded-xl object-cover shadow-md shadow-blue-500/30 ring-1 ring-white/20"
                />
                <div className="text-left">
                  <div className="flex items-center gap-1 text-sm sm:text-base font-black tracking-tight">
                    <span className="text-white">Talaba</span>
                    <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">Go</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold ml-1">2.0</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                    O&apos;qish • Rivojlanish • Erishish
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/15 via-emerald-500/15 to-red-500/15 border border-white/20 backdrop-blur-md rounded-full px-4 py-1.5 text-xs sm:text-sm font-bold text-slate-200 mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              {c.badge}
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-5 leading-[1.18]"
          >
            {c.title_start}
            <span className="bg-gradient-to-r from-blue-400 via-emerald-300 to-sky-300 bg-clip-text text-transparent">
              {c.title_highlight}
            </span>
          </motion.h1>

          {/* Subtitle - Exact user statement */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto mb-8 font-normal"
          >
            {c.subtitle}
          </motion.p>

          {/* Action Buttons directly below Subtitle (User Request) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mb-5"
          >
            {user ? (
              <div className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
                <Link
                  href="/files"
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white px-8 py-3.5 sm:py-4 rounded-2xl font-black shadow-xl shadow-blue-600/30 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 text-base sm:text-lg cursor-pointer"
                >
                  <BookOpen className="w-5 h-5" />
                  {c.btn_files}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/tests"
                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-7 py-3.5 sm:py-4 rounded-2xl font-bold shadow-xl shadow-emerald-600/25 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-base sm:text-lg cursor-pointer"
                >
                  <Zap className="w-5 h-5" />
                  Onlayn Testlar
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto">
                <Link
                  href="/register"
                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 via-teal-600 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white px-8 py-3.5 sm:py-4 rounded-2xl font-black shadow-xl shadow-emerald-600/30 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 text-base sm:text-lg cursor-pointer border border-emerald-400/40"
                >
                  <UserPlus className="w-5 h-5" />
                  {c.btn_register}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-md px-7 py-3.5 sm:py-4 rounded-2xl font-bold text-white transition-all flex items-center justify-center gap-2.5 text-base sm:text-lg hover:border-white/40"
                >
                  <LogIn className="w-4 h-4" />
                  {c.btn_login}
                </Link>
              </div>
            )}
          </motion.div>

          {!user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-8"
            >
              <span className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-300 bg-slate-900/80 border border-slate-700/80 px-4 py-1.5 rounded-full backdrop-blur-md shadow-inner">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                {lang === "uz" && "Barcha konspekt, ON/YaN testlari va yuklab olishlar ro'yxatdan o'tgan talabalar uchun ochiq"}
                {lang === "kaa" && "Barlıq konspekt, AB/JB testler hám júklep alıwlar dizimnen ótken studentler ushın ashıq"}
                {lang === "ru" && "Доступ к конспектам, тестам ON/YaN и скачиванию открыт для зарегистрированных студентов"}
                {lang === "en" && "Full access to lecture notes, ON/YaN tests and downloads for registered students"}
              </span>
            </motion.div>
          )}

        </div>

        {/* ============================================================== */}
        {/* CENTER HOOK SECTION: NIMA OLADI & NIMA QILA OLADI */}
        {/* ============================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16"
        >
          {/* Card 1: NIMA OLADI? */}
          <div className="relative rounded-3xl bg-slate-900/85 backdrop-blur-xl border border-blue-500/30 p-6 sm:p-8 shadow-2xl shadow-blue-950/40 hover:border-blue-500/50 transition-all group overflow-hidden">
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl group-hover:scale-125 transition-transform" />

            <div className="flex items-center justify-between gap-3 mb-6 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-400 flex items-center justify-center font-bold">
                  <Gift className="w-5 h-5" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {c.what_you_get_title}
                </h3>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 shrink-0">
                {c.what_you_get_badge}
              </span>
            </div>

            <div className="space-y-4 relative z-10">
              {c.get_items.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-blue-500/30 hover:bg-white/[0.06] transition-all flex items-start gap-3.5"
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${item.color}`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 2: NIMA QILA OLADI? */}
          <div className="relative rounded-3xl bg-slate-900/85 backdrop-blur-xl border border-emerald-500/30 p-6 sm:p-8 shadow-2xl shadow-emerald-950/40 hover:border-emerald-500/50 transition-all group overflow-hidden">
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl group-hover:scale-125 transition-transform" />

            <div className="flex items-center justify-between gap-3 mb-6 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {c.what_you_can_do_title}
                </h3>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 shrink-0">
                {c.what_you_can_do_badge}
              </span>
            </div>

            <div className="space-y-4 relative z-10">
              {c.can_do_items.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 hover:bg-white/[0.06] transition-all flex items-start gap-3.5"
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${item.color}`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ============================================================== */}
        {/* Trust Badges */}
        {/* ============================================================== */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 sm:mt-16 pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-semibold text-slate-400"
        >
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            {c.trust_free}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
            {c.trust_files}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            {c.trust_id}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
            {c.trust_ai}
          </span>
        </motion.div>

      </div>
    </section>
  );
}