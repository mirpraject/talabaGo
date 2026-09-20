"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ClipboardList,
  Loader2,
  CheckCircle2,
  XCircle,
  Send,
  ArrowLeft,
  ArrowRight,
  Star,
  School,
  GraduationCap,
  Layers,
  RotateCcw,
  ChevronRight,
  HelpCircle,
  Award,
  Crown,
  Zap,
  Shield,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RequireAuth from "@/components/RequireAuth";
import AIChat from "@/components/AIChat";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/lib/api";
import { getTierConfig } from "@/lib/subscription";

type Question = {
  id: number;
  question_text: string;
  option_a: string | null;
  option_b: string | null;
  option_c: string | null;
  option_d: string | null;
};

type TestDetail = {
  id: number;
  title: string;
  subject_name: string | null;
  description: string | null;
  level: string | null;
  grade: number | null;
  is_ai_generated: boolean;
  question_count: number;
  ticket_number: number;
  total_tickets: number;
  questions: Question[];
};

type QuestionResult = {
  question_id: number;
  question: string;
  your_answer: string;
  correct_answer: string;
  is_correct: boolean;
  explanation: string;
};

type TestResult = {
  score: number;
  total: number;
  percentage: number;
  stars_earned: number;
  ticket_number: number;
  total_tickets: number;
  results: QuestionResult[];
};

const letters = ["A", "B", "C", "D"];


export default function TestDetailPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const testId = Number(params.id);
  const initialTicket = Number(searchParams.get("ticket")) || 1;

  const { t } = useLanguage();
  const { user, refreshUser } = useAuth();
  const [test, setTest] = useState<TestDetail | null>(null);
  const [ticketNumber, setTicketNumber] = useState<number>(initialTicket);
  const [loading, setLoading] = useState(true);

  // Sequential question state
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [error, setError] = useState("");

  const loadTestTicket = useCallback(
    async (tNum: number) => {
      setLoading(true);
      setError("");
      setResult(null);
      setAnswers({});
      setCurrentIdx(0);
      try {
        const data = await api.get<TestDetail>(`/api/tests/${testId}?ticket=${tNum}`);
        setTest(data);
        setTicketNumber(data.ticket_number || tNum);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("ai_error"));
      } finally {
        setLoading(false);
      }
    },
    [testId, t]
  );

  useEffect(() => {
    loadTestTicket(initialTicket);
  }, [loadTestTicket, initialTicket]);

  const chooseOption = (questionId: number, answer: string) => {
    if (result) return;
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const changeTicket = (newTNum: number) => {
    if (newTNum === ticketNumber) return;
    router.replace(`/tests/${testId}?ticket=${newTNum}`);
    loadTestTicket(newTNum);
  };

  async function submit() {
    if (!test) return;
    setSubmitting(true);
    setError("");
    try {
      const payload = Object.entries(answers).map(([question_id, answer]) => ({
        question_id: Number(question_id),
        answer,
      }));
      const res = await api.post<TestResult>(`/api/tests/${testId}/submit`, {
        ticket_number: ticketNumber,
        answers: payload,
      });
      setResult(res);
      await refreshUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("ai_error"));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <RequireAuth>
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
          <p className="text-gray-500 font-medium">Bilet savollari yuklanmoqda...</p>
        </div>
      </RequireAuth>
    );
  }

  if (!test || test.questions.length === 0) {
    return (
      <RequireAuth>
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-md w-full text-center">
            <HelpCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {error || "Ushbu biletda test savollari topilmadi"}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Tez orada yangi savollar qo&apos;shiladi yoki boshqa biletni tanlang.
            </p>
            <Link
              href="/tests"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium text-sm hover:bg-indigo-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("back_to_tests")}
            </Link>
          </div>
        </div>
      </RequireAuth>
    );
  }

  const currentQ = test.questions[currentIdx] || test.questions[0];
  const totalInTicket = test.questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / totalInTicket) * 100);

  const qOptions = [
    { label: "A", value: currentQ?.option_a },
    { label: "B", value: currentQ?.option_b },
    { label: "C", value: currentQ?.option_c },
    { label: "D", value: currentQ?.option_d },
  ].filter((o) => o.value);

  return (
    <RequireAuth>
      <div className="w-full text-slate-100">
        <main className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Top Navigation & Info Header */}
            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
              <Link
                href="/tests"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors bg-white px-3.5 py-2 rounded-xl border border-gray-200 shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                {t("back_to_tests")}
              </Link>

              {/* Bilet Selector */}
              {test.total_tickets > 1 && (
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-sm">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Bilet:
                  </span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: test.total_tickets }, (_, i) => i + 1).map((bNum) => (
                      <button
                        key={bNum}
                        onClick={() => changeTicket(bNum)}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                          ticketNumber === bNum
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {bNum}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Test Title Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0">
                    <ClipboardList className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-xl font-bold text-gray-900">{test.title}</h1>
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {ticketNumber}-Bilet (20 ta savol)
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs mt-1">
                      {test.subject_name || "Umumiy fan"} · Jami: {test.question_count} ta savol
                      {test.total_tickets > 1 ? ` · ${test.total_tickets} ta biletga ajratilgan` : ""}
                    </p>
                  </div>
                </div>

                {test.level && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5">
                    {test.level === "school" ? (
                      <School className="w-3.5 h-3.5 text-indigo-600" />
                    ) : (
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                    )}
                    {test.level === "school"
                      ? `${test.grade}-sinf`
                      : `${test.grade}-kurs`}
                  </span>
                )}
              </div>

              {/* Progress bar */}
              {!result && (
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs font-medium text-gray-500 mb-1.5">
                    <span>
                      Javob berildi: <strong className="text-gray-900">{answeredCount}</strong> / {totalInTicket}
                    </span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* RESULTS VIEW */}
            {result ? (
              <div className="space-y-6">
                {/* Result summary banner */}
                <div className="bg-white rounded-3xl shadow-sm border border-indigo-100 p-8 text-center relative overflow-hidden">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-violet-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
                      <Award className="w-8 h-8" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                      {ticketNumber}-Bilet Natijalari
                    </span>
                    <h2 className="text-3xl font-extrabold text-gray-900 mt-1 mb-2">
                      {result.score} / {result.total} ta to&apos;g&apos;ri javob
                    </h2>
                    <p className="text-sm font-semibold text-gray-500 mb-4">
                      Muvaffaqiyat darajasi:{" "}
                      <span
                        className={
                          result.percentage >= 70
                            ? "text-green-600"
                            : result.percentage >= 50
                            ? "text-amber-600"
                            : "text-red-600"
                        }
                      >
                        {result.percentage}%
                      </span>
                    </p>

                    <div className="inline-flex flex-col items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200 px-5 py-3 rounded-2xl text-sm font-bold mb-6 shadow-sm">
                      <div className="flex items-center gap-2 text-base">
                        <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
                        <span>+{result.stars_earned} yulduz qo&apos;lga kiritildi!</span>
                      </div>
                      {(() => {
                        const tier = user?.subscription_tier || "free";
                        if (tier === "plus_plus") {
                          return (
                            <div className="text-xs text-amber-800 font-extrabold flex items-center gap-1.5">
                              <Crown className="w-4 h-4 text-amber-600 fill-amber-500 animate-pulse" />
                              <span>TalabaGo Plus+ stavkasi: Har bir to&apos;g&apos;ri javob uchun 1.7 ⭐ berildi! (Cheksiz test)</span>
                            </div>
                          );
                        }
                        if (tier === "plus") {
                          return (
                            <div className="text-xs text-emerald-800 font-bold flex flex-col items-center gap-0.5">
                              <span className="flex items-center gap-1">
                                <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-500" />
                                TalabaGo Plus stavkasi: 1.3 ⭐ berildi!
                              </span>
                              <Link href="/premium" className="text-amber-800 font-semibold underline text-[11px] hover:text-amber-900">
                                Plus+ da 1.7 ⭐ va cheksiz testlar oling →
                              </Link>
                            </div>
                          );
                        }
                        return (
                          <div className="text-xs text-slate-700 font-normal flex flex-col items-center gap-0.5">
                            <span>Oddiy stavka: Har bir to&apos;g&apos;ri javob uchun 0.5 ⭐ berildi (150 ta test limit).</span>
                            <Link href="/premium" className="text-amber-800 font-bold underline hover:text-amber-900 text-[11px]">
                              Plus (1.3 ⭐) yoki Plus+ (1.7 ⭐) ga o&apos;tish →
                            </Link>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="flex items-center justify-center gap-3 flex-wrap">
                      <button
                        onClick={() => loadTestTicket(ticketNumber)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-all"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Qayta urinish
                      </button>

                      {ticketNumber < test.total_tickets && (
                        <button
                          onClick={() => changeTicket(ticketNumber + 1)}
                          className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-indigo-200"
                        >
                          Keyingi bilet ({ticketNumber + 1}-Bilet)
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Question by question detailed analysis */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Savollar tahlili va tushuntirishlar ({result.results.length} ta)
                  </h3>

                  <div className="space-y-4">
                    {result.results.map((r, i) => (
                      <div
                        key={r.question_id}
                        className={`p-4 rounded-xl border ${
                          r.is_correct
                            ? "bg-green-50/40 border-green-200"
                            : "bg-red-50/40 border-red-200"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                              r.is_correct
                                ? "bg-green-600 text-white"
                                : "bg-red-600 text-white"
                            }`}
                          >
                            {i + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm mb-2">
                              {r.question}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-2">
                              <div
                                className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 ${
                                  r.is_correct
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {r.is_correct ? (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                ) : (
                                  <XCircle className="w-3.5 h-3.5" />
                                )}
                                Sizning javobingiz: <strong>{r.your_answer || "Belgilanmagan"}</strong>
                              </div>
                              <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 font-medium">
                                To&apos;g&apos;ri javob: <strong className="text-green-700">{r.correct_answer}</strong>
                              </div>
                            </div>
                            {r.explanation && (
                              <p className="text-xs text-gray-600 bg-white/80 p-2.5 rounded-lg border border-gray-100 leading-relaxed">
                                <strong className="text-indigo-600">Tushuntirish:</strong> {r.explanation}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* ACTIVE SEQUENTIAL TEST TAKING VIEW */
              <div className="space-y-6">
                {/* 20-Question Quick Jump Matrix */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-3 text-xs font-semibold text-gray-500">
                    <span>Savollar ro&apos;yxati (Bilet #{ticketNumber})</span>
                    <span>
                      {answeredCount} / {totalInTicket} bajarildi
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {test.questions.map((q, idx) => {
                      const isAnswered = !!answers[q.id];
                      const isCurrent = currentIdx === idx;
                      return (
                        <button
                          key={q.id}
                          onClick={() => setCurrentIdx(idx)}
                          className={`w-9 h-9 rounded-xl text-xs font-bold transition-all relative flex items-center justify-center ${
                            isCurrent
                              ? "bg-indigo-600 text-white ring-2 ring-indigo-400 ring-offset-2 shadow-sm"
                              : isAnswered
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold"
                              : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                          }`}
                        >
                          {idx + 1}
                          {isAnswered && !isCurrent && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Current Question Focus Card */}
                {currentQ && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">
                        Savol #{currentIdx + 1} / {totalInTicket}
                      </span>
                      {answers[currentQ.id] ? (
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Javob berildi
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Hali tanlanmadi</span>
                      )}
                    </div>

                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-relaxed mb-6">
                      {currentQ.question_text}
                    </h2>

                    {/* Options list */}
                    <div className="space-y-3">
                      {qOptions.map((opt, i) => {
                        const isChosen = answers[currentQ.id] === opt.label;
                        return (
                          <button
                            key={opt.label}
                            onClick={() => chooseOption(currentQ.id, opt.label)}
                            className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                              isChosen
                                ? "border-indigo-600 bg-indigo-50/70 text-indigo-950 font-medium ring-1 ring-indigo-500 shadow-sm"
                                : "border-gray-200 bg-white hover:border-indigo-200 hover:bg-gray-50/50 text-gray-800"
                            }`}
                          >
                            <span
                              className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
                                isChosen
                                  ? "bg-indigo-600 text-white shadow-sm"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {letters[i]}
                            </span>
                            <span className="text-sm leading-snug flex-1">{opt.value}</span>
                            {isChosen && (
                              <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Step Navigation buttons */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100 flex-wrap gap-3">
                      <button
                        onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                        disabled={currentIdx === 0}
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Oldingi savol
                      </button>

                      <div className="flex items-center gap-2">
                        {currentIdx < totalInTicket - 1 ? (
                          <button
                            onClick={() => setCurrentIdx((prev) => Math.min(totalInTicket - 1, prev + 1))}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
                          >
                            Keyingi savol
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={submit}
                            disabled={submitting || answeredCount === 0}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-emerald-200 disabled:opacity-50"
                          >
                            {submitting ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Send className="w-4 h-4" />
                            )}
                            Biletni yakunlash
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Finish Ticket Banner if answered majority */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">
                      Testni topshirishga tayyormisiz?
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {answeredCount} ta savolga javob berildi ({totalInTicket - answeredCount} ta qoldi).
                    </p>
                  </div>
                  <button
                    onClick={submit}
                    disabled={submitting || answeredCount === 0}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-indigo-100 disabled:opacity-50"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Biletni topshirish ({answeredCount}/{totalInTicket})
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
        <AIChat />
      </div>
    </RequireAuth>
  );
}