"use client";

import { motion } from "framer-motion";
import { FileText, Search, Star, Shield, PencilLine, FolderTree, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslationKey } from "@/lib/translations";

const features = [
  {
    icon: FolderTree,
    title: "feat_1_title" as TranslationKey,
    text: "feat_1_text" as TranslationKey,
    color: "from-blue-500 to-indigo-600",
    shadow: "shadow-blue-500/25",
  },
  {
    icon: Search,
    title: "feat_2_title" as TranslationKey,
    text: "feat_2_text" as TranslationKey,
    color: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/25",
  },
  {
    icon: Star,
    title: "feat_3_title" as TranslationKey,
    text: "feat_3_text" as TranslationKey,
    color: "from-amber-500 to-orange-600",
    shadow: "shadow-amber-500/25",
  },
  {
    icon: PencilLine,
    title: "feat_4_title" as TranslationKey,
    text: "feat_4_text" as TranslationKey,
    color: "from-purple-500 to-fuchsia-600",
    shadow: "shadow-purple-500/25",
  },
  {
    icon: FileText,
    title: "feat_5_title" as TranslationKey,
    text: "feat_5_text" as TranslationKey,
    color: "from-rose-500 to-red-600",
    shadow: "shadow-rose-500/25",
  },
  {
    icon: Shield,
    title: "feat_6_title" as TranslationKey,
    text: "feat_6_text" as TranslationKey,
    color: "from-cyan-500 to-blue-600",
    shadow: "shadow-cyan-500/25",
  },
];

export default function Features() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Asosiy Imkoniyatlar
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {t("features_title")}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t("features_subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.1 }}
              className="bg-white rounded-3xl p-7 shadow-sm border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer"
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} ${feature.shadow} text-white flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2.5 group-hover:text-primary-600 transition-colors">
                {t(feature.title)}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {t(feature.text)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}