"use client";

import Link from "next/link";
import { GraduationCap, Star, BookOpen, ClipboardList, Bot } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  const links = [
    { label: "Fayllar", href: "/files", icon: BookOpen },
    { label: "Testlar", href: "/tests", icon: ClipboardList },
    { label: "AI Referat", href: "/tools/report", icon: Bot },
    { label: "Yulduzlar", href: "/rewards", icon: Star },
  ];

  return (
    <footer className="relative z-10 border-t border-white/[0.06] bg-[#0f1117]/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="font-black text-lg text-white">
                Talaba<span className="text-violet-400">Go</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
              O'zbekiston talabalari uchun yagona premium akademik platforma.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-3">
            {links.map((l) => {
              const Icon = l.icon;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-violet-400 transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <span>© {year} TalabaGo. Barcha huquqlar himoyalangan.</span>
          <div className="flex items-center gap-1.5">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span>100 ★ = 10 000 so'm</span>
          </div>
        </div>
      </div>
    </footer>
  );
}