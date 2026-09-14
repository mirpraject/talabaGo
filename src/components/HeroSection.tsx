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

const bentoCards = [
  {
    icon: BookOpen,
    color: "text-blue-400",
    bg: "from-blue-600/10 to-blue-500/5",
    border: "border-blue-500/20",
    title: "Konspektlar",
    desc: "50 000+ tasdiqlangan akademik material",
    stat: "50K+",
    href: "/files?type=notes",
    span: "lg:col-span-1",
  },
  {
    icon: ClipboardList,
    color: "text-emerald-400",
    bg: "from-emerald-600/10 to-emerald-500/5",
    border: "border-emerald-500/20",
    title: "Oraliq & Yakuniy",
    desc: "Haqiqiy imtihon biletlari va test savollari",
    stat: "100%",
    href: "/tests",
    span: "lg:col-span-1",
  },
  {
    icon: Bot,
    color: "text-violet-400",
    bg: "from-violet-600/10 to-violet-500/5",
    border: "border-violet-500/20",
    title: "AI Yordamchi",
    desc: "Referat, kurs ishi va mustaqil ishlarni daqiqada tayyorlang",
    stat: "AI",
    href: "/tools/report",
    span: "lg:col-span-1",
  },
  {
    icon: Coins,
    color: "text-amber-400",
    bg: "from-amber-600/10 to-amber-500/5",
    border: "border-amber-500/20",
    title: "Yulduzlar Tizimi",
    desc: "100 ★ = 10 000 so'm — kartangizga to'g'ridan-to'g'ri",
    stat: "★",
    href: "/rewards",
    span: "lg:col-span-1",
  },
];

const stats = [
  { icon: Users, value: "10 000+", label: "Faol Talabalar", color: "text-blue-400" },
  { icon: FileText, value: "50 000+", label: "Akademik Fayllar", color: "text-emerald-400" },
  { icon: GraduationCap, value: "100+", label: "Universitetlar", color: "text-violet-400" },
  { icon: TrendingUp, value: "99%", label: "Muvaffaqiyat", color: "text-amber-400" },
];

export default function HeroSection() {
  const { user } = useAuth();
  const { lang } = useLanguage();

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 pb-16 px-4 sm:px-6 lg:px-8">

      {/* ── Badge ────────────────────────────────────────────── */}
      <motion.div
        custom={0} variants={fadeUp} initial="hidden" animate="show"
        className="mb-8"
      >
        <div className="inline-flex items-center gap-2 glass border border-violet-500/30 rounded-full px-4 py-2 text-xs font-semibold text-violet-300">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          O'zbekiston OTMlari uchun №1 akademik platforma
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </motion.div>

      {/* ── Heading ──────────────────────────────────────────── */}
      <motion.h1
        custom={1} variants={fadeUp} initial="hidden" animate="show"
        className="heading-display heading-xl text-center max-w-4xl mx-auto mb-6"
      >
        Telegram guruhlarda{" "}
        <span className="gradient-text text-glow">sarson bo'lmang</span>
        <br />
        — barchasi bu yerda
      </motion.h1>

      {/* ── Subtitle ─────────────────────────────────────────── */}
      <motion.p
        custom={2} variants={fadeUp} initial="hidden" animate="show"
        className="text-slate-400 text-base sm:text-lg max-w-2xl text-center mb-10 leading-relaxed"
      >
        Konspektlar, oraliq/yakuniy nazorat testlari, AI yordamchi va yulduzlar tizimi —
        hammasi bitta platformada, xavfsiz va bepul.
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
              Materiallarni ko'rish
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/tests" className="btn btn-secondary btn-lg">
              <Zap className="w-5 h-5 text-emerald-400" />
              Onlayn Testlar
            </Link>
          </>
        ) : (
          <>
            <Link href="/register" className="btn btn-primary btn-lg glow-sm-purple">
              <Star className="w-5 h-5" />
              Bepul ro'yxatdan o'tish
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/login" className="btn btn-secondary btn-lg">
              Tizimga kirish
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
          {bentoCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={idx}
                custom={5 + idx} variants={fadeUp} initial="hidden" animate="show"
              >
                <Link
                  href={card.href}
                  className={`bento-card block group h-full ${card.span} bg-gradient-to-br ${card.bg} border ${card.border}`}
                >
                  {/* Icon + Stat */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-white/[0.05] border ${card.border} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${card.color}`} />
                    </div>
                    <span className={`text-2xl font-black ${card.color}`}>{card.stat}</span>
                  </div>
                  {/* Text */}
                  <h3 className="text-sm font-bold text-slate-100 mb-1.5">{card.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{card.desc}</p>
                  {/* Arrow */}
                  <div className={`mt-4 flex items-center gap-1 text-xs font-semibold ${card.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                    Ko'rish <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* ── Stats Row ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={idx}
                custom={9 + idx} variants={fadeUp} initial="hidden" animate="show"
                className="bento-card text-center py-5"
              >
                <Icon className={`w-5 h-5 ${s.color} mx-auto mb-2`} />
                <div className={`text-2xl font-black ${s.color} mb-0.5`}>{s.value}</div>
                <div className="text-xs text-slate-500 font-medium">{s.label}</div>
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
            100% Bepul va Xavfsiz
          </span>
          <span className="flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-400" />
            Telegram spam yo'q
          </span>
          <span className="flex items-center gap-2">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            Student ID va Yulduzlar tizimi
          </span>
          <span className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-violet-400" />
            Jonli AI Yordamchi
          </span>
        </motion.div>
      )}
    </section>
  );
}