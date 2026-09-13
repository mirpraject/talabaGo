"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  User as UserIcon,
  Mail,
  University,
  BookOpen,
  Save,
  Loader2,
  Shield,
  Phone,
  Star,
  School,
  GraduationCap,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RequireAuth from "@/components/RequireAuth";
import AIChat from "@/components/AIChat";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { t } = useLanguage();
  const [form, setForm] = useState({
    full_name: "",
    university: "",
    level: "school",
    grade: 9,
    bio: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        full_name: user.full_name || "",
        university: user.university || "",
        level: user.level === "university" ? "university" : "school",
        grade: user.grade || (user.level === "university" ? 1 : 9),
        bio: user.bio || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const update = useCallback((field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSavedMsg("");
    try {
      await api.put("/api/auth/me", {
        full_name: form.full_name || null,
        university: form.university || null,
        level: form.level,
        grade: Number(form.grade),
        bio: form.bio || null,
        phone: form.phone || null,
      });
      await refreshUser();
      setSavedMsg(t("saved_success"));
    } catch {
      setSavedMsg("");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all";

  return (
    <RequireAuth>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 py-10">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Profile header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
              <div className="h-24 bg-gradient-to-r from-primary-600 to-primary-800" />
              <div className="px-6 pb-6 -mt-12 flex items-end gap-4">
                <div className="w-24 h-24 bg-primary-100 rounded-2xl border-4 border-white flex items-center justify-center shadow-lg">
                  <span className="text-3xl font-bold text-primary-700">
                    {(user?.full_name || user?.username || "?").charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="pb-1">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user?.full_name || user?.username}
                  </h1>
                  <p className="text-gray-500">@{user?.username}</p>
                  {user?.level && (
                    <span className="inline-flex items-center gap-1 mt-1 text-xs font-medium text-primary-700 bg-primary-50 border border-primary-100 rounded-lg px-2 py-0.5">
                      {user.level === "school" ? (
                        <School className="w-3.5 h-3.5" />
                      ) : (
                        <GraduationCap className="w-3.5 h-3.5" />
                      )}
                      {user.level === "school"
                        ? `${user.grade}-${t("grade_label")}`
                        : `${user.grade}-${t("course_label")}`}
                    </span>
                  )}
                  <Link
                    href="/rewards"
                    className="inline-flex items-center gap-1.5 mt-2 text-sm font-semibold text-amber-600 hover:text-amber-500 bg-amber-50 border border-amber-100 rounded-lg px-3 py-1"
                  >
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    {user?.stars || 0} ★
                  </Link>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                <Mail className="w-5 h-5 text-primary-600 mx-auto mb-1" />
                <p className="text-sm font-medium text-gray-900 truncate">{user?.email || "—"}</p>
                <p className="text-xs text-gray-500">{t("email")}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                <Phone className="w-5 h-5 text-primary-600 mx-auto mb-1" />
                <p className="text-sm font-medium text-gray-900 truncate">{user?.phone || "—"}</p>
                <p className="text-xs text-gray-500">{t("phone")}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                <University className="w-5 h-5 text-primary-600 mx-auto mb-1" />
                <p className="text-sm font-medium text-gray-900 truncate">{user?.university || "—"}</p>
                <p className="text-xs text-gray-500">{t("university_name")}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                <Shield className="w-5 h-5 text-primary-600 mx-auto mb-1" />
                <p className="text-sm font-medium text-gray-900">
                  {user?.is_admin ? t("admin_badge") : "Talaba"}
                </p>
                <p className="text-xs text-gray-500">Rol</p>
              </div>
            </div>

            {/* Edit form */}
            <form
              onSubmit={handleSave}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary-600" />
                {t("edit_profile")}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("full_name")}
                  </label>
                  <input
                    value={form.full_name}
                    onChange={(e) => update("full_name", e.target.value)}
                    className={inputClass}
                    placeholder="Ali Valiyev"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("university_name")}
                  </label>
                  <input
                    value={form.university}
                    onChange={(e) => update("university", e.target.value)}
                    className={inputClass}
                    placeholder="TATU, NUUz..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("phone")}
                  </label>
                  <input
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className={inputClass}
                    placeholder={t("phone_placeholder")}
                    inputMode="tel"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("study_level")}
                  </label>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <button
                      type="button"
                      onClick={() => {
                        setForm({ ...form, level: "school", grade: 9 });
                      }}
                      className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border font-medium transition-all ${
                        form.level === "school"
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-gray-200 text-gray-600 hover:border-primary-300"
                      }`}
                    >
                      <School className="w-5 h-5" />
                      {t("school_student")}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setForm({ ...form, level: "university", grade: 1 });
                      }}
                      className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border font-medium transition-all ${
                        form.level === "university"
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-gray-200 text-gray-600 hover:border-primary-300"
                      }`}
                    >
                      <GraduationCap className="w-5 h-5" />
                      {t("university_student")}
                    </button>
                  </div>
                  <select
                    value={form.grade}
                    onChange={(e) => update("grade", e.target.value)}
                    className={inputClass}
                  >
                    {form.level === "school"
                      ? [5, 6, 7, 8, 9, 10, 11].map((g) => (
                          <option key={g} value={g}>
                            {g}-{t("grade_label")}
                          </option>
                        ))
                      : [1, 2, 3, 4].map((g) => (
                          <option key={g} value={g}>
                            {g}-{t("course_label")}
                          </option>
                        ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("bio")}
                  </label>
                  <textarea
                    rows={3}
                    value={form.bio}
                    onChange={(e) => update("bio", e.target.value)}
                    className={inputClass + " resize-none"}
                    placeholder={t("bio_placeholder")}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                {savedMsg ? (
                  <p className="text-sm text-green-600 font-medium">{savedMsg}</p>
                ) : (
                  <span />
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex items-center gap-2 disabled:opacity-60"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? t("saving") : t("save_changes")}
                </button>
              </div>
            </form>
          </div>
        </main>
        <Footer />
        <AIChat />
      </div>
    </RequireAuth>
  );
}