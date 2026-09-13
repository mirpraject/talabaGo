"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Loader2, CheckCircle2 } from "lucide-react";
import { api, getToken } from "@/lib/api";

type Props = {
  onClose: () => void;
  onSuccess: () => void;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function UploadModal({ onClose, onSuccess }: Props) {
  const [universities, setUniversities] = useState<{ id: number; name: string }[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileType, setFileType] = useState("notes");
  const [universityId, setUniversityId] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get<{ id: number; name: string }[]>("/api/universities/").then(setUniversities).catch(() => {});
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!file) {
      setError("Fayl tanlang");
      return;
    }
    if (!title.trim()) {
      setError("Sarlavha kiriting");
      return;
    }
    if (!universityId) {
      setError("Universitetni tanlang");
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("title", title);
      form.append("description", description);
      form.append("file_type", fileType);
      form.append("university_id", String(universityId));
      form.append("file", file);

      const res = await fetch(`${API_URL}/api/files/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: form,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Yuklashda xatolik");
      }

      setDone(true);
      setTimeout(() => {
        onSuccess();
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yuklashda xatolik");
    } finally {
      setUploading(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 30, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {done ? (
            <div className="p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 15 }}
              >
                <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Muvaffaqiyatli yuklandi!</h2>
              <p className="text-gray-500">Materialingiz tekshiruvdan so'ng ko'rinadi</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Fayl yuklash</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleUpload} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Sarlavha *
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input"
                    placeholder="Masalan: Algebra — 3-mavzu konspekti"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Tavsif
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input min-h-[80px]"
                    placeholder="Material haqida qisqacha ma'lumot..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Fayl turi *
                    </label>
                    <select
                      value={fileType}
                      onChange={(e) => setFileType(e.target.value)}
                      className="input"
                    >
                      <option value="notes">📑 Konspekt</option>
                      <option value="midterm">📝 Oraliq nazorat (ON)</option>
                      <option value="final">🎯 Yakuniy nazorat (YaN)</option>
                      <option value="lectures">🎙️ Ma'ruza</option>
                      <option value="tests">⚡ Test savollari</option>
                      <option value="lab">🧪 Laboratoriya</option>
                      <option value="book">📚 Darslik</option>
                      <option value="exercise">✏️ Mashq</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Universitet *
                    </label>
                    <select
                      value={universityId}
                      onChange={(e) => setUniversityId(Number(e.target.value))}
                      className="input"
                    >
                      <option value={0}>Tanlang...</option>
                      {universities.map((u) => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Fayl *
                  </label>
                  <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 transition-colors">
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-500 text-sm">
                      {file ? file.name : "PDF yoki hujjat tanlang"}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={uploading}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-60"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Yuklanmoqda...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Yuklash
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}