"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { GraduationCap, Lock, UserPlus, LogIn, ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      const redirectParam = pathname ? `&redirect=${encodeURIComponent(pathname)}` : "";
      router.push(`/register?reason=auth_required${redirectParam}`);
    }
  }, [loading, user, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <GraduationCap className="w-14 h-14 text-emerald-400 animate-bounce" />
        <p className="mt-4 text-slate-300 font-medium text-sm">Tekshirilmoqda...</p>
      </div>
    );
  }

  if (!user) {
    const redirectParam = pathname ? `?redirect=${encodeURIComponent(pathname)}` : "";
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4 py-12 text-white">
        <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl text-center">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>

          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center mb-4">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
            Ro&apos;yxatdan o&apos;tish talab qilinadi
          </h2>
          <p className="text-sm text-slate-300 mb-6 leading-relaxed">
            TalabaGo platformasidagi konspektlar, oraliq/yakuniy nazorat testlari va materiallardan foydalanish uchun hisobingizga kiring yoki ro&apos;yxatdan o&apos;ting.
          </p>

          <div className="space-y-3">
            <Link
              href={`/register?reason=auth_required${redirectParam ? `&redirect=${encodeURIComponent(pathname)}` : ""}`}
              className="w-full bg-gradient-to-r from-emerald-500 via-teal-600 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white py-3.5 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02]"
            >
              <UserPlus className="w-5 h-5" />
              Bepul ro&apos;yxatdan o&apos;tish
            </Link>

            <Link
              href={`/login${redirectParam}`}
              className="w-full bg-white/10 hover:bg-white/15 border border-white/20 text-white py-3 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <LogIn className="w-4 h-4" />
              Mavjud hisobga kirish
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-200 mt-3 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Bosh sahifaga qaytish
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}