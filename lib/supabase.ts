import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { supabaseAnonKey, supabaseServiceKey, supabaseUrl } from "./config";

/** Client theo phiên đăng nhập của người đang xem (đọc/ghi cookie phiên). */
export async function supabaseServer() {
  const store = await cookies();
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          for (const { name, value, options } of list) store.set(name, value, options);
        } catch {
          // Gọi từ Server Component thì không ghi được cookie; proxy.ts đã làm mới phiên.
        }
      },
    },
  });
}

/** Client quyền quản trị, chỉ chạy trên máy chủ. Bảng dữ liệu bật RLS, không mở cho trình duyệt. */
export function supabaseAdmin() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
