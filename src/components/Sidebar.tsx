"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import UserAvatar from "@/components/UserAvatar";
import {
  BookOpen,
  FolderOpen,
  ClipboardList,
  Code2,
  Star,
  Crown,
  ShieldCheck,
  Sparkles,
  LogOut,
  FileText,
  LayoutDashboard,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import { motion } from "framer-motion";

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  if (!user) return null;

  const navItems = [
    {
      group: "Asosiy",
      items: [
        { href: "/files", icon: BookOpen, label: t("files"), color: "text-blue-400" },
        { href: "/my-files", icon: FolderOpen, label: t("my_files"), color: "text-indigo-400" },
        { href: "/tests", icon: ClipboardList, label: t("tests"), color: "text-emerald-400" },
        { href: "/learning", icon: Code2, label: t("coding"), color: "text-violet-400" },
      ],
    },
    {
      group: "AI Asboblar",
      items: [
        { href: "/tools/report", icon: FileText, label: t("report_title"), color: "text-purple-400" },
      ],
    },
    {
      group: "Profil",
      items: [
        { href: "/rewards", icon: Star, label: t("rewards"), color: "text-amber-400" },
        { href: "/premium", icon: Crown, label: "Premium", color: "text-orange-400" },
        ...(user.is_admin
          ? [{ href: "/admin", icon: ShieldCheck, label: "Admin Panel", color: "text-red-400" }]
          : []),
      ],
    },
  ];

  const isActive = (href: string) => {
    if (href === "/files") return pathname === "/files" || pathname?.startsWith("/files/");
    return pathname === href || pathname?.startsWith(href + "/");
  };

  const handleLogout = () => {
    onClose?.();
    logout();
  };

  return (
    <motion.aside
      initial={{ x: -280, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sidebar flex flex-col h-full"
    >
      {/* Logo + Brand */}
      <div className="p-5 border-b border-white/[0.06]">
        <Link href="/" onClick={onClose} className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 opacity-60 blur-sm group-hover:opacity-90 transition" />
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-lg">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base text-white tracking-tight">Talaba</span>
              <span className="font-black text-base bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent tracking-tight">Go</span>
              <span className="text-[9px] px-1 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-bold">v2</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide">Academic Platform</p>
          </div>
        </Link>
      </div>

      {/* User Profile Card */}
      <div className="p-4 mx-3 mt-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
        <Link href="/profile" onClick={onClose} className="flex items-center gap-3">
          <UserAvatar
            studentId={user.student_id}
            avatarUrl={user.avatar_url}
            name={user.full_name || user.username}
            size="md"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-100 truncate">
              {user.full_name || user.username}
            </p>
            {user.student_id && (
              <span className="text-[10px] font-mono font-bold text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded border border-violet-500/20">
                {user.student_id}
              </span>
            )}
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
        </Link>

        {/* Stars balance */}
        <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between">
          <Link href="/rewards" onClick={onClose} className="stars-chip hover:bg-amber-500/20 transition-colors text-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{Number(user.stars || 0).toFixed(1)} yulduz</span>
          </Link>
          {user.is_premium ? (
            <span className="badge badge-amber text-[10px]">
              <Crown className="w-2.5 h-2.5" />
              PRO
            </span>
          ) : (
            <Link
              href="/premium"
              onClick={onClose}
              className="text-[10px] text-amber-400/70 hover:text-amber-400 transition-colors font-semibold"
            >
              → Premium
            </Link>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 mt-2 space-y-5 scrollbar-none">
        {navItems.map((group, gIdx) => (
          <div key={group.group}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 px-3 mb-2">
              {group.group}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item, iIdx) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: 0.05 + (gIdx * 3 + iIdx) * 0.03, ease: "easeOut" }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`nav-link ${active ? "active" : ""}`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${active ? "text-violet-400" : item.color}`} />
                      <span>{item.label}</span>
                      {active && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom: Logout */}
      <div className="p-3 border-t border-white/[0.06]">
        <button
          onClick={handleLogout}
          className="nav-link w-full text-red-400/70 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>{t("logout")}</span>
        </button>
      </div>
    </motion.aside>
  );
}
