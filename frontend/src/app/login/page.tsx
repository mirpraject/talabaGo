"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogIn, Loader2, Eye, EyeOff } from "lucide-react";
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
      if (loggedUser && loggedUser.is_admin) {
        window.location.href = "/admin";
      } else {
        window.location.href = redirectTarget || "/files";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xatolik");
    } finally {
      setSubmitting(false);
    }
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