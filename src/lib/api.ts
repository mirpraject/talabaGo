export function getApiUrl(): string {
  if (typeof window !== "undefined") {
    const isLocal =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    if (!isLocal) {
      // Production domain: agar alohida backend domeni berilgan bo'lsa uni oladi, aks holda Next.js rewrites ishlatiladi
      return process.env.NEXT_PUBLIC_API_URL || "";
    }
    const localPort = process.env.NEXT_PUBLIC_API_PORT || process.env.BACKEND_PORT || "8000";
    return process.env.NEXT_PUBLIC_API_URL || `http://127.0.0.1:${localPort}`;
  }
  const backendPort = process.env.BACKEND_PORT || "8000";
  return process.env.INTERNAL_API_URL || `http://127.0.0.1:${backendPort}`;
}

export const API_URL = "";

export const TOKEN_KEY = "studenthub_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export type ApiError = {
  detail?: string | { msg?: string }[] | Record<string, unknown>;
  message?: string;
};

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);

  const baseUrl = getApiUrl();
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers,
      signal: options.signal || controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      let message = `Serverda xatolik yuz berdi (${res.status})`;
      if (res.status === 401) {
        message = "Username yoki parol noto'g'ri";
      } else if (res.status === 429) {
        message = "Juda ko'p so'rov yuborildi. Iltimos, biroz kutib qayta urinib ko'ring (429 Rate limit).";
      } else if (res.status === 413) {
        message = "Fayl yoki so'rov hajmi ruxsat etilgan me'yordan katta (Maksimal 50 MB).";
      } else if (res.status === 502 || res.status === 503 || res.status === 504) {
        message = "Server hali to'liq ishga tushmadi (yoki qayta yuklanmoqda). Iltimos, bir necha soniyadan so'ng qayta urinib ko'ring.";
      }
      try {
        const data = (await res.json()) as any;
        if (typeof data?.detail === "string") {
          message = data.detail;
        } else if (Array.isArray(data?.detail) && data.detail.length > 0) {
          const first = data.detail[0];
          message = typeof first === "string" ? first : first.msg || JSON.stringify(first);
        } else if (data?.message) {
          message = String(data.message);
        }
      } catch {
        /* ignore */
      }
      throw new Error(message);
    }

    return res.json() as Promise<T>;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error("So'rov vaqti tugadi (Timeout). Iltimos, internet aloqasini tekshiring.");
    }
    if (err.message?.includes("Failed to fetch") || err.message?.includes("NetworkError")) {
      throw new Error("Server bilan aloqa o'rnatib bo'lmadi. Backend ishlayotganini tekshiring.");
    }
    throw err;
  }
}

export const api = {
  get: <T>(path: string) => apiFetch<T>(path),
  post: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, {
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  put: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, {
      method: "PUT",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  patch: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, {
      method: "PATCH",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  del: <T>(path: string) => apiFetch<T>(path, { method: "DELETE" }),
  delete: <T>(path: string) => apiFetch<T>(path, { method: "DELETE" }),
};

export async function downloadBlob(path: string): Promise<Blob> {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const baseUrl = getApiUrl();
  const res = await fetch(`${baseUrl}${path}`, { headers });
  if (!res.ok) {
    let message = "Faylni yuklab olishda xatolik yuz berdi";
    try {
      const data = (await res.json()) as ApiError;
      if (typeof data?.detail === "string") message = data.detail;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  return res.blob();
}

export async function postBlob(path: string, body?: unknown): Promise<Blob> {
  const token = getToken();
  const headers: Record<string, string> = {};
  headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const baseUrl = getApiUrl();
  const res = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let message = "Yuklab olishda xatolik yuz berdi";
    try {
      const data = (await res.json()) as ApiError;
      if (typeof data?.detail === "string") message = data.detail;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  return res.blob();
}

export function filenameFromDisposition(
  disposition: string | null,
  fallback: string
): string {
  if (!disposition) return fallback;
  const match = disposition.match(/filename\*=UTF-8''([^;]+)/);
  if (match) {
    try {
      return decodeURIComponent(match[1]);
    } catch {
      return match[1];
    }
  }
  return fallback;
}