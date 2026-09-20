"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Crown,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  Star,
  Send,
  Code2,
  Terminal,
  Loader2,
  Check,
  Shield,
  Layers,
} from "lucide-react";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/lib/api";
import { getTierConfig, SubscriptionTier } from "@/lib/subscription";

type PlanInfo = {
  tier: "free" | "plus" | "plus_plus";
  name: string;
  badge: string;
  price_uzs: number;
  star_rate: number;
  test_limit: number | null;
  duration_days: number;
  color: string;
  hex: string;
  features: string[];
};

type SubscriptionStatus = {
  is_premium: boolean;
  subscription_tier: "free" | "plus" | "plus_plus";
  tier_name: string;
  star_rate: number;
  tests_taken: number;
  test_limit: number | null;
  premium_expires: string | null;
  plans: PlanInfo[];
  current_plan: PlanInfo;
};

export default function PremiumPage() {
  const { user, refreshUser } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [selectedTier, setSelectedTier] = useState<"plus" | "plus_plus">("plus_plus");
  const [selectedMethod, setSelectedMethod] = useState<"click" | "payme" | "uzum">("click");
  const [successNotice, setSuccessNotice] = useState(false);
  const [errorNotice, setErrorNotice] = useState("");

  const currentTier = (user?.subscription_tier || status?.subscription_tier || "free") as SubscriptionTier;
  const userTierConfig = getTierConfig(user);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await api.get<SubscriptionStatus>("/api/subscription/status");
        setStatus(res);
        if (res.subscription_tier === "plus") {
          setSelectedTier("plus_plus");
        }
      } catch (err) {
        console.error("Error loading subscription status:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();
  }, []);

  async function handleSubscribe(targetTier: "plus" | "plus_plus") {
    setErrorNotice("");
    setPurchasing(true);
    try {
      const res = await api.post<SubscriptionStatus>("/api/subscription/purchase", {
        tier: targetTier,
        payment_method: selectedMethod,
      });
      setStatus(res);
      await refreshUser();
      setSuccessNotice(true);
    } catch (err: any) {
      setErrorNotice(err?.message || "To'lov jarayonida xatolik yuz berdi");
    } finally {
      setPurchasing(false);
    }
  }

  const selectedTierPrice = selectedTier === "plus_plus" ? 65000 : 40000;

  return (
    <RequireAuth>
      <div className="w-full text-slate-100 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Hero Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide uppercase shadow-sm">
              <Crown className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
              {t("prem_badge")}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {t("prem_hero_title")} <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">{t("prem_hero_highlight")}</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400">
              {t("prem_hero_sub")}
            </p>
          </div>

          {/* Success Notice */}
          {successNotice && (
            <div className="p-5 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 flex items-start gap-4 shadow-xl backdrop-blur-md animate-in fade-in">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="font-bold text-base text-white">
                  {t("prem_congrats_title")}
                </h3>
                <p className="text-sm text-emerald-300/90">
                  {t("prem_congrats_desc")}
                </p>
                <div className="pt-2 flex gap-3">
                  <Link
                    href="/tests"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded-xl hover:bg-emerald-400 transition-colors shadow"
                  >
                    {t("prem_start_tests")}
                  </Link>
                  <Link
                    href="/profile"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/10 text-white border border-white/20 text-xs font-semibold rounded-xl hover:bg-white/20 transition-colors"
                  >
                    {t("prem_view_profile")}
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Current Active Plan Banner (if user has active status) */}
          <div className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6 ${userTierConfig.cardBg} ${userTierConfig.borderClass}`}>
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black ${userTierConfig.avatarRing} bg-zinc-900 shadow-xl`}>
                {userTierConfig.tier === "plus_plus" ? (
                  <Crown className="w-8 h-8 text-amber-400 fill-amber-400" />
                ) : userTierConfig.tier === "plus" ? (
                  <Zap className="w-8 h-8 text-emerald-400 fill-emerald-400" />
                ) : (
                  <Shield className="w-8 h-8 text-slate-400" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase border ${userTierConfig.badgeClass}`}>
                    {t("prem_current_plan")}: {userTierConfig.name}
                  </span>
                  <span className="text-xs text-slate-400">
                    • {userTierConfig.starRate}⭐ {t("prem_star_rate_label")}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {userTierConfig.tier === "plus_plus"
                    ? t("prem_plan_plus_plus")
                    : userTierConfig.tier === "plus"
                    ? t("prem_plan_plus")
                    : t("prem_plan_free")}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t("prem_tests_used")}: <strong className={userTierConfig.textClass}>{user?.tests_taken || 0}</strong> {userTierConfig.testLimit !== null ? `/ ${userTierConfig.testLimit}` : `(${t("prem_unlimited")})`}
                </p>
              </div>
            </div>

            {userTierConfig.tier !== "plus_plus" && (
              <button
                onClick={() => setSelectedTier("plus_plus")}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Crown className="w-4 h-4 fill-slate-950" />
                {t("prem_upgrade_btn")}
              </button>
            )}
          </div>

          {/* 3 Pricing Cards Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {/* 1. Oddiy (Free) Plan */}
            <div className={`rounded-3xl border p-7 flex flex-col justify-between transition-all duration-300 relative ${
              currentTier === "free"
                ? "bg-slate-900/90 border-slate-600 shadow-xl shadow-slate-950/60 ring-2 ring-slate-500/30"
                : "bg-slate-900/50 border-white/5 hover:border-white/15"
            }`}>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {t("prem_free_badge")}
                  </span>
                  {currentTier === "free" && (
                    <span className="text-[11px] font-extrabold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md">
                      {t("prem_free_active")}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-white">{t("prem_free_title")}</h3>
                  <p className="text-xs text-slate-400">{t("prem_free_sub")}</p>
                </div>

                <div className="flex items-baseline gap-1.5 pb-4 border-b border-white/5">
                  <span className="text-4xl font-black text-white">0</span>
                  <span className="text-sm font-bold text-slate-400">so&apos;m</span>
                  <span className="text-xs text-slate-500">/ {t("prem_free_price")}</span>
                </div>

                {/* Key specs */}
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.03]">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                    <div>
                      <span className="font-bold text-white block">{t("prem_free_star_title")}</span>
                      <span className="text-[11px] text-slate-400">{t("prem_free_star_sub")}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.03]">
                    <Layers className="w-4 h-4 text-blue-400 shrink-0" />
                    <div>
                      <span className="font-bold text-white block">{t("prem_free_test_title")}</span>
                      <span className="text-[11px] text-slate-400">{t("prem_free_test_sub")}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.03]">
                    <Shield className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="font-bold text-white block">{t("prem_free_profile_title")}</span>
                      <span className="text-[11px] text-slate-400">{t("prem_free_profile_sub")}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/5">
                <button
                  disabled
                  className="w-full py-3 rounded-2xl bg-white/5 text-slate-400 text-xs font-bold cursor-not-allowed border border-white/5"
                >
                  {currentTier === "free" ? t("prem_free_btn_current") : t("prem_free_btn_default")}
                </button>
              </div>
            </div>

            {/* 2. TalabaGo Plus (40 000 so'm) */}
            <div className={`rounded-3xl border p-7 flex flex-col justify-between transition-all duration-300 relative ${
              selectedTier === "plus"
                ? "bg-gradient-to-b from-emerald-950/60 via-slate-900 to-slate-950 border-emerald-500/60 shadow-2xl shadow-emerald-950/60 ring-2 ring-emerald-500/50 scale-[1.02]"
                : "bg-slate-900/60 border-emerald-500/20 hover:border-emerald-500/40"
            }`}>
              {/* Top tag */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30">
                  {t("prem_plus_popular")}
                </span>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    TalabaGo Plus
                  </span>
                  {currentTier === "plus" && (
                    <span className="text-[11px] font-extrabold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/30">
                      {t("prem_plus_active")}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-white">TalabaGo Plus</h3>
                  <p className="text-xs text-slate-400">{t("prem_plus_sub")}</p>
                </div>

                <div className="flex items-baseline gap-1.5 pb-4 border-b border-white/5">
                  <span className="text-4xl sm:text-5xl font-black text-white">40,000</span>
                  <span className="text-sm font-bold text-emerald-400">so&apos;m</span>
                  <span className="text-xs text-slate-400">{t("prem_plus_per_month")}</span>
                </div>

                {/* Key specs */}
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <Star className="w-4 h-4 text-emerald-400 fill-emerald-400 shrink-0" />
                    <div>
                      <span className="font-bold text-emerald-300 block">{t("prem_plus_star_title")}</span>
                      <span className="text-[11px] text-slate-400">{t("prem_plus_star_sub")}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400 shrink-0" />
                    <div>
                      <span className="font-bold text-emerald-300 block">{t("prem_plus_test_title")}</span>
                      <span className="text-[11px] text-slate-400">{t("prem_plus_test_sub")}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="font-bold text-emerald-300 block">{t("prem_plus_profile_title")}</span>
                      <span className="text-[11px] text-slate-400">{t("prem_plus_profile_sub")}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-300 pt-1">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{t("prem_plus_feat_stars")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{t("prem_plus_feat_coding")}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTier("plus");
                    handleSubscribe("plus");
                  }}
                  disabled={purchasing || currentTier === "plus"}
                  className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {purchasing && selectedTier === "plus" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4 fill-slate-950" />
                  )}
                  {currentTier === "plus" ? t("prem_plus_btn_current") : t("prem_plus_btn_buy")}
                </button>
              </div>
            </div>

            {/* 3. TalabaGo Plus+ (65 000 so'm) */}
            <div className={`rounded-3xl border p-7 flex flex-col justify-between transition-all duration-300 relative ${
              selectedTier === "plus_plus"
                ? "bg-gradient-to-b from-amber-950/60 via-purple-950/40 to-slate-950 border-amber-400/80 shadow-2xl shadow-amber-950/70 ring-2 ring-amber-400/60 scale-[1.02]"
                : "bg-slate-900/60 border-amber-500/30 hover:border-amber-400/50"
            }`}>
              {/* Crown Tag */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 shadow-md shadow-amber-500/30 flex items-center gap-1">
                  <Crown className="w-3 h-3 fill-slate-950" />
                  {t("prem_plusplus_vip")}
                </span>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-amber-300 border border-amber-400/40">
                    TalabaGo Plus+
                  </span>
                  {currentTier === "plus_plus" && (
                    <span className="text-[11px] font-extrabold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-400/40">
                      {t("prem_plusplus_active")}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-white flex items-center gap-2">
                    <span>TalabaGo Plus+</span>
                    <Crown className="w-5 h-5 text-amber-400 fill-amber-400" />
                  </h3>
                  <p className="text-xs text-slate-400">{t("prem_plusplus_sub")}</p>
                </div>

                <div className="flex items-baseline gap-1.5 pb-4 border-b border-white/5">
                  <span className="text-4xl sm:text-5xl font-black text-white">65,000</span>
                  <span className="text-sm font-bold text-amber-400">so&apos;m</span>
                  <span className="text-xs text-slate-400">{t("prem_plus_per_month")}</span>
                </div>

                {/* Key specs */}
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                    <div>
                      <span className="font-bold text-amber-300 block">{t("prem_plusplus_star_title")}</span>
                      <span className="text-[11px] text-slate-400">{t("prem_plusplus_star_sub")}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <Crown className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                    <div>
                      <span className="font-bold text-amber-300 block">{t("prem_plusplus_test_title")}</span>
                      <span className="text-[11px] text-slate-400">{t("prem_plusplus_test_sub")}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="font-bold text-amber-300 block">{t("prem_plusplus_profile_title")}</span>
                      <span className="text-[11px] text-slate-400">{t("prem_plusplus_profile_sub")}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-300 pt-1">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{t("prem_plusplus_feat_stars")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-300">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{t("prem_plusplus_feat_coding")}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTier("plus_plus");
                    handleSubscribe("plus_plus");
                  }}
                  disabled={purchasing || currentTier === "plus_plus"}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 hover:from-amber-400 hover:to-orange-300 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {purchasing && selectedTier === "plus_plus" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Crown className="w-4 h-4 fill-slate-950" />
                  )}
                  {currentTier === "plus_plus" ? t("prem_plusplus_btn_current") : t("prem_plusplus_btn_buy")}
                </button>
              </div>
            </div>
          </div>

          {/* Payment Method Selector & Guarantee */}
          <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {t("prem_pay_method")}
              </span>
              <div className="flex items-center gap-3">
                {[
                  { id: "click", name: "Click Up" },
                  { id: "payme", name: "Payme" },
                  { id: "uzum", name: "Uzum Bank" },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMethod(m.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      selectedMethod === m.id
                        ? "bg-white text-slate-950 border-white shadow-md"
                        : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold text-white">{t("prem_secure_title")}</p>
                <p className="text-[11px]">{t("prem_secure_sub")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
