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
  Crown,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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

  const inputClass =
    "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all";

  return (
    <RequireAuth>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 py-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t("tests")}</h1>
                <p className="text-gray-500">{t("tests_subtitle")}</p>
              </div>
            </div>

            {/* Generate test */}
            <form
              onSubmit={generate}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary-600" />
                {t("generate_test")}
              </h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className={inputClass + " flex-1"}
                  placeholder={t("report_topic_placeholder")}
                  maxLength={200}
                />
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-600 whitespace-nowrap">
                    {t("question_count")}:
                  </label>
                  <select
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className={inputClass + " w-24"}
                  >
                    {[5, 10, 15, 20, 25, 30].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    disabled={generating || !topic.trim()}
                    className="btn-primary flex items-center gap-2 disabled:opacity-60"
                  >
                    {generating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    {generating ? t("generating") : t("generate")}
                  </button>
                </div>
              </div>
              {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
            </form>

            {/* Grade filter */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (level !== "school") {
                        setLevel("school");
                        setGrade(5);
                      }
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-medium transition-all ${
                      level === "school"
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-gray-200 text-gray-600 hover:border-primary-300"
                    }`}
                  >
                    <School className="w-4 h-4" />
                    {t("school_student")}
                  </button>
                  <button
                    onClick={() => {
                      if (level !== "university") {
                        setLevel("university");
                        setGrade(1);
                      }
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-medium transition-all ${
                      level === "university"
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-gray-200 text-gray-600 hover:border-primary-300"
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    {t("university_student")}
                  </button>
                </div>
                <div className="flex items-center gap-3 flex-1">
                  <label className="text-sm text-gray-600 whitespace-nowrap">
                    {level === "school" ? t("grade_label") : t("course_label")}:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(level === "school" ? SCHOOL_GRADES : UNI_COURSES).map((g) => (
                      <button
                        key={g}
                        onClick={() => setGrade(g)}
                        className={`min-w-10 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                          grade === g
                            ? "bg-primary-600 text-white border-primary-600"
                            : "border-gray-200 text-gray-600 hover:border-primary-300 hover:bg-gray-50"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                  {user?.level && (level !== user.level || grade !== (user.grade || 9)) && (
                    <button
                      onClick={() => {
                        setLevel(user.level || "school");
                        setGrade(user.grade || 9);
                      }}
                      className="text-sm text-primary-600 font-medium whitespace-nowrap hover:underline"
                    >
                      {t("my_level")}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Search and Subject filter */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Test nomi yoki fan bo'yicha tezkor qidirish (masalan: Python, Algebra, Bilet)..."
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded"
                  >
                    Tozalash
                  </button>
                )}
              </div>

              {availableSubjects.length > 0 && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                  <button
                    onClick={() => setSelectedSubject("all")}
                    className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                      selectedSubject === "all"
                        ? "bg-primary-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Barcha fanlar ({tests.length})
                  </button>
                  {availableSubjects.map((s) => {
                    const count = tests.filter((t) => t.subject_name === s).length;
                    return (
                      <button
                        key={s}
                        onClick={() => setSelectedSubject(s)}
                        className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                          selectedSubject === s
                            ? "bg-primary-600 text-white shadow-sm"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {s} ({count})
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Test list */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {t("tests")} ({filteredTests.length} ta topildi)
              </h2>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
              </div>
            ) : filteredTests.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <FileQuestion className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Qidiruv bo'yicha testlar topilmadi</p>
                {(searchQuery || selectedSubject !== "all") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedSubject("all");
                    }}
                    className="mt-3 text-xs text-primary-600 font-bold hover:underline"
                  >
                    Filtrlarni bekor qilish
                  </button>
                )}
              </div>
            ) : (
              Object.entries(
                filteredTests.reduce<Record<string, TestListItem[]>>((acc, test) => {
                  const key = test.subject_name || t("unassigned");
                  (acc[key] = acc[key] || []).push(test);
                  return acc;
                }, {})
              ).map(([subjectName, subjectTests]) => (
                <div key={subjectName} className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-5 bg-primary-500 rounded-full" />
                    <h3 className="text-base font-bold text-gray-900">
                      {subjectName}
                    </h3>
                    <span className="text-sm text-gray-400">
                      ({subjectTests.length})
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subjectTests.map((test) => (
                      <Link
                        key={test.id}
                        href={`/tests/${test.id}`}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-primary-200 transition-all group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                            <ClipboardList className="w-5 h-5 text-primary-600" />
                          </div>
                          {test.is_ai_generated && (
                            <span className="text-[11px] font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                              {t("ai_tag")}
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900 leading-snug group-hover:text-primary-700">
                          {test.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {test.subject_name || "—"} · {test.question_count} ta savol
                          {test.question_count > 0 && (
                            <span className="text-indigo-600 font-medium ml-1">
                              · {test.tickets_count || Math.max(1, Math.ceil(test.question_count / 20))} ta bilet
                            </span>
                          )}
                        </p>
                        <div className="flex items-center gap-2 mt-3 flex-wrap">
                          {test.level && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary-700 bg-primary-50 border border-primary-100 rounded-full px-2 py-0.5">
                              {test.level === "school" ? (
                                <School className="w-3 h-3" />
                              ) : (
                                <GraduationCap className="w-3 h-3" />
                              )}
                              {test.level === "school"
                                ? `${test.grade}-${t("grade_label")}`
                                : `${test.grade}-${t("course_label")}`}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200/80 rounded-full px-2 py-0.5">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                            +0.5⭐ <span className="text-[10px] text-amber-600 font-normal">(Pro: 1.2⭐)</span>
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 mt-4 group-hover:gap-2.5 transition-all">
                          <Play className="w-4 h-4" />
                          {t("take_test")}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
        <Footer />
        <AIChat />
      </div>
    </RequireAuth>
  );
}