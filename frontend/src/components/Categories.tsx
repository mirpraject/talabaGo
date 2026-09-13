"use client";

import { ClipboardList, FileText, BookOpen, PenTool, Calculator, Microscope, Library, Dumbbell, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslationKey } from "@/lib/translations";

const categories = [
  {
    name: "cat_books" as TranslationKey,
    description: "cat_books_desc" as TranslationKey,
    icon: Library,
    href: "/files?type=book",
    color: "from-indigo-500 to-blue-600",
    bgLight: "bg-indigo-50/70",
  },
  {
    name: "cat_notes" as TranslationKey,
    description: "cat_notes_desc" as TranslationKey,
    icon: FileText,
    href: "/files?type=notes",
    color: "from-blue-500 to-cyan-600",
    bgLight: "bg-blue-50/70",
  },
  {
    name: "cat_tests" as TranslationKey,
    description: "cat_tests_desc" as TranslationKey,
    icon: PenTool,
    href: "/files?type=tests",
    color: "from-emerald-500 to-teal-600",
    bgLight: "bg-emerald-50/70",
  },
  {
    name: "cat_lectures" as TranslationKey,
    description: "cat_lectures_desc" as TranslationKey,
    icon: BookOpen,
    href: "/files?type=lectures",
    color: "from-purple-500 to-indigo-600",
    bgLight: "bg-purple-50/70",
  },
  {
    name: "cat_subjects" as TranslationKey,
    description: "cat_subjects_desc" as TranslationKey,
    icon: Calculator,
    href: "/files",
    color: "from-orange-500 to-amber-600",
    bgLight: "bg-orange-50/70",
  },
  {
    name: "cat_lab" as TranslationKey,
    description: "cat_lab_desc" as TranslationKey,
    icon: Microscope,
    href: "/files?type=lab",
    color: "from-rose-500 to-red-600",
    bgLight: "bg-rose-50/70",
  },
  {
    name: "cat_exercises" as TranslationKey,
    description: "cat_exercises_desc" as TranslationKey,
    icon: Dumbbell,
    href: "/files?type=exercise",
    color: "from-teal-500 to-cyan-600",
    bgLight: "bg-teal-50/70",
  },
  {
    name: "tests" as TranslationKey,
    description: "cat_tests_desc" as TranslationKey,
    icon: ClipboardList,
    href: "/tests",
    color: "from-violet-500 to-purple-600",
    bgLight: "bg-violet-50/70",
  },
];

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Categories() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Material Turlari
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
            {t("categories_title")}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            {t("categories_subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  router.push(
                    `/register?reason=auth_required&redirect=${encodeURIComponent(category.href)}`
                  );
                }
              }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${category.color} text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-200`}
                >
                  <category.icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-primary-600 transition-colors">
                  {t(category.name)}
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  {t(category.description)}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs font-semibold text-primary-600 group-hover:translate-x-1 transition-transform">
                <span>Ko&apos;rish</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}