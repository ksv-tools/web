"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { GoogleButton, useAuth } from "./Auth";

/** Chỉ cho quay về đường dẫn nội bộ của web. */
function safeNext(v: string | null): string {
  return v && v.startsWith("/") && !v.startsWith("//") && !v.includes("\\") ? v : "/tai-khoan";
}

/** Nút đăng nhập; đăng nhập xong thì quay về trang ở ?next=. */
export function LoginBox() {
  const { user } = useAuth();
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  useEffect(() => {
    if (user) router.replace(next);
  }, [user, next, router]);
  return (
    <div className="social">
      <GoogleButton />
    </div>
  );
}
