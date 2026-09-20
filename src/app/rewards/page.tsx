"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Star,
  Wallet,
  CreditCard,
  Phone,
  Loader2,
  Send,
  Trophy,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRightLeft,
  Copy,
  Check,
  UserCheck,
  AlertCircle,
  History,
  ArrowUpRight,
  ArrowDownLeft,
  Crown,
  Zap,
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RequireAuth from "@/components/RequireAuth";
import AIChat from "@/components/AIChat";
import UserAvatar from "@/components/UserAvatar";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslationKey } from "@/lib/translations";
import { api } from "@/lib/api";

type LeaderboardEntry = {
  id: number;
  username: string;
  student_id?: string | null;
  avatar_url?: string | null;
  full_name: string | null;
  stars: number;
};

type Withdrawal = {
  id: number;
  amount: number;
  stars_spent: number;
  method: string;
  target: string;
  status: string;
  created_at: string;
  processed_at: string | null;
};

type StarTransfer = {
  id: number;
  sender_id: number;
  sender_username: string | null;
  sender_student_id: string | null;
  recipient_id: number;
  recipient_username: string | null;
  recipient_student_id: string;
  stars: number;
  note: string | null;
  created_at: string;
};

type RecipientInfo = {
  student_id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
};

const statusLabels: Record<string, string> = {
  pending: "status_pending",
  paid: "status_paid",
  rejected: "status_rejected",
};

export default function RewardsPage() {
  const { user, refreshUser } = useAuth();
  const { t } = useLanguage();
  const [stars, setStars] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [history, setHistory] = useState<Withdrawal[]>([]);
  const [transfers, setTransfers] = useState<StarTransfer[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  
  // Active action tab: "withdraw" or "transfer"
  const [actionTab, setActionTab] = useState<"transfer" | "withdraw">("transfer");
  // Active history tab: "transfers" or "withdrawals"
  const [historyTab, setHistoryTab] = useState<"transfers" | "withdrawals">("transfers");

  // Withdraw state
  const [method, setMethod] = useState<"card" | "phone">("card");
  const [target, setTarget] = useState("");

  // Transfer state
  const [recipientStudentId, setRecipientStudentId] = useState("");
  const [transferStars, setTransferStars] = useState<number | "">("");
  const [transferNote, setTransferNote] = useState("");
  const [recipientInfo, setRecipientInfo] = useState<RecipientInfo | null>(null);
  const [lookingUpRecipient, setLookingUpRecipient] = useState(false);
  const [recipientError, setRecipientError] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [copiedId, setCopiedId] = useState(false);

  const load = useCallback(async () => {
    try {
      const [me, withs, trans, top] = await Promise.all([
        api.get<{ stars: number; pending_count: number }>("/api/rewards/me"),
        api.get<Withdrawal[]>("/api/rewards/withdrawals"),
        api.get<StarTransfer[]>("/api/rewards/transfers").catch(() => []),
        api.get<LeaderboardEntry[]>("/api/rewards/leaderboard"),
      ]);
      setStars(me.stars);
      setPendingCount(me.pending_count);
      setHistory(withs);
      setTransfers(trans);
      setLeaderboard(top);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Handle student ID copy
  function copyStudentId() {
    if (!user?.student_id) return;
    navigator.clipboard.writeText(user.student_id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  }

  // Lookup recipient when student ID is entered
  async function handleLookupRecipient(idToLookup: string) {
    const cleanId = idToLookup.trim().toUpperCase();
    if (!cleanId || cleanId.length < 3) {
      setRecipientInfo(null);
      setRecipientError("");
      return;
    }
    if (user?.student_id && cleanId === user.student_id.toUpperCase()) {
      setRecipientInfo(null);
      setRecipientError("O'zingizning Student ID raqamingizga yulduz o'tkaza olmaysiz");
      return;
    }

    setLookingUpRecipient(true);
    setRecipientError("");
    try {
      const info = await api.get<RecipientInfo>(
        `/api/rewards/recipient-info?student_id=${encodeURIComponent(cleanId)}`
      );
      setRecipientInfo(info);
      setRecipientError("");
    } catch (err: any) {
      setRecipientInfo(null);
      setRecipientError(err?.message || "Bunday ID raqamli talaba topilmadi");
    } finally {
      setLookingUpRecipient(false);
    }
  }

  // Handle Transfer Submit
  async function handleTransfer(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const targetId = recipientStudentId.trim().toUpperCase();
    if (!targetId) {
      setError("Qabul qiluvchining Student ID raqamini kiriting");
      return;
    }
    const numStars = typeof transferStars === "number" ? transferStars : parseInt(transferStars as string);
    if (!numStars || numStars <= 0) {
      setError("O'tkaziladigan yulduzlar miqdorini to'g'ri kiriting");
      return;
    }
    if (stars < numStars) {
      setError(`Yulduzlaringiz yetarli emas. Sizda ${stars} ta yulduz mavjud`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post<StarTransfer>("/api/rewards/transfer", {
        recipient_student_id: targetId,
        stars: numStars,
        note: transferNote.trim() || undefined,
      });

      setSuccessMsg(
        `${numStars} ta yulduz muvaffaqiyatli ${res.recipient_username} (${res.recipient_student_id}) ga o'tkazildi!`
      );
      setTransferStars("");
      setRecipientStudentId("");
      setTransferNote("");
      setRecipientInfo(null);
      await refreshUser();
      await load();
    } catch (err: any) {
      setError(err?.message || "Yulduzlarni o'tkazishda xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  }

  // Handle Withdraw Submit
  async function handleWithdraw(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    if (!target.trim()) {
      setError("Ma'lumotni kiriting");
      return;
    }
    if (stars < 100) {
      setError(t("not_enough_stars"));
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post<{
        amount: number;
        stars_spent: number;
        remaining_stars: number;
      }>("/api/rewards/withdraw", { method, target: target.trim() });
      setSuccessMsg(t("withdraw_success"));
      setStars(res.remaining_stars);
      setTarget("");
      await refreshUser();
      await load();
    } catch (err: any) {
      setError(err instanceof Error ? err.message : t("withdraw_btn"));
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-800 text-sm";

  return (
    <RequireAuth>
      <div className="w-full text-slate-100">
        <main className="py-8 sm:py-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-tr from-amber-400 to-amber-500 rounded-2xl flex items-center justify-center text-white shadow-md shadow-amber-500/20">
                  <Star className="w-6 h-6 fill-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {t("rewards")} & Yulduzlar Tizimi
                  </h1>
                  <p className="text-slate-500 text-sm">
                    Yulduz to'plang, o'zaro Student ID orqali o'tkazing yoki so'mga almashtiring
                  </p>
                </div>
              </div>

              {/* Student ID Card Badge */}
              {user?.student_id && (
                <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-sm flex items-center gap-3 self-start sm:self-auto">
                  <UserAvatar
                    studentId={user.student_id}
                    avatarUrl={user.avatar_url}
                    name={user.full_name || user.username}
                    size="sm"
                  />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Mening Student ID
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-base text-slate-900">
                        {user.student_id}
                      </span>
                      <button
                        onClick={copyStudentId}
                        className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="ID dan nusxa olish"
                      >
                        {copiedId ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Balance Card + Leaderboard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Balance card */}
              <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-950/20 lg:col-span-2 flex flex-col justify-between relative overflow-hidden border border-white/10">
                <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-sm text-amber-300 border border-white/10">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {t("my_stars")}
                      </span>
                      {user?.is_premium ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-400 text-slate-950">
                          <Crown className="w-3 h-3 fill-slate-950" /> PREMIUM
                        </span>
                      ) : (
                        <Link
                          href="/premium"
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40 hover:bg-amber-500/30 transition-colors"
                        >
                          <Crown className="w-3 h-3" /> Premium olish
                        </Link>
                      )}
                    </div>
                    <p className="text-5xl sm:text-6xl font-black tracking-tight flex items-center gap-3">
                      {typeof stars === "number" ? stars.toFixed(1) : stars}
                      <span className="text-2xl text-amber-400 font-medium">★</span>
                    </p>
                    <div className="text-slate-300 text-xs sm:text-sm mt-3 space-y-1">
                      <p className="flex items-center gap-1.5">
                        <span>Kurs:</span>
                        <strong className="text-white">100 ★ = 10 000 so'm</strong>
                      </p>
                      <p className="text-xs text-amber-200/90">
                        {user?.is_premium ? (
                          <>⚡ Har bir to'g'ri test uchun: <strong>1.2 ⭐</strong> (Premium stavka)</>
                        ) : (
                          <>⚡ Har bir to'g'ri test uchun: <strong>0.5 ⭐</strong> (Premiumda 1.2 ⭐ bo'ladi)</>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2 shrink-0">
                    <button
                      onClick={() => setActionTab("transfer")}
                      className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm ${
                        actionTab === "transfer"
                          ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30"
                          : "bg-white/10 hover:bg-white/20 text-white"
                      }`}
                    >
                      <ArrowRightLeft className="w-4 h-4" />
                      {t("rewards_transfer_tab")}
                    </button>
                    <button
                      onClick={() => setActionTab("withdraw")}
                      className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm ${
                        actionTab === "withdraw"
                          ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30"
                          : "bg-white/10 hover:bg-white/20 text-white"
                      }`}
                    >
                      <Wallet className="w-4 h-4" />
                      {t("rewards_withdraw_tab")}
                    </button>
                  </div>
                </div>

                {pendingCount > 0 && (
                  <div className="relative z-10 mt-6 inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/30 text-amber-200 rounded-xl px-3.5 py-2 text-xs font-medium">
                    <Clock className="w-4 h-4 text-amber-400" />
                    {t("withdrawals_pending")}: {pendingCount} ta so'rov ko'rib chiqilmoqda
                  </div>
                )}
              </div>

              {/* Leaderboard Card */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-base">
                      <Trophy className="w-5 h-5 text-amber-500" />
                      {t("leaderboard")}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Top 5</span>
                  </h3>

                  {loading ? (
                    <div className="flex justify-center py-6">
                      <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                    </div>
                  ) : (
                    <ol className="space-y-3">
                      {leaderboard.slice(0, 5).map((entry, i) => (
                        <li key={entry.id} className="flex items-center gap-3 text-sm group">
                          <span
                            className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                              i === 0
                                ? "bg-amber-100 text-amber-700"
                                : i === 1
                                ? "bg-slate-200 text-slate-700"
                                : i === 2
                                ? "bg-orange-100 text-orange-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {i + 1}
                          </span>

                          <UserAvatar
                            studentId={entry.student_id}
                            avatarUrl={entry.avatar_url}
                            name={entry.full_name || entry.username}
                            size="xs"
                          />

                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold text-slate-800 text-xs">
                              {entry.full_name || entry.username}
                            </p>
                            {entry.student_id && (
                              <p className="text-[10px] font-mono text-slate-400">
                                {entry.student_id}
                              </p>
                            )}
                          </div>

                          <span className="flex items-center gap-1 font-bold text-amber-600 text-xs">
                            {entry.stars}
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          </span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 text-center">
                  Fayl yuklab, test topshirib yulduz to'plang!
                </div>
              </div>
            </div>

            {/* Actions & History Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Form Column (7 cols) */}
              <div className="lg:col-span-7 bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
                
                {/* Switch tab buttons */}
                <div className="flex rounded-2xl bg-slate-100 p-1 mb-6 border border-slate-200/60">
                  <button
                    type="button"
                    onClick={() => {
                      setActionTab("transfer");
                      setError("");
                      setSuccessMsg("");
                    }}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                      actionTab === "transfer"
                        ? "bg-white text-emerald-600 shadow-sm border border-slate-200/60"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <ArrowRightLeft className="w-4 h-4 text-emerald-500" />
                    ID orqali yulduz o'tkazish
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActionTab("withdraw");
                      setError("");
                      setSuccessMsg("");
                    }}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                      actionTab === "withdraw"
                        ? "bg-white text-blue-600 shadow-sm border border-slate-200/60"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Wallet className="w-4 h-4 text-blue-500" />
                    Pul yechib olish
                  </button>
                </div>

                {/* Feedback Alerts */}
                {error && (
                  <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200/80 flex items-start gap-3 text-red-700 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
                    <p>{error}</p>
                  </div>
                )}
                {successMsg && (
                  <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-3 text-emerald-800 text-sm">
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
                    <p>{successMsg}</p>
                  </div>
                )}

                {/* FORM 1: STAR TRANSFER VIA STUDENT ID */}
                {actionTab === "transfer" ? (
                  <form onSubmit={handleTransfer} className="space-y-5">
                    <div>
                      <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <ArrowRightLeft className="w-5 h-5 text-emerald-600" />
                        {t("rewards_transfer_title")}
                      </h2>
                      <p className="text-slate-500 text-xs sm:text-sm mt-1">
                        {t("rewards_transfer_sub")}
                      </p>
                    </div>

                    {!user?.is_premium && !user?.is_admin && (
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-emerald-200/80 flex items-center justify-center text-emerald-800 shrink-0">
                            <Zap className="w-5 h-5 fill-emerald-600 text-emerald-700" />
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm font-bold text-emerald-950">
                              {t("rewards_prem_banner_title")}
                            </p>
                            <p className="text-[11px] text-emerald-800">
                              {t("rewards_prem_banner_desc")}
                            </p>
                          </div>
                        </div>
                        <Link
                          href="/premium"
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-sm transition-all shrink-0"
                        >
                          {t("rewards_get_plus_btn")}
                        </Link>
                      </div>
                    )}

                    {/* Recipient Student ID input */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Qabul qiluvchining Student ID raqami
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={recipientStudentId}
                          onChange={(e) => {
                            const val = e.target.value.toUpperCase();
                            setRecipientStudentId(val);
                            handleLookupRecipient(val);
                          }}
                          placeholder="Masalan: T000002"
                          className={`${inputClass} font-mono font-bold uppercase text-base tracking-wider`}
                          maxLength={15}
                          required
                        />
                        {lookingUpRecipient && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                          </div>
                        )}
                      </div>

                      {/* Recipient lookup feedback */}
                      {recipientError && (
                        <p className="text-xs font-medium text-red-500 mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {recipientError}
                        </p>
                      )}

                      {recipientInfo && (
                        <div className="mt-3 p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl flex items-center gap-3">
                          <UserAvatar
                            studentId={recipientInfo.student_id}
                            avatarUrl={recipientInfo.avatar_url}
                            name={recipientInfo.full_name || recipientInfo.username}
                            size="sm"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-900">
                                {recipientInfo.full_name || recipientInfo.username}
                              </span>
                              <span className="font-mono text-[10px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded">
                                {recipientInfo.student_id}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">@{recipientInfo.username}</p>
                          </div>
                          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                            <Check className="w-4 h-4" /> Topildi
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Transfer Amount */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          O'tkaziladigan yulduzlar soni
                        </label>
                        <span className="text-xs text-slate-500">
                          Mavjud: <strong className="text-slate-800">{stars} ★</strong>
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          max={stars}
                          value={transferStars}
                          onChange={(e) => {
                            const v = e.target.value === "" ? "" : parseInt(e.target.value);
                            setTransferStars(v);
                          }}
                          placeholder="Miqdor (masalan: 10)"
                          className={`${inputClass} pr-12 text-base font-bold`}
                          required
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-amber-500 flex items-center gap-1">
                          <Star className="w-4 h-4 fill-amber-400" />
                        </div>
                      </div>

                      {/* Quick amount chips */}
                      <div className="flex gap-2 mt-2">
                        {[5, 10, 25, 50].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setTransferStars(amt)}
                            disabled={stars < amt}
                            className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors"
                          >
                            +{amt} ★
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setTransferStars(stars)}
                          disabled={stars <= 0}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-40 transition-colors"
                        >
                          Barchasi ({stars})
                        </button>
                      </div>
                    </div>

                    {/* Note / Message */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Izoh (ixtiyoriy)
                      </label>
                      <input
                        type="text"
                        value={transferNote}
                        onChange={(e) => setTransferNote(e.target.value)}
                        placeholder="Masalan: Konspekt uchun katta rahmat!"
                        className={inputClass}
                        maxLength={150}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting || stars <= 0 || !recipientStudentId || !transferStars}
                      className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm sm:text-base shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                      Yulduzlarni darhol o'tkazish
                    </button>
                  </form>
                ) : (
                  /* FORM 2: WITHDRAWAL */
                  <form onSubmit={handleWithdraw} className="space-y-5">
                    <div>
                      <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-blue-600" />
                        {t("withdraw")}
                      </h2>
                      <p className="text-slate-500 text-xs sm:text-sm mt-1">
                        {t("withdraw_min")} (100 yulduz = 10 000 so'm). So'rov 24 soat ichida administrator tomonidan to'lanadi.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        {t("withdraw_method")}
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setMethod("card")}
                          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border font-bold text-sm transition-all ${
                            method === "card"
                              ? "border-blue-500 bg-blue-50/80 text-blue-700 shadow-sm"
                              : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          <CreditCard className="w-4 h-4" />
                          {t("method_card")}
                        </button>
                        <button
                          type="button"
                          onClick={() => setMethod("phone")}
                          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border font-bold text-sm transition-all ${
                            method === "phone"
                              ? "border-blue-500 bg-blue-50/80 text-blue-700 shadow-sm"
                              : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          <Phone className="w-4 h-4" />
                          {t("method_phone")}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        {method === "card" ? t("card_number") : t("phone_number")}
                      </label>
                      <div className="relative">
                        {method === "card" ? (
                          <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        ) : (
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        )}
                        <input
                          value={target}
                          onChange={(e) => setTarget(e.target.value)}
                          className={`${inputClass} pl-12 text-sm font-medium`}
                          placeholder={
                            method === "card"
                              ? t("card_number_placeholder")
                              : t("phone_number_placeholder")
                          }
                          inputMode={method === "card" ? "numeric" : "tel"}
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting || stars < 100}
                      className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm sm:text-base shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                      {t("withdraw_btn")}
                    </button>
                  </form>
                )}
              </div>

              {/* History Column (5 cols) */}
              <div className="lg:col-span-5 bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <History className="w-5 h-5 text-slate-600" />
                    Amallar Tarixi
                  </h3>
                  
                  {/* Tab switches for history */}
                  <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200/60 text-xs font-bold">
                    <button
                      onClick={() => setHistoryTab("transfers")}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        historyTab === "transfers"
                          ? "bg-white text-emerald-600 shadow-sm"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      O'tkazmalar ({transfers.length})
                    </button>
                    <button
                      onClick={() => setHistoryTab("withdrawals")}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        historyTab === "withdrawals"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      Pul yechish ({history.length})
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div className="py-12 flex justify-center">
                    <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
                  </div>
                ) : historyTab === "transfers" ? (
                  /* Transfers List */
                  transfers.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-sm">
                      Hali yulduzlar o'tkazilmagan
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                      {transfers.map((t) => {
                        const isSent = t.sender_id === user?.id;
                        return (
                          <div
                            key={t.id}
                            className="p-3.5 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3 transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                  isSent
                                    ? "bg-red-50 text-red-500"
                                    : "bg-emerald-50 text-emerald-600"
                                }`}
                              >
                                {isSent ? (
                                  <ArrowUpRight className="w-5 h-5" />
                                ) : (
                                  <ArrowDownLeft className="w-5 h-5" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-900 truncate">
                                  {isSent ? (
                                    <>
                                      Yuborildi: <span className="text-emerald-700">{t.recipient_username}</span>{" "}
                                      <span className="font-mono text-[10px] text-slate-400">({t.recipient_student_id})</span>
                                    </>
                                  ) : (
                                    <>
                                      Keldi: <span className="text-blue-700">{t.sender_username}</span>{" "}
                                      <span className="font-mono text-[10px] text-slate-400">({t.sender_student_id})</span>
                                    </>
                                  )}
                                </p>
                                {t.note && (
                                  <p className="text-[11px] text-slate-500 italic truncate mt-0.5">
                                    "{t.note}"
                                  </p>
                                )}
                                <p className="text-[10px] text-slate-400 mt-0.5">
                                  {new Date(t.created_at).toLocaleDateString()}{" "}
                                  {new Date(t.created_at).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                            </div>

                            <span
                              className={`text-sm font-black shrink-0 ${
                                isSent ? "text-red-500" : "text-emerald-600"
                              }`}
                            >
                              {isSent ? "-" : "+"}
                              {t.stars} ★
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )
                ) : (
                  /* Withdrawals List */
                  history.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-sm">
                      {t("empty_state")}
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                      {history.map((w) => (
                        <div
                          key={w.id}
                          className="flex items-center justify-between border border-slate-100 rounded-2xl p-3.5 bg-slate-50/50"
                        >
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 text-sm">
                              {new Intl.NumberFormat("uz-UZ").format(w.amount)} so'm
                            </p>
                            <p className="text-xs text-slate-500 truncate mt-0.5">
                              {w.method === "card" ? t("method_card") : t("method_phone")} · {w.target}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {new Date(w.created_at).toLocaleDateString()} · {w.stars_spent} ★
                            </p>
                          </div>
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                              w.status === "paid"
                                ? "bg-emerald-50 text-emerald-600"
                                : w.status === "rejected"
                                ? "bg-red-50 text-red-500"
                                : "bg-amber-50 text-amber-600"
                            }`}
                          >
                            {w.status === "paid" ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : w.status === "rejected" ? (
                              <XCircle className="w-3.5 h-3.5" />
                            ) : (
                              <Clock className="w-3.5 h-3.5" />
                            )}
                            {t((statusLabels[w.status] || "status_pending") as TranslationKey)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>

            </div>

          </div>
        </main>
        <AIChat />
      </div>
    </RequireAuth>
  );
}