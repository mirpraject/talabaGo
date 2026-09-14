"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Star,
  Download,
  Eye,
  Loader2,
  User as UserIcon,
  University,
  BookOpen,
  Building2,
  Calendar,
  Layers,
  FileText,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RequireAuth from "@/components/RequireAuth";
import AIChat from "@/components/AIChat";
import { useLanguage } from "@/context/LanguageContext";
import { api, downloadBlob } from "@/lib/api";
import { downloadFile, openFileInNewTab } from "@/lib/fileActions";

type FileDetail = {
  id: number;
  title: string;
  description: string | null;
  file_type: string;
  file_size: number;
  downloads: number;
  views: number;
  rating: number;
  uploader_name: string | null;
  university_name: string | null;
  faculty_name: string | null;
  subject_name: string | null;
  semester: number | null;
  course: number | null;
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

function formatSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
}

export default function FileDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const { t } = useLanguage();
  const [file, setFile] = useState<FileDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [ratingMessage, setRatingMessage] = useState("");
  const [downloadErr, setDownloadErr] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await api.get<FileDetail>(`/api/files/${id}`);
      setFile(data);
    } catch (e) {
      setDownloadErr(e instanceof Error ? e.message : t("ai_error"));
    } finally {
      setLoading(false);
    }
  }, [id, t]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleRate(score: number) {
    setRating(score);
    setRatingMessage("");
    try {
      const res = await api.post<{ rating: number }>(`/api/files/${id}/rating`, {
        score,
      });
      setFile((f) => (f ? { ...f, rating: res.rating } : f));
      setRatingMessage(t("rated_success"));
    } catch (e) {
      setRatingMessage(e instanceof Error ? e.message : t("ai_error"));
    }
  }

  async function handleDownload() {
    setDownloadErr("");
    try {
      const blob = await downloadBlob(`/api/files/${id}/download`);
      const ext =
        blob.type === "application/pdf"
          ? ".pdf"
          : blob.type === "text/plain"
          ? ".txt"
          : "";
      await downloadFile(
        `/api/files/${id}/download`,
        `${file?.title || "material"}${ext}`
      );
    } catch (e) {
      setDownloadErr(e instanceof Error ? e.message : t("ai_error"));
    }
  }

  return (
    <RequireAuth>
      <div className="w-full">
        <main className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/files"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 font-medium mb-6 transition-colors"
            >
              {t("back_to_files")}
            </Link>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
              </div>
            ) : !file ? (
              <div className="bg-white rounded-2xl p-16 text-center border border-dashed border-gray-300">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-700">{t("no_files_title")}</h2>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header section */}
                <div className="p-6 sm:p-8 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                    <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <FileText className="w-8 h-8 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="bg-primary-50 text-primary-600 px-3 py-1 rounded-full text-sm font-medium">
                          {typeLabels[file.file_type] || file.file_type}
                        </span>
                        {file.university_name && (
                          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                            {file.university_name}
                          </span>
                        )}
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                        {file.title}
                      </h1>
                      {file.description && (
                        <p className="text-gray-600 whitespace-pre-line">{file.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button
                      onClick={handleDownload}
                      className="btn-primary flex-1 flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      {t("download")}
                    </button>
                    <button
                      onClick={() =>
                        openFileInNewTab(`/api/files/${id}/download`).catch((e) =>
                          setDownloadErr(e instanceof Error ? e.message : "")
                        )
                      }
                      className="btn-secondary flex items-center justify-center gap-2"
                    >
                      <Eye className="w-5 h-5" />
                      {t("view_file")}
                    </button>
                  </div>
                  {downloadErr && (
                    <p className="text-red-500 text-sm mt-3">{downloadErr}</p>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-gray-100">
                  <div className="p-5 text-center">
                    <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gray-900">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      {file.rating || 0}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{t("rate_this")}</p>
                  </div>
                  <div className="p-5 text-center border-l border-gray-100">
                    <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gray-900">
                      <Download className="w-5 h-5 text-gray-400" />
                      {file.downloads}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{t("downloads_count")}</p>
                  </div>
                  <div className="p-5 text-center border-l border-gray-100">
                    <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gray-900">
                      <Eye className="w-5 h-5 text-gray-400" />
                      {file.views}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{t("views_count")}</p>
                  </div>
                  <div className="p-5 text-center border-l border-gray-100">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatSize(file.file_size)}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{t("file_size")}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 sm:p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <UserIcon className="w-5 h-5 text-primary-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">{t("author")}</p>
                        <p className="font-medium text-gray-900">{file.uploader_name || "—"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <University className="w-5 h-5 text-primary-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">{t("university_name")}</p>
                        <p className="font-medium text-gray-900">{file.university_name || "—"}</p>
                      </div>
                    </div>
                    {file.faculty_name && (
                      <div className="flex items-start gap-3">
                        <Building2 className="w-5 h-5 text-primary-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">{t("faculty")}</p>
                          <p className="font-medium text-gray-900">{file.faculty_name}</p>
                        </div>
                      </div>
                    )}
                    {file.subject_name && (
                      <div className="flex items-start gap-3">
                        <BookOpen className="w-5 h-5 text-primary-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">{t("subject")}</p>
                          <p className="font-medium text-gray-900">{file.subject_name}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <Layers className="w-5 h-5 text-primary-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">{t("semester")}</p>
                        <p className="font-medium text-gray-900">{file.semester ? `Semestr ${file.semester}` : "—"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">{t("file_type_label")}</p>
                        <p className="font-medium text-gray-900">
                          {typeLabels[file.file_type] || file.file_type}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="mt-8 bg-gray-50 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {t("your_rating")} ({rating ? `${rating}/5` : t("no_rating")})
                      </h3>
                      {ratingMessage && (
                        <p className="text-sm text-green-600 font-medium">{ratingMessage}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((score) => (
                        <button
                          key={score}
                          onClick={() => handleRate(score)}
                          className="p-1 group"
                          title={`${score}/5`}
                        >
                          <Star
                            className={`w-8 h-8 transition-all ${
                              score <= rating
                                ? "text-yellow-400 fill-yellow-400 scale-110"
                                : "text-gray-300 group-hover:text-yellow-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        <AIChat />
      </div>
    </RequireAuth>
  );
}