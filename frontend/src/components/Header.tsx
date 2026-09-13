"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Menu,
  X,
  LogOut,
  User,
  Globe,
  Check,
  FolderOpen,
  ClipboardList,
  Sparkles,
  Shield,
  Star,
  LogIn,
  UserPlus,
  ShieldCheck,
  Crown,
  Code2,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import NewsTicker from "@/components/NewsTicker";
import Logo from "@/components/Logo";
import UserAvatar from "@/components/UserAvatar";
import type { Lang } from "@/lib/translations";

const langOptions: { code: Lang; label: string }[] = [
  { code: "uz", label: "O'zbek" },
  { code: "kaa", label: "Qaraqalpaq" },
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [aiMenuOpen, setAiMenuOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const aiRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
      if (aiRef.current && !aiRef.current.contains(e.target as Node)) {
        setAiMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 transition-all shadow-xs">
      {/* Top Main Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 md:gap-4">
          {/* Logo */}
          <Link href="/" className="shrink-0 group">
            <Logo size="md" />
          </Link>

          {/* Center: News Ticker */}
          <div className="flex flex-1 justify-center min-w-0 max-w-xl mx-2">
            <NewsTicker />
          </div>

          {/* Right: User status & Language Switcher */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {user ? (
              <div className="hidden sm:flex items-center gap-2 lg:gap-3">
                {/* Stars balance */}
                <Link
                  href="/rewards"
                  title={t("rewards")}
                  className="flex items-center gap-1.5 bg-amber-50 text-amber-800 hover:bg-amber-100 font-bold text-xs px-2.5 py-1.5 rounded-xl transition-all border border-amber-200/70 shadow-xs hover:scale-105"
                >
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>{Number(user.stars || 0).toFixed(1)}</span>
                </Link>

                {/* Premium badge */}
                {user.is_premium ? (
                  <Link
                    href="/premium"
                    title="Siz Premium a'zosisiz"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-slate-950 font-black text-xs shadow-xs hover:scale-105 transition-all"
                  >
                    <Crown className="w-3.5 h-3.5 fill-slate-950" />
                    PRO
                  </Link>
                ) : (
                  <Link
                    href="/premium"
                    title="Premium obunani olish"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs transition-all hover:scale-105"
                  >
                    <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                    Premium
                  </Link>
                )}

                {/* Admin badge */}
                {user.is_admin && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-1 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs font-bold px-2.5 py-1.5 rounded-xl shadow-xs hover:scale-105 transition-all"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Admin
                  </Link>
                )}

                {/* Profile & Logout */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 text-slate-700 font-medium hover:text-blue-600 transition-colors group"
                  >
                    <UserAvatar
                      studentId={user.student_id}
                      avatarUrl={user.avatar_url}
                      name={user.full_name || user.username}
                      size="sm"
                    />
                    <div className="hidden lg:flex flex-col text-left">
                      <span className="max-w-[120px] truncate text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {user.full_name || user.username}
                      </span>
                      {user.student_id && (
                        <span className="font-mono text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200/50 inline-block leading-tight">
                          {user.student_id}
                        </span>
                      )}
                    </div>
                  </Link>
                  <button
                    onClick={logout}
                    title={t("logout")}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-slate-600 hover:text-slate-900 font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-all"
                >
                  {t("hero_login")}
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm transition-all"
                >
                  {t("hero_register")}
                </Link>
              </div>
            )}

            {/* Language Switcher */}
            <div
              className="flex items-center p-0.5 bg-slate-100/90 border border-slate-200/90 rounded-xl shadow-xs"
              title="Tilni tanlash / Выбрать язык"
            >
              {langOptions.map((option) => {
                const isActive = lang === option.code;
                return (
                  <button
                    key={option.code}
                    onClick={() => setLang(option.code)}
                    className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      isActive
                        ? "bg-white text-blue-600 shadow-xs font-extrabold"
                        : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                    }`}
                    title={option.label}
                  >
                    {option.code.toUpperCase()}
                  </button>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="p-2 text-slate-600 hover:text-slate-900 md:hidden rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menyu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-2">
            {user ? (
              <>
                <Link
                  href="/files"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-xl font-medium text-sm"
                >
                  {t("files")}
                </Link>
                <Link
                  href="/my-files"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-xl font-medium text-sm"
                >
                  <FolderOpen className="w-4 h-4 text-slate-400" />
                  {t("my_files")}
                </Link>
                <Link
                  href="/tests"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-xl font-medium text-sm"
                >
                  <ClipboardList className="w-4 h-4 text-slate-400" />
                  {t("tests")}
                </Link>
                <Link
                  href="/tools/report"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-xl font-medium text-sm"
                >
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  {t("report_title")}
                </Link>
                <Link
                  href="/learning"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-indigo-700 hover:bg-indigo-50 rounded-xl font-medium text-sm"
                >
                  <Code2 className="w-4 h-4 text-indigo-500" />
                  {t("coding")}
                </Link>
                <Link
                  href="/premium"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-xl font-bold text-sm"
                >
                  <Crown className="w-4 h-4 text-amber-600 fill-amber-500" />
                  {user.is_premium ? "VIP Premium (Faol)" : "Premium olish"}
                </Link>
                <Link
                  href="/rewards"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-amber-700 hover:bg-amber-50 rounded-xl font-medium text-sm"
                >
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  {t("rewards")} · {Number(user.stars || 0).toFixed(1)}★
                </Link>

                {user.is_admin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl font-bold text-sm"
                  >
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    Admin Panel
                  </Link>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-3">
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 text-slate-700 font-medium text-sm"
                  >
                    <UserAvatar
                      studentId={user.student_id}
                      avatarUrl={user.avatar_url}
                      name={user.full_name || user.username}
                      size="sm"
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">{user.full_name || user.username}</span>
                      {user.student_id && (
                        <span className="font-mono text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200/50 inline-block w-fit">
                          {user.student_id}
                        </span>
                      )}
                    </div>
                  </Link>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="text-red-500 hover:text-red-600 text-xs font-semibold flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-red-50 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    {t("logout")}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2 px-3 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-slate-700 font-bold text-sm rounded-xl border border-slate-200"
                >
                  {t("hero_login")}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 bg-blue-600 text-white font-bold text-sm rounded-xl shadow-sm"
                >
                  {t("hero_register")}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sub-Navigation Bar (2-Qavat: 2-rasm ustidagi toza navigatsiya) */}
      {user && (
        <div className="border-t border-slate-200/80 bg-slate-50/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2.5 overflow-x-auto py-2 scrollbar-none text-xs sm:text-sm font-medium w-full">
              {/* Fayllar */}
              <Link
                href="/files"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all shrink-0 ${
                  pathname === "/files" || pathname?.startsWith("/files/")
                    ? "bg-white text-blue-600 shadow-xs font-bold border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/70"
                }`}
              >
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span>{t("files")}</span>
              </Link>

              {/* Mening fayllarim */}
              <Link
                href="/my-files"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all shrink-0 ${
                  pathname === "/my-files"
                    ? "bg-white text-blue-600 shadow-xs font-bold border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/70"
                }`}
              >
                <FolderOpen className="w-4 h-4 text-slate-400" />
                <span>{t("my_files")}</span>
              </Link>

              {/* Testlar */}
              <Link
                href="/tests"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all shrink-0 ${
                  pathname?.startsWith("/tests")
                    ? "bg-white text-blue-600 shadow-xs font-bold border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/70"
                }`}
              >
                <ClipboardList className="w-4 h-4 text-emerald-500" />
                <span>{t("tests")}</span>
              </Link>

              {/* Dasturlash */}
              <Link
                href="/learning"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all shrink-0 ${
                  pathname?.startsWith("/learning")
                    ? "bg-white text-indigo-600 shadow-xs font-bold border border-slate-200/80"
                    : "text-slate-600 hover:text-indigo-600 hover:bg-white/70"
                }`}
              >
                <Code2 className="w-4 h-4 text-indigo-500" />
                <span>{t("coding")}</span>
              </Link>

              {/* Yulduzchalar / Mukofotlar */}
              <Link
                href="/rewards"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all shrink-0 ${
                  pathname === "/rewards"
                    ? "bg-white text-amber-700 shadow-xs font-bold border border-slate-200/80"
                    : "text-slate-600 hover:text-amber-700 hover:bg-white/70"
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>{t("rewards")}</span>
              </Link>

              {/* Premium */}
              <Link
                href="/premium"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all shrink-0 ${
                  pathname === "/premium"
                    ? "bg-gradient-to-r from-amber-400/20 to-orange-400/20 text-amber-900 font-bold border border-amber-300 shadow-xs"
                    : "text-amber-800 hover:bg-amber-50/80"
                }`}
              >
                <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>Premium</span>
              </Link>

              {/* AI Asboblar dropdown */}
              <div className="relative shrink-0" ref={aiRef}>
                <button
                  onClick={() => setAiMenuOpen(!aiMenuOpen)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-white/70 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{t("ai_tools")}</span>
                  <svg className="w-3 h-3 mt-0.5 opacity-60" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {aiMenuOpen && (
                  <div className="absolute left-0 top-full mt-1.5 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <Link
                      href="/tools/report"
                      onClick={() => setAiMenuOpen(false)}
                      className="block px-4 py-2 text-xs sm:text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 font-medium"
                    >
                      {t("report_title")}
                    </Link>
                    <Link
                      href="/tests"
                      onClick={() => setAiMenuOpen(false)}
                      className="block px-4 py-2 text-xs sm:text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 font-medium"
                    >
                      {t("generate_test")}
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}