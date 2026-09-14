"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogIn, Loader2, Eye, EyeOff, Check, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import Logo from "@/components/Logo";


export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(true);

  const [redirectTarget, setRedirectTarget] = useState("/files");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loggedName, setLoggedName] = useState("");

  useEffect(() => {
    setUsername("");
    setPassword("");
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const red = params.get("redirect");
      if (red) {
        setRedirectTarget(red);
      }
    }
  }, []);

  async function handleLogin() {
    if (!username.trim() || !password.trim()) {
      setError("Login va parolni kiriting");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const loggedUser = await login(username, password);
      setLoggedName(loggedUser?.full_name || username);
      setIsSuccess(true);
      setTimeout(() => {
        if (loggedUser && loggedUser.is_admin) {
          window.location.href = "/admin";
        } else {
          window.location.href = redirectTarget || "/files";
        }
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xatolik");
      setSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07090e] px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-violet-600/30 via-indigo-600/35 to-blue-500/25 rounded-full blur-3xl pointer-events-none animate-pulse" />

        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md relative z-10 text-center"
        >
          <div className="glass rounded-3xl p-8 sm:p-10 border border-violet-500/30 shadow-2xl shadow-violet-500/10 backdrop-blur-2xl">
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.05 }}
              className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-tr from-violet-500 to-indigo-400 p-0.5 shadow-xl shadow-violet-500/30 flex items-center justify-center"
            >
              <div className="w-full h-full rounded-3xl bg-[#090d16] flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Check className="w-10 h-10 text-violet-400 stroke-[3]" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.35, ease: "easeOut" }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-400 text-xs font-bold mb-3"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Xush kelibsiz!</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.35, ease: "easeOut" }}
              className="text-2xl font-black text-white tracking-tight mb-2"
            >
              Qaytganingizdan xursandmiz, {loggedName}! 👋
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.35 }}
              className="text-sm text-slate-400 mb-6"
            >
              Tizimga muvaffaqiyatli kirildi. Yo'naltirilmoqdasiz...
            </motion.p>

            <div className="relative w-full h-2 bg-white/[0.08] rounded-full overflow-hidden mb-3">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "linear" }}
                className="h-full bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-500 rounded-full"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1.5 text-violet-400">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping" />
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>


          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">{t("welcome")}</h1>
          <p className="text-gray-500 text-center mb-8">{t("login_title")}</p>

          <div
            className="space-y-4"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogin();
            }}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Login</label>
              <input
                id="site_login_box"
                name="entry_login_val"
                type="text"
                required
                readOnly={isReadOnly}
                onFocus={() => setIsReadOnly(false)}
                onClick={() => setIsReadOnly(false)}
                onMouseDown={() => setIsReadOnly(false)}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                placeholder="Login"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                data-lpignore="true"
                data-form-type="other"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Parol</label>
              <div className="relative">
                <input
                  id="site_pass_box"
                  name="entry_pass_val"
                  type="text"
                  required
                  readOnly={isReadOnly}
                  onFocus={() => setIsReadOnly(false)}
                  onClick={() => setIsReadOnly(false)}
                  onMouseDown={() => setIsReadOnly(false)}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pr-10"
                  placeholder="Parol"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  data-lpignore="true"
                  data-form-type="other"
                  style={{
                    WebkitTextSecurity: showPassword ? "none" : "disc",
                  } as React.CSSProperties}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1"
                  title={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100"
              >
                {error}
              </motion.p>
            )}

            <button
              type="button"
              onClick={handleLogin}
              disabled={submitting}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-60 cursor-pointer"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
              {t("login_submit")}
            </button>
          </div>

          <p className="text-center text-gray-500 mt-6 text-sm">
            {t("login_no_account")}{" "}
            <Link href="/register" className="text-primary-600 font-medium hover:underline">
              {t("register")}
            </Link>
          </p>


          <div className="mt-4 p-3 bg-gray-50 rounded-xl text-center">
            <button onClick={() => router.push("/")} className="text-primary-600 font-medium hover:underline text-sm">
              {t("back_home")}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}