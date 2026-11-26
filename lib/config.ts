/** Cấu hình đọc từ biến môi trường (.env.local trên máy, Environment Variables trên Vercel). */

export const SITE_NAME = "KSV Tools";
export const SITE_TAGLINE = "Không gian tiện ích số dành cho Kiểm sát viên";
export const AUTHOR = "Trần Hồng Minh";
export const AUTHOR_UNIT = "VKSND khu vực 3 Ninh Bình";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/** Đã cấu hình Supabase: đăng nhập thật. */
export const hasSupabase = Boolean(supabaseUrl && supabaseAnonKey && supabaseServiceKey);

/** Chế độ thử: chưa có Supabase và đang chạy trên máy (npm run dev). Không bao giờ bật khi đưa lên mạng. */
export const demoMode = !hasSupabase && process.env.NODE_ENV !== "production";

export const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export const defaultDailyQuota = Math.max(0, Number.parseInt(process.env.DEFAULT_DAILY_QUOTA ?? "5", 10) || 5);

export function isAdminEmail(email: string | null | undefined): boolean {
  return Boolean(email) && adminEmails.includes(email!.toLowerCase());
}

/**
 * Cách đăng nhập. Hiện chỉ dùng Google. Muốn thêm Facebook hay X sau này: thêm { id: "facebook", label: "Facebook" }
 * hoặc { id: "x", label: "X" } vào đây và bật mạng đó trong Supabase (biểu tượng đã có sẵn trong components/Icon.tsx).
 */
export const PROVIDERS = [{ id: "google", label: "Google" }] as const;
export type ProviderId = (typeof PROVIDERS)[number]["id"];
