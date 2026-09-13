"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  LogIn,
  UserPlus,
  Loader2,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Check,
  Star,
  Zap,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Logo from "@/components/Logo";

export default function AuthModal() {
  const {
    authModalOpen,
    authModalMode,
    authRedirectPath,
    closeAuthModal,
    setAuthModalMode,
    login,
    register,
  } = useAuth();

  // Login form state
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);

  // Register form state
  const [regFullName, setRegFullName] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPhone, setRegPhone] = useState("+998 ");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPass, setShowRegPass] = useState(false);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Reset errors and fields on mode change or open
  useEffect(() => {
    setError("");
  }, [authModalMode, authModalOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && authModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [authModalOpen, closeAuthModal]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (authModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [authModalOpen]);

  // Password requirements for register
  const requirements = [
    { ok: regPassword.length >= 8, label: "Kamida 8 ta belgi" },
    { ok: /[A-Z]/.test(regPassword), label: "Katta harf (A-Z)" },
    { ok: /[a-z]/.test(regPassword), label: "Kichik harf (a-z)" },
    { ok: /\d/.test(regPassword), label: "Raqam (0-9)" },
  ];
  const allRequirementsOk = requirements.every((r) => r.ok);

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!loginUser.trim() || !loginPass.trim()) {
      setError("Login va parolni kiriting");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const loggedUser = await login(loginUser.trim(), loginPass.trim(), authRedirectPath || "/files");
      closeAuthModal();
      if (loggedUser.is_admin) {
        window.location.href = "/admin";
      } else {
        window.location.href = authRedirectPath || "/files";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kirishda xatolik");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRegisterSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!regFullName.trim()) {
      setError("Ismingizni kiriting");
      return;
    }
    if (!regUsername.trim() || regUsername.length < 3) {
      setError("Login kamida 3 ta belgidan iborat bo'lishi kerak");
      return;
    }
    if (!allRequirementsOk) {
      setError("Parol barcha xavfsizlik talablariga javob berishi shart");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setError("Parollar bir-biriga mos kelmadi");
      return;
    }

    setSubmitting(true);
    try {
      const cleanPhone = regPhone.replace(/\s+/g, "");
      const phoneToSend = cleanPhone.length > 4 ? regPhone.trim() : undefined;

      await register({
        username: regUsername.trim(),
        full_name: regFullName.trim(),
        phone: phoneToSend,
        password: regPassword,
      });
      closeAuthModal();
      window.location.href = authRedirectPath || "/files";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ro'yxatdan o'tishda xatolik");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeAuthModal}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden my-auto grid grid-cols-1 md:grid-cols-12 z-10"
          >
            {/* Close Button */}
            <button
              onClick={closeAuthModal}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:text-slate-300 transition-colors flex items-center justify-center z-30 cursor-pointer shadow-sm"
              title="Yopish"
            >
              <X className="w-5 h-5" />
            </button>

            {/* ============================================================== */}
            {/* LEFT COLUMN: ANIMATED SITE ILLUSTRATION & GRAPHIC MOCKUP */}
            {/* ============================================================== */}
            <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 flex flex-col justify-between overflow-hidden md:col-span-5 border-b md:border-b-0 md:border-r border-slate-800">
              {/* Dynamic Animated Glow Orbs */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                  className="absolute -top-10 -left-10 w-44 h-44 bg-blue-600/30 rounded-full blur-3xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute bottom-10 -right-10 w-48 h-48 bg-emerald-500/25 rounded-full blur-3xl"
                  animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute top-1/2 left-1/4 w-32 h-32 bg-purple-600/20 rounded-full blur-2xl"
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Subtle tech grid mesh */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:2.5rem_2.5rem]" />
              </div>

              {/* Brand Logo & Headline */}
              <div className="relative z-10">
                <div className="mb-4">
                  <Logo size="md" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-[11px] font-bold tracking-wide mb-4 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  Yagona Akademik Platforma
                </div>
                <h3 className="text-xl sm:text-2xl font-black leading-tight text-white mb-2">
                  TalabaGo ga xush kelibsiz!
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  OTM materiallari, nazorat testlari va talabalar uchun yulduzlar tizimi.
                </p>
              </div>

              {/* Floating Animated Graphic Cards (Site Simulation) */}
              <div className="relative z-10 my-6 space-y-3">
                {/* Float Card 1: Materiallar */}
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                  className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-xl flex items-center gap-3 hover:bg-white/15 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/30 shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">50 000+ Konspekt & Darslik</div>
                    <div className="text-[10px] text-slate-300 truncate">Oraliq va yakuniy nazorat biletlari</div>
                  </div>
                </motion.div>

                {/* Float Card 2: Yulduzlar & Real Daromad */}
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-amber-400/30 shadow-xl flex items-center gap-3 hover:bg-white/15 transition-all ml-2"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/30 shrink-0">
                    <Star className="w-5 h-5 fill-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-amber-200 truncate">Yulduzlar va Real Daromad</div>
                    <div className="text-[10px] text-slate-300 truncate">100 ★ = 10 000 so&apos;m kartaga naqd</div>
                  </div>
                </motion.div>

                {/* Float Card 3: Interaktiv Testlar */}
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3.9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-emerald-400/30 shadow-xl flex items-center gap-3 hover:bg-white/15 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/30 shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-emerald-200 truncate">Interaktiv Test Tizimi</div>
                    <div className="text-[10px] text-slate-300 truncate">Haqiqiy biletlar va avtomatik ball</div>
                  </div>
                </motion.div>
              </div>

              {/* Bottom Guarantee */}
              <div className="relative z-10 pt-4 border-t border-white/10 flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Bepul, xavfsiz va tezkor kirish</span>
              </div>
            </div>

            {/* ============================================================== */}
            {/* RIGHT COLUMN: INTERACTIVE FORM (LOGIN & REGISTER TABS) */}
            {/* ============================================================== */}
            <div className="p-6 sm:p-8 flex flex-col justify-center md:col-span-7 bg-white dark:bg-slate-900">
              {/* Top Segmented Mode Tabs */}
              <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6 max-w-sm mx-auto w-full">
                <button
                  type="button"
                  onClick={() => setAuthModalMode("login")}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    authModalMode === "login"
                      ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm font-extrabold"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Kirish
                </button>
                <button
                  type="button"
                  onClick={() => setAuthModalMode("register")}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    authModalMode === "register"
                      ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm font-extrabold"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Ro&apos;yxatdan o&apos;tish
                </button>
              </div>

              {/* Heading */}
              <div className="mb-5 text-left">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {authModalMode === "login" ? "Tizimga kirish" : "Yangi talaba hisobi"}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {authModalMode === "login"
                    ? "O'quv materiallar va testlardan to'liq foydalanish uchun kiring"
                    : "TalabaGo ga qo'shiling va bepul foydalanishni boshlang"}
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs font-medium flex items-start gap-2"
                >
                  <span className="font-bold shrink-0">⚠️</span>
                  <span>{error}</span>
                </motion.div>
              )}

              {/* ======================= LOGIN FORM ======================= */}
              {authModalMode === "login" && (
                <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Login (Foydalanuvchi nomi) *
                    </label>
                    <input
                      type="text"
                      required
                      value={loginUser}
                      onChange={(e) => setLoginUser(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-600 dark:focus:border-indigo-400 transition-all placeholder:text-slate-400"
                      placeholder="Login yoki username"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Parol *
                    </label>
                    <div className="relative">
                      <input
                        type={showLoginPass ? "text" : "password"}
                        required
                        value={loginPass}
                        onChange={(e) => setLoginPass(e.target.value)}
                        className="w-full px-4 py-2.5 pr-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-600 dark:focus:border-indigo-400 transition-all placeholder:text-slate-400"
                        placeholder="Parolingiz"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPass(!showLoginPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
                      >
                        {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <LogIn className="w-4 h-4" />
                    )}
                    Tizimga kirish
                  </button>

                  <p className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2">
                    Hisobingiz yo&apos;qmi?{" "}
                    <button
                      type="button"
                      onClick={() => setAuthModalMode("register")}
                      className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                    >
                      Ro&apos;yxatdan o&apos;tish
                    </button>
                  </p>
                </form>
              )}

              {/* ===================== REGISTER FORM ===================== */}
              {authModalMode === "register" && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3 text-left">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Ism va familiya *
                    </label>
                    <input
                      type="text"
                      required
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-600 dark:focus:border-indigo-400 transition-all placeholder:text-slate-400"
                      placeholder="Masalan: Azizbek Karimov"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Login (Foydalanuvchi nomi) *
                      </label>
                      <input
                        type="text"
                        required
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                        className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-600 dark:focus:border-indigo-400 transition-all placeholder:text-slate-400 font-mono"
                        placeholder="azizbek01"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Telefon raqam
                      </label>
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-600 dark:focus:border-indigo-400 transition-all placeholder:text-slate-400 font-mono"
                        placeholder="+998 90 123 45 67"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Parol *
                      </label>
                      <div className="relative">
                        <input
                          type={showRegPass ? "text" : "password"}
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className="w-full px-3.5 py-2 pr-9 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-600 dark:focus:border-indigo-400 transition-all placeholder:text-slate-400"
                          placeholder="Kamida 8 ta belgi"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPass(!showRegPass)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
                        >
                          {showRegPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Parolni tasdiqlang *
                      </label>
                      <input
                        type={showRegPass ? "text" : "password"}
                        required
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-600 dark:focus:border-indigo-400 transition-all placeholder:text-slate-400"
                        placeholder="Parolni qayta kiriting"
                      />
                    </div>
                  </div>

                  {/* Real-time requirements */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 grid grid-cols-2 gap-1.5 text-[10px]">
                    {requirements.map((r, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-1.5 ${
                          r.ok ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-400"
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] ${
                          r.ok ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                        }`}>
                          {r.ok ? "✓" : "•"}
                        </span>
                        <span>{r.label}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <UserPlus className="w-4 h-4" />
                    )}
                    Ro&apos;yxatdan o&apos;tish (100% Bepul)
                  </button>

                  <p className="text-center text-xs text-slate-500 dark:text-slate-400 pt-1">
                    Allaqachon a&apos;zomisiz?{" "}
                    <button
                      type="button"
                      onClick={() => setAuthModalMode("login")}
                      className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                    >
                      Tizimga kirish
                    </button>
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
