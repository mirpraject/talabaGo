"use client";

import { motion } from "framer-motion";
import {
  Search, Zap, ArrowRightLeft, Bot, Shield, Star, Code2, Crown
} from "lucide-react";

const features = [
  {
    icon: Search,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    title: "1 soniyada qidirish",
    desc: "Universitet, fakultet, kurs va semestr bo'yicha kerakli materialni Telegram spam va reklamasiz toping.",
  },
  {
    icon: Zap,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    title: "Onlayn testlar",
    desc: "Haqiqiy imtihon biletlari bo'yicha interaktiv test ishlab, xatolarni tahlil qiling.",
  },
  {
    icon: ArrowRightLeft,
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    title: "Student ID orqali o'tkazma",
    desc: "Kursdoshingizning Student ID raqamini kiritib, yulduzlarni bir soniyada yuborib bering.",
  },
  {
    icon: Bot,
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
    title: "AI Referat yozuvchi",
    desc: "Sun'iy intellekt yordamida daqiqalar ichida ilmiy referat, kurs ishi tayyorlang.",
  },
  {
    icon: Shield,
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
    title: "Xavfsiz platforma",
    desc: "Barcha fayllar moderatsiyadan o'tgan. Spam, reklama va zararli kontent yo'q.",
  },
  {
    icon: Star,
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    title: "Real daromad",
    desc: "Faollik uchun yulduz to'plang. 100 ★ = 10 000 so'm. Kartangizga to'g'ridan-to'g'ri.",
  },
  {
    icon: Code2,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10 border-indigo-500/20",
    title: "Dasturlash kurslari",
    desc: "Python, JavaScript, SQL va boshqa dasturlash tillari bo'yicha interaktiv darslar.",
  },
  {
    icon: Crown,
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
    title: "Premium imkoniyatlar",
    desc: "VIP obuna bilan cheksiz yuklash, prioritet AI yordami va maxsus materiallar.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: "easeOut" as const },
  }),
};

export default function Features() {
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
          <span className="badge badge-purple text-xs mb-4">⚡ Imkoniyatlar</span>
          <h2 className="heading-display heading-lg text-white mt-4 mb-4">
            Platformada nima qila olasiz?
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base">
            TalabaGo — shunchaki fayl ombori emas. Bu talabalarga mo'ljallangan to'liq ekosistema.
          </p>
        </motion.div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((f, idx) => {
          const Icon = f.icon;
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
              <h3 className="text-sm font-bold text-slate-100 mb-2">{f.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}