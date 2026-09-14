"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, UserPlus, LogIn, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function CTA() {
  const { user } = useAuth();
  const { t } = useLanguage();

  if (user) {
    return (
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl p-10 border border-slate-100 shadow-sm"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">{t("cta_logged_title")}</h2>
            <Link
              href="/files"
              className="btn-primary inline-flex items-center gap-2 py-3 px-8 text-base shadow-lg shadow-primary-500/25 cursor-pointer"
            >
              {t("cta_go_to_files")}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-indigo-900 via-primary-800 to-slate-900 rounded-3xl p-10 sm:p-14 text-center text-white shadow-2xl shadow-indigo-950/40 relative overflow-hidden border border-indigo-700/30"
        >
          {/* Background Glow */}
          <motion.div
            className="absolute -top-20 -right-20 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl pointer-events-none"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-indigo-200 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Talabalar hamjamiyati
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight leading-tight">
              {t("cta_title")}
            </h2>
            <p className="text-indigo-100/90 mb-8 text-base sm:text-lg leading-relaxed">
              {t("cta_text")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto bg-white text-primary-700 hover:bg-slate-50 px-8 py-4 rounded-2xl font-bold shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-5 h-5" />
                {t("cta_register")}
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur px-8 py-4 rounded-2xl font-semibold text-white transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                {t("cta_login")}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}