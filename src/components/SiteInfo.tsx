"use client";

import { motion } from "framer-motion";
import { GraduationCap, FileText, Search, BookOpen } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

const steps = [
  { icon: GraduationCap, title: "step1_title", text: "step1_text" },
  { icon: Search, title: "step2_title", text: "step2_text" },
  { icon: FileText, title: "step3_title", text: "step3_text" },
] as const;

export default function SiteInfo() {
  const { user } = useAuth();
  const { t } = useLanguage();

  if (user) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <BookOpen className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t("siteinfo_title")}</h2>
          <p className="text-lg text-gray-600 leading-relaxed">{t("siteinfo_text")}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="card text-center hover:-translate-y-1 transition-transform"
            >
              <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <step.icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t(step.title)}</h3>
              <p className="text-gray-500">{t(step.text)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}