"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/lib/api";
import RequireAuth from "@/components/RequireAuth";
import AIChat from "@/components/AIChat";
import {
  User,
  Mail,
  School,
  GraduationCap,
  Save,
  CheckCircle2,
  Loader2,
  Sparkles,
  Shield,
  Star,
} from "lucide-react";

type University = {
  id: number;
  name: string;
  short_name: string;
};

const SCHOOL_GRADES = [5, 6, 7, 8, 9, 10, 11];
const UNI_COURSES = [1, 2, 3, 4];

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { t } = useLanguage();
  const [universities, setUniversities] = useState<University[]>([]);
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [level, setLevel] = useState(user?.level || "school");
  const [grade, setGrade] = useState(user?.grade || 9);
  const [universityId, setUniversityId] = useState(user?.university_id || 0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<University[]>("/api/universities/")
      .then(setUniversities)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setLevel(user.level || "school");
      setGrade(user.grade || (user.level === "university" ? 1 : 9));
      setUniversityId(user.university_id || 0);
    }
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");

    try {
      const updated = await api.put<{
        id: number;
        username: string;
        email: string;
        full_name: string | null;
        level: string | null;
        grade: number | null;
        university_id: number | null;
      }>("/api/auth/me", {
        full_name: fullName.trim() || null,
        level,
        grade,
        university_id: level === "university" && universityId ? universityId : null,
      });

      await refreshUser();

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("ai_error"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <RequireAuth>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Card Header */}
        <div className="glass-card border border-white/10 overflow-hidden mb-6">
          <div className="h-28 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-800 relative">
            <div className="absolute top-3 right-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/40 text-zinc-200 border border-white/10 backdrop-blur-md flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-violet-400" />
                {user?.is_admin ? "Administrator" : "Talaba"}
              </span>
            </div>
          </div>
          <div className="px-6 pb-6 -mt-10 flex items-end gap-4">
            <div className="w-20 h-20 bg-zinc-900 rounded-2xl border-2 border-white/20 flex items-center justify-center shadow-xl text-2xl font-black text-violet-400">
              {(user?.full_name || user?.username || "?").charAt(0).toUpperCase()}
            </div>
            <div className="pt-2">
              <h1 className="text-xl font-bold text-white">
                {user?.full_name || user?.username}
              </h1>
              <p className="text-xs text-zinc-400">@{user?.username}</p>
            </div>
          </div>
        </div>

        {/* Form Settings */}
        <form
          onSubmit={handleSubmit}
          className="glass-card border border-white/10 p-6 space-y-6"
        >
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <User className="w-4 h-4 text-violet-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              {t("profile")}
            </h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              {t("username")}
            </label>
            <input
              type="text"
              value={user?.username || ""}
              disabled
              className="w-full bg-zinc-900/60 border border-white/5 text-zinc-500 text-sm rounded-xl px-4 py-2.5 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              {t("email")}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full bg-zinc-900/60 border border-white/5 text-zinc-500 text-sm rounded-xl pl-10 pr-4 py-2.5 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              {t("full_name")}
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ism va familiyangiz"
              className="w-full bg-zinc-900/80 border border-white/10 text-zinc-100 placeholder-zinc-500 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          {/* Level Switch */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              {t("study_level")}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setLevel("school");
                  setGrade(9);
                }}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                  level === "school"
                    ? "border-violet-500 bg-violet-600/20 text-violet-300 shadow-md shadow-violet-600/20"
                    : "border-white/10 bg-zinc-900/80 text-zinc-400 hover:text-white"
                }`}
              >
                <School className="w-4 h-4" />
                {t("school_student") || "Maktab o'quvchisi"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setLevel("university");
                  setGrade(1);
                }}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                  level === "university"
                    ? "border-violet-500 bg-violet-600/20 text-violet-300 shadow-md shadow-violet-600/20"
                    : "border-white/10 bg-zinc-900/80 text-zinc-400 hover:text-white"
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                {t("university_student") || "OTM talabasi"}
              </button>
            </div>
          </div>

          {/* Grade / Course */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              {level === "school" ? t("grade_label") : t("course_label")}
            </label>
            <div className="flex flex-wrap gap-2">
              {(level === "school" ? SCHOOL_GRADES : UNI_COURSES).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGrade(g)}
                  className={`min-w-10 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    grade === g
                      ? "bg-white text-zinc-950 shadow"
                      : "bg-zinc-900/80 border border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* University selector if level == university */}
          {level === "university" && (
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
                Universitet
              </label>
              <select
                value={universityId}
                onChange={(e) => setUniversityId(Number(e.target.value))}
                className="w-full bg-zinc-900/80 border border-white/10 text-zinc-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-violet-500 cursor-pointer"
              >
                <option value={0}>Universitetni tanlang</option>
                {universities.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {error && <p className="text-xs text-rose-400">{error}</p>}

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            {saved ? (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                O&apos;zgarishlar saqlandi!
              </span>
            ) : (
              <span />
            )}
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>
        </form>

        <AIChat />
      </div>
    </RequireAuth>
  );
}