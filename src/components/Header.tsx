"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Menu, X, Globe, Check, Star, GraduationCap } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import UserAvatar from "@/components/UserAvatar";
import { getTierConfig } from "@/lib/subscription";
import type { Lang } from "@/lib/translations";

const langOptions: { code: Lang; label: string; flag: string }[] = [
  { code: "uz",  label: "O'zbek",      flag: "🇺🇿" },
  { code: "kaa", label: "Qaraqalpaq",  flag: "🌐" },
  { code: "kr",  label: "Кирилча",     flag: "🇺🇿" },
  { code: "ru",  label: "Русский",     flag: "🇷🇺" },
  { code: "en",  label: "English",     flag: "🇬🇧" },
];

export default function Header() {
  const { user } = useAuth();
  const { lang, setLang } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const tierConfig = getTierConfig(user);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Close sidebar on resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setSidebarOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      {/* ── Header bar ────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#08090e]/90 backdrop-blur-xl border-b border-white/[0.07] shadow-xl shadow-black/30"
            : "bg-transparent"
        }`}
        style={{ left: user ? "var(--sidebar-w, 0)" : 0 }}
      >
        <div className="max-w-full px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 gap-4">

            {/* Left: Burger (mobile, only when user logged in) OR Logo */}
            <div className="flex items-center gap-3">
              {user && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden btn btn-ghost btn-sm p-2 cursor-pointer"
                  aria-label="Menyu"
                >
                  <Menu className="w-5 h-5" />
                </button>
              )}
              {!user && (
                <Link href="/" className="flex items-center gap-2 group">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-black text-sm text-white">
                    Talaba<span className="text-violet-400">Go</span>
                  </span>
                </Link>
              )}
            </div>

            {/* Right: Lang switcher + Auth buttons */}
            <div className="flex items-center gap-2 ml-auto">

              {/* Language switcher */}
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="btn btn-secondary btn-sm gap-1.5 cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span className="uppercase text-[11px]">{lang}</span>
                </button>
                {langOpen && (
                  <div className="absolute right-0 top-full mt-2 w-44 glass border border-white/10 rounded-2xl py-1.5 z-50 shadow-2xl shadow-black/50">
                    {langOptions.map((opt) => (
                      <button
                        key={opt.code}
                        onClick={() => { setLang(opt.code); setLangOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                      >
                        <span>{opt.flag}</span>
                        <span>{opt.label}</span>
                        {lang === opt.code && <Check className="w-3.5 h-3.5 text-violet-400 ml-auto" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Logged-in User Chip & Stars */}
              {user && (
                <>
                  <Link href="/rewards" className="stars-chip text-xs">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{Number(user.stars || 0).toFixed(1)}</span>
                  </Link>
                  <Link
                    href="/profile"
                    className={`flex items-center gap-2 py-1 px-2.5 rounded-xl border transition-all hover:scale-105 active:scale-95 ${tierConfig.cardBg} ${tierConfig.borderClass}`}
                    title={`${user.full_name || user.username} (${tierConfig.name})`}
                  >
                    <UserAvatar
                      studentId={user.student_id}
                      avatarUrl={user.avatar_url}
                      name={user.full_name || user.username}
                      tier={user.subscription_tier}
                      size="xs"
                    />
                    <span className="text-xs font-bold text-slate-200 hidden sm:inline max-w-[100px] truncate">
                      {user.full_name || user.username}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase ${tierConfig.badgeClass}`}>
                      {tierConfig.badge}
                    </span>
                  </Link>
                </>
              )}

              {/* Auth buttons (guest) */}
              {!user && (
                <div className="flex items-center gap-2">
                  <Link href="/login" className="btn btn-ghost btn-sm">
                    Kirish
                  </Link>
                  <Link href="/register" className="btn btn-primary btn-sm">
                    Ro'yxatdan o'tish
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Sidebar overlay ─────────────────────────────── */}
      {user && sidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Sidebar panel */}
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
            <div className="relative h-full">
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-[-44px] btn btn-ghost p-2 z-10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        </>
      )}
    </>
  );
}