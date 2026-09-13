"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { api, clearToken, getToken, setToken } from "@/lib/api";

export type User = {
  id: number;
  student_id?: string | null;
  avatar_url?: string | null;
  email: string | null;
  username: string;
  phone: string | null;
  full_name: string | null;
  university: string | null;
  level?: string | null;
  grade?: number | null;
  is_active: boolean;
  is_admin?: boolean;
  bio?: string | null;
  stars?: number;
  is_premium?: boolean;
  premium_expires?: string | null;
  created_at: string;
};


type AuthModalMode = "login" | "register";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string, redirectPath?: string) => Promise<User>;
  register: (data: {
    username: string;
    full_name?: string;
    phone?: string;
    university?: string;
    level?: string;
    grade?: number;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  authModalOpen: boolean;
  authModalMode: AuthModalMode;
  authRedirectPath?: string;
  openAuthModal: (mode?: AuthModalMode, redirectPath?: string) => void;
  closeAuthModal: () => void;
  setAuthModalMode: (mode: AuthModalMode) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>("login");
  const [authRedirectPath, setAuthRedirectPath] = useState<string | undefined>(undefined);
  const pathname = usePathname();
  const router = useRouter();

  const openAuthModal = useCallback((mode: AuthModalMode = "login", redirectPath?: string) => {
    setAuthModalMode(mode);
    setAuthRedirectPath(redirectPath);
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
    setAuthRedirectPath(undefined);
  }, []);

  const loadUser = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await api.get<User>("/api/auth/me");
      setUser(me);
    } catch {
      clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [pathname, loadUser]);

  const login = useCallback(
    async (username: string, password: string, redirectPath?: string) => {
      const { access_token } = await api.post<{ access_token: string }>(
        "/api/auth/login/json",
        { username, password }
      );
      setToken(access_token);
      const me = await api.get<User>("/api/auth/me");
      setUser(me);
      if (redirectPath) {
        router.push(redirectPath);
      } else if (me.is_admin) {
        router.push("/admin");
      } else {
        router.push("/files");
      }
      router.refresh();
      return me;
    },
    [router]
  );

  const register = useCallback(
    async (data: {
      username: string;
      full_name?: string;
      phone?: string;
      university?: string;
      level?: string;
      grade?: number;
      password: string;
    }) => {
      const userData = await api.post<User>("/api/auth/register", data);
      const { access_token } = await api.post<{ access_token: string }>(
        "/api/auth/login/json",
        { username: data.username, password: data.password }
      );
      setToken(access_token);
      setUser(userData);
      router.push("/files");
      router.refresh();
    },
    [router]
  );

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    router.push("/");
    router.refresh();
  }, [router]);

  const refreshUser = useCallback(async () => {
    if (!getToken()) return;
    try {
      const me = await api.get<User>("/api/auth/me");
      setUser(me);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
        authModalOpen,
        authModalMode,
        authRedirectPath,
        openAuthModal,
        closeAuthModal,
        setAuthModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth AuthProvider ichida ishlatilishi kerak");
  return ctx;
}