"use client";

import Link from "next/link";
import { Avatar } from "./Avatar";
import { useAuth } from "./Auth";

/** Góc phải đầu trang: tên người đang đăng nhập, hoặc nút Đăng nhập. */
export function UserMenu() {
  const { user, ready } = useAuth();
  if (!ready) return <span className="user-chip-ph" aria-hidden="true" />;
  if (user)
    return (
      <Link href="/tai-khoan" className="user-chip" title="Tài khoản của tôi">
        <Avatar name={user.name || user.email} src={user.picture} />
        <span className="user-name">{user.name || user.email}</span>
      </Link>
    );
  return (
    <Link href="/dang-nhap" className="btn btn-primary btn-sm">
      Đăng nhập
    </Link>
  );
}

/** Chỉ hiện khi chưa đăng nhập (ví dụ nút Đăng nhập ở đầu trang chủ). */
export function SignedOutOnly({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? null : <>{children}</>;
}
