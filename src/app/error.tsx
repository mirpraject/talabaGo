"use client";
import React, { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected client-side error
    console.error("Global Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center text-4xl mb-6 shadow-lg shadow-amber-500/5 animate-pulse">
        ⚠️
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
        Kutilmagan xatolik yuz berdi
      </h1>
      <p className="text-slate-600 dark:text-slate-400 max-w-md mb-8 text-sm sm:text-base leading-relaxed">
        Tizimda vaqtinchalik xatolik aniqlandi. Xavotir olmang, sahifani qayta yuklash orqali davom ettirishingiz mumkin.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => reset()}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer"
        >
          🔄 Qayta urinib ko&apos;rish
        </button>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-sm transition-all active:scale-95"
        >
          🏠 Bosh sahifaga qaytish
        </Link>
      </div>

      {process.env.NODE_ENV === "development" && error?.message && (
        <div className="mt-8 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 max-w-lg text-left text-xs font-mono text-red-600 dark:text-red-400 overflow-x-auto">
          {error.message}
        </div>
      )}
    </div>
  );
}
