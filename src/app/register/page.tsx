"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UserPlus, Loader2, Check, X, User, AtSign, Phone, Eye, EyeOff, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import Logo from "@/components/Logo";


export default function RegisterPage() {
  const { register } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("+998 ");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(true);

  const [isSuccess, setIsSuccess] = useState(false);
  const [successFullName, setSuccessFullName] = useState("");

  useEffect(() => {
    setFullName("");
    setUsername("");
    setPhone("+998 ");
    setPassword("");
    setConfirmPassword("");
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("reason") === "auth_required") {
        setAuthRequiredNotice(true);
      }
      const red = params.get("redirect");
      if (red) {
        setRedirectTarget(red);
      }
    }
  }, []);

  const requirements = [
    { ok: password.length >= 6, label: "Kamida 6 ta belgi" },
  ];
  const allOk = password.length >= 6;

  async function handleRegister() {
    setError("");

    if (!fullName.trim()) {
      setError("Ismingizni kiriting");
      return;
    }
    if (!username.trim() || username.length < 3) {
      setError("Login kamida 3 ta belgidan iborat bo'lishi kerak");
      return;
    }
    if (!allOk) {
      setError("Parol kamida 6 ta belgidan iborat bo'lishi kerak");
      return;
    }
    if (password !== confirmPassword) {
      setError("Parollar bir-biriga mos kelmadi");
      return;
    }

    setSubmitting(true);
    try {
      const cleanPhone = phone.replace(/\s+/g, "");
      const phoneToSend = cleanPhone.length > 4 ? phone.trim() : undefined;
      const registeredName = fullName.trim();
      setSuccessFullName(registeredName);

      await register({
        username: username.trim(),
        full_name: registeredName,
        phone: phoneToSend,
        password: password,
      });

      setIsSuccess(true);
      setTimeout(() => {
        window.location.href = redirectTarget || "/files";
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ro'yxatdan o'tishda xatolik yuz berdi");
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all";

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07090e] px-4 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-600/30 via-violet-600/35 to-teal-500/25 rounded-full blur-3xl pointer-events-none animate-pulse" />

        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md relative z-10 text-center"
        >
          <div className="glass rounded-3xl p-8 sm:p-10 border border-emerald-500/30 shadow-2xl shadow-emerald-500/10 backdrop-blur-2xl">
            {/* Animated Checkmark Circle */}
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.05 }}
              className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-xl shadow-emerald-500/30 flex items-center justify-center"
            >
              <div className="w-full h-full rounded-3xl bg-[#090d16] flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Check className="w-10 h-10 text-emerald-400 stroke-[3]" />
                </motion.div>
              </div>
            </motion.div>

            {/* Sparkles Floating */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.35, ease: "easeOut" }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold mb-3"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ro'yxatdan muvaffaqiyatli o'tdingiz!</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.35, ease: "easeOut" }}
              className="text-2xl font-black text-white tracking-tight mb-2"
            >
              Xush kelibsiz, {successFullName}! 🎉
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.35 }}
              className="text-sm text-slate-400 mb-6"
            >
              Hisobingiz tayyorlandi. Platformaga yo'naltirilmoqdasiz...
            </motion.p>

            {/* 1.5s Progress Bar */}
            <div className="relative w-full h-2 bg-white/[0.08] rounded-full overflow-hidden mb-3">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "linear" }}
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 rounded-full"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Kirilmoqda...
              </span>
              <span>1.5 soniya</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 px-4 py-12 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-950/40 p-7 sm:p-9 border border-slate-100">
          {/* Logo & Header */}
          <div className="text-center mb-6">
            <Link href="/" className="inline-block mb-3">
              <Logo size="lg" />
            </Link>

            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Ro&apos;yxatdan o&apos;tish</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Platformadan to&apos;liq foydalanish uchun hisob yarating</p>
          </div>

          {authRequiredNotice && (
            <div className="mb-5 p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-2.5 text-amber-800 text-xs sm:text-sm">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-slate-900">Platformadan foydalanish uchun ro&apos;yxatdan o&apos;ting</span>
                Konspektlar, oraliq/yakuniy nazorat testlari va ma&apos;ruza fayllari faqat ro&apos;yxatdan o&apos;tgan talabalar uchun ochiq. Ro&apos;yxatdan o&apos;tish bepul va 30 soniya vaqt oladi.
              </div>
            </div>
          )}

          {/* Form Container (No <form> tag to eliminate aggressive browser autofill popups) */}
          <div
            className="space-y-4"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRegister();
            }}
          >
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Ism va Familiyangiz
              </label>
              <input
                id="reg-fullname"
                name="reg_fl_name"
                type="text"
                required
                readOnly={isReadOnly}
                onFocus={() => setIsReadOnly(false)}
                onClick={() => setIsReadOnly(false)}
                onMouseDown={() => setIsReadOnly(false)}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={inputClass}
                placeholder="Ali Valiyev"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <AtSign className="w-3.5 h-3.5 text-slate-400" />
                Login (Username)
              </label>
              <input
                id="reg-login"
                name="reg_usr_login"
                type="text"
                required
                readOnly={isReadOnly}
                onFocus={() => setIsReadOnly(false)}
                onClick={() => setIsReadOnly(false)}
                onMouseDown={() => setIsReadOnly(false)}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputClass}
                placeholder="masalan: ali_99"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                Telefon raqam <span className="text-slate-400 font-normal lowercase">(ixtiyoriy)</span>
              </label>
              <input
                id="reg-phone"
                name="reg_usr_tel"
                type="text"
                readOnly={isReadOnly}
                onFocus={() => setIsReadOnly(false)}
                onClick={() => setIsReadOnly(false)}
                onMouseDown={() => setIsReadOnly(false)}
                value={phone}
                onChange={(e) => {
                  let v = e.target.value;
                  if (!v.startsWith("+998")) {
                    v = "+998 " + v.replace(/^\+?9?9?8?/, "").trimStart();
                  }
                  setPhone(v);
                }}
                className={inputClass}
                placeholder="+998"
                autoComplete="off"
                inputMode="tel"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Parol
              </label>
              <div className="relative">
                <input
                  id="reg-pass"
                  name="reg_sec_pwd"
                  type="text"
                  required
                  readOnly={isReadOnly}
                  onFocus={() => setIsReadOnly(false)}
                  onClick={() => setIsReadOnly(false)}
                  onMouseDown={() => setIsReadOnly(false)}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pr-11`}
                  placeholder="Parolni kiriting"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  style={{
                    WebkitTextSecurity: showPassword ? "none" : "disc",
                  } as React.CSSProperties}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                  title={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Parolni tasdiqlash
              </label>
              <div className="relative">
                <input
                  id="reg-conf"
                  name="reg_sec_conf"
                  type="text"
                  required
                  readOnly={isReadOnly}
                  onFocus={() => setIsReadOnly(false)}
                  onClick={() => setIsReadOnly(false)}
                  onMouseDown={() => setIsReadOnly(false)}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`${inputClass} pr-11`}
                  placeholder="Parolni qayta kiriting"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  style={{
                    WebkitTextSecurity: showConfirm ? "none" : "disc",
                  } as React.CSSProperties}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                  title={showConfirm ? "Parolni yashirish" : "Parolni ko'rsatish"}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs font-semibold text-rose-500 mt-1.5 flex items-center gap-1">
                  <X className="w-3.5 h-3.5" /> Parollar bir-biriga mos kelmadi
                </p>
              )}
            </div>

            {/* Password Requirements (PASTGA TUSHIRILDI) */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 mt-2">
              <p className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                Parol talablari:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {requirements.map((r) => (
                  <div
                    key={r.label}
                    className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                      r.ok ? "text-emerald-600" : "text-slate-400"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                        r.ok ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-400"
                      }`}
                    >
                      {r.ok ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : "•"}
                    </div>
                    <span>{r.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 p-3 rounded-xl flex items-center gap-2"
              >
                <X className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleRegister}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-indigo-600 via-primary-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 transition-all cursor-pointer mt-3"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
              Ro&apos;yxatdan o&apos;tish
            </button>
          </div>

          {/* Footer Link */}
          <p className="text-center text-slate-500 mt-6 text-xs sm:text-sm font-medium">
            Akkauntingiz bormi?{" "}
            <Link href="/login" className="text-indigo-600 font-bold hover:underline">
              Kirish
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}