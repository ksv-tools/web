"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { GoogleButton, STATUS_PENDING, api, useAuth } from "./Auth";

/** Chỉ cho quay về đường dẫn nội bộ của web. */
function safeNext(v: string | null): string {
  return v && v.startsWith("/") && !v.startsWith("//") && !v.includes("\\") ? v : "/tai-khoan";
}

type Tab = "dang-nhap" | "dang-ky" | "quen";

/** Đăng nhập (email + mật khẩu hoặc Google), đăng ký tài khoản, quên mật khẩu. */
export function LoginBox() {
  const { user, approved, googleError } = useAuth();
  const router = useRouter();
  const sp = useSearchParams();
  const next = safeNext(sp.get("next"));
  const [tab, setTab] = useState<Tab>(sp.get("tab") === "dang-ky" ? "dang-ky" : "dang-nhap");

  useEffect(() => {
    if (user && approved) router.replace(next);
  }, [user, approved, next, router]);

  if (user && !approved) return <PendingNotice />;

  return (
    <>
      <div className="auth-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={tab === "dang-nhap"} onClick={() => setTab("dang-nhap")}>
          Đăng nhập
        </button>
        <button type="button" role="tab" aria-selected={tab === "dang-ky"} onClick={() => setTab("dang-ky")}>
          Tạo tài khoản
        </button>
      </div>
      {tab === "dang-nhap" && <LoginForm onForgot={() => setTab("quen")} />}
      {tab === "dang-ky" && <RegisterForm />}
      {tab === "quen" && <ResetForm onDone={() => setTab("dang-nhap")} />}
      {googleError && <p className="alert alert-err">{googleError}</p>}
    </>
  );
}

function LoginForm({ onForgot }: { onForgot: () => void }) {
  const { loginPassword } = useAuth();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  return (
    <>
      <form
        className="form auth-form"
        onSubmit={async (e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          setBusy(true);
          setErr((await loginPassword(String(f.get("email")), String(f.get("password")))) ?? "");
          setBusy(false);
        }}
      >
        <label>
          Email
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          Mật khẩu
          <input name="password" type="password" autoComplete="current-password" required />
        </label>
        {err && <p className="alert alert-err">{err}</p>}
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? "Đang đăng nhập…" : "Đăng nhập"}
        </button>
        <button type="button" className="link-btn auth-forgot" onClick={onForgot}>
          Quên mật khẩu?
        </button>
      </form>
      <div className="auth-or">
        <span>hoặc</span>
      </div>
      <div className="social">
        <GoogleButton />
      </div>
    </>
  );
}

function RegisterForm() {
  const { register, setGoogleExtra } = useAuth();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [extra, setExtra] = useState({ name: "", unit: "", role: "", phone: "" });
  useEffect(() => {
    setGoogleExtra(extra);
  }, [extra, setGoogleExtra]);
  const field = (k: keyof typeof extra) => ({
    value: extra[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setExtra((x) => ({ ...x, [k]: e.target.value })),
  });

  return (
    <>
      <p className="auth-note">
        Tài khoản cần người quản trị duyệt mới tải được công cụ và xem văn bản nội bộ. Văn bản công khai xem tự do, không
        cần tài khoản.
      </p>
      <form
        className="form auth-form"
        onSubmit={async (e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          if (f.get("password") !== f.get("password2")) return setErr("Hai lần nhập mật khẩu không khớp.");
          setBusy(true);
          setErr(
            (await register({ ...extra, email: String(f.get("email")), password: String(f.get("password")) })) ?? "",
          );
          setBusy(false);
        }}
      >
        <label>
          <span>Họ tên <b className="req">*</b></span>
          <input autoComplete="name" required {...field("name")} />
        </label>
        <label>
          <span>Đơn vị công tác <b className="req">*</b></span>
          <input placeholder="Ví dụ: VKSND khu vực 3 Ninh Bình" required {...field("unit")} />
        </label>
        <div className="form-row">
          <label>
            Chức vụ
            <input placeholder="Kiểm sát viên, Kiểm tra viên…" {...field("role")} />
          </label>
          <label>
            Điện thoại
            <input type="tel" autoComplete="tel" {...field("phone")} />
          </label>
        </div>
        <label>
          <span>Email <b className="req">*</b></span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <div className="form-row">
          <label>
            <span>Mật khẩu <b className="req">*</b></span>
            <input name="password" type="password" autoComplete="new-password" minLength={8} required />
          </label>
          <label>
            <span>Nhập lại mật khẩu <b className="req">*</b></span>
            <input name="password2" type="password" autoComplete="new-password" minLength={8} required />
          </label>
        </div>
        {err && <p className="alert alert-err">{err}</p>}
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? "Đang gửi…" : "Tạo tài khoản"}
        </button>
      </form>
      <div className="auth-or">
        <span>hoặc đăng ký bằng Google (điền họ tên, đơn vị ở trên trước)</span>
      </div>
      <div className="social">
        <GoogleButton />
      </div>
    </>
  );
}

function ResetForm({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState<"email" | "code" | "done">("email");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  if (step === "done")
    return (
      <div className="alert alert-ok">
        Đã đặt mật khẩu mới.{" "}
        <button type="button" className="link-btn" onClick={onDone}>
          Đăng nhập
        </button>
      </div>
    );

  return (
    <form
      className="form auth-form"
      onSubmit={async (e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        setBusy(true);
        setErr("");
        if (step === "email") {
          const r = await api("reset-request", { email });
          if (r.ok) setStep("code");
          else setErr(r.error ?? "Không gửi được mã.");
        } else {
          if (f.get("password") !== f.get("password2")) {
            setBusy(false);
            return setErr("Hai lần nhập mật khẩu không khớp.");
          }
          const r = await api("reset-confirm", { email, code: f.get("code"), password: f.get("password") });
          if (r.ok) setStep("done");
          else setErr(r.error ?? "Không đặt lại được mật khẩu.");
        }
        setBusy(false);
      }}
    >
      <h2 className="auth-sub">Quên mật khẩu</h2>
      <label>
        Email đã đăng ký
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={step === "code"} required />
      </label>
      {step === "code" && (
        <>
          <p className="auth-note">Nếu email đã đăng ký, mã 6 số vừa được gửi tới hộp thư (kiểm tra cả thư rác).</p>
          <label>
            Mã 6 số
            <input name="code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required />
          </label>
          <div className="form-row">
            <label>
              Mật khẩu mới
              <input name="password" type="password" autoComplete="new-password" minLength={8} required />
            </label>
            <label>
              Nhập lại
              <input name="password2" type="password" autoComplete="new-password" minLength={8} required />
            </label>
          </div>
        </>
      )}
      {err && <p className="alert alert-err">{err}</p>}
      <button type="submit" className="btn btn-primary" disabled={busy}>
        {busy ? "Đang xử lý…" : step === "email" ? "Gửi mã qua email" : "Đặt mật khẩu mới"}
      </button>
      <button type="button" className="link-btn auth-forgot" onClick={onDone}>
        Quay lại đăng nhập
      </button>
    </form>
  );
}

/** Đã đăng nhập nhưng tài khoản chưa được duyệt. */
export function PendingNotice() {
  const { user, signOut, refresh } = useAuth();
  const [checking, setChecking] = useState(false);
  if (!user) return null;
  return (
    <div className="pending">
      <h2>Tài khoản đang chờ duyệt</h2>
      <p>
        Đã nhận đăng ký của <b>{user.name}</b> ({user.email}). Người quản trị sẽ duyệt và gửi email báo kết quả. Trong lúc
        chờ, bạn vẫn xem được các văn bản công khai.
      </p>
      <p className="muted">Trạng thái hiện tại: {user.status || STATUS_PENDING}</p>
      <div className="row-actions">
        <button
          type="button"
          className="btn btn-outline btn-sm"
          disabled={checking}
          onClick={async () => {
            setChecking(true);
            await refresh();
            setChecking(false);
          }}
        >
          {checking ? "Đang kiểm tra…" : "Kiểm tra lại"}
        </button>
        <Link href="/van-ban" className="btn btn-ghost btn-sm">
          Xem văn bản công khai
        </Link>
        <button type="button" className="btn btn-ghost btn-sm" onClick={signOut}>
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
