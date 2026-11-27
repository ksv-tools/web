"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { GOOGLE_CLIENT_ID, LOG_URL, demoMode } from "@/lib/config";
import { SocialIcon } from "./Icon";

/**
 * Đăng nhập Google chạy hoàn toàn trong trình duyệt (Google Identity Services).
 * Google trả về một mã xác nhận (ID token) có họ tên, email, ảnh; web giữ trong localStorage 30 ngày.
 * Khi tải công cụ, mã này được gửi kèm sang Apps Script để kiểm tra với Google rồi ghi vào Sheet.
 */

export type User = {
  name: string;
  email: string;
  picture: string | null;
  /** ID token của Google, hết hạn sau khoảng 1 giờ. */
  credential: string;
  /** Thời điểm ID token hết hạn (ms). */
  tokenExp: number;
  /** Hết thời điểm này thì phải đăng nhập lại (ms). */
  until: number;
};

const KEY = "ksv_user";
const SESSION_MS = 30 * 24 * 3600 * 1000;

type GoogleId = {
  initialize(opts: Record<string, unknown>): void;
  renderButton(el: HTMLElement, opts: Record<string, unknown>): void;
  prompt(): void;
  disableAutoSelect(): void;
};
declare global {
  interface Window {
    google?: { accounts: { id: GoogleId } };
  }
}

type Ctx = { user: User | null; ready: boolean; gsiReady: boolean; signIn: (credential: string) => void; signOut: () => void };
const AuthCtx = createContext<Ctx>({ user: null, ready: false, gsiReady: false, signIn: () => {}, signOut: () => {} });

export const useAuth = () => useContext(AuthCtx);

function decodeJwt(token: string): Record<string, unknown> {
  const part = token.split(".")[1]!.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(part.padEnd(part.length + ((4 - (part.length % 4)) % 4), "="));
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

function userFromCredential(credential: string, keepUntil?: number): User {
  if (credential.startsWith("demo:")) {
    return {
      name: "Người dùng thử",
      email: "nguoidung@vidu.test",
      picture: null,
      credential,
      tokenExp: Date.now() + 3600_000,
      until: keepUntil ?? Date.now() + SESSION_MS,
    };
  }
  const p = decodeJwt(credential);
  return {
    name: String(p.name ?? p.email ?? ""),
    email: String(p.email ?? ""),
    picture: typeof p.picture === "string" ? p.picture : null,
    credential,
    tokenExp: Number(p.exp ?? 0) * 1000,
    until: keepUntil ?? Date.now() + SESSION_MS,
  };
}

function readStored(): User | null {
  try {
    const u = JSON.parse(localStorage.getItem(KEY) ?? "null") as User | null;
    return u && u.until > Date.now() ? u : null;
  } catch {
    return null;
  }
}

function store(u: User | null) {
  try {
    if (u) localStorage.setItem(KEY, JSON.stringify(u));
    else localStorage.removeItem(KEY);
  } catch {
    /* trình duyệt chặn lưu trữ: vẫn đăng nhập được trong lần mở trang này */
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [gsiReady, setGsiReady] = useState(false);
  const userRef = useRef<User | null>(null);

  const signIn = useCallback((credential: string) => {
    // Lấy mã mới cho người đang đăng nhập thì giữ nguyên hạn 30 ngày.
    const prev = userRef.current;
    const next = userFromCredential(credential);
    const u = prev && prev.email === next.email ? { ...next, until: prev.until } : next;
    userRef.current = u;
    setUser(u);
    store(u);
  }, []);

  const signOut = useCallback(() => {
    window.google?.accounts.id.disableAutoSelect();
    userRef.current = null;
    setUser(null);
    store(null);
  }, []);

  useEffect(() => {
    const stored = readStored();
    userRef.current = stored;
    setUser(stored);
    setReady(true);
    if (!GOOGLE_CLIENT_ID) return;

    const init = () => {
      window.google!.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (r: { credential: string }) => signIn(r.credential),
        auto_select: true,
        cancel_on_tap_outside: true,
        use_fedcm_for_prompt: true,
      });
      setGsiReady(true);
      // Mã cũ đã hết hạn: xin Google cấp lại lặng lẽ (không hiện gì nếu Google không cấp được).
      if (stored && stored.tokenExp < Date.now() + 60_000) window.google!.accounts.id.prompt();
    };
    if (window.google?.accounts?.id) return init();
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.onload = init;
    document.head.appendChild(s);
  }, [signIn]);

  return <AuthCtx.Provider value={{ user, ready, gsiReady, signIn, signOut }}>{children}</AuthCtx.Provider>;
}

/** Nút "Đăng nhập bằng Google" do Google vẽ. Chế độ thử trên máy: nút giả tạo tài khoản thử. */
export function GoogleButton({ width = 320 }: { width?: number }) {
  const { gsiReady, signIn } = useAuth();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gsiReady || !ref.current) return;
    window.google!.accounts.id.renderButton(ref.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "rectangular",
      logo_alignment: "left",
      locale: "vi",
      width,
    });
  }, [gsiReady, width]);

  if (demoMode) {
    return (
      <button type="button" className="social-btn" onClick={() => signIn("demo:" + Date.now())}>
        <SocialIcon id="google" />
        <span>Tiếp tục với Google (thử trên máy)</span>
      </button>
    );
  }
  if (!GOOGLE_CLIENT_ID) return <div className="alert alert-warn">Trang chưa được cấu hình đăng nhập Google.</div>;
  return <div ref={ref} className="gsi-btn" style={{ minHeight: 44 }} />;
}

/** Ghi một lượt tải vào Google Sheet. Không chờ kết quả, không chặn việc tải. */
export function logDownload(user: User, tool: string, version: string) {
  if (!LOG_URL) return;
  try {
    void fetch(LOG_URL, {
      method: "POST",
      mode: "no-cors",
      keepalive: true,
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ credential: user.credential, name: user.name, email: user.email, tool, version }),
    });
  } catch {
    /* bỏ qua: không ghi được thì vẫn cho tải */
  }
}

export type Suggestion = {
  docName: string;
  number: string;
  field: string;
  link: string;
  message: string;
  /** Tệp đính kèm, nội dung mã hóa base64. Apps Script gửi kèm email cho người quản trị. */
  file?: { name: string; type: string; data: string };
};

/** Gửi đề xuất đăng tài liệu: Apps Script ghi vào trang "Đề xuất" của Google Sheet và gửi email báo người quản trị. */
export async function sendSuggestion(user: User, s: Suggestion): Promise<boolean> {
  if (!LOG_URL) return demoMode;
  try {
    await fetch(LOG_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ type: "de-xuat", credential: user.credential, name: user.name, email: user.email, ...s }),
    });
    return true;
  } catch {
    return false;
  }
}
