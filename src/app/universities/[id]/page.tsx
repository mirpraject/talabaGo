"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RequireAuth from "@/components/RequireAuth";
import AIChat from "@/components/AIChat";
import { api } from "@/lib/api";
import {
  Building2,
  GraduationCap,
  MapPin,
  Loader2,
  FileText,
  Download,
  Star,
  Clock,
  Layers,
  ArrowLeft,
} from "lucide-react";

type University = {
  id: number;
  name: string;
  short_name: string;
  description: string | null;
  city: string | null;
};

type Faculty = {
  id: number;
  name: string;
  university_id: number;
};

type FileItem = {
  id: number;
  title: string;
  description: string | null;
  file_type: string;
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

export default function UniversityDetailPage() {
  const params = useParams<{ id: string }>();
  const uniId = Number(params.id);

  const [uni, setUni] = useState<University | null>(null);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [uniData, facData, filesData] = await Promise.all([
        api.get<University>(`/api/universities/${uniId}`),
        api.get<Faculty[]>(`/api/universities/${uniId}/faculties`),
        api.get<FileItem[]>(`/api/files/?university_id=${uniId}`),
      ]);
      setUni(uniData);
      setFaculties(facData);
      setFiles(filesData);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [uniId]);

  useEffect(() => {
    load();
  }, [load]);

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString("uz-UZ", { day: "numeric", month: "short" });
  }

  if (loading) {
    return (
      <RequireAuth>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      </RequireAuth>
    );
  }

  if (notFound || !uni) {
    return (
      <RequireAuth>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <p className="text-red-600 font-medium">Universitet topilmadi</p>
          <Link href="/universities" className="text-primary-600 mt-3 hover:underline">
            ← Universitetlarga qaytish
          </Link>
        </div>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <div className="w-full">
        <main className="py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/universities"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 font-medium mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Universitetlar
            </Link>

            {/* University header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3 flex-wrap">
                    {uni.name}
                    <span className="text-sm font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded">
                      {uni.short_name}
                    </span>
                  </h1>
                  {uni.city && (
                    <p className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                      <MapPin className="w-4 h-4" />
                      {uni.city}
                    </p>
                  )}
                </div>
              </div>
              {uni.description && (
                <p className="text-gray-600 mt-4">{uni.description}</p>
              )}
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                <span className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-3 py-1.5">
                  <Layers className="w-4 h-4 text-primary-600" />
                  {faculties.length} yo'nalish (fakultet)
                </span>
                <span className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-3 py-1.5">
                  <FileText className="w-4 h-4 text-primary-600" />
                  {files.length} ta material
                </span>
              </div>
            </motion.div>

            {/* Faculties */}
            {faculties.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mb-8"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary-600" />
                  Fakultetlar va yo'nalishlar
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {faculties.map((f) => (
                    <div
                      key={f.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
                    >
                      <GraduationCap className="w-5 h-5 text-primary-600 mb-2" />
                      <p className="font-medium text-gray-800">{f.name}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Materials */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-600" />
                Materiallar
              </h2>

              {files.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
                  <FileText className="w-14 h-14 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Hozircha materiallar yo'q
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Ushbu universitet uchun hali fayl yuklanmagan. O'z materialingizni
                    «Fayllar» bo'limi orqali yuklashingiz mumkin.
                  </p>
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
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {file.description}
                            </p>
                          )}
                          <span className="inline-block bg-primary-50 text-primary-600 px-2 py-0.5 rounded font-medium text-sm mt-2">
                            {typeLabels[file.file_type] || file.file_type}
                          </span>
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
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </main>
        <AIChat />
      </div>
    </RequireAuth>
  );
}