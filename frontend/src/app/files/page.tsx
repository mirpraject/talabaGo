"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RequireAuth from "@/components/RequireAuth";
import UploadModal from "@/components/UploadModal";
import AIChat from "@/components/AIChat";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/lib/api";
import { downloadFile } from "@/lib/fileActions";
import { FileText, Download, Star, Clock, Search, Loader2, Upload } from "lucide-react";

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

const typeLabels: Record<string, string> = {
  notes: "Konspekt",
  midterm: "Oraliq nazorat (ON)",
  final: "Yakuniy nazorat (YaN)",
  lectures: "Ma'ruza",
  tests: "Test",
  lab: "Laboratoriya",
  book: "Darslik",
  exercise: "Mashq",
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
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  Salom, {user?.full_name || user?.username}! 👋
                </h1>
                <p className="text-gray-600">{t("files_greeting")}</p>
              </div>
              <button
                onClick={() => setShowUpload(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                {t("upload_file")}
              </button>
            </div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8 flex flex-col lg:flex-row gap-4"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Material qidirish..."
                  className="input pl-10"
                />
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="input lg:w-52 font-medium"
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
                className="input lg:w-56"
              >
                <option value={0}>Barcha universitetlar</option>
                {universities.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Files list */}
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
              </div>
            ) : files.length === 0 ? (
              <div className="bg-white rounded-2xl p-16 text-center border border-dashed border-gray-300">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-700 mb-3">{t("no_files_title")}</h2>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  {t("no_files_text")}
                </p>
                <button onClick={() => setShowUpload(true)} className="btn-primary">
                  {t("upload_file")}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {files.map((file, i) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="card group cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary-100 transition-colors">
                        <FileText className="w-6 h-6 text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/files/${file.id}`}>
                          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                            {file.title}
                          </h3>
                        </Link>
                        {file.description && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{file.description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-500">
                          <span className="bg-primary-50 text-primary-600 px-2 py-0.5 rounded font-medium">
                            {typeLabels[file.file_type] || file.file_type}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            {file.rating || "—"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="w-4 h-4" />
                            {file.downloads}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDate(file.created_at)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          downloadFile(`/api/files/${file.id}/download`, file.title).catch(() => {})
                        }
                        title="Yuklab olish"
                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors flex-shrink-0"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>
        <Footer />

        {showUpload && <UploadModal onClose={() => setShowUpload(false)} onSuccess={() => { setShowUpload(false); load(); }} />}
        <AIChat />
      </div>
    </RequireAuth>
  );
}

export default function FilesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Yuklanmoqda...</div>}>
      <FilesContent />
    </Suspense>
  );
}