"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const duration = 1500;

          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref}>
      {value.toLocaleString()}
      {suffix}
    </div>
  );
}

export default function Stats() {
  const { t } = useLanguage();

  const stats = [
    { value: 500, label: t("stat_files"), suffix: "+" },
    { value: 200, label: t("tests"), suffix: "+" },
    { value: 1000, label: t("stat_students"), suffix: "+" },
    { value: 120, label: t("stat_directions"), suffix: "+" },
  ];

  return (
    <section className="py-20 bg-slate-950 relative overflow-hidden text-white border-y border-slate-800/80">
      {/* Glow shapes */}
      <motion.div className="absolute inset-0 pointer-events-none" aria-hidden>
        <motion.div
          className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px]"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="bg-slate-900/60 backdrop-blur border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-lg shadow-black/20"
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-2 bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
                <Counter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-slate-400 font-semibold text-xs sm:text-sm tracking-wide uppercase">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}