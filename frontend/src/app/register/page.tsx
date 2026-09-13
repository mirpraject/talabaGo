"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UserPlus, Loader2, Check, X, User, AtSign, Phone, Eye, EyeOff, ShieldCheck } from "lucide-react";
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

  const [authRequiredNotice, setAuthRequiredNotice] = useState(false);
  const [redirectTarget, setRedirectTarget] = useState("/files");

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
    { ok: password.length >= 8, label: "Kamida 8 ta belgi" },
    { ok: /[A-Z]/.test(password), label: "Katta harf (A-Z)" },
    { ok: /[a-z]/.test(password), label: "Kichik harf (a-z)" },
    { ok: /\d/.test(password), label: "Raqam (0-9)" },
  ];
  const allOk = requirements.every((r) => r.ok);

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
      setError("Parol barcha talablarga javob berishi shart");
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

      await register({
        username: username.trim(),
        full_name: fullName.trim(),
        phone: phoneToSend,
        password: password,
      });
      window.location.href = redirectTarget || "/files";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ro'yxatdan o'tishda xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all";

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