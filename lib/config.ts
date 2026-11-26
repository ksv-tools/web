/** Cấu hình chung của web. Mọi giá trị ở đây đều công khai (web là trang tĩnh, ai cũng xem được mã). */

export const SITE_NAME = "KSV Tools";
export const SITE_TAGLINE = "Không gian tiện ích số dành cho Kiểm sát viên";
export const AUTHOR = "Trần Hồng Minh";
export const AUTHOR_UNIT = "VKSND khu vực 3 Ninh Bình";

/**
 * Client ID của Google (Google Cloud Console → Credentials → OAuth client ID, loại Web application).
 * Đây là mã công khai, không phải khóa bí mật. Để trống thì trên máy dùng đăng nhập thử.
 */
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

/** Địa chỉ Web app của Apps Script ghi lượt tải vào Google Sheet (xem google/ghi-luot-tai.gs). Để trống thì không ghi. */
export const LOG_URL = process.env.NEXT_PUBLIC_LOG_URL ?? "";

/** Chưa có Client ID và đang chạy trên máy (npm run dev): nút đăng nhập tạo tài khoản giả. */
export const demoMode = !GOOGLE_CLIENT_ID && process.env.NODE_ENV !== "production";

/** Thêm đường dẫn gốc (ví dụ /web) cho các liên kết không đi qua next/link. */
export function withBase(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
