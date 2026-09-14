"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  FileText,
  Download,
  Eye,
  Star,
  Building2,
  BookOpen,
  ShieldAlert,
  Loader2,
  ClipboardList,
  Check,
  X,
  Wallet,
  Plus,
  Edit2,
  Trash2,
  Search,
  School,
  GraduationCap,
  Layers,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  ArrowRightLeft,
  Megaphone,
  ExternalLink,
  ShieldCheck,
  Crown,
  Snowflake,
  Ban,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AIChat from "@/components/AIChat";
import UserAvatar from "@/components/UserAvatar";
import Logo from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/lib/api";

type TabType = "overview" | "subjects" | "files" | "tests" | "users" | "withdrawals" | "announcements";

type AnnouncementItem = {
  id: number;
  title: string;
  content: string | null;
  type: string;
  badge_text: string | null;
  link_url: string | null;
  is_active: boolean;
  priority: number;
  created_at: string;
};


type Overview = {
  users: number;
  files: number;
  universities: number;
  subjects: number;
  tests: number;
  downloads_total: number;
  views_total: number;
  ratings_total: number;
  stars_total: number;
  withdrawals_pending: number;
};

type UniversityItem = {
  id: number;
  name: string;
  short_name: string;
  city: string | null;
  faculty_count: number;
  file_count: number;
};

type FacultyItem = {
  id: number;
  name: string;
  university_id: number;
};

type SubjectItem = {
  id: number;
  name: string;
  file_count: number;
  test_count: number;
};

type FileItem = {
  id: number;
  title: string;
  description: string | null;
  file_type: string;
  file_size: number;
  views: number;
  downloads: number;
  rating: number;
  university_name: string | null;
  subject_name: string | null;
  uploader_name: string | null;
  created_at: string;
};

type TestItem = {
  id: number;
  title: string;
  subject_id: number | null;
  subject_name: string | null;
  description: string | null;
  level: string | null;
  grade: number | null;
  is_ai_generated: boolean;
  question_count: number;
  tickets_count: number;
  created_at: string;
};

type QuestionItem = {
  id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string | null;
};

type UserItem = {
  id: number;
  student_id?: string | null;
  avatar_url?: string | null;
  username: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  university: string | null;
  level: string | null;
  grade: number | null;
  is_admin: boolean;
  is_premium?: boolean;
  is_active?: boolean;
  is_blocked?: boolean;
  block_reason?: string | null;
  stars: number;
  created_at: string;
};

type UserActivity = {
  user: UserItem;
  files: Array<{
    id: number;
    title: string;
    file_type: string;
    file_size: number;
    views: number;
    downloads: number;
    rating: number;
    created_at: string;
  }>;
  withdrawals: Array<{
    id: number;
    amount: number;
    stars_spent: number;
    method: string;
    target: string;
    status: string;
    created_at: string;
  }>;
  sent_transfers: Array<{
    id: number;
    recipient_id: number;
    recipient_student_id: string;
    recipient_username: string;
    stars: number;
    note: string | null;
    created_at: string;
  }>;
  received_transfers: Array<{
    id: number;
    sender_id: number;
    sender_student_id: string;
    sender_username: string;
    stars: number;
    note: string | null;
    created_at: string;
  }>;
  tests: Array<{
    id: number;
    title: string;
    level: string | null;
    grade: number | null;
    created_at: string;
  }>;
};


type WithdrawalItem = {
  id: number;
  amount: number;
  stars_spent: number;
  method: string;
  target: string;
  status: string;
  created_at: string;
};

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Tab Data States
  const [universities, setUniversities] = useState<UniversityItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [tests, setTests] = useState<TestItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalItem[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);

  // Search filters
  const [fileSearch, setFileSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [testSearch, setTestSearch] = useState("");
  const [announcementSearch, setAnnouncementSearch] = useState("");
  const [userFilter, setUserFilter] = useState<"all" | "active" | "frozen" | "blocked" | "admin" | "premium" | "stars">("all");
  const [copiedTargetId, setCopiedTargetId] = useState<number | null>(null);
  const [starModalUser, setStarModalUser] = useState<UserItem | null>(null);
  const [starDelta, setStarDelta] = useState<string>("10");
  const [blockModalUser, setBlockModalUser] = useState<UserItem | null>(null);
  const [blockReasonInput, setBlockReasonInput] = useState<string>("");
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<UserItem | null>(null);

  // Sub-view: Test Questions Manager
  const [selectedTest, setSelectedTest] = useState<TestItem | null>(null);
  const [testQuestions, setTestQuestions] = useState<QuestionItem[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // Sub-view: University Faculties Manager
  const [selectedUni, setSelectedUni] = useState<UniversityItem | null>(null);
  const [uniFaculties, setUniFaculties] = useState<FacultyItem[]>([]);
  const [loadingFaculties, setLoadingFaculties] = useState(false);

  // Sub-view: User Activity Inspector
  const [selectedUserActivity, setSelectedUserActivity] = useState<UserActivity | null>(null);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [activityActiveTab, setActivityActiveTab] = useState<"files" | "transfers" | "withdrawals" | "tests">("files");

  const openUserInspector = async (userId: number) => {
    setLoadingActivity(true);
    setModalType("user_inspector");
    try {
      const act = await api.get<UserActivity>(`/api/admin/users/${userId}/activity`);
      setSelectedUserActivity(act);
    } catch (err: any) {
      setError("Foydalanuvchi ma'lumotlarini yuklab bo'lmadi");
    } finally {
      setLoadingActivity(false);
    }
  };

  // Modals state
  const [modalType, setModalType] = useState<string | null>(null);
  const [modalData, setModalData] = useState<any>(null);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  const handleAdjustStars = async (userId: number, delta: number) => {
    try {
      await api.post(`/api/admin/users/${userId}/adjust-stars`, { delta });
      showNotification("Yulduzlar balansi muvaffaqiyatli yangilandi!");
      setStarModalUser(null);
      loadUsers();
      loadOverview();
    } catch (err: any) {
      setError(err?.message || "Yulduzlar miqdorini o'zgartirib bo'lmadi");
    }
  };

  const handleTogglePremium = async (userId: number) => {
    try {
      const res: any = await api.post(`/api/admin/users/${userId}/toggle-premium`, {});
      showNotification(`Premium holati: ${res.is_premium ? "VIP Premium yoqildi" : "Premium bekor qilindi"}`);
      loadUsers();
    } catch (err: any) {
      setError(err?.message || "Premium holatini o'zgartirib bo'lmadi");
    }
  };

  const handleToggleFreeze = async (userId: number) => {
    try {
      const res: any = await api.post(`/api/admin/users/${userId}/toggle-freeze`, {});
      showNotification(res.message || "Hisob holati o'zgartirildi");
      loadUsers();
    } catch (err: any) {
      setError(err?.message || "Hisobni muzlatib bo'lmadi");
    }
  };

  const handleSaveBlockStatus = async (user: UserItem, isBlocked: boolean, reason?: string) => {
    try {
      const res: any = await api.post(`/api/admin/users/${user.id}/toggle-block`, {
        is_blocked: isBlocked,
        reason: reason || null,
      });
      showNotification(res.message || "Blok holati yangilandi");
      setBlockModalUser(null);
      setBlockReasonInput("");
      loadUsers();
    } catch (err: any) {
      setError(err?.message || "Blok holatini o'zgartirib bo'lmadi");
    }
  };

  const handleExecuteDeleteUser = async (userId: number) => {
    try {
      const res: any = await api.delete(`/api/admin/users/${userId}`);
      showNotification(res?.message || "Foydalanuvchi muvaffaqiyatli o'chirildi");
      setDeleteConfirmUser(null);
      loadUsers();
      loadOverview();
    } catch (err: any) {
      setError(err?.message || "Foydalanuvchini o'chirib bo'lmadi");
    }
  };

  const handleCopyCard = (target: string, id: number) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(target);
      setCopiedTargetId(id);
      showNotification("Karta raqami nusxalandi: " + target);
      setTimeout(() => setCopiedTargetId(null), 2500);
    }
  };

  const loadOverview = useCallback(async () => {
    try {
      const [ov, withs] = await Promise.all([
        api.get<Overview>("/api/stats/overview"),
        api.get<WithdrawalItem[]>("/api/rewards/admin/withdrawals"),
      ]);
      setOverview(ov);
      setWithdrawals(withs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xatolik yuz berdi");
    }
  }, []);

  const loadUniversities = useCallback(async () => {
    try {
      const data = await api.get<UniversityItem[]>("/api/admin/universities");
      setUniversities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Universitetlarni yuklab bo'lmadi");
    }
  }, []);

  const loadSubjects = useCallback(async () => {
    try {
      const data = await api.get<SubjectItem[]>("/api/admin/subjects");
      setSubjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fanlarni yuklab bo'lmadi");
    }
  }, []);

  const loadFiles = useCallback(async () => {
    try {
      const data = await api.get<FileItem[]>(`/api/admin/files?search=${encodeURIComponent(fileSearch)}`);
      setFiles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fayllarni yuklab bo'lmadi");
    }
  }, [fileSearch]);

  const loadTests = useCallback(async () => {
    try {
      const data = await api.get<TestItem[]>("/api/admin/tests");
      setTests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Testlarni yuklab bo'lmadi");
    }
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      const data = await api.get<UserItem[]>("/api/admin/users");
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Foydalanuvchilarni yuklab bo'lmadi");
    }
  }, []);

  const loadAnnouncements = useCallback(async () => {
    try {
      const data = await api.get<AnnouncementItem[]>("/api/admin/announcements");
      setAnnouncements(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "E'lonlarni yuklab bo'lmadi");
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user?.is_admin) {
      setLoading(true);
      Promise.all([
        loadOverview(),
        loadUniversities(),
        loadSubjects(),
        loadFiles(),
        loadTests(),
        loadUsers(),
        loadAnnouncements(),
      ]).finally(() => setLoading(false));
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [
    user,
    authLoading,
    loadOverview,
    loadUniversities,
    loadSubjects,
    loadFiles,
    loadTests,
    loadUsers,
    loadAnnouncements,
  ]);

  // Questions for test
  const openQuestions = async (tItem: TestItem) => {
    setSelectedTest(tItem);
    setLoadingQuestions(true);
    try {
      const qs = await api.get<QuestionItem[]>(`/api/admin/tests/${tItem.id}/questions`);
      setTestQuestions(qs);
    } catch (err) {
      setError("Savollarni yuklab bo'lmadi");
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Faculties for university
  const openFaculties = async (uItem: UniversityItem) => {
    setSelectedUni(uItem);
    setLoadingFaculties(true);
    try {
      const facs = await api.get<FacultyItem[]>(`/api/admin/universities/${uItem.id}/faculties`);
      setUniFaculties(facs);
    } catch (err) {
      setError("Fakultetlarni yuklab bo'lmadi");
    } finally {
      setLoadingFaculties(false);
    }
  };

  // CRUD Actions
  async function handleSaveUniversity(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (modalData.id) {
        await api.put(`/api/admin/universities/${modalData.id}`, modalData);
        showNotification("Universitet muvaffaqiyatli yangilandi");
      } else {
        await api.post("/api/admin/universities", modalData);
        showNotification("Yangi universitet qo'shildi");
      }
      setModalType(null);
      await loadUniversities();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Saqlashda xatolik");
    }
  }

  async function handleDeleteUniversity(id: number) {
    if (!confirm("Rostdan ham bu universitetni va unga tegishli barcha yo'nalishlarni o'chirmoqchimisiz?")) return;
    try {
      await api.delete(`/api/admin/universities/${id}`);
      showNotification("Universitet o'chirildi");
      await loadUniversities();
    } catch (err) {
      setError(err instanceof Error ? err.message : "O'chirishda xatolik");
    }
  }

  async function handleSaveFaculty(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedUni) return;
    try {
      if (modalData.id) {
        await api.put(`/api/admin/faculties/${modalData.id}`, { name: modalData.name });
        showNotification("Fakultet yangilandi");
      } else {
        await api.post(`/api/admin/universities/${selectedUni.id}/faculties`, { name: modalData.name });
        showNotification("Yangi fakultet qo'shildi");
      }
      setModalType(null);
      await openFaculties(selectedUni);
      await loadUniversities();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fakultetni saqlashda xatolik");
    }
  }

  async function handleDeleteFaculty(facId: number) {
    if (!confirm("Fakultetni o'chirmoqchimisiz?")) return;
    try {
      await api.delete(`/api/admin/faculties/${facId}`);
      showNotification("Fakultet o'chirildi");
      if (selectedUni) await openFaculties(selectedUni);
      await loadUniversities();
    } catch (err) {
      setError("O'chirishda xatolik");
    }
  }

  async function handleSaveSubject(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (modalData.id) {
        await api.put(`/api/admin/subjects/${modalData.id}`, { name: modalData.name });
        showNotification("Fan yangilandi");
      } else {
        await api.post("/api/admin/subjects", { name: modalData.name });
        showNotification("Yangi fan qo'shildi");
      }
      setModalType(null);
      await loadSubjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fanni saqlashda xatolik");
    }
  }

  async function handleDeleteSubject(id: number) {
    if (!confirm("Rostdan ham bu fanni o'chirmoqchimisiz?")) return;
    try {
      await api.delete(`/api/admin/subjects/${id}`);
      showNotification("Fan o'chirildi");
      await loadSubjects();
    } catch (err) {
      setError("O'chirishda xatolik");
    }
  }

  async function handleSaveFile(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.put(`/api/admin/files/${modalData.id}`, modalData);
      showNotification("Fayl ma'lumotlari yangilandi");
      setModalType(null);
      await loadFiles();
    } catch (err) {
      setError("Faylni yangilashda xatolik");
    }
  }

  async function handleDeleteFile(id: number) {
    if (!confirm("Rostdan ham ushbu faylni o'chirmoqchimisiz?")) return;
    try {
      await api.delete(`/api/admin/files/${id}`);
      showNotification("Fayl o'chirildi");
      await loadFiles();
    } catch (err) {
      setError("O'chirishda xatolik");
    }
  }

  async function handleSaveTest(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (modalData.id) {
        await api.put(`/api/admin/tests/${modalData.id}`, modalData);
        showNotification("Test yangilandi");
      } else {
        await api.post("/api/admin/tests", modalData);
        showNotification("Yangi test qo'shildi");
      }
      setModalType(null);
      await loadTests();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Testni saqlashda xatolik");
    }
  }

  async function handleDeleteTest(id: number) {
    if (!confirm("Testni va unga tegishli barcha savollarni o'chirmoqchimisiz?")) return;
    try {
      await api.delete(`/api/admin/tests/${id}`);
      showNotification("Test o'chirildi");
      if (selectedTest?.id === id) setSelectedTest(null);
      await loadTests();
    } catch (err) {
      setError("O'chirishda xatolik");
    }
  }

  async function handleSaveQuestion(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTest) return;
    try {
      if (modalData.id) {
        await api.put(`/api/admin/questions/${modalData.id}`, modalData);
        showNotification("Savol yangilandi");
      } else {
        await api.post(`/api/admin/tests/${selectedTest.id}/questions`, modalData);
        showNotification("Savol qo'shildi");
      }
      setModalType(null);
      await openQuestions(selectedTest);
      await loadTests();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Savolni saqlashda xatolik");
    }
  }

  async function handleDeleteQuestion(id: number) {
    if (!confirm("Ushbu savolni o'chirmoqchimisiz?")) return;
    try {
      await api.delete(`/api/admin/questions/${id}`);
      showNotification("Savol o'chirildi");
      if (selectedTest) await openQuestions(selectedTest);
      await loadTests();
    } catch (err) {
      setError("O'chirishda xatolik");
    }
  }

  async function handleSaveUser(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (modalData.id) {
        await api.put(`/api/admin/users/${modalData.id}`, modalData);
        showNotification("Foydalanuvchi ma'lumotlari yangilandi");
      } else {
        await api.post("/api/admin/users", modalData);
        showNotification("Yangi foydalanuvchi qo'shildi");
      }
      setModalType(null);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Foydalanuvchini saqlashda xatolik");
    }
  }

  async function handleDeleteUser(id: number) {
    if (!confirm("Rostdan ham bu foydalanuvchini o'chirmoqchimisiz?")) return;
    try {
      await api.delete(`/api/admin/users/${id}`);
      showNotification("Foydalanuvchi o'chirildi");
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "O'chirishda xatolik");
    }
  }

  async function handleWithdrawal(id: number, action: "approve" | "reject") {
    try {
      await api.post(`/api/rewards/admin/withdrawals/${id}/${action}`);
      showNotification(action === "approve" ? "Pul o'tkazmasi tasdiqlandi" : "So'rov rad etildi");
      await loadOverview();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Amalni bajarishda xatolik");
    }
  }

  async function handleSaveAnnouncement(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (modalData.id) {
        await api.put(`/api/admin/announcements/${modalData.id}`, modalData);
        showNotification("E'lon / reklama muvaffaqiyatli yangilandi");
      } else {
        await api.post("/api/admin/announcements", modalData);
        showNotification("Yangi e'lon / reklama qo'shildi");
      }
      setModalType(null);
      await loadAnnouncements();
    } catch (err) {
      setError(err instanceof Error ? err.message : "E'lonni saqlashda xatolik");
    }
  }

  async function handleDeleteAnnouncement(id: number) {
    if (!confirm("Ushbu e'lon yoki reklamani o'chirmoqchimisiz?")) return;
    try {
      await api.delete(`/api/admin/announcements/${id}`);
      showNotification("E'lon o'chirildi");
      await loadAnnouncements();
    } catch (err) {
      setError(err instanceof Error ? err.message : "O'chirishda xatolik");
    }
  }

  async function handleToggleAnnouncement(id: number) {
    try {
      await api.patch(`/api/admin/announcements/${id}/toggle`);
      await loadAnnouncements();
      showNotification("E'lon holati o'zgartirildi");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Holatni o'zgartirishda xatolik");
    }
  }

  const filteredAnnouncements = announcements.filter((a) => {
    if (!announcementSearch) return true;
    const q = announcementSearch.toLowerCase();
    return (
      a.title.toLowerCase().includes(q) ||
      (a.badge_text && a.badge_text.toLowerCase().includes(q)) ||
      (a.content && a.content.toLowerCase().includes(q)) ||
      a.type.toLowerCase().includes(q)
    );
  });

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!user?.is_admin) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center max-w-md w-full">
            <ShieldAlert className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Administrator huquqi talab etiladi</h2>
            <p className="text-sm text-gray-500 mb-6">
              Ushbu bo&apos;limga faqat platforma ma&apos;murlari kirishi mumkin.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100"
            >
              Tizimga kirish
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const statCards = overview
    ? [
        { label: "Foydalanuvchilar", value: overview.users, icon: Users, tab: "users" },
        { label: "Materiallar (Fayllar)", value: overview.files, icon: FileText, tab: "files" },
        { label: "Testlar", value: overview.tests, icon: ClipboardList, tab: "tests" },
        { label: "Fanlar", value: overview.subjects, icon: BookOpen, tab: "subjects" },
        { label: "Kutilayotgan pullar", value: overview.withdrawals_pending, icon: Wallet, tab: "withdrawals" },
        { label: "Jami yuklashlar", value: overview.downloads_total, icon: Download },
        { label: "Jami yulduzlar", value: overview.stars_total, icon: Star },
      ]
    : [];

  return (
    <div className="w-full">
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          {/* Header */}
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-emerald-500 p-0.5 shadow-md shadow-blue-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-white">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">TalabaGo Admin Markazi</h1>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Online
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-500">
                  Foydalanuvchilar, materiallar, testlar va moliyaviy so&apos;rovlarni to&apos;liq nazorat qilish
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/files"
                className="text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-50 hover:bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200 transition-all cursor-pointer"
              >
                📁 Fayllar bazasi
              </Link>
              <Link
                href="/"
                className="text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                ← Asosiy saytga qaytish
              </Link>
            </div>
          </div>

          {/* Toast / Alert notifications */}
          {successMsg && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm animate-fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              {successMsg}
            </div>
          )}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between shadow-sm">
              <span>{error}</span>
              <button onClick={() => setError("")} className="text-red-500 hover:text-red-700">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Tabs Navigation */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 scrollbar-none border-b border-gray-200">
            {[
              { id: "overview", label: "📊 Umumiy", icon: ShieldAlert },
              { id: "subjects", label: "📚 Fanlar", count: subjects.length },
              { id: "files", label: "📁 Fayllar", count: files.length },
              { id: "tests", label: "📝 Testlar & Savollar", count: tests.length },
              { id: "users", label: "👥 Foydalanuvchilar", count: users.length },
              { id: "withdrawals", label: "💳 Yechib olishlar", count: withdrawals.filter((w) => w.status === "pending").length },
              { id: "announcements", label: "📢 E'lonlar & Reklama", count: announcements.length },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as TabType);
                    setSelectedTest(null);
                    setSelectedUni(null);
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                        isActive
                          ? "bg-indigo-700 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Quick Actions Header Card */}
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold tracking-wider uppercase text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 rounded-full">
                      Tezkor Amallar Paneli
                    </span>
                    <h2 className="text-xl font-black mt-2">Boshqaruv markaziga xush kelibsiz!</h2>
                    <p className="text-xs text-slate-300 max-w-xl mt-1">
                      Kerakli bo&apos;limga bir zumda o&apos;ting, yangi materiallar, testlar yoki e&apos;lonlarni darhol yarating.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    <button
                      onClick={() => {
                        setModalData({
                          title: "",
                          content: "",
                          type: "ad",
                          badge_text: "REKLAMA",
                          link_url: "",
                          is_active: true,
                          priority: 0,
                        });
                        setModalType("announcement");
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      <Megaphone className="w-4 h-4" /> Yangi e&apos;lon
                    </button>
                    <button
                      onClick={() => {
                        setModalType("test");
                        setModalData({ title: "", subject_id: subjects[0]?.id || null, level: "school", grade: 9, description: "" });
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Test yaratish
                    </button>
                    <button
                      onClick={() => {
                        setModalType("user");
                        setModalData({ username: "", password: "", full_name: "", email: "", phone: "", is_admin: false });
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                    >
                      <Users className="w-4 h-4" /> Yangi talaba
                    </button>
                    {withdrawals.filter((w) => w.status === "pending").length > 0 && (
                      <button
                        onClick={() => setActiveTab("withdrawals")}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md animate-pulse cursor-pointer"
                      >
                        <Wallet className="w-4 h-4" /> Pul yechishlar ({withdrawals.filter((w) => w.status === "pending").length})
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {statCards.map((card, i) => (
                  <div
                    key={i}
                    onClick={() => card.tab && setActiveTab(card.tab as TabType)}
                    className={`bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs transition-all group ${
                      card.tab ? "cursor-pointer hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 group-hover:bg-blue-50 text-slate-700 group-hover:text-blue-600 flex items-center justify-center transition-colors">
                        <card.icon className="w-5 h-5" />
                      </div>
                      {card.tab && (
                        <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                          Batafsil →
                        </span>
                      )}
                    </div>
                    <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">{card.value}</p>
                    <p className="text-xs font-semibold text-slate-500 mt-1">{card.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SUBJECTS */}
          {activeTab === "subjects" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Fanlar ro&apos;yxati ({subjects.length})</h2>
                  <p className="text-xs text-gray-500">Barcha fanlarni kiritish, tahrirlash va nazorat qilish</p>
                </div>
                <button
                  onClick={() => {
                    setModalType("subject");
                    setModalData({ name: "" });
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl text-xs hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Yangi fan qo&apos;shish
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Fan nomi</th>
                      <th className="p-3">Materiallar soni</th>
                      <th className="p-3">Testlar soni</th>
                      <th className="p-3 text-right">Amallar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {subjects.map((s, i) => (
                      <tr key={s.id} className="hover:bg-gray-50">
                        <td className="p-3 text-gray-400">{i + 1}</td>
                        <td className="p-3 font-semibold text-gray-900">{s.name}</td>
                        <td className="p-3 text-gray-600">{s.file_count} ta fayl</td>
                        <td className="p-3 text-gray-600">{s.test_count} ta test</td>
                        <td className="p-3 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => {
                                setModalType("subject");
                                setModalData({ id: s.id, name: s.name });
                              }}
                              className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                              title="Tahrirlash"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteSubject(s.id)}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                              title="O'chirish"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: FILES */}
          {activeTab === "files" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Yuklangan barcha materiallar ({files.length})</h2>
                  <p className="text-xs text-gray-500">Fayllar tafsilotlarini o&apos;zgartirish va o&apos;chirish</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Fayl nomi bo'yicha..."
                      value={fileSearch}
                      onChange={(e) => setFileSearch(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && loadFiles()}
                      className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-indigo-500 w-48"
                    />
                  </div>
                  <button
                    onClick={loadFiles}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-xs font-semibold rounded-xl text-gray-700"
                  >
                    Qidirish
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Sarlavha</th>
                      <th className="p-3">OTM</th>
                      <th className="p-3">Fan</th>
                      <th className="p-3">Yuklagan</th>
                      <th className="p-3">Yuklashlar</th>
                      <th className="p-3">Reyting</th>
                      <th className="p-3 text-right">Amallar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {files.map((f, i) => (
                      <tr key={f.id} className="hover:bg-gray-50">
                        <td className="p-3 text-gray-400">{i + 1}</td>
                        <td className="p-3">
                          <p className="font-semibold text-gray-900 truncate max-w-xs">{f.title}</p>
                          <span className="text-[10px] text-gray-400 uppercase">{f.file_type}</span>
                        </td>
                        <td className="p-3 text-gray-600">{f.university_name || "—"}</td>
                        <td className="p-3 text-gray-600">{f.subject_name || "—"}</td>
                        <td className="p-3 text-indigo-600 font-medium">@{f.uploader_name || "tizim"}</td>
                        <td className="p-3 text-gray-600">{f.downloads}</td>
                        <td className="p-3 text-amber-600 font-bold">★ {f.rating.toFixed(1)}</td>
                        <td className="p-3 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => {
                                setModalType("file");
                                setModalData({
                                  id: f.id,
                                  title: f.title,
                                  description: f.description || "",
                                  file_type: f.file_type,
                                });
                              }}
                              className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                              title="Tahrirlash"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteFile(f.id)}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                              title="O'chirish"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: TESTS & QUESTIONS (FULL CRUD + 20-QUESTION TICKETS) */}
          {activeTab === "tests" && (
            <div className="space-y-6">
              {selectedTest ? (
                /* Questions sub-view for selected test */
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedTest(null)}
                        className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-lg font-bold text-gray-900">
                            {selectedTest.title}
                          </h2>
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                            Jami: {testQuestions.length} ta savol ({Math.max(1, Math.ceil(testQuestions.length / 20))} ta bilet)
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Har bir biletda aniq 20 ta takrorlanmas savol taqsimlanadi.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setModalType("question");
                          setModalData({
                            question_text: "",
                            option_a: "",
                            option_b: "",
                            option_c: "",
                            option_d: "",
                            correct_answer: "A",
                            explanation: "",
                          });
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl text-xs hover:bg-indigo-700 transition-colors shadow-sm"
                      >
                        <Plus className="w-4 h-4" /> Savol qo&apos;shish
                      </button>
                    </div>
                  </div>

                  {loadingQuestions ? (
                    <div className="py-12 text-center">
                      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                    </div>
                  ) : testQuestions.length === 0 ? (
                    <div className="py-12 text-center text-gray-400 text-sm">
                      Ushbu testda hali savollar mavjud emas. Yuqoridagi &quot;Savol qo&apos;shish&quot; tugmasi orqali kiriting.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {testQuestions.map((q, idx) => {
                        const ticketIdx = Math.floor(idx / 20) + 1;
                        const isFirstInTicket = idx % 20 === 0;

                        return (
                          <div key={q.id}>
                            {isFirstInTicket && (
                              <div className="flex items-center gap-2 my-4 pt-3 border-t border-gray-100">
                                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-lg">
                                  Bilet #{ticketIdx} (Savollar {idx + 1} - {Math.min(testQuestions.length, idx + 20)})
                                </span>
                              </div>
                            )}

                            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-indigo-100 transition-all">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3">
                                  <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                    {idx + 1}
                                  </span>
                                  <div>
                                    <p className="font-semibold text-gray-900 text-sm mb-2">{q.question_text}</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-gray-600">
                                      <span className={q.correct_answer === "A" ? "font-bold text-emerald-600" : ""}>
                                        A) {q.option_a}
                                      </span>
                                      <span className={q.correct_answer === "B" ? "font-bold text-emerald-600" : ""}>
                                        B) {q.option_b}
                                      </span>
                                      <span className={q.correct_answer === "C" ? "font-bold text-emerald-600" : ""}>
                                        C) {q.option_c}
                                      </span>
                                      <span className={q.correct_answer === "D" ? "font-bold text-emerald-600" : ""}>
                                        D) {q.option_d}
                                      </span>
                                    </div>
                                    <div className="mt-2 flex items-center gap-3 text-xs">
                                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                        To&apos;g&apos;ri javob: {q.correct_answer}
                                      </span>
                                      {q.explanation && (
                                        <span className="text-gray-500 italic truncate max-w-sm">
                                          Izoh: {q.explanation}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="inline-flex items-center gap-1 shrink-0">
                                  <button
                                    onClick={() => {
                                      setModalType("question");
                                      setModalData({ ...q });
                                    }}
                                    className="p-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors"
                                    title="Tahrirlash"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteQuestion(q.id)}
                                    className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                                    title="O'chirish"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                /* Tests List Table */
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Testlar ro&apos;yxati ({tests.length})</h2>
                      <p className="text-xs text-gray-500">Testlarni yaratish, biletlarga bo&apos;lish va savollarini boshqarish</p>
                    </div>
                    <button
                      onClick={() => {
                        setModalType("test");
                        setModalData({
                          title: "",
                          subject_id: subjects[0]?.id || null,
                          level: "school",
                          grade: 9,
                          description: "",
                        });
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl text-xs hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                      <Plus className="w-4 h-4" /> Yangi test yaratish
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
                        <tr>
                          <th className="p-3">#</th>
                          <th className="p-3">Test nomi</th>
                          <th className="p-3">Fan</th>
                          <th className="p-3">Daraja / Sinf</th>
                          <th className="p-3">Savollar</th>
                          <th className="p-3">Biletlar (20 tadan)</th>
                          <th className="p-3 text-right">Amallar</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {tests.map((tItem, i) => (
                          <tr key={tItem.id} className="hover:bg-gray-50">
                            <td className="p-3 text-gray-400">{i + 1}</td>
                            <td className="p-3">
                              <p className="font-semibold text-gray-900">{tItem.title}</p>
                              {tItem.is_ai_generated && (
                                <span className="text-[10px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded font-bold">
                                  AI yaratgan
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-gray-600">{tItem.subject_name || "—"}</td>
                            <td className="p-3 text-gray-600">
                              {tItem.level === "school" ? `${tItem.grade}-sinf` : `${tItem.grade}-kurs`}
                            </td>
                            <td className="p-3 font-bold text-gray-900">{tItem.question_count} ta</td>
                            <td className="p-3">
                              <button
                                onClick={() => openQuestions(tItem)}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg"
                              >
                                <Layers className="w-3.5 h-3.5" />
                                {tItem.tickets_count || Math.max(1, Math.ceil(tItem.question_count / 20))} ta bilet
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            </td>
                            <td className="p-3 text-right">
                              <div className="inline-flex items-center gap-1">
                                <button
                                  onClick={() => openQuestions(tItem)}
                                  className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-[11px] transition-colors"
                                >
                                  Savollar ({tItem.question_count})
                                </button>
                                <button
                                  onClick={() => {
                                    setModalType("test");
                                    setModalData({
                                      id: tItem.id,
                                      title: tItem.title,
                                      subject_id: tItem.subject_id,
                                      level: tItem.level || "school",
                                      grade: tItem.grade || 9,
                                      description: tItem.description || "",
                                    });
                                  }}
                                  className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                                  title="Tahrirlash"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteTest(tItem.id)}
                                  className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                                  title="O'chirish"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: USERS */}
          {activeTab === "users" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Foydalanuvchilar ({users.length})</h2>
                  <p className="text-xs text-gray-500">Student ID orqali qidiring, barcha ma'lumotlarini ko'ring va tahrirlang</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Student ID, ism, username..."
                      className="pl-9 pr-3 py-1.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-indigo-600 w-52 sm:w-64"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setModalType("user");
                      setModalData({ username: "", password: "", full_name: "", email: "", phone: "", is_admin: false });
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 text-white font-semibold rounded-xl text-xs hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Qo&apos;shish
                  </button>
                </div>
              </div>

              {/* User Category Filter Chips */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {[
                  { id: "all", label: "Barchasi", count: users.length },
                  { id: "active", label: "✓ Faol", count: users.filter((u) => !u.is_blocked && u.is_active !== false).length },
                  { id: "frozen", label: "❄️ Muzlatilgan", count: users.filter((u) => u.is_active === false && !u.is_blocked).length },
                  { id: "blocked", label: "🚫 Bloklangan", count: users.filter((u) => u.is_blocked).length },
                  { id: "admin", label: "Adminlar", count: users.filter((u) => u.is_admin).length },
                  { id: "premium", label: "👑 VIP Premium", count: users.filter((u) => u.is_premium).length },
                  { id: "stars", label: "⭐ Yulduzli", count: users.filter((u) => (u.stars || 0) > 0).length },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setUserFilter(f.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      userFilter === f.id
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <span>{f.label}</span>
                    <span className="text-[10px] opacity-80 font-mono">({f.count})</span>
                  </button>
                ))}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Student ID</th>
                      <th className="p-3">Foydalanuvchi</th>
                      <th className="p-3">Telefon / Email</th>
                      <th className="p-3">Holat</th>
                      <th className="p-3">Maqomi</th>
                      <th className="p-3">Yulduzlar</th>
                      <th className="p-3">Sana</th>
                      <th className="p-3 text-right">Amallar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users
                      .filter((u) => {
                        if (userFilter === "active" && (u.is_blocked || u.is_active === false)) return false;
                        if (userFilter === "frozen" && (u.is_active !== false || u.is_blocked)) return false;
                        if (userFilter === "blocked" && !u.is_blocked) return false;
                        if (userFilter === "admin" && !u.is_admin) return false;
                        if (userFilter === "premium" && !u.is_premium) return false;
                        if (userFilter === "stars" && (!u.stars || u.stars <= 0)) return false;
                        const q = userSearch.toLowerCase().trim();
                        if (!q) return true;
                        return (
                          (u.student_id && u.student_id.toLowerCase().includes(q)) ||
                          u.username.toLowerCase().includes(q) ||
                          (u.full_name && u.full_name.toLowerCase().includes(q)) ||
                          (u.phone && u.phone.includes(q)) ||
                          (u.email && u.email.toLowerCase().includes(q))
                        );
                      })
                      .map((u, i) => (
                        <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-3 text-gray-400">{i + 1}</td>
                          <td className="p-3">
                            <button
                              onClick={() => openUserInspector(u.id)}
                              className="font-mono font-bold text-xs bg-slate-900 text-emerald-400 hover:bg-slate-800 px-2.5 py-1 rounded-lg border border-emerald-500/20 shadow-xs transition-colors flex items-center gap-1.5 group cursor-pointer"
                              title="ID egasining barcha ma'lumotlarini ko'rish"
                            >
                              <span>{u.student_id || `T${u.id.toString().padStart(6, "0")}`}</span>
                              <Eye className="w-3 h-3 text-emerald-400/60 group-hover:text-emerald-300" />
                            </button>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2.5">
                              <UserAvatar
                                studentId={u.student_id}
                                avatarUrl={u.avatar_url}
                                name={u.full_name || u.username}
                                size="xs"
                              />
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <p className="font-semibold text-gray-900">{u.full_name || u.username}</p>
                                  {u.is_premium && (
                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-800 border border-amber-300 text-[9px] font-black">
                                      <Crown className="w-2.5 h-2.5 text-amber-600 fill-amber-500" />
                                      PRO
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-500 text-[11px]">@{u.username}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-gray-600 font-mono text-[11px]">
                            {u.phone || u.email || "—"}
                          </td>
                          <td className="p-3">
                            {u.is_blocked ? (
                              <span
                                className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-700 border border-red-200 inline-flex items-center gap-1 cursor-help"
                                title={u.block_reason ? `Sabab: ${u.block_reason}` : "Administrator tomonidan bloklangan"}
                              >
                                <Ban className="w-2.5 h-2.5 text-red-600" />
                                BLOKLANGAN
                              </span>
                            ) : u.is_active === false ? (
                              <span
                                className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200 inline-flex items-center gap-1"
                                title="Hisob vaqtincha muzlatilgan"
                              >
                                <Snowflake className="w-2.5 h-2.5 text-sky-600" />
                                MUZLATILGAN
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                                Faol
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            {u.is_admin ? (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200 inline-flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-indigo-600" />
                                ADMIN
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-600">
                                Talaba
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="inline-flex items-center gap-1.5">
                              <span className="font-bold text-amber-600 font-mono">★ {Number(u.stars || 0).toFixed(1)}</span>
                              <button
                                onClick={() => setStarModalUser(u)}
                                className="px-1.5 py-0.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-200 cursor-pointer"
                                title="Yulduzlar miqdorini tahrirlash"
                              >
                                ± Yulduz
                              </button>
                            </div>
                          </td>
                          <td className="p-3 text-gray-400">{new Date(u.created_at).toLocaleDateString()}</td>
                          <td className="p-3 text-right">
                            <div className="inline-flex items-center gap-1">
                              {/* Inspector */}
                              <button
                                onClick={() => openUserInspector(u.id)}
                                className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer"
                                title="Barcha ma'lumotlarini ko'rish"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* Toggle Freeze */}
                              <button
                                onClick={() => handleToggleFreeze(u.id)}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                  u.is_active === false
                                    ? "bg-sky-100 text-sky-700 hover:bg-sky-200"
                                    : "bg-slate-100 text-slate-500 hover:bg-sky-50 hover:text-sky-700"
                                }`}
                                title={u.is_active === false ? "Muzdan chiqarish (Faollashtirish)" : "Hisobni muzlatish"}
                              >
                                <Snowflake className="w-3.5 h-3.5" />
                              </button>

                              {/* Toggle Block */}
                              <button
                                onClick={() => {
                                  if (u.is_blocked) {
                                    handleSaveBlockStatus(u, false);
                                  } else {
                                    setBlockModalUser(u);
                                    setBlockReasonInput("");
                                  }
                                }}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                  u.is_blocked
                                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                                    : "bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-700"
                                }`}
                                title={u.is_blocked ? "Blokdan chiqarish" : "Hisobni bloklash (sabab bilan)"}
                              >
                                <Ban className="w-3.5 h-3.5" />
                              </button>

                              {/* Toggle Premium */}
                              <button
                                onClick={() => handleTogglePremium(u.id)}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                  u.is_premium
                                    ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                                    : "bg-slate-100 text-slate-500 hover:bg-amber-50 hover:text-amber-700"
                                }`}
                                title={u.is_premium ? "VIP Premiumni bekor qilish" : "VIP Premium berish"}
                              >
                                <Crown className="w-3.5 h-3.5" />
                              </button>

                              {/* Edit */}
                              <button
                                onClick={() => {
                                  setModalType("user");
                                  setModalData({
                                    id: u.id,
                                    username: u.username,
                                    full_name: u.full_name || "",
                                    email: u.email || "",
                                    phone: u.phone || "",
                                    is_admin: u.is_admin,
                                    password: "",
                                  });
                                }}
                                className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer"
                                title="Tahrirlash"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => setDeleteConfirmUser(u)}
                                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                                title="Foydalanuvchini o'chirish"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}


          {/* TAB 7: WITHDRAWALS */}
          {activeTab === "withdrawals" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Pul yechish so&apos;rovlari ({withdrawals.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Miqdori</th>
                      <th className="p-3">Yulduzlar</th>
                      <th className="p-3">Usul</th>
                      <th className="p-3">Karta / Hamyon</th>
                      <th className="p-3">Sana</th>
                      <th className="p-3">Holat</th>
                      <th className="p-3 text-right">Amal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {withdrawals.map((w, i) => (
                      <tr key={w.id} className="hover:bg-gray-50">
                        <td className="p-3 text-gray-400">{i + 1}</td>
                        <td className="p-3 font-bold text-gray-900">{w.amount.toLocaleString("uz-UZ")} so&apos;m</td>
                        <td className="p-3 font-medium text-amber-600">★ {w.stars_spent}</td>
                        <td className="p-3">
                          <div className="inline-flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                            <span className="font-mono font-bold text-slate-900">{w.target}</span>
                            <button
                              onClick={() => handleCopyCard(w.target, w.id)}
                              className="p-1 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                              title="Karta raqamini nusxalash"
                            >
                              {copiedTargetId === w.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <ClipboardList className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="p-3 text-gray-400">{new Date(w.created_at).toLocaleDateString()}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              w.status === "paid"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : w.status === "rejected"
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {w.status === "paid" ? "To'landi" : w.status === "rejected" ? "Rad etildi" : "Kutilmoqda"}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {w.status === "pending" && (
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => handleWithdrawal(w.id, "approve")}
                                className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                title="Tasdiqlash"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleWithdrawal(w.id, "reject")}
                                className="p-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100"
                                title="Rad etish"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ANNOUNCEMENTS & ADS (NEWS TICKER) TAB */}
          {/* ========================================================================= */}
          {activeTab === "announcements" && (
            <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm p-6 space-y-6">
              {/* Header & Action Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-indigo-600" />
                    E&apos;lonlar, Reklama va Sayt Yangiliklari
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Sayt yuqorisidagi jonli lenta (Header News Ticker)da aylanadigan reklama, e&apos;lon va yangiliklarni to&apos;liq boshqarish
                  </p>
                </div>
                <button
                  onClick={() => {
                    setModalData({
                      title: "",
                      content: "",
                      type: "ad",
                      badge_text: "REKLAMA",
                      link_url: "",
                      is_active: true,
                      priority: 0,
                    });
                    setModalType("announcement");
                  }}
                  className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Yangi e&apos;lon / reklama qo&apos;shish
                </button>
              </div>

              {/* Live Preview Info Banner */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-indigo-900">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold">Avtomatik jonli hodisalar faol:</span>
                    <span className="ml-1 text-indigo-700">
                      Siz qo&apos;shgan reklamalardan tashqari, tizim avtomatik ravishda so&apos;nggi pul yechishlar (🎉), yangi talabalar (👋) va yangi yuklangan fayllarni lentada navbatma-navbat aylantirib ko&apos;rsatadi.
                    </span>
                  </div>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={announcementSearch}
                    onChange={(e) => setAnnouncementSearch(e.target.value)}
                    placeholder="E'lon yoki reklama matni bo'yicha qidirish..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              {/* Announcements Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-600">
                  <thead className="bg-slate-50 text-gray-700 font-bold border-b border-gray-200">
                    <tr>
                      <th className="py-3 px-4">Turi & Belgisi</th>
                      <th className="py-3 px-4">Sarlavha / Reklama Matni</th>
                      <th className="py-3 px-4">Havola (Link)</th>
                      <th className="py-3 px-4">Prioritet</th>
                      <th className="py-3 px-4">Holati</th>
                      <th className="py-3 px-4 text-right">Amallar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredAnnouncements.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide inline-flex items-center gap-1 ${
                              item.type === "ad"
                                ? "bg-amber-100 text-amber-800 border border-amber-200"
                                : item.type === "update"
                                ? "bg-purple-100 text-purple-800 border border-purple-200"
                                : item.type === "alert"
                                ? "bg-rose-100 text-rose-800 border border-rose-200"
                                : "bg-blue-100 text-blue-800 border border-blue-200"
                            }`}
                          >
                            {item.type === "ad" ? "🎁 " : item.type === "update" ? "⚡ " : "📢 "}
                            {item.badge_text || item.type.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-gray-900 max-w-md line-clamp-2">{item.title}</div>
                          {item.content && <div className="text-[11px] text-gray-500 line-clamp-1">{item.content}</div>}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-indigo-600">
                          {item.link_url ? (
                            <a href={item.link_url} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                              {item.link_url}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-gray-400 font-sans italic">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md text-[11px]">
                            {item.priority}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleAnnouncement(item.id)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                              item.is_active
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                                : "bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200"
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${item.is_active ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`} />
                            {item.is_active ? "Faol (Efirda)" : "Nofaol"}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                          <button
                            onClick={() => {
                              setModalData({ ...item });
                              setModalType("announcement");
                            }}
                            className="p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                            title="Tahrirlash"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteAnnouncement(item.id)}
                            className="p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                            title="O'chirish"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredAnnouncements.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-400">
                          Hech qanday e&apos;lon yoki reklama topilmadi.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Announcement Modal */}
          {modalType === "announcement" && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <form
                onSubmit={handleSaveAnnouncement}
                className="bg-white rounded-3xl shadow-xl max-w-lg w-full p-6 space-y-4"
              >
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-indigo-600" />
                    {modalData.id ? "E'lon / Reklamani tahrirlash" : "Yangi e'lon / reklama qo'shish"}
                  </h3>
                  <button type="button" onClick={() => setModalType(null)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Sarlavha / Matn (Lentada ko&apos;rinadigan asosiy matn) *
                  </label>
                  <input
                    required
                    value={modalData.title || ""}
                    onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                    className="w-full px-3.5 py-2 border rounded-xl text-xs outline-none focus:border-indigo-600"
                    placeholder="Masalan: 🚀 Konspekt yuklab har bir yuklab olish uchun pul ishlang!"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Turi</label>
                    <select
                      value={modalData.type || "ad"}
                      onChange={(e) => {
                        const val = e.target.value;
                        const defaultBadge =
                          val === "ad"
                            ? "REKLAMA"
                            : val === "update"
                            ? "YANGILANISH"
                            : val === "alert"
                            ? "MUHIM"
                            : "YANGILIK";
                        setModalData({
                          ...modalData,
                          type: val,
                          badge_text: modalData.badge_text || defaultBadge,
                        });
                      }}
                      className="w-full px-3.5 py-2 border rounded-xl text-xs outline-none focus:border-indigo-600 bg-white"
                    >
                      <option value="ad">🎁 Reklama (Ad)</option>
                      <option value="news">📢 Yangilik (News)</option>
                      <option value="update">⚡ Saytdagi o&apos;zgarish (Update)</option>
                      <option value="alert">⚠️ Muhim e&apos;lon (Alert)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Maxsus belgi (Badge matni)
                    </label>
                    <input
                      value={modalData.badge_text || ""}
                      onChange={(e) => setModalData({ ...modalData, badge_text: e.target.value })}
                      className="w-full px-3.5 py-2 border rounded-xl text-xs outline-none focus:border-indigo-600"
                      placeholder="Masalan: REKLAMA, AKSIYA, YANGILIK"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Havola / Link (Ixtiyoriy)
                    </label>
                    <input
                      value={modalData.link_url || ""}
                      onChange={(e) => setModalData({ ...modalData, link_url: e.target.value })}
                      className="w-full px-3.5 py-2 border rounded-xl text-xs outline-none focus:border-indigo-600"
                      placeholder="/rewards yoki https://..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Prioritet (Tartib raqami)
                    </label>
                    <input
                      type="number"
                      value={modalData.priority || 0}
                      onChange={(e) => setModalData({ ...modalData, priority: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 border rounded-xl text-xs outline-none focus:border-indigo-600"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="ann_active"
                    checked={modalData.is_active ?? true}
                    onChange={(e) => setModalData({ ...modalData, is_active: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                  <label htmlFor="ann_active" className="text-xs font-medium text-gray-700 cursor-pointer">
                    Sayt lentasida faol (ko&apos;rsatilsin)
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm"
                  >
                    Saqlash
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Subject Modal */}
          {modalType === "subject" && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <form
                onSubmit={handleSaveSubject}
                className="bg-white rounded-3xl shadow-xl max-w-md w-full p-6 space-y-4"
              >
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="font-bold text-gray-900 text-base">
                    {modalData.id ? "Fanni tahrirlash" : "Yangi fan qo'shish"}
                  </h3>
                  <button type="button" onClick={() => setModalType(null)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Fan nomi</label>
                  <input
                    required
                    value={modalData.name}
                    onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                    className="w-full px-3.5 py-2 border rounded-xl text-xs outline-none focus:border-indigo-600"
                    placeholder="Masalan: Oliy Matematika"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm"
                  >
                    Saqlash
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* File Edit Modal */}
          {modalType === "file" && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <form
                onSubmit={handleSaveFile}
                className="bg-white rounded-3xl shadow-xl max-w-md w-full p-6 space-y-4"
              >
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="font-bold text-gray-900 text-base">Faylni tahrirlash</h3>
                  <button type="button" onClick={() => setModalType(null)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Sarlavha</label>
                  <input
                    required
                    value={modalData.title}
                    onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                    className="w-full px-3.5 py-2 border rounded-xl text-xs outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Tavsif</label>
                  <textarea
                    rows={3}
                    value={modalData.description || ""}
                    onChange={(e) => setModalData({ ...modalData, description: e.target.value })}
                    className="w-full px-3.5 py-2 border rounded-xl text-xs outline-none focus:border-indigo-600 resize-none"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm"
                  >
                    Saqlash
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Test Modal */}
          {modalType === "test" && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <form
                onSubmit={handleSaveTest}
                className="bg-white rounded-3xl shadow-xl max-w-lg w-full p-6 space-y-4"
              >
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="font-bold text-gray-900 text-base">
                    {modalData.id ? "Testni tahrirlash" : "Yangi test yaratish"}
                  </h3>
                  <button type="button" onClick={() => setModalType(null)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Test sarlavhasi</label>
                  <input
                    required
                    value={modalData.title}
                    onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                    className="w-full px-3.5 py-2 border rounded-xl text-xs outline-none focus:border-indigo-600"
                    placeholder="Masalan: Fizika: Dinamika qonunlari"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Fan</label>
                    <select
                      value={modalData.subject_id || ""}
                      onChange={(e) => setModalData({ ...modalData, subject_id: Number(e.target.value) || null })}
                      className="w-full px-3.5 py-2 border rounded-xl text-xs outline-none focus:border-indigo-600 bg-white"
                    >
                      <option value="">Fanni tanlang</option>
                      {subjects.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Tizim</label>
                    <select
                      value={modalData.level || "school"}
                      onChange={(e) => setModalData({ ...modalData, level: e.target.value })}
                      className="w-full px-3.5 py-2 border rounded-xl text-xs outline-none focus:border-indigo-600 bg-white"
                    >
                      <option value="school">Maktab</option>
                      <option value="university">Universitet</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {modalData.level === "school" ? "Sinf (5-11)" : "Kurs (1-4)"}
                  </label>
                  <input
                    type="number"
                    value={modalData.grade || 1}
                    onChange={(e) => setModalData({ ...modalData, grade: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 border rounded-xl text-xs outline-none focus:border-indigo-600"
                    min={1}
                    max={11}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Tavsif (ixtiyoriy)</label>
                  <textarea
                    rows={2}
                    value={modalData.description || ""}
                    onChange={(e) => setModalData({ ...modalData, description: e.target.value })}
                    className="w-full px-3.5 py-2 border rounded-xl text-xs outline-none focus:border-indigo-600 resize-none"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm"
                  >
                    Saqlash
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Question Modal */}
          {modalType === "question" && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
              <form
                onSubmit={handleSaveQuestion}
                className="bg-white rounded-3xl shadow-xl max-w-lg w-full p-6 space-y-4 my-8"
              >
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="font-bold text-gray-900 text-base">
                    {modalData.id ? "Savolni tahrirlash" : "Yangi test savoli qo'shish"}
                  </h3>
                  <button type="button" onClick={() => setModalType(null)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Savol matni</label>
                  <textarea
                    required
                    rows={2}
                    value={modalData.question_text}
                    onChange={(e) => setModalData({ ...modalData, question_text: e.target.value })}
                    className="w-full px-3.5 py-2 border rounded-xl text-xs outline-none focus:border-indigo-600 resize-none"
                    placeholder="Savol matnini kiriting..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-700">Variantlar</label>
                  <div className="flex items-center gap-2">
                    <span className="w-6 text-xs font-bold text-indigo-600">A)</span>
                    <input
                      required
                      value={modalData.option_a}
                      onChange={(e) => setModalData({ ...modalData, option_a: e.target.value })}
                      className="flex-1 px-3 py-1.5 border rounded-xl text-xs outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 text-xs font-bold text-indigo-600">B)</span>
                    <input
                      required
                      value={modalData.option_b}
                      onChange={(e) => setModalData({ ...modalData, option_b: e.target.value })}
                      className="flex-1 px-3 py-1.5 border rounded-xl text-xs outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 text-xs font-bold text-indigo-600">C)</span>
                    <input
                      required
                      value={modalData.option_c}
                      onChange={(e) => setModalData({ ...modalData, option_c: e.target.value })}
                      className="flex-1 px-3 py-1.5 border rounded-xl text-xs outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 text-xs font-bold text-indigo-600">D)</span>
                    <input
                      required
                      value={modalData.option_d}
                      onChange={(e) => setModalData({ ...modalData, option_d: e.target.value })}
                      className="flex-1 px-3 py-1.5 border rounded-xl text-xs outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">To&apos;g&apos;ri javob</label>
                    <select
                      value={modalData.correct_answer}
                      onChange={(e) => setModalData({ ...modalData, correct_answer: e.target.value })}
                      className="w-full px-3.5 py-2 border rounded-xl text-xs outline-none focus:border-indigo-600 bg-white font-bold"
                    >
                      <option value="A">A varianti</option>
                      <option value="B">B varianti</option>
                      <option value="C">C varianti</option>
                      <option value="D">D varianti</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Tushuntirish / Izoh (ixtiyoriy)</label>
                  <textarea
                    rows={2}
                    value={modalData.explanation || ""}
                    onChange={(e) => setModalData({ ...modalData, explanation: e.target.value })}
                    className="w-full px-3.5 py-2 border rounded-xl text-xs outline-none focus:border-indigo-600 resize-none"
                    placeholder="Talaba testni yakunlaganda ko'rinadigan tushuntirish..."
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm"
                  >
                    Saqlash
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* User Modal */}
          {modalType === "user" && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <form
                onSubmit={handleSaveUser}
                className="bg-white rounded-3xl shadow-xl max-w-md w-full p-6 space-y-4"
              >
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="font-bold text-gray-900 text-base">
                    {modalData.id ? "Foydalanuvchini tahrirlash" : "Yangi foydalanuvchi qo'shish"}
                  </h3>
                  <button type="button" onClick={() => setModalType(null)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {!modalData.id && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Foydalanuvchi nomi (username)</label>
                    <input
                      required
                      value={modalData.username}
                      onChange={(e) => setModalData({ ...modalData, username: e.target.value })}
                      className="w-full px-3.5 py-2 border rounded-xl text-xs outline-none focus:border-indigo-600"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {modalData.id ? "Parolni o'zgartirish (bo'sh qoldirish mumkin)" : "Parol"}
                  </label>
                  <input
                    type="password"
                    required={!modalData.id}
                    value={modalData.password || ""}
                    onChange={(e) => setModalData({ ...modalData, password: e.target.value })}
                    className="w-full px-3.5 py-2 border rounded-xl text-xs outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">To&apos;liq ism</label>
                  <input
                    value={modalData.full_name || ""}
                    onChange={(e) => setModalData({ ...modalData, full_name: e.target.value })}
                    className="w-full px-3.5 py-2 border rounded-xl text-xs outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={modalData.email || ""}
                    onChange={(e) => setModalData({ ...modalData, email: e.target.value })}
                    className="w-full px-3.5 py-2 border rounded-xl text-xs outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Telefon</label>
                  <input
                    value={modalData.phone || ""}
                    onChange={(e) => setModalData({ ...modalData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 border rounded-xl text-xs outline-none focus:border-indigo-600"
                  />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="admin_checkbox"
                    checked={modalData.is_admin}
                    onChange={(e) => setModalData({ ...modalData, is_admin: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <label htmlFor="admin_checkbox" className="text-xs font-bold text-gray-800">
                    Administrator huquqini berish
                  </label>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm"
                  >
                    Saqlash
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* User Activity Inspector Modal (By Student ID) */}
          {modalType === "user_inspector" && (

            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
              <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full my-8 overflow-hidden border border-slate-200">
                {loadingActivity ? (
                  <div className="py-24 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    <p className="text-xs font-semibold text-slate-500">Talaba ma'lumotlari yuklanmoqda...</p>
                  </div>
                ) : selectedUserActivity ? (
                  <div>
                    {/* Inspector Header */}
                    <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white relative">
                      <button
                        type="button"
                        onClick={() => setModalType(null)}
                        className="absolute right-5 top-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <UserAvatar
                          studentId={selectedUserActivity.user.student_id}
                          avatarUrl={selectedUserActivity.user.avatar_url}
                          name={selectedUserActivity.user.full_name || selectedUserActivity.user.username}
                          size="lg"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-xl font-black tracking-tight">
                              {selectedUserActivity.user.full_name || selectedUserActivity.user.username}
                            </h3>
                            <span className="font-mono text-xs font-black bg-emerald-500 text-slate-950 px-2.5 py-0.5 rounded-lg">
                              {selectedUserActivity.user.student_id || `T${selectedUserActivity.user.id.toString().padStart(6, "0")}`}
                            </span>
                            {selectedUserActivity.user.is_admin ? (
                              <span className="text-[10px] font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 px-2 py-0.5 rounded-full">
                                Administrator
                              </span>
                            ) : (
                              <span className="text-[10px] font-medium bg-white/10 text-slate-300 px-2 py-0.5 rounded-full">
                                Talaba
                              </span>
                            )}
                            {selectedUserActivity.user.is_blocked ? (
                              <span className="text-[10px] font-black bg-red-500/30 text-red-300 border border-red-400/40 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                                <Ban className="w-3 h-3 text-red-400" /> BLOKLANGAN
                              </span>
                            ) : selectedUserActivity.user.is_active === false ? (
                              <span className="text-[10px] font-bold bg-sky-500/30 text-sky-200 border border-sky-400/40 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                                <Snowflake className="w-3 h-3 text-sky-300" /> MUZLATILGAN
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-300" /> Faol
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">@{selectedUserActivity.user.username}</p>

                          {/* Quick Stats bar in header */}
                          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-300">
                            <span className="flex items-center gap-1.5 font-bold text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              {selectedUserActivity.user.stars || 0} ta yulduz
                            </span>
                            {selectedUserActivity.user.phone && (
                              <span>📞 {selectedUserActivity.user.phone}</span>
                            )}
                            {selectedUserActivity.user.email && (
                              <span>✉️ {selectedUserActivity.user.email}</span>
                            )}
                            {selectedUserActivity.user.university && (
                              <span>🏛️ {selectedUserActivity.user.university}</span>
                            )}
                            <span>📅 A'zo bo'lgan: {new Date(selectedUserActivity.user.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Tabs inside Modal */}
                    <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2 pt-2 text-xs font-bold overflow-x-auto">
                      <button
                        onClick={() => setActivityActiveTab("files")}
                        className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
                          activityActiveTab === "files"
                            ? "border-blue-600 text-blue-600 font-black"
                            : "border-transparent text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        <FileText className="w-4 h-4" />
                        Yuklagan Fayllari ({selectedUserActivity.files.length})
                      </button>
                      <button
                        onClick={() => setActivityActiveTab("transfers")}
                        className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
                          activityActiveTab === "transfers"
                            ? "border-emerald-600 text-emerald-600 font-black"
                            : "border-transparent text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        <ArrowRightLeft className="w-4 h-4" />
                        Yulduz O'tkazmalari ({selectedUserActivity.sent_transfers.length + selectedUserActivity.received_transfers.length})
                      </button>
                      <button
                        onClick={() => setActivityActiveTab("withdrawals")}
                        className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
                          activityActiveTab === "withdrawals"
                            ? "border-amber-600 text-amber-600 font-black"
                            : "border-transparent text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        <Wallet className="w-4 h-4" />
                        Pul Yechishlari ({selectedUserActivity.withdrawals.length})
                      </button>
                      <button
                        onClick={() => setActivityActiveTab("tests")}
                        className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
                          activityActiveTab === "tests"
                            ? "border-indigo-600 text-indigo-600 font-black"
                            : "border-transparent text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        <ClipboardList className="w-4 h-4" />
                        Tuzgan Testlari ({selectedUserActivity.tests.length})
                      </button>
                    </div>

                    {/* Modal Tab Content Panes */}
                    <div className="p-6 max-h-[460px] overflow-y-auto">
                      
                      {/* PANE 1: FILES */}
                      {activityActiveTab === "files" && (
                        <div>
                          {selectedUserActivity.files.length === 0 ? (
                            <p className="text-center py-10 text-slate-400 text-xs">
                              Ushbu talaba hali hech qanday fayl yuklamagan
                            </p>
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
                                  <tr>
                                    <th className="p-2.5">Fayl nomi</th>
                                    <th className="p-2.5">Turi</th>
                                    <th className="p-2.5">Ko'rishlar</th>
                                    <th className="p-2.5">Yuklab olishlar</th>
                                    <th className="p-2.5">Reyting</th>
                                    <th className="p-2.5">Sana</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {selectedUserActivity.files.map((f) => (
                                    <tr key={f.id} className="hover:bg-slate-50">
                                      <td className="p-2.5 font-bold text-slate-900">{f.title}</td>
                                      <td className="p-2.5 uppercase font-mono text-[10px] text-slate-500">{f.file_type}</td>
                                      <td className="p-2.5 text-slate-600">{f.views}</td>
                                      <td className="p-2.5 text-slate-600">{f.downloads}</td>
                                      <td className="p-2.5 text-amber-600 font-bold">★ {f.rating.toFixed(1)}</td>
                                      <td className="p-2.5 text-slate-400">{new Date(f.created_at).toLocaleDateString()}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      )}

                      {/* PANE 2: TRANSFERS */}
                      {activityActiveTab === "transfers" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Sent transfers */}
                          <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50">
                            <h4 className="font-bold text-xs text-slate-800 mb-3 flex items-center justify-between">
                              <span>Yuborilgan O'tkazmalar</span>
                              <span className="text-[10px] font-bold bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                                {selectedUserActivity.sent_transfers.length} ta
                              </span>
                            </h4>
                            {selectedUserActivity.sent_transfers.length === 0 ? (
                              <p className="text-center py-6 text-slate-400 text-xs">Yuborilmagan</p>
                            ) : (
                              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                                {selectedUserActivity.sent_transfers.map((st) => (
                                  <div key={st.id} className="p-2.5 rounded-xl bg-white border border-slate-200/60 text-xs flex items-center justify-between">
                                    <div className="min-w-0">
                                      <p className="font-bold text-slate-800 truncate">
                                        Qabul qiluvchi: <span className="text-blue-600">{st.recipient_username}</span>
                                      </p>
                                      <p className="font-mono text-[10px] text-slate-400">{st.recipient_student_id}</p>
                                      {st.note && <p className="text-[11px] italic text-slate-500 truncate mt-0.5">"{st.note}"</p>}
                                      <p className="text-[10px] text-slate-400">{new Date(st.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <span className="font-black text-red-500 shrink-0 ml-2">-{st.stars} ★</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Received transfers */}
                          <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50">
                            <h4 className="font-bold text-xs text-slate-800 mb-3 flex items-center justify-between">
                              <span>Qabul Qilingan O'tkazmalar</span>
                              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">
                                {selectedUserActivity.received_transfers.length} ta
                              </span>
                            </h4>
                            {selectedUserActivity.received_transfers.length === 0 ? (
                              <p className="text-center py-6 text-slate-400 text-xs">Qabul qilinmagan</p>
                            ) : (
                              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                                {selectedUserActivity.received_transfers.map((rt) => (
                                  <div key={rt.id} className="p-2.5 rounded-xl bg-white border border-slate-200/60 text-xs flex items-center justify-between">
                                    <div className="min-w-0">
                                      <p className="font-bold text-slate-800 truncate">
                                        Yuboruvchi: <span className="text-emerald-600">{rt.sender_username}</span>
                                      </p>
                                      <p className="font-mono text-[10px] text-slate-400">{rt.sender_student_id}</p>
                                      {rt.note && <p className="text-[11px] italic text-slate-500 truncate mt-0.5">"{rt.note}"</p>}
                                      <p className="text-[10px] text-slate-400">{new Date(rt.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <span className="font-black text-emerald-600 shrink-0 ml-2">+{rt.stars} ★</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* PANE 3: WITHDRAWALS */}
                      {activityActiveTab === "withdrawals" && (
                        <div>
                          {selectedUserActivity.withdrawals.length === 0 ? (
                            <p className="text-center py-10 text-slate-400 text-xs">
                              Ushbu talaba hali pul yechish so'rovi yubormagan
                            </p>
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
                                  <tr>
                                    <th className="p-2.5">Miqdor</th>
                                    <th className="p-2.5">Yulduzlar</th>
                                    <th className="p-2.5">Usul</th>
                                    <th className="p-2.5">Raqam / Hamyon</th>
                                    <th className="p-2.5">Holati</th>
                                    <th className="p-2.5">Sana</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {selectedUserActivity.withdrawals.map((w) => (
                                    <tr key={w.id} className="hover:bg-slate-50">
                                      <td className="p-2.5 font-bold text-slate-900">{w.amount.toLocaleString()} so'm</td>
                                      <td className="p-2.5 text-amber-600 font-bold">★ {w.stars_spent}</td>
                                      <td className="p-2.5 capitalize">{w.method}</td>
                                      <td className="p-2.5 font-mono text-[11px]">{w.target}</td>
                                      <td className="p-2.5">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                          w.status === "paid"
                                            ? "bg-emerald-50 text-emerald-700"
                                            : w.status === "rejected"
                                            ? "bg-red-50 text-red-700"
                                            : "bg-amber-50 text-amber-700"
                                        }`}>
                                          {w.status === "paid" ? "To'landi" : w.status === "rejected" ? "Rad etildi" : "Kutilmoqda"}
                                        </span>
                                      </td>
                                      <td className="p-2.5 text-slate-400">{new Date(w.created_at).toLocaleDateString()}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      )}

                      {/* PANE 4: TESTS */}
                      {activityActiveTab === "tests" && (
                        <div>
                          {selectedUserActivity.tests.length === 0 ? (
                            <p className="text-center py-10 text-slate-400 text-xs">
                              Ushbu talaba hali test yaratmagan
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {selectedUserActivity.tests.map((ts) => (
                                <div key={ts.id} className="p-3 rounded-xl border border-slate-200/70 bg-slate-50 flex items-center justify-between text-xs">
                                  <div>
                                    <p className="font-bold text-slate-900">{ts.title}</p>
                                    <p className="text-[11px] text-slate-500 mt-0.5">
                                      {ts.level === "school" ? "Maktab" : "Universitet"} · {ts.grade}-sinf/kurs
                                    </p>
                                  </div>
                                  <span className="text-slate-400 text-[10px]">{new Date(ts.created_at).toLocaleDateString()}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                    </div>

                    {/* Inspector Footer */}
                    <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setModalType(null)}
                        className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
                      >
                        Yopish
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Star Adjust Modal */}
      {starModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                Yulduzlar balansini tahrirlash
              </h3>
              <button
                onClick={() => setStarModalUser(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 mb-4 text-xs">
              <p className="text-slate-500">Talaba:</p>
              <p className="font-bold text-slate-900 text-sm">
                {starModalUser.full_name || starModalUser.username}{" "}
                <span className="font-mono text-emerald-600">({starModalUser.student_id})</span>
              </p>
              <p className="text-slate-500 mt-2">Hozirgi balans:</p>
              <p className="font-mono font-black text-amber-600 text-lg">
                ★ {Number(starModalUser.stars || 0).toFixed(1)}
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  O&apos;zgartirish miqdori (qo&apos;shish uchun musbat, ayirish uchun - minus):
                </label>
                <div className="flex gap-2">
                  {["+5", "+10", "+25", "-5", "-10"].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setStarDelta(preset.replace("+", ""))}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-[11px] font-bold font-mono transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  step="0.5"
                  value={starDelta}
                  onChange={(e) => setStarDelta(e.target.value)}
                  placeholder="Masalan: 10 yoki -5"
                  className="w-full mt-2 px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold font-mono outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStarModalUser(null)}
                  className="flex-1 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                >
                  Bekor qilish
                </button>
                <button
                  type="button"
                  onClick={() => handleAdjustStars(starModalUser.id, parseFloat(starDelta) || 0)}
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-600/20"
                >
                  Saqlash
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Block User Modal */}
      {blockModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-red-600">
                <div className="p-2 rounded-xl bg-red-50 text-red-600">
                  <Ban className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Foydalanuvchini Bloklash
                </h3>
              </div>
              <button
                onClick={() => setBlockModalUser(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-red-50/60 border border-red-200/60 mb-4 text-xs">
              <p className="text-slate-500">Bloklanayotgan hisob:</p>
              <p className="font-bold text-slate-900 text-sm mt-0.5">
                {blockModalUser.full_name || blockModalUser.username}{" "}
                <span className="font-mono text-emerald-600">({blockModalUser.student_id})</span>
              </p>
              <p className="text-red-700 text-[11px] mt-1.5 font-medium">
                ⚠️ Bloklangan foydalanuvchi tizimga kira olmaydi va barcha amallari to'xtatiladi.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Bloklash sababi (foydalanuvchiga ko&apos;rsatiladi):
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {[
                    "Qoidabuzarlik",
                    "Spam va reklama",
                    "Soxta material yuklash",
                    "Firibgarlik shubhasi",
                  ].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setBlockReasonInput(r)}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-600 text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <textarea
                  value={blockReasonInput}
                  onChange={(e) => setBlockReasonInput(e.target.value)}
                  placeholder="Sababni batafsil yozing..."
                  rows={3}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-red-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBlockModalUser(null)}
                  className="flex-1 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveBlockStatus(blockModalUser, true, blockReasonInput)}
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-md shadow-red-600/20 cursor-pointer"
                >
                  🚫 Bloklash
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-red-600">
                <div className="p-2 rounded-xl bg-red-100 text-red-600">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Foydalanuvchini o&apos;chirish
                </h3>
              </div>
              <button
                onClick={() => setDeleteConfirmUser(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 mb-4 text-xs space-y-2">
              <p className="text-slate-700">
                Rostdan ham <strong className="text-slate-900 font-bold">{deleteConfirmUser.full_name || deleteConfirmUser.username}</strong> ({deleteConfirmUser.student_id}) hisobini va unga tegishli barcha fayllar hamda yozuvlarni to&apos;liq o&apos;chirmoqchimisiz?
              </p>
              <p className="text-red-700 font-bold">
                ⚠️ DIQQAT: Bu amal qaytarib bo&apos;lmaydi!
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmUser(null)}
                className="flex-1 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={() => handleExecuteDeleteUser(deleteConfirmUser.id)}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-md shadow-red-600/20 cursor-pointer"
              >
                🗑️ Butunlay o&apos;chirish
              </button>
            </div>
          </div>
        </div>
      )}
      <AIChat />
    </div>
  );
}