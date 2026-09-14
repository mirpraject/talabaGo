"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Code2,
  Terminal,
  Play,
  CheckCircle2,
  XCircle,
  Sparkles,
  Lock,
  Crown,
  ChevronRight,
  BookOpen,
  HelpCircle,
  RotateCcw,
  Loader2,
  Star,
  Layers,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/lib/api";

type Exercise = {
  id: string;
  title: string;
  difficulty: string;
  description: string;
  initial_code: string;
  test_cases: { expected_output?: string }[];
  hint?: string | null;
};

type Lesson = {
  id: string;
  slug: string;
  title: string;
  track: string;
  track_title: string;
  summary: string;
  content: string;
  exercises: Exercise[];
};

type Track = {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessons_count: number;
  lessons: Lesson[];
};

type CodeRunResponse = {
  stdout: string;
  stderr: string;
  exit_code: number;
  success: boolean;
  exercise_completed: boolean;
  feedback?: string | null;
};

export default function LearningPage() {
  const { user, refreshUser } = useAuth();
  const { lang } = useLanguage();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedTrackId, setSelectedTrackId] = useState<string>("python");
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [code, setCode] = useState<string>("");
  const [terminalOutput, setTerminalOutput] = useState<CodeRunResponse | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [showPremiumModal, setShowPremiumModal] = useState<boolean>(false);

  const isPremium = Boolean(user?.is_premium || user?.is_admin);

  const tDict = {
    uz: {
      badge: "Interaktiv Dasturlash Laboratoriyasi",
      title: "Python, Django & Algoritmlar",
      premiumActive: "Premium Ochiq",
      demoMode: "Demo Rejim",
      algorithms: "Algoritmlar",
      lessons: "Darslar",
      lessonSuffix: "ta dars",
      runCode: "Kodni ishga tushirish",
      checking: "Tekshirilmoqda...",
      resetTitle: "Kodni boshlang'ich holatga qaytarish",
      theory: "Nazariya",
      exercise: "Amaliy Topshiriq",
      hint: "Yordam / Maslahat",
      placeholder: "# Python kodingizni bu yerga yozing...",
      lockedTitle: "Ushbu dars faqat Premium foydalanuvchilar uchun ochiq",
      lockedSubtitle: "Barcha Python, Django va Algoritmlar darslarini to'liq ochish uchun 15 000 so'm evaziga VIP Premium obunani faollashtiring.",
      btnGetPremium: "Premium Olish (15 000 so'm)",
    },
    kaa: {
      badge: "Interaktiv Programmalaw Laboratoriyası",
      title: "Python, Django & Algoritmler",
      premiumActive: "Premium Ashıq",
      demoMode: "Demo Rejim",
      algorithms: "Algoritmler",
      lessons: "Sabaqlar",
      lessonSuffix: "sabaq",
      runCode: "Kodtı iske túsiriw",
      checking: "Tekserilmekte...",
      resetTitle: "Kodtı baslanǵısh jaǵdayǵa qaytarıw",
      theory: "Teoriya",
      exercise: "Ámeliy Tapsırma",
      hint: "Kómek / Máslahát",
      placeholder: "# Python koduńızdı bul jerge jazıń...",
      lockedTitle: "Bul sabaq tek Premium paydalanıwshılar ushın ashıq",
      lockedSubtitle: "Barlıq Python, Django hám Algoritmler sabaqların tolıq ashıw ushın 15 000 somǵa VIP Premium jazılıwdı aktivlestiriń.",
      btnGetPremium: "Premium Jazılıw (15 000 som)",
    },
    ru: {
      badge: "Интерактивная Лаборатория Программирования",
      title: "Python, Django и Алгоритмы",
      premiumActive: "Премиум Доступен",
      demoMode: "Демо-режим",
      algorithms: "Алгоритмы",
      lessons: "Уроки",
      lessonSuffix: "уроков",
      runCode: "Запустить код",
      checking: "Выполняется...",
      resetTitle: "Сбросить код к начальному",
      theory: "Теория",
      exercise: "Практическое Задание",
      hint: "Подсказка",
      placeholder: "# Напишите ваш код на Python здесь...",
      lockedTitle: "Этот урок доступен только для пользователей с Premium",
      lockedSubtitle: "Для полного доступа ко всем урокам Python, Django и Алгоритмов оформите VIP Премиум всего за 15 000 сум в месяц.",
      btnGetPremium: "Оформить Премиум (15 000 сум)",
    },
    en: {
      badge: "Interactive Coding Laboratory",
      title: "Python, Django & Algorithms",
      premiumActive: "Premium Unlocked",
      demoMode: "Demo Mode",
      algorithms: "Algorithms",
      lessons: "Lessons",
      lessonSuffix: "lessons",
      runCode: "Run code live",
      checking: "Running...",
      resetTitle: "Reset code to default",
      theory: "Theory",
      exercise: "Practical Exercise",
      hint: "Hint",
      placeholder: "# Write your Python code here...",
      lockedTitle: "This lesson is exclusive to Premium members",
      lockedSubtitle: "Unlock all lessons in Python, Django and Algorithms by subscribing to VIP Premium for just 15,000 UZS/month.",
      btnGetPremium: "Get Premium (15,000 UZS)",
    },
  }[lang] || {
    badge: "Interaktiv Dasturlash Laboratoriyasi",
    title: "Python, Django & Algoritmlar",
    premiumActive: "Premium Ochiq",
    demoMode: "Demo Rejim",
    algorithms: "Algoritmlar",
    lessons: "Darslar",
    lessonSuffix: "ta dars",
    runCode: "Kodni ishga tushirish",
    checking: "Tekshirilmoqda...",
    resetTitle: "Kodni boshlang'ich holatga qaytarish",
    theory: "Nazariya",
    exercise: "Amaliy Topshiriq",
    hint: "Yordam / Maslahat",
    placeholder: "# Python kodingizni bu yerga yozing...",
    lockedTitle: "Ushbu dars faqat Premium foydalanuvchilar uchun ochiq",
    lockedSubtitle: "Barcha Python, Django va Algoritmlar darslarini to'liq ochish uchun 15 000 so'm evaziga VIP Premium obunani faollashtiring.",
    btnGetPremium: "Premium Olish (15 000 so'm)",
  };

  useEffect(() => {
    async function loadCurriculum() {
      try {
        const data = await api.get<Track[]>("/api/learning/tracks");
        setTracks(data);
        if (data.length > 0) {
          const firstTrack = data[0];
          setSelectedTrackId(firstTrack.id);
          if (firstTrack.lessons.length > 0) {
            const firstLesson = firstTrack.lessons[0];
            setSelectedLesson(firstLesson);
            if (firstLesson.exercises.length > 0) {
              setCode(firstLesson.exercises[0].initial_code);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load learning tracks:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCurriculum();
  }, []);

  const currentTrack = tracks.find((t) => t.id === selectedTrackId);

  function handleSelectLesson(lesson: Lesson, isLocked: boolean) {
    if (isLocked) {
      setShowPremiumModal(true);
      return;
    }
    setSelectedLesson(lesson);
    setShowHint(false);
    setTerminalOutput(null);
    if (lesson.exercises.length > 0) {
      setCode(lesson.exercises[0].initial_code);
    } else {
      setCode("# Ushbu dars uchun Python kodini sinab ko'ring:\nprint('Salom TalabaGo!')\n");
    }
  }

  async function handleRunCode() {
    if (!selectedLesson) return;
    const currentEx = selectedLesson.exercises[0];

    // Check lock
    const isLocked = !isPremium && selectedLesson.id !== "py-1";
    if (isLocked) {
      setShowPremiumModal(true);
      return;
    }

    setIsRunning(true);
    setTerminalOutput(null);

    try {
      const res = await api.post<CodeRunResponse>("/api/learning/run", {
        code,
        exercise_id: currentEx ? currentEx.id : undefined,
      });
      setTerminalOutput(res);
      if (res.exercise_completed) {
        await refreshUser();
      }
    } catch (err: any) {
      setTerminalOutput({
        stdout: "",
        stderr: err?.message || "Ijroda xatolik yuz berdi",
        exit_code: 1,
        success: false,
        exercise_completed: false,
        feedback: "Xatolik ro'y berdi.",
      });
    } finally {
      setIsRunning(false);
    }
  }

  function handleResetCode() {
    if (selectedLesson && selectedLesson.exercises.length > 0) {
      setCode(selectedLesson.exercises[0].initial_code);
      setTerminalOutput(null);
    }
  }

  const currentExercise = selectedLesson?.exercises[0];

  return (
    <RequireAuth>
      <div className="w-full text-slate-100">
        <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
          {/* Top banner / Navigation */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <Code2 className="w-3.5 h-3.5" />
                {tDict.badge}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
                {tDict.title}
                {isPremium ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold uppercase">
                    <Crown className="w-3 h-3 fill-amber-400" /> {tDict.premiumActive}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs font-medium border border-slate-700">
                    <Lock className="w-3 h-3" /> {tDict.demoMode}
                  </span>
                )}
              </h1>
            </div>

            {/* Quick Track Switcher Tabs */}
            <div className="flex items-center gap-2 bg-slate-800/80 p-1 rounded-2xl border border-slate-700/80">
              {tracks.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedTrackId(t.id);
                    if (t.lessons.length > 0) {
                      const isLocked = !isPremium && t.lessons[0].id !== "py-1";
                      handleSelectLesson(t.lessons[0], isLocked);
                    }
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                    selectedTrackId === t.id
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                  }`}
                >
                  <span className="text-base">{t.icon}</span>
                  <span>{t.id === "python" ? "Python" : t.id === "algorithms" ? tDict.algorithms : "Django"}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main workspace (Grid: Sidebar lessons, Middle theory/exercise, Right Code Editor & Runner) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
            {/* Left sidebar: Lessons list (3 cols) */}
            <div className="lg:col-span-3 bg-slate-800/60 backdrop-blur-md rounded-3xl border border-slate-700/60 p-4 space-y-3">
              <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-700/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> {tDict.lessons}
                </span>
                <span>{currentTrack?.lessons.length || 0} {tDict.lessonSuffix}</span>
              </div>

              <div className="space-y-1.5 max-h-[620px] overflow-y-auto pr-1">
                {currentTrack?.lessons.map((lesson, idx) => {
                  const isLocked = !isPremium && lesson.id !== "py-1";
                  const isCurrent = selectedLesson?.id === lesson.id;

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => handleSelectLesson(lesson, isLocked)}
                      className={`w-full text-left p-3 rounded-2xl transition-all flex items-start gap-3 border ${
                        isCurrent
                          ? "bg-indigo-600/20 border-indigo-500/60 text-white shadow-md shadow-indigo-500/10"
                          : "bg-slate-800/40 border-transparent hover:bg-slate-700/40 text-slate-300"
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {isLocked ? (
                          <div className="w-6 h-6 rounded-lg bg-slate-700 flex items-center justify-center text-slate-400">
                            <Lock className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                            isCurrent ? "bg-indigo-600 text-white" : "bg-slate-700 text-slate-300"
                          }`}>
                            {idx + 1}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold truncate flex items-center gap-1.5">
                          {lesson.title.split(": ")[1] || lesson.title}
                          {isLocked && (
                            <span className="text-[10px] text-amber-400 font-normal">VIP</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {lesson.summary}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {!isPremium && (
                <div className="pt-2">
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-center space-y-2">
                    <Crown className="w-5 h-5 text-amber-400 fill-amber-400 mx-auto" />
                    <div className="text-xs font-bold text-amber-200">
                      Barcha darslar va kod tekshiruvini oching!
                    </div>
                    <Link
                      href="/premium"
                      className="block w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md transition-all"
                    >
                      Premium (15 000 so'm)
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Middle: Theory & Exercise prompt (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              {/* Theory Card */}
              <div className="bg-slate-800/60 rounded-3xl border border-slate-700/60 p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-700/50">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" /> Dars Nazariyasi
                  </span>
                  <span className="text-xs text-slate-400">{selectedLesson?.track_title}</span>
                </div>

                <div className="prose prose-invert prose-sm max-h-[260px] overflow-y-auto pr-2 text-slate-300 space-y-3">
                  <h3 className="text-base font-bold text-white">{selectedLesson?.title}</h3>
                  <p className="text-xs leading-relaxed text-slate-300 whitespace-pre-line">
                    {selectedLesson?.content}
                  </p>
                </div>
              </div>

              {/* Practical Exercise Card */}
              {currentExercise && (
                <div className="bg-gradient-to-br from-indigo-950/40 to-slate-800/80 rounded-3xl border border-indigo-500/30 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold uppercase">
                        Amaliy Topsiriq
                      </span>
                      <span className="text-[11px] text-slate-400">Qiyinlik: {currentExercise.difficulty}</span>
                    </div>

                    {currentExercise.hint && (
                      <button
                        onClick={() => setShowHint(!showHint)}
                        className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium transition-colors"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        {showHint ? "Yashirish" : "Yordam (Hint)"}
                      </button>
                    )}
                  </div>

                  <h4 className="font-bold text-sm text-white">{currentExercise.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentExercise.description}
                  </p>

                  {showHint && currentExercise.hint && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs animate-in fade-in">
                      💡 <strong>Maslahat:</strong> {currentExercise.hint}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right: Code Editor and Terminal Runner (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* Code Editor Container */}
              <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
                {/* Editor Header */}
                <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-xs font-mono text-slate-400 ml-2">main.py</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleResetCode}
                      title={tDict.resetTitle}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={handleRunCode}
                      disabled={isRunning}
                      className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      {isRunning ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          {tDict.checking}
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-slate-950" />
                          {tDict.runCode}
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Textarea code editor */}
                <div className="p-3 relative bg-slate-950">
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    rows={12}
                    spellCheck={false}
                    className="w-full bg-transparent text-emerald-400 font-mono text-xs sm:text-sm p-2 focus:outline-none resize-none leading-relaxed selection:bg-indigo-900 selection:text-white"
                    placeholder={tDict.placeholder}
                  />
                </div>
              </div>

              {/* Terminal Output */}
              <div className="bg-slate-950 rounded-3xl border border-slate-800 p-4 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-slate-400" />
                    Terminal & Test Natijasi
                  </span>
                  {terminalOutput && (
                    <span className={terminalOutput.success ? "text-emerald-400" : "text-rose-400"}>
                      Exit code: {terminalOutput.exit_code}
                    </span>
                  )}
                </div>

                {/* Feedback pill */}
                {terminalOutput?.feedback && (
                  <div className={`p-2.5 rounded-xl flex items-center gap-2 font-sans font-medium text-xs ${
                    terminalOutput.exercise_completed
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  }`}>
                    {terminalOutput.exercise_completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                    <span>{terminalOutput.feedback}</span>
                  </div>
                )}

                {/* Output log */}
                <div className="min-h-[90px] max-h-[160px] overflow-y-auto bg-slate-900/60 p-3 rounded-xl border border-slate-800/60 text-slate-300 whitespace-pre-wrap font-mono text-xs">
                  {terminalOutput ? (
                    <>
                      {terminalOutput.stdout && (
                        <div className="text-emerald-300">{terminalOutput.stdout}</div>
                      )}
                      {terminalOutput.stderr && (
                        <div className="text-rose-400">{terminalOutput.stderr}</div>
                      )}
                      {!terminalOutput.stdout && !terminalOutput.stderr && (
                        <div className="text-slate-500 italic">Dastur hech narsa chop etmadi.</div>
                      )}
                    </>
                  ) : (
                    <div className="text-slate-500 italic">
                      "Kodni ishga tushirish" tugmasini bosing va natijani real vaqtda ko'ring...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Premium Barrier Modal */}
        {showPremiumModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-5 shadow-2xl relative">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto">
                <Crown className="w-8 h-8 text-amber-400 fill-amber-400" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-white">
                  Premium Laboratoriyani oching!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Python, Django va Algoritmlar bo'yicha to'liq amaliy darslar va real-vaqtda kod yozish laboratoriyasi faqat <strong>TalabaGo Premium</strong> foydalanuvchilari uchun ochiq.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-xs text-left space-y-2 text-slate-300">
                <div className="flex items-center gap-2">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>Har bir to'g'ri test uchun <strong>1.2 ⭐ yulduz</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sayt ichida interaktiv kod muharriri</span>
                </div>
                <div className="flex items-center gap-2">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>Narxi: <strong>atigi 15 000 so'm / oyiga</strong></span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowPremiumModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold text-xs transition-colors"
                >
                  Keyinroq
                </button>
                <Link
                  href="/premium"
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Crown className="w-3.5 h-3.5 fill-slate-950" /> Premium olish
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </RequireAuth>
  );
}
