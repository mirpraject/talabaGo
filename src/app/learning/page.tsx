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
  ArrowRight,
  Award,
  Copy,
  Check,
} from "lucide-react";
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
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

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
      lockedSubtitle: "Barcha Python, Django va Algoritmlar darslarini to'liq ochish uchun TalabaGo Plus (40 000 so'm) yoki Plus+ (65 000 so'm) obunasini faollashtiring.",
      btnGetPremium: "Plus Olish (40 000 so'm)",
      nextLesson: "Keyingi darsga o'tish",
      trackCompleted: "Tabriklaymiz! Siz ushbu yo'nalishni to'liq tamomladingiz!",
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
      lockedSubtitle: "Barlıq Python, Django hám Algoritmler sabaqların tolıq ashıw ushın TalabaGo Plus (40 000 som) yamasa Plus+ (65 000 som) jazılıwdı aktivlestiriń.",
      btnGetPremium: "Plus Jazılıw (40 000 som)",
      nextLesson: "Keyingi sabaqqa ótiw",
      trackCompleted: "Qutlıqlaymız! Bul baǵdardı tolıq tamamladıńız!",
    },
    kr: {
      badge: "Интерактив Дастурлаш Лабораторияси",
      title: "Python, Django & Алгоритмлар",
      premiumActive: "Премиум Очиқ",
      demoMode: "Демо Режим",
      algorithms: "Алгоритмлар",
      lessons: "Дарслар",
      lessonSuffix: "та дарс",
      runCode: "Кодни ишга тушириш",
      checking: "Текширилмоқда...",
      resetTitle: "Кодни бошланғич ҳолатга қайтариш",
      theory: "Назария",
      exercise: "Амалий Топшириқ",
      hint: "Ёрдам / Маслаҳат",
      placeholder: "# Python кодингизни бу ерга ёзинг...",
      lockedTitle: "Ушбу дарс фақат Премиум фойдаланувчилар учун очиқ",
      lockedSubtitle: "Барча Python, Django ва Алгоритмлар дарсларини тўлиқ очиш учун TalabaGo Plus (40 000 сўм) ёки Plus+ (65 000 сўм) обунасини фаоллаштиринг.",
      btnGetPremium: "Plus Олиш (40 000 сўм)",
      nextLesson: "Кейинги дарсга ўтиш",
      trackCompleted: "Табриклаймиз! Сиз ушбу йўналишни тўлиқ тамомладингиз!",
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
      lockedSubtitle: "Для полного доступа ко всем урокам Python, Django и Алгоритмов оформите TalabaGo Plus (40 000 сум) или Plus+ (65 000 сум).",
      btnGetPremium: "Оформить Plus (40 000 сум)",
      nextLesson: "Перейти к следующему уроку",
      trackCompleted: "Поздравляем! Вы полностью завершили это направление!",
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
      lockedSubtitle: "Unlock all lessons in Python, Django and Algorithms with TalabaGo Plus (40,000 UZS) or Plus+ (65,000 UZS).",
      btnGetPremium: "Get Plus (40,000 UZS)",
      nextLesson: "Next Lesson",
      trackCompleted: "Congratulations! You have completed this track!",
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
    lockedSubtitle: "Barcha Python, Django va Algoritmlar darslarini to'liq ochish uchun TalabaGo Plus (40 000 so'm) yoki Plus+ (65 000 so'm) obunasini faollashtiring.",
    btnGetPremium: "Plus Olish (40 000 so'm)",
    nextLesson: "Keyingi darsga o'tish",
    trackCompleted: "Tabriklaymiz! Siz ushbu yo'nalishni to'liq tamomladingiz!",
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

  function handleNextLesson() {
    if (!currentTrack || !selectedLesson) return;
    const currentIndex = currentTrack.lessons.findIndex((l) => l.id === selectedLesson.id);
    if (currentIndex !== -1 && currentIndex + 1 < currentTrack.lessons.length) {
      const nextLesson = currentTrack.lessons[currentIndex + 1];
      const isLocked = !isPremium && nextLesson.id !== "py-1";
      handleSelectLesson(nextLesson, isLocked);
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

  function handleCopySnippet(snippetText: string, idx: number) {
    navigator.clipboard.writeText(snippetText);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  const currentExercise = selectedLesson?.exercises[0];
  const currentLessonIndex = currentTrack && selectedLesson
    ? currentTrack.lessons.findIndex((l) => l.id === selectedLesson.id)
    : -1;
  const hasNextLesson = currentTrack && currentLessonIndex !== -1 && currentLessonIndex < currentTrack.lessons.length - 1;

  // Custom Markdown & Code renderer for rich theory presentation
  function renderContentBlocks(rawContent: string) {
    if (!rawContent) return null;

    const sections = rawContent.split(/```/g);
    return sections.map((section, idx) => {
      // Odd indices are code blocks
      if (idx % 2 === 1) {
        let codeBody = section;
        if (section.startsWith("python\n")) {
          codeBody = section.replace(/^python\n/, "");
        } else if (section.startsWith("python\r\n")) {
          codeBody = section.replace(/^python\r\n/, "");
        }

        return (
          <div key={idx} className="my-3 rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950 shadow-inner">
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                python
              </span>
              <button
                onClick={() => handleCopySnippet(codeBody.trim(), idx)}
                className="hover:text-white transition-colors flex items-center gap-1"
                title="Kodni nusxalash"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-[10px] text-emerald-400">Nusxalandi</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span className="text-[10px]">Nusxa</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 text-[11px] sm:text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre leading-relaxed">
              {codeBody.trim()}
            </pre>
          </div>
        );
      }

      // Even indices are regular markdown text
      const lines = section.split("\n");
      return (
        <div key={idx} className="space-y-2">
          {lines.map((line, lIdx) => {
            const trimmed = line.trim();
            if (!trimmed) return null;

            if (trimmed.startsWith("# ")) {
              return null; // The lesson title is already in card header
            }
            if (trimmed.startsWith("### ")) {
              return (
                <h4 key={lIdx} className="text-xs sm:text-sm font-bold text-indigo-300 pt-2 pb-0.5 border-b border-indigo-900/30 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                  {trimmed.replace(/^###\s*/, "")}
                </h4>
              );
            }
            if (trimmed.startsWith("## ")) {
              return (
                <h3 key={lIdx} className="text-sm font-bold text-white pt-2">
                  {trimmed.replace(/^##\s*/, "")}
                </h3>
              );
            }
            if (trimmed.startsWith("- ")) {
              return (
                <div key={lIdx} className="flex items-start gap-2 text-xs text-slate-300 pl-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>{trimmed.replace(/^-\s*/, "")}</span>
                </div>
              );
            }
            return (
              <p key={lIdx} className="text-xs text-slate-300 leading-relaxed">
                {trimmed}
              </p>
            );
          })}
        </div>
      );
    });
  }

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
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-900/60 text-slate-300 font-mono">
                    {t.lessons.length}
                  </span>
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
                <span className="text-emerald-400 font-semibold">{currentTrack?.lessons.length || 0} {tDict.lessonSuffix}</span>
              </div>

              {/* Track progress indicator */}
              <div className="px-2 py-1.5 flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/40 rounded-xl">
                <span>Dars: {currentLessonIndex !== -1 ? currentLessonIndex + 1 : 1} / {currentTrack?.lessons.length || 8}</span>
                <span className="text-indigo-400 font-bold">
                  {Math.round(((currentLessonIndex + 1) / (currentTrack?.lessons.length || 8)) * 100)}%
                </span>
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
                      Barcha 24 ta dars va kod muharririni oching!
                    </div>
                    <Link
                      href="/premium"
                      className="block w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-md transition-all text-center"
                    >
                      Plus Olish (40 000 so'm)
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Middle: Theory & Exercise prompt (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              {/* Theory Card */}
              <div className="bg-slate-800/60 rounded-3xl border border-slate-700/60 p-5 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-700/50">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> Dars Nazariyasi
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-300 font-medium">
                    {selectedLesson?.track_title}
                  </span>
                </div>

                <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2">
                  <h3 className="text-sm font-extrabold text-white">{selectedLesson?.title}</h3>
                  {selectedLesson?.content && renderContentBlocks(selectedLesson.content)}
                </div>
              </div>

              {/* Practical Exercise Card */}
              {currentExercise && (
                <div className="bg-gradient-to-br from-indigo-950/40 to-slate-800/80 rounded-3xl border border-indigo-500/30 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold uppercase">
                        Amaliy Topshiriq
                      </span>
                      <span className="text-[11px] text-slate-400">Qiyinlik: {currentExercise.difficulty}</span>
                    </div>

                    {currentExercise.hint && (
                      <button
                        onClick={() => setShowHint(!showHint)}
                        className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium transition-colors cursor-pointer"
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
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
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
              <div className="bg-slate-950 rounded-3xl border border-slate-800 p-4 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-slate-400" />
                    Terminal & Test Natijasi
                  </span>
                  {terminalOutput && (
                    <span className={terminalOutput.success ? "text-emerald-400 font-semibold" : "text-rose-400 font-semibold"}>
                      Exit code: {terminalOutput.exit_code}
                    </span>
                  )}
                </div>

                {/* Feedback pill */}
                {terminalOutput?.feedback && (
                  <div className={`p-3 rounded-xl flex items-center justify-between gap-2 font-sans font-medium text-xs ${
                    terminalOutput.exercise_completed
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-500/10"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  }`}>
                    <div className="flex items-center gap-2">
                      {terminalOutput.exercise_completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                      <span>{terminalOutput.feedback}</span>
                    </div>

                    {/* Next Lesson Action Button */}
                    {terminalOutput.exercise_completed && hasNextLesson && (
                      <button
                        onClick={handleNextLesson}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-transform hover:scale-105 active:scale-95 shrink-0 cursor-pointer shadow"
                      >
                        <span>{tDict.nextLesson}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}

                {/* Course Completion Trophy Banner */}
                {terminalOutput?.exercise_completed && !hasNextLesson && (
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-indigo-500/20 to-purple-500/20 border border-amber-500/40 text-center space-y-1.5 font-sans">
                    <div className="flex items-center justify-center gap-2 text-amber-300 font-black text-xs">
                      <Award className="w-4 h-4 text-amber-400" />
                      {tDict.trackCompleted}
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Keyingi yo'nalishga o'ting va o'rganishda davom eting!
                    </p>
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
                  Python, Django va Algoritmlar bo'yicha to'liq 24 ta dars va real-vaqtda kod yozish laboratoriyasi faqat <strong>TalabaGo Plus</strong> yoki <strong>Plus+</strong> obunachilari uchun ochiq.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-xs text-left space-y-2 text-slate-300">
                <div className="flex items-center gap-2">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>Plus bilan <strong>1.3 ⭐</strong>, Plus+ bilan <strong>1.7 ⭐ yulduz</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>24 ta interaktiv masterclass darslari</span>
                </div>
                <div className="flex items-center gap-2">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>Narxi: <strong>TalabaGo Plus 40 000 so&apos;m</strong> / Plus+ <strong>65 000 so&apos;m</strong></span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowPremiumModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold text-xs transition-colors cursor-pointer"
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
