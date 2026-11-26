import "server-only";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { cache } from "react";
import { defaultDailyQuota, demoMode, hasSupabase, isAdminEmail } from "./config";
import { type Profile, store } from "./store";
import { supabaseServer } from "./supabase";

export const DEMO_COOKIE = "demo_uid";
export const DEMO_ADMIN_EMAIL = "quantri@vidu.test";

export type SessionUser = Profile & {
  isAdmin: boolean;
  /** Số lượt tải mỗi ngày áp dụng cho người này. */
  quota: number;
};

function withRole(p: Profile): SessionUser {
  const isAdmin = isAdminEmail(p.email) || (demoMode && p.email === DEMO_ADMIN_EMAIL);
  return {
    ...p,
    isAdmin,
    // Quản trị luôn được dùng, kể cả khi hồ sơ đang ở trạng thái khác.
    status: isAdmin ? "approved" : p.status,
    quota: p.dailyQuota ?? defaultDailyQuota,
  };
}

/** Người đang đăng nhập, hoặc null. Gọi nhiều lần trong một lượt tải trang chỉ đọc một lần. */
export const getUser = cache(async (): Promise<SessionUser | null> => {
  // Trang nào đọc người dùng thì luôn dựng lại theo từng lượt xem, không bao giờ dựng sẵn thành trang tĩnh.
  await connection();
  if (hasSupabase) {
    const sb = await supabaseServer();
    const { data } = await sb.auth.getUser();
    const u = data.user;
    if (!u) return null;
    let p = await store.getProfile(u.id);
    if (!p) {
      // Bình thường trigger trong cơ sở dữ liệu đã tạo hồ sơ; đây là phòng khi trigger chưa chạy.
      const meta = u.user_metadata ?? {};
      p = await store.createProfile({
        id: u.id,
        email: u.email ?? "",
        fullName: meta.full_name ?? meta.name ?? u.email ?? "",
        avatarUrl: meta.avatar_url ?? meta.picture ?? null,
        provider: (u.app_metadata?.provider as string) ?? "",
        status: "pending",
      });
    }
    return withRole(p);
  }
  if (demoMode) {
    const id = (await cookies()).get(DEMO_COOKIE)?.value;
    if (!id) return null;
    const p = await store.getProfile(id);
    return p ? withRole(p) : null;
  }
  return null;
});
