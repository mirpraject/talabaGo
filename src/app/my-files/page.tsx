"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import RequireAuth from "@/components/RequireAuth";
import AIChat from "@/components/AIChat";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/lib/api";
import {
  FileText,
  Trash2,
  Download,
  Star,
  Clock,
  Loader2,
  Upload,
  AlertTriangle,
  FolderOpen,
} from "lucide-react";

type MyFile = {
  id: number;
  title: string;
  description: string | null;
  file_type: string;
  views: number;
  downloads: number;
  rating: number;
  created_at: string;
  is_verified?: boolean;
};

const typeLabels: Record<string, { label: string; badge: string }> = {
  notes: { label: "Konspekt", badge: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  midterm: { label: "Oraliq nazorat (ON)", badge: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  final: { label: "Yakuniy nazorat (YaN)", badge: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
  lectures: { label: "Ma'ruza", badge: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  tests: { label: "Testlar", badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  lab: { label: "Laboratoriya", badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
  book: { label: "Darslik", badge: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
  exercise: { label: "Mashq", badge: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" },
};

export default function MyFilesPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [files, setFiles] = useState<MyFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get<MyFile[]>("/api/files/my");
        setFiles(data);
      } catch {
        setFiles([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString("uz-UZ", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  async function handleDelete(id: number) {
    setDeleting(id);
    try {
      await api.delete(`/api/files/${id}`);
      setFiles((prev) => prev.filter((f) => f.id !== id));
      setConfirmDelete(null);
    } catch {
      /* ignore */
    } finally {
      setDeleting(null);
    }
  }

  return (
    <RequireAuth>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center gap-1.5">
                <FolderOpen className="w-3.5 h-3.5" />
                Mening kabinetim
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              {t("my_files_title") || "Mening Materiallarim"}
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              {t("my_files_subtitle") || "Siz yuklagan o'quv materiallar"} ({files.length} ta)
            </p>
          </div>
          <Link
            href="/files"
            className="btn btn-primary shadow-lg shadow-violet-600/25 flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {t("upload_file") || "Yangi material yuklash"}
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
            <span className="text-zinc-500 text-sm">Fayllar yuklanmoqda...</span>
          </div>
        ) : files.length === 0 ? (
          <div className="glass-card p-16 text-center border border-dashed border-white/10 rounded-2xl">
            <FileText className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">
              {t("my_files_empty") || "Siz hali material yuklamagansiz"}
            </h2>
            <p className="text-zinc-400 text-sm max-w-md mx-auto mb-6">
              Foydali konspekt yoki darslik yuklab, reytingingizni oshiring va yulduzchalar yutib oling!
            </p>
            <Link href="/files" className="btn btn-primary inline-flex items-center gap-2">
              <Upload className="w-4 h-4" />
              {t("upload_first") || "Birinchi materialni yuklash"}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {files.map((file, i) => {
              const badgeInfo = typeLabels[file.file_type] || {
                label: file.file_type,
                badge: "bg-zinc-800 text-zinc-400 border-zinc-700",
              };
              return (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="glass-card p-5 border border-white/10 hover:border-violet-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-11 h-11 bg-violet-600/10 border border-violet-500/20 rounded-xl flex items-center justify-center flex-shrink-0 text-violet-400 mt-0.5">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Link href={`/files/${file.id}`}>
                          <h3 className="font-semibold text-white hover:text-violet-400 transition-colors text-base truncate">
                            {file.title}
                          </h3>
                        </Link>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${badgeInfo.badge}`}
                        >
                          {badgeInfo.label}
                        </span>
                      </div>

                      {file.description && (
                        <p className="text-xs text-zinc-400 line-clamp-1 mb-2">
                          {file.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-zinc-500">
                        <span className="flex items-center gap-1 text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {file.rating ? file.rating.toFixed(1) : "5.0"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="w-3.5 h-3.5" />
                          {file.downloads} yuklash
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDate(file.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {confirmDelete === file.id ? (
                      <div className="flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/30 px-3 py-1.5 rounded-xl">
                        <span className="text-xs text-rose-400 font-semibold mr-1">O'chirilsinmi?</span>
                        <button
                          onClick={() => handleDelete(file.id)}
                          disabled={deleting === file.id}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg transition-colors"
                        >
                          {deleting === file.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            "Ha"
                          )}
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="px-2 py-1 text-xs text-zinc-400 hover:text-white rounded-lg transition-colors"
                        >
                          Yo'q
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(file.id)}
                        title="O'chirish"
                        className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <AIChat />
      </div>
    </RequireAuth>
  );
}