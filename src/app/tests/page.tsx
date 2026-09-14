"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ClipboardList,
  Loader2,
  Sparkles,
  Play,
  FileQuestion,
  School,
  GraduationCap,
  Search,
  Star,
  Layers,
  ChevronRight,
} from "lucide-react";
import RequireAuth from "@/components/RequireAuth";
import AIChat from "@/components/AIChat";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/lib/api";

export type TestListItem = {
  id: number;
  title: string;
  subject_id: number | null;
  subject_name: string | null;
  description: string | null;
  level: string | null;
  grade: number | null;
  is_ai_generated: boolean;
  created_at: string;
  question_count: number;
  tickets_count?: number;
};

const SCHOOL_GRADES = [5, 6, 7, 8, 9, 10, 11];
const UNI_COURSES = [1, 2, 3, 4];

export default function TestsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [tests, setTests] = useState<TestListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState("");
  const [questionCount, setQuestionCount] = useState(10);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [level, setLevel] = useState(user?.level || "school");
  const [grade, setGrade] = useState(user?.grade || 9);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ level, grade: String(grade) });
      const data = await api.get<TestListItem[]>(`/api/tests/?${params.toString()}`);
      setTests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("ai_error"));
    } finally {
      setLoading(false);
    }
  }, [t, level, grade]);

  useEffect(() => {
    if (user?.level) {
      setLevel(user.level);
      setGrade(user.grade || (user.level === "university" ? 1 : 9));
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim()) return;
    setGenerating(true);
    setError("");
    try {
      await api.post("/api/ai/test", {
        topic: topic.trim(),
        question_count: questionCount,
        language: "uz",
        level,
        grade,
      });
      setTopic("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("ai_error"));
    } finally {
      setGenerating(false);
    }
  }

  const availableSubjects = Array.from(
    new Set(tests.map((t) => t.subject_name).filter(Boolean))
  ) as string[];

  const filteredTests = tests.filter((test) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      test.title.toLowerCase().includes(q) ||
      (test.subject_name && test.subject_name.toLowerCase().includes(q));
    const matchesSubject =
      selectedSubject === "all" || test.subject_name === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <RequireAuth>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Interaktiv Sinov & Biletlar
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              {t("tests") || "Akademik Testlar"}
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              {t("tests_subtitle") || "Fanlar bo'yicha tayyorgarlik ko'ring yoki sun'iy intellekt orqali yangi test yarating"}
            </p>
          </div>
        </div>

        {/* AI Generator Box */}
        <form
          onSubmit={generate}
          className="glass-card p-6 mb-8 border border-violet-500/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-400" />
            {t("generate_test") || "AI bilan yangi test yaratish"}
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="flex-1 bg-zinc-900/80 border border-white/10 text-zinc-100 placeholder-zinc-500 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-violet-500 transition-colors"
              placeholder={t("report_topic_placeholder") || "Mavzuni kiriting (masalan: Diskret matematika, Nyuton qonunlari)..."}
              maxLength={200}
            />
            <div className="flex items-center gap-2.5">
              <span className="text-xs text-zinc-400 whitespace-nowrap">Savollar:</span>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="bg-zinc-900/80 border border-white/10 text-zinc-200 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-violet-500"
              >
                {[5, 10, 15, 20, 25, 30].map((n) => (
                  <option key={n} value={n}>
                    {n} ta
                  </option>
                ))}
              </select>
              <button
                type="submit"
                disabled={generating || !topic.trim()}
                className="btn btn-primary flex items-center gap-2 disabled:opacity-50 py-2.5 px-4"
              >
                {generating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {generating ? (t("generating") || "Yaratilmoqda...") : (t("generate") || "Yaratish")}
              </button>
            </div>
          </div>
          {error && <p className="text-xs text-rose-400 mt-2">{error}</p>}
        </form>

        {/* Level & Grade Selector */}
        <div className="glass-card p-4 mb-6 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (level !== "school") {
                  setLevel("school");
                  setGrade(5);
                }
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                level === "school"
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                  : "bg-zinc-800/80 text-zinc-400 hover:text-white border border-white/5"
              }`}
            >
              <School className="w-3.5 h-3.5" />
              {t("school_student") || "Maktab"}
            </button>
            <button
              onClick={() => {
                if (level !== "university") {
                  setLevel("university");
                  setGrade(1);
                }
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                level === "university"
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                  : "bg-zinc-800/80 text-zinc-400 hover:text-white border border-white/5"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              {t("university_student") || "Universitet"}
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-zinc-400 font-medium">
              {level === "school" ? "Sinf:" : "Kurs:"}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(level === "school" ? SCHOOL_GRADES : UNI_COURSES).map((g) => (
                <button
                  key={g}
                  onClick={() => setGrade(g)}
                  className={`min-w-8 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    grade === g
                      ? "bg-white text-zinc-950 shadow"
                      : "bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search & Subject Tabs */}
        <div className="glass-card p-4 mb-6 border border-white/10 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Test yoki fan nomi bo'yicha qidirish (masalan: Fizika, Tarix, Python)..."
              className="w-full pl-10 pr-10 py-2 text-sm bg-zinc-900/80 border border-white/10 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white bg-zinc-800 px-1.5 py-0.5 rounded"
              >
                ✕
              </button>
            )}
          </div>

          {availableSubjects.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              <button
                onClick={() => setSelectedSubject("all")}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedSubject === "all"
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                    : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/5"
                }`}
              >
                Barchasi ({tests.length})
              </button>
              {availableSubjects.map((s) => {
                const count = tests.filter((t) => t.subject_name === s).length;
                return (
                  <button
                    key={s}
                    onClick={() => setSelectedSubject(s)}
                    className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                      selectedSubject === s
                        ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                        : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/5"
                    }`}
                  >
                    {s} ({count})
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Test List Section */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-zinc-300">
            Mavjud testlar ({filteredTests.length} ta)
          </h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
            <span className="text-zinc-500 text-sm">Testlar yuklanmoqda...</span>
          </div>
        ) : filteredTests.length === 0 ? (
          <div className="glass-card p-12 text-center border border-dashed border-white/10 rounded-2xl">
            <FileQuestion className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-400 text-sm font-medium">Ushbu parametrlar bo'yicha test topilmadi</p>
            {(searchQuery || selectedSubject !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSubject("all");
                }}
                className="mt-3 text-xs text-violet-400 font-bold hover:underline"
              >
                Filtrlarni tozalash
              </button>
            )}
          </div>
        ) : (
          Object.entries(
            filteredTests.reduce<Record<string, TestListItem[]>>((acc, test) => {
              const key = test.subject_name || t("unassigned") || "Boshqa";
              (acc[key] = acc[key] || []).push(test);
              return acc;
            }, {})
          ).map(([subjectName, subjectTests]) => (
            <div key={subjectName} className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-4 bg-violet-500 rounded-full" />
                <h3 className="text-base font-bold text-white">
                  {subjectName}
                </h3>
                <span className="text-xs text-zinc-500 font-medium">
                  ({subjectTests.length})
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjectTests.map((test) => (
                  <Link
                    key={test.id}
                    href={`/tests/${test.id}`}
                    className="glass-card p-5 border border-white/10 hover:border-violet-500/40 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-105 transition-transform flex-shrink-0">
                          <ClipboardList className="w-5 h-5" />
                        </div>
                        {test.is_ai_generated && (
                          <span className="text-[10px] font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            AI Test
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-white leading-snug group-hover:text-violet-400 transition-colors line-clamp-2">
                        {test.title}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1.5">
                        {test.question_count} ta savol
                        {test.question_count > 0 && (
                          <span className="text-violet-400 font-medium ml-1.5">
                            · {test.tickets_count || Math.max(1, Math.ceil(test.question_count / 20))} bilet
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs mt-3">
                      <div className="flex items-center gap-2">
                        {test.level && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-400 bg-zinc-800/80 border border-white/5 rounded-md px-2 py-0.5">
                            {test.level === "school" ? (
                              <School className="w-3 h-3" />
                            ) : (
                              <GraduationCap className="w-3 h-3" />
                            )}
                            {test.level === "school"
                              ? `${test.grade}-sinf`
                              : `${test.grade}-kurs`}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400">
                          <Star className="w-3 h-3 fill-amber-400" />
                          +0.5
                        </span>
                      </div>

                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-violet-400 group-hover:translate-x-0.5 transition-transform">
                        Boshlash
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}

        <AIChat />
      </div>
    </RequireAuth>
  );
}