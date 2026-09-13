"use client";

import { useState } from "react";
import {
  FileText,
  Loader2,
  Sparkles,
  Copy,
  Check,
  Download,
  Send,
  FileDown,
  FilePlus2,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RequireAuth from "@/components/RequireAuth";
import AIChat from "@/components/AIChat";
import { useLanguage } from "@/context/LanguageContext";
import { api, postBlob } from "@/lib/api";

type Report = {
  title: string;
  content: string;
  summary: string;
};

export default function ReportToolPage() {
  const { t, lang } = useLanguage();
  const [topic, setTopic] = useState("");
  const [length, setLength] = useState("medium");
  const [language, setLanguage] = useState<"uz" | "en" | "ru">(lang === "kaa" ? "uz" : lang);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setError("");
    setCopied(false);
    try {
      const data = await api.post<Report>("/api/ai/report", {
        topic: topic.trim(),
        length,
        language,
      });
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("ai_error"));
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!report) return;
    try {
      await navigator.clipboard.writeText(report.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  async function downloadFormat(format: "docx" | "pdf") {
    if (!report) return;
    try {
      const blob = await postBlob("/api/ai/report/export", {
        title: report.title,
        content: report.content,
        format,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${report.title.replace(/[\\/:*?"<>|]+/g, "_").slice(0, 80)}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      /* ignore */
    }
  }

  function downloadTxt() {
    if (!report) return;
    const blob = new Blob([report.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.title.replace(/[^\wа-яА-ЯёЁ-]+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const inputClass =
    "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all";

  return (
    <RequireAuth>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 py-10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t("report_title")}</h1>
                <p className="text-gray-500">{t("report_subtitle")}</p>
              </div>
            </div>

            <form
              onSubmit={generate}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("report_topic")}
                  </label>
                  <input
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className={inputClass}
                    placeholder={t("report_topic_placeholder")}
                    maxLength={200}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t("report_length")}
                    </label>
                    <select
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      className={inputClass}
                    >
                      <option value="short">{t("length_short")}</option>
                      <option value="medium">{t("length_medium")}</option>
                      <option value="long">{t("length_long")}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Til</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as "uz" | "en" | "ru")}
                      className={inputClass}
                    >
                      <option value="uz">O'zbek</option>
                      <option value="en">English</option>
                      <option value="ru">Русский</option>
                    </select>
                  </div>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <button
                  type="submit"
                  disabled={loading || !topic.trim()}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                  {loading ? t("generating") : t("generate")}
                </button>
              </div>
            </form>

            {report && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary-600" />
                    {report.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="btn-secondary flex items-center gap-1.5 text-sm"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      {copied ? t("copied") : t("copy")}
                    </button>
                    <button
                      onClick={() => downloadFormat("docx")}
                      title="Word (.docx)"
                      className="btn-secondary flex items-center gap-1.5 text-sm !py-2 !px-3"
                    >
                      <FilePlus2 className="w-4 h-4" />
                      Word
                    </button>
                    <button
                      onClick={() => downloadFormat("pdf")}
                      title="PDF"
                      className="btn-secondary flex items-center gap-1.5 text-sm !py-2 !px-3"
                    >
                      <FileDown className="w-4 h-4" />
                      PDF
                    </button>
                    <button
                      onClick={downloadTxt}
                      className="btn-primary flex items-center gap-1.5 text-sm !py-2 !px-3"
                    >
                      <Download className="w-4 h-4" />
                      {t("download_txt")}
                    </button>
                  </div>
                </div>
                <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                    {report.content}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer />
        <AIChat />
      </div>
    </RequireAuth>
  );
}