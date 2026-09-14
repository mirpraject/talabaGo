"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import RequireAuth from "@/components/RequireAuth";
import UploadModal from "@/components/UploadModal";
import AIChat from "@/components/AIChat";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/lib/api";
import { downloadFile } from "@/lib/fileActions";
import {
  FileText,
  Download,
  Star,
  Clock,
  Search,
  Loader2,
  Upload,
  BookOpen,
  Filter,
  Sparkles,
} from "lucide-react";

type FileItem = {
  id: number;
  title: string;
  description: string | null;
  file_type: string;
  university_id: number;
  subject_id: number | null;
  views: number;
  downloads: number;
  rating: number;
  created_at: string;
};

type University = {
  id: number;
  name: string;
  short_name: string;
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

function FilesContent() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [typeFilter, setTypeFilter] = useState(searchParams.get("type") || "");
  const [uniFilter, setUniFilter] = useState(0);
  const [showUpload, setShowUpload] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (typeFilter) params.set("file_type", typeFilter);
      if (uniFilter) params.set("university_id", String(uniFilter));

      const [filesData, uniData] = await Promise.all([
        api.get<FileItem[]>(`/api/files/?${params.toString()}`),
        api.get<University[]>("/api/universities/"),
      ]);
      setFiles(filesData);
      setUniversities(uniData);
    } catch {
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter, uniFilter]);

  useEffect(() => {
    load();
  }, [load]);

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString("uz-UZ", { day: "numeric", month: "short" });
  }

  return (
    <RequireAuth>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Title & Upload Action */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Akademik Repozitoriy
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              O'quv Materiallari & Resurslar
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Universitetlar, fanlar bo'yicha saralangan konspekt, darslik va nazorat savollari
            </p>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="btn btn-primary shadow-lg shadow-violet-600/25 flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {t("upload_file") || "Material yuklash"}
          </button>
        </div>

        {/* Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 mb-8 flex flex-col md:flex-row gap-3 items-center border border-white/10"
        >
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Material, mavzu yoki fan qidirish..."
              className="w-full bg-zinc-900/80 border border-white/10 text-zinc-100 placeholder-zinc-500 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          <div className="flex w-full md:w-auto gap-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-zinc-900/80 border border-white/10 text-zinc-200 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-violet-500 cursor-pointer"
            >
              <option value="">Barcha turlar</option>
              <option value="notes">📑 Konspektlar</option>
              <option value="midterm">📝 Oraliq nazorat (ON)</option>
              <option value="final">🎯 Yakuniy nazorat (YaN)</option>
              <option value="lectures">🎙️ Ma'ruzalar</option>
              <option value="tests">⚡ Testlar</option>
              <option value="lab">🧪 Laboratoriya</option>
              <option value="book">📚 Darsliklar</option>
              <option value="exercise">✏️ Mashqlar</option>
            </select>

            <select
              value={uniFilter}
              onChange={(e) => setUniFilter(Number(e.target.value))}
              className="bg-zinc-900/80 border border-white/10 text-zinc-200 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-violet-500 cursor-pointer max-w-[200px]"
            >
              <option value={0}>Barcha OTMlar</option>
              {universities.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.short_name || u.name}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Files Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
            <span className="text-zinc-500 text-sm">Materiallar yuklanmoqda...</span>
          </div>
        ) : files.length === 0 ? (
          <div className="glass-card p-16 text-center border border-dashed border-white/10 rounded-2xl">
            <div className="w-16 h-16 rounded-2xl bg-zinc-800/80 border border-white/10 flex items-center justify-center mx-auto mb-4 text-zinc-400">
              <FileText className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Hozircha materiallar topilmadi</h2>
            <p className="text-zinc-400 text-sm max-w-md mx-auto mb-6">
              Qidiruv parametrlarini o'zgartirib ko'ring yoki birinchi bo'lib foydali material yuklang!
            </p>
            <button onClick={() => setShowUpload(true)} className="btn btn-primary">
              <Upload className="w-4 h-4 mr-2" />
              Material yuklash
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {files.map((file, i) => {
              const badgeInfo = typeLabels[file.file_type] || {
                label: file.file_type,
                badge: "bg-zinc-800 text-zinc-400 border-zinc-700",
              };
              return (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="glass-card p-5 border border-white/10 hover:border-violet-500/40 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-105 transition-transform flex-shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${badgeInfo.badge}`}
                      >
                        {badgeInfo.label}
                      </span>
                    </div>

                    <Link href={`/files/${file.id}`}>
                      <h3 className="font-semibold text-white text-base group-hover:text-violet-400 transition-colors line-clamp-2 mb-1.5">
                        {file.title}
                      </h3>
                    </Link>

                    {file.description && (
                      <p className="text-xs text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
                        {file.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400 mt-2">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {file.rating ? file.rating.toFixed(1) : "5.0"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-3.5 h-3.5 text-zinc-500" />
                        {file.downloads}
                      </span>
                      <span className="flex items-center gap-1 text-zinc-500">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDate(file.created_at)}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        downloadFile(`/api/files/${file.id}/download`, file.title).catch(() => {})
                      }
                      title="Yuklab olish"
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-violet-600/20 hover:text-violet-300 text-zinc-300 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {showUpload && (
          <UploadModal
            onClose={() => setShowUpload(false)}
            onSuccess={() => {
              setShowUpload(false);
              load();
            }}
          />
        )}
        <AIChat />
      </div>
    </RequireAuth>
  );
}

export default function FilesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center text-zinc-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2 text-violet-500" />
          Yuklanmoqda...
        </div>
      }
    >
      <FilesContent />
    </Suspense>
  );
}