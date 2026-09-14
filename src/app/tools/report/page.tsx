"use client";

import { useState } from "react";
import {
  Sparkles,
  FileText,
  Download,
  Loader2,
} from "lucide-react";
import RequireAuth from "@/components/RequireAuth";
import AIChat from "@/components/AIChat";
import { api } from "@/lib/api";
import { downloadFile } from "@/lib/fileActions";

type GeneratedReport = {
  title: string;
  topic: string;
  page_count: number;
  content: string;
  docx_url?: string | null;
  pdf_url?: string | null;
};

export default function ReportPage() {
  const [topic, setTopic] = useState("");
  const [pageCount, setPageCount] = useState(5);
  const [language, setLanguage] = useState("uz");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState<GeneratedReport | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setError("");
    setReport(null);

    try {
      const data = await api.post<GeneratedReport>("/api/ai/report", {
        topic: topic.trim(),
        page_count: pageCount,
        language,
      });
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <RequireAuth>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-violet-600/10 border border-violet-500/20 rounded-2xl flex items-center justify-center text-violet-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              AI Referat Generator
            </h1>
            <p className="text-xs text-zinc-400">
              Mavzuni yozing va professional akademik referat tayyorlab oling
            </p>
          </div>
        </div>

        {/* Generator Form */}
        <form
          onSubmit={handleSubmit}
          className="glass-card border border-white/10 p-6 mb-8 space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              Referat mavzusi
            </label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Masalan: Sun'iy intellektning tibbiyotdagi o'rni..."
              maxLength={200}
              className="w-full bg-zinc-900/80 border border-white/10 text-zinc-100 placeholder-zinc-500 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
                Hajmi (bet soni)
              </label>
              <select
                value={pageCount}
                onChange={(e) => setPageCount(Number(e.target.value))}
                className="w-full bg-zinc-900/80 border border-white/10 text-zinc-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-violet-500"
              >
                {[3, 5, 8, 10, 15, 20].map((n) => (
                  <option key={n} value={n}>
                    {n} bet
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
                Til
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-zinc-900/80 border border-white/10 text-zinc-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-violet-500"
              >
                <option value="uz">O&apos;zbek tili</option>
                <option value="ru">Русский язык</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          {error && <p className="text-xs text-rose-400">{error}</p>}

          <button
            type="submit"
            disabled={loading || !topic.trim()}
            className="w-full btn btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            {loading ? "Tayyorlanmoqda..." : "Referat yaratish"}
          </button>
        </form>

        {/* Result Box */}
        {report && (
          <div className="glass-card border border-white/10 overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/60">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-violet-400" />
                  {report.title}
                </h2>
                <span className="text-xs text-zinc-400">
                  {report.page_count} betlik referat tayyor
                </span>
              </div>
              <div className="flex gap-2">
                {report.docx_url && (
                  <button
                    onClick={() =>
                      downloadFile(report.docx_url!, `${report.title}.docx`).catch(() => {})
                    }
                    className="btn bg-blue-600/20 border border-blue-500/30 text-blue-300 hover:bg-blue-600/30 text-xs px-3 py-1.5 flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Word (.docx)
                  </button>
                )}
                {report.pdf_url && (
                  <button
                    onClick={() =>
                      downloadFile(report.pdf_url!, `${report.title}.pdf`).catch(() => {})
                    }
                    className="btn bg-rose-600/20 border border-rose-500/30 text-rose-300 hover:bg-rose-600/30 text-xs px-3 py-1.5 flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    PDF (.pdf)
                  </button>
                )}
              </div>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <pre className="whitespace-pre-wrap font-sans text-zinc-300 text-sm leading-relaxed">
                {report.content}
              </pre>
            </div>
          </div>
        )}

        <AIChat />
      </div>
    </RequireAuth>
  );
}