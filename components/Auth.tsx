"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { GOOGLE_CLIENT_ID, LOG_URL, demoMode } from "@/lib/config";
import { SocialIcon } from "./Icon";

/**
 * Tài khoản KSV Tools. Máy chủ là Apps Script trong Google Sheet (google/ghi-luot-tai.gs):
 * - Đăng ký bằng email + mật khẩu, hoặc đăng nhập bằng Google; người quản trị duyệt trong Sheet.
 * - Đăng nhập xong máy chủ cấp một "vé" có chữ ký (token), lưu trong trình duyệt. Tài khoản đã duyệt: vé không hết hạn;
 *   bị khóa trong Sheet thì vé mất hiệu lực ở lần kiểm tra sau.
 * - Chỉ tải app và xem văn bản nội bộ mới cần tài khoản đã duyệt; văn bản công khai xem tự do.
 */

export const STATUS_OK = "Đã duyệt";
export const STATUS_PENDING = "Chờ duyệt";

export type User = {
  name: string;
  email: string;
  picture: string | null;
  unit?: string;
  role?: string;
  /** "Google", "Mật khẩu" hoặc cả hai. */
  via?: string;
  /** Chủ Sheet: được tải văn bản nội bộ lên. */
  admin?: boolean;
  status: string;
  token: string;
  /** Vé hết hạn lúc (ms). */
  until: number;
};

type ApiResult = {
  ok: boolean;
  error?: string;
  expired?: boolean;
  token?: string;
  until?: number;
  status?: string;
  profile?: { email: string; name: string; unit?: string; role?: string; via?: string; admin?: boolean };
  [k: string]: unknown;
};

const KEY = "ksv_session";

/** Gọi máy chủ Apps Script. Gửi dạng text/plain để trình duyệt không phải hỏi trước (CORS). */
export async function api(action: string, body: Record<string, unknown> = {}): Promise<ApiResult> {
  if (!LOG_URL) return demoApi(action, body);
  try {
    const r = await fetch(LOG_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action, ...body }),
    });
    return (await r.json()) as ApiResult;
  } catch {
    return { ok: false, error: "Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại." };
  }
}

/** Chạy thử trên máy khi chưa cấu hình máy chủ: tài khoản nào cũng được duyệt ngay. */
async function demoApi(action: string, body: Record<string, unknown>): Promise<ApiResult> {
  if (!demoMode) return { ok: false, error: "Trang chưa được cấu hình máy chủ tài khoản." };
  const email = String(body.email ?? "nguoidung@vidu.test");
  const profile = { email, name: String(body.name ?? "Người dùng thử"), unit: String(body.unit ?? ""), via: "Thử", admin: true };
  if (action === "doc") return { ok: false, error: "Chạy thử trên máy: chưa có máy chủ văn bản nội bộ." };
  return { ok: true, token: "demo." + Date.now(), until: Date.now() + 3650 * 864e5, status: STATUS_OK, profile };
}

function fromResult(r: ApiResult, picture: string | null): User | null {
  if (!r.ok || !r.token || !r.profile) return null;
  return {
    name: r.profile.name,
    email: r.profile.email,
    unit: r.profile.unit,
    role: r.profile.role,
    via: r.profile.via,
    admin: r.profile.admin,
    picture,
    status: r.status ?? STATUS_PENDING,
    token: r.token,
    until: r.until ?? Date.now() + 30 * 864e5,
  };
}

function decodeJwt(token: string): Record<string, unknown> {
  try {
    const part = token.split(".")[1]!.replace(/-/g, "+").replace(/_/g, "/");
    const bin = atob(part.padEnd(part.length + ((4 - (part.length % 4)) % 4), "="));
    return JSON.parse(new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0))));
  } catch {
    return {};
  }
}

function readStored(): User | null {
  try {
    const u = JSON.parse(localStorage.getItem(KEY) ?? "null") as User | null;
    return u && u.token && u.until > Date.now() ? u : null;
  } catch {
    return null;
  }
}

function store(u: User | null) {
  try {
    if (u) localStorage.setItem(KEY, JSON.stringify(u));
    else localStorage.removeItem(KEY);
    localStorage.removeItem("ksv_user"); // phiên đăng nhập Google kiểu cũ
  } catch {
    /* trình duyệt chặn lưu trữ: vẫn đăng nhập được trong lần mở trang này */
  }
}

type Extra = { name?: string; unit?: string; role?: string; phone?: string };

type Ctx = {
  user: User | null;
  ready: boolean;
  gsiReady: boolean;
  /** Đã đăng nhập và được duyệt. */
  approved: boolean;
  /** Lỗi của lần đăng nhập Google gần nhất. */
  googleError: string;
  loginPassword: (email: string, password: string) => Promise<string | null>;
  register: (data: Extra & { email: string; password: string }) => Promise<string | null>;
  /** Thông tin đơn vị gửi kèm khi đăng ký bằng Google. */
  setGoogleExtra: (x: Extra) => void;
  refresh: () => Promise<void>;
  signOut: () => void;
};

const AuthCtx = createContext<Ctx>({
  user: null,
  ready: false,
  gsiReady: false,
  approved: false,
  googleError: "",
  loginPassword: async () => null,
  register: async () => null,
  setGoogleExtra: () => {},
  refresh: async () => {},
  signOut: () => {},
});

export const useAuth = () => useContext(AuthCtx);

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [gsiReady, setGsiReady] = useState(false);
  const [googleError, setGoogleError] = useState("");
  const [googleBusy, setGoogleBusy] = useState(false);
  const extra = useRef<Extra>({});

  const save = useCallback((u: User | null) => {
    setUser(u);
    store(u);
  }, []);

  const onGoogle = useCallback(
    async (credential: string) => {
      setGoogleError("");
      setGoogleBusy(true);
      const p = decodeJwt(credential);
      const r = await api("google", { credential, ...extra.current });
      setGoogleBusy(false);
      const u = fromResult(r, typeof p.picture === "string" ? p.picture : null);
      if (u) save(u);
      else setGoogleError(r.error ?? "Không đăng nhập được bằng Google.");
    },
    [save],
  );

  const loginPassword = useCallback(
    async (email: string, password: string) => {
      const r = await api("login", { email, password });
      const u = fromResult(r, null);
      if (!u) return r.error ?? "Không đăng nhập được.";
      save(u);
      return null;
    },
    [save],
  );

  const register = useCallback(
    async (data: Extra & { email: string; password: string }) => {
      const r = await api("register", data);
      if (!r.ok) return r.error ?? "Không đăng ký được.";
      // Đăng ký xong thì đăng nhập luôn (tài khoản ở trạng thái chờ duyệt).
      return loginPassword(data.email, data.password);
    },
    [loginPassword],
  );

  const signOut = useCallback(() => {
    window.google?.accounts.id.disableAutoSelect();
    save(null);
  }, [save]);

  const refresh = useCallback(async () => {
    const cur = readStored();
    if (!cur || !LOG_URL) return;
    const r = await api("me", { token: cur.token });
    if (r.expired) return save(null);
    const u = fromResult(r, cur.picture);
    if (u) save(u);
  }, [save]);

  useEffect(() => {
    setUser(readStored());
    setReady(true);
    // Hỏi lại máy chủ trạng thái tài khoản (vừa được duyệt, bị khóa…).
    void refresh();
    if (!GOOGLE_CLIENT_ID) return;
    const init = () => {
      window.google!.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (r: { credential: string }) => void onGoogle(r.credential),
        auto_select: false,
        cancel_on_tap_outside: true,
        use_fedcm_for_prompt: true,
      });
      setGsiReady(true);
    };
    if (window.google?.accounts?.id) return init();
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.onload = init;
    document.head.appendChild(s);
  }, [onGoogle, refresh]);

  const value: Ctx = {
    user,
    ready,
    gsiReady,
    approved: user?.status === STATUS_OK,
    googleError,
    loginPassword,
    register,
    setGoogleExtra: (x) => {
      extra.current = x;
    },
    refresh,
    signOut,
  };
  return (
    <AuthCtx.Provider value={value}>
      {children}
      {googleBusy && (
        <div className="auth-busy" role="status" aria-live="polite">
          <div className="auth-busy-box">
            <span className="spinner" aria-hidden="true" />
            Đang đăng nhập bằng Google…
          </div>
        </div>
      )}
    </AuthCtx.Provider>
  );
}

/** Nút "Tiếp tục với Google" do Google vẽ. Chế độ thử trên máy: nút giả tạo tài khoản thử. */
export function GoogleButton({ width = 320 }: { width?: number }) {
  const { gsiReady, loginPassword } = useAuth();
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
      <button type="button" className="social-btn" onClick={() => void loginPassword("nguoidung@vidu.test", "x")}>
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
      keepalive: true,
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ token: user.token, name: user.name, email: user.email, tool, version }),
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
  const r = await api("", { type: "de-xuat", token: user.token, name: user.name, email: user.email, ...s });
  return r.ok;
}
