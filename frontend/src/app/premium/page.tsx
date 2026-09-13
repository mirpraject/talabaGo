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
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

type SubscriptionStatus = {
  is_premium: boolean;
  premium_expires: string | null;
  plan: {
    name: string;
    price_uzs: number;
    duration_days: number;
    features: string[];
  };
};

export default function PremiumPage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<"click" | "payme" | "uzum">("click");
  const [successNotice, setSuccessNotice] = useState(false);
  const [errorNotice, setErrorNotice] = useState("");

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await api.get<SubscriptionStatus>("/api/subscription/status");
        setStatus(res);
      } catch (err) {
        console.error("Error loading subscription status:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();
  }, []);

  async function handleSubscribe() {
    setErrorNotice("");
    setPurchasing(true);
    try {
      const res = await api.post<SubscriptionStatus>("/api/subscription/purchase", {
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

  const isPremiumActive = Boolean(status?.is_premium || user?.is_premium);

  return (
    <RequireAuth>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />

        <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto space-y-12">
            {/* Hero Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/80 border border-amber-300/80 text-amber-900 text-xs font-bold tracking-wide uppercase shadow-sm">
                <Crown className="w-4 h-4 text-amber-600 fill-amber-500 animate-pulse" />
                TalabaGo VIP Imtiyozlari
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                TalabaGo <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">PREMIUM</span>
              </h1>

              <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600">
                Testlarda 2.4 barobar ko'proq yulduzcha ishlang, do'stlaringizga yulduz o'tkazing va platformada Python, Django, Algoritmlarni amaliy o'rganing!
              </p>
            </div>

            {/* Success Notice */}
            {successNotice && (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-4 shadow-sm animate-in fade-in">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-emerald-800">
                    Tabriklaymiz! Sizning Premium obunangiz muvaffaqiyatli faollashtirildi! 🎉
                  </h3>
                  <p className="text-sm text-emerald-700">
                    Barcha imtiyozlar (1.2⭐ yulduzcha tezligi, do'stlarga o'tkazish, dasturlash laboratoriyasi) tayyor.
                  </p>
                  <div className="pt-2 flex gap-3">
                    <Link
                      href="/learning"
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow"
                    >
                      <Code2 className="w-3.5 h-3.5" /> Dasturlashni boshlash
                    </Link>
                    <Link
                      href="/rewards"
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white text-emerald-800 border border-emerald-300 text-xs font-semibold rounded-lg hover:bg-emerald-100/50 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" /> Yulduz o'tkazish
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* If Already Premium */}
            {isPremiumActive && !successNotice && (
              <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-xl shadow-amber-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                    <Crown className="w-9 h-9 text-amber-200 fill-amber-200" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/25 text-[11px] font-extrabold uppercase tracking-wider mb-1">
                      <Sparkles className="w-3 h-3" /> Faol Obuna
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black">
                      Siz TalabaGo Premium egasisiz!
                    </h2>
                    <p className="text-amber-100 text-xs sm:text-sm">
                      {status?.premium_expires ? (
                        <>Muddati: {new Date(status.premium_expires).toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric" })} gacha faol</>
                      ) : (
                        "Faol Premium obuna"
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSubscribe}
                    disabled={purchasing}
                    className="px-5 py-2.5 rounded-xl bg-white text-amber-700 hover:bg-amber-50 font-bold text-sm shadow-md transition-all flex items-center gap-2 hover:scale-105 active:scale-95 disabled:opacity-50"
                  >
                    {purchasing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />}
                    Yana 1 oyga uzaytirish (15 000 so'm)
                  </button>
                </div>
              </div>
            )}

            {/* Pricing Card & Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Feature comparison table (8 cols) */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    Oddiy vs Premium Taqqoslash
                  </h3>

                  <div className="space-y-4">
                    {/* Row 1: Stars */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                          Testlarda yulduzcha stavkasi
                        </div>
                        <p className="text-xs text-slate-500">Har bir to'g'ri javob uchun taqdim etiladigan yulduz</p>
                      </div>
                      <div className="flex items-center gap-4 text-xs shrink-0">
                        <div className="text-slate-400 font-medium line-through">0.5 ⭐</div>
                        <div className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 font-extrabold text-sm border border-amber-300">
                          1.2 ⭐
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Star Transfers */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                          <Send className="w-4 h-4 text-indigo-500" />
                          Yulduzlarni do'stlarga o'tkazish
                        </div>
                        <p className="text-xs text-slate-500">Student ID orqali kursdoshlarga yulduz yuborish</p>
                      </div>
                      <div className="flex items-center gap-4 text-xs shrink-0">
                        <div className="text-rose-500 font-semibold">Yopiq ✕</div>
                        <div className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300">
                          Cheksiz ✓
                        </div>
                      </div>
                    </div>

                    {/* Row 3: Programming Track */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                          <Terminal className="w-4 h-4 text-blue-500" />
                          Python, Django va Algoritmlar
                        </div>
                        <p className="text-xs text-slate-500">Amaliy darslar, tushuntirishlar va topshiriqlar</p>
                      </div>
                      <div className="flex items-center gap-4 text-xs shrink-0">
                        <div className="text-slate-400 font-medium">Faqat 1-dars</div>
                        <div className="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-800 font-bold text-xs border border-indigo-300">
                          To'liq ochiq ✓
                        </div>
                      </div>
                    </div>

                    {/* Row 4: Code Sandbox */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                          <Code2 className="w-4 h-4 text-emerald-500" />
                          Sayt ichida kod yozish va tekshirish
                        </div>
                        <p className="text-xs text-slate-500">Interaktiv dasturlash laboratoriyasi (Code Runner)</p>
                      </div>
                      <div className="flex items-center gap-4 text-xs shrink-0">
                        <div className="text-rose-500 font-semibold">Yopiq ✕</div>
                        <div className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300">
                          To'liq ochiq ✓
                        </div>
                      </div>
                    </div>

                    {/* Row 5: VIP Status */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                          <Crown className="w-4 h-4 text-amber-500 fill-amber-400" />
                          Oltin VIP Nishon (Reytingda ustunlik)
                        </div>
                        <p className="text-xs text-slate-500">Profil va liderlar jadvalida oltin toj nishoni</p>
                      </div>
                      <div className="flex items-center gap-4 text-xs shrink-0">
                        <div className="text-slate-400 font-medium">Yo'q</div>
                        <div className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 font-bold text-xs border border-amber-300">
                          Mavjud 👑
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Xavfsiz to'lov va 100% kafolat
                  </span>
                  <span>Bir martalik to'lov • Avtomatik yechilmaydi</span>
                </div>
              </div>

              {/* Purchase Card (5 cols) */}
              <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 rounded-3xl p-7 sm:p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between border border-slate-800">
                {/* Glow effect */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-56 h-56 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                      <Crown className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      1 oylik obuna
                    </div>
                    <span className="text-xs text-slate-400">Atigi</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                        15,000
                      </span>
                      <span className="text-lg text-amber-400 font-bold">so'm</span>
                      <span className="text-xs text-slate-400">/ oyiga</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Barcha imtiyozlar 30 kunga to'liq beriladi.
                    </p>
                  </div>

                  {/* Payment Methods */}
                  <div className="space-y-2.5 pt-2">
                    <label className="text-xs font-semibold text-slate-300 block">
                      To'lov tizimini tanlang:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "click", name: "Click", color: "from-blue-600 to-cyan-600" },
                        { id: "payme", name: "Payme", color: "from-teal-600 to-emerald-600" },
                        { id: "uzum", name: "Uzum", color: "from-purple-600 to-pink-600" },
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setSelectedMethod(m.id as any)}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                            selectedMethod === m.id
                              ? "bg-white/15 border-amber-400 text-white shadow-lg shadow-amber-500/10 scale-102"
                              : "bg-white/5 border-slate-700 text-slate-400 hover:bg-white/10"
                          }`}
                        >
                          <span>{m.name}</span>
                          {selectedMethod === m.id && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Feature summary bullets */}
                  <div className="space-y-2.5 text-xs text-slate-300 pt-2">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Har to'g'ri javobga <strong>1.2 ⭐ yulduz</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Do'stlarga yulduzcha o'tkazish imkoniyati</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Python, Django, Algoritmlar amaliyoti</span>
                    </div>
                  </div>

                  {errorNotice && (
                    <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs">
                      {errorNotice}
                    </div>
                  )}
                </div>

                <div className="relative z-10 pt-6 space-y-3">
                  <button
                    onClick={handleSubscribe}
                    disabled={purchasing}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {purchasing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        To'lov bajarilmoqda...
                      </>
                    ) : (
                      <>
                        <Crown className="w-5 h-5 fill-slate-950" />
                        {isPremiumActive ? "Obunani uzaytirish (15 000 so'm)" : "15 000 so'mga Premium olish"}
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-slate-400">
                    To'lov bir zumda hisobingizga biriktiriladi.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick action banners */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link
                href="/learning"
                className="group p-6 rounded-3xl bg-white border border-slate-200/80 hover:border-indigo-400 hover:shadow-lg transition-all flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                    <Code2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                      Dasturlash Laboratoriyasiga o'tish
                    </h4>
                    <p className="text-xs text-slate-500">
                      Python, Django va Algoritmlarni sayt ichida amalda bajaring
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all shrink-0" />
              </Link>

              <Link
                href="/rewards"
                className="group p-6 rounded-3xl bg-white border border-slate-200/80 hover:border-amber-400 hover:shadow-lg transition-all flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                    <Send className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base group-hover:text-amber-600 transition-colors">
                      Yulduzchalarni do'stlarga o'tkazish
                    </h4>
                    <p className="text-xs text-slate-500">
                      Student ID raqami bo'yicha tezkor yulduz o'tkazmalari
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all shrink-0" />
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </RequireAuth>
  );
}
