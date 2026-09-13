"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Star,
  Clock,
  Trash2,
  Upload,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RequireAuth from "@/components/RequireAuth";
import AIChat from "@/components/AIChat";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/lib/api";
import { downloadFile } from "@/lib/fileActions";

type FileItem = {
  id: number;
  title: string;
  description: string | null;
  file_type: string;
  file_size: number;
  views: number;
  downloads: number;
  rating: number;
  created_at: string;
};

const typeLabels: Record<string, string> = {
  notes: "Konspekt",
  tests: "Test",
  lectures: "Ma'ruza",
  lab: "Laboratoriya",
  book: "Darslik",
  exercise: "Mashq",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("uz-UZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function MyFilesPage() {
  const { t } = useLanguage();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<FileItem[]>("/api/files/my");
      setFiles(data);
    } catch {
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id: number) {
    setDeleting(id);
    try {
      await api.del(`/api/files/${id}`);
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
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 py-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">{t("my_files_title")}</h1>
                <p className="text-gray-600">{t("my_files_subtitle")} ({files.length})</p>
              </div>
              <Link href="/files" className="btn-primary flex items-center gap-2">
                <Upload className="w-4 h-4" />
                {t("upload_file")}
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
              </div>
            ) : files.length === 0 ? (
              <div className="bg-white rounded-2xl p-16 text-center border border-dashed border-gray-300">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-700 mb-3">{t("my_files_empty")}</h2>
                <Link href="/files" className="btn-primary inline-flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  {t("upload_first")}
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {files.map((file, i) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <Link href={`/files/${file.id}`} className="flex-1 flex items-start gap-4 min-w-0">
                        <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                          <FileText className="w-6 h-6 text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                            {file.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                            <span className="bg-primary-50 text-primary-600 px-2 py-0.5 rounded font-medium">
                              {typeLabels[file.file_type] || file.file_type}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                              {file.rating || "—"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Download className="w-3.5 h-3.5" />
                              {file.downloads}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {formatDate(file.created_at)}
                            </span>
                          </div>
                        </div>
                      </Link>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() =>
                            downloadFile(
                              `/api/files/${file.id}/download`,
                              file.title
                            ).catch(() => {})
                          }
                          title={t("download")}
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                        {confirmDelete === file.id ? (
                          <div className="flex items-center gap-1 bg-red-50 border border-red-200 rounded-lg p-1">
                            <button
                              onClick={() => handleDelete(file.id)}
                              disabled={deleting === file.id}
                              className="p-1.5 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {deleting === file.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <AlertTriangle className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="p-1.5 text-gray-500 hover:text-gray-700 rounded-lg transition-colors text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(file.id)}
                            title={t("delete")}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
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