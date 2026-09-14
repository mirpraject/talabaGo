"use client";

import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

const NO_SHELL_PATHS = ["/login", "/register", "/admin/login"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  const isNoShell = NO_SHELL_PATHS.some((p) => pathname === p);
  const isAdmin = pathname?.startsWith("/admin");

  // Auth/Login sahifalarida shell ko'rsatma
  if (isNoShell) {
    return <>{children}</>;
  }

  // Admin panel — o'ziga xos layout
  if (isAdmin) {
    return (
      <div className="relative z-10 min-h-screen">
        <Header />
        <main className="pt-14">{children}</main>
      </div>
    );
  }

  // Landing page (guest)
  if (!user && !loading) {
    return (
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-14">{children}</main>
        <Footer />
      </div>
    );
  }

  // Dashboard (logged in user) — Sidebar layout
  if (user) {
    return (
      <div className="relative z-10 sidebar-layout">
        {/* Sidebar (desktop — fixed) */}
        <Sidebar />

        {/* Content area */}
        <div className="sidebar-content">
          <Header />
          <main className="pt-14 min-h-screen">{children}</main>
        </div>
      </div>
    );
  }

  // Loading state
  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
    </div>
  );
}
