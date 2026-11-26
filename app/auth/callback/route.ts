import { type NextRequest, NextResponse } from "next/server";
import { hasSupabase } from "@/lib/config";
import { store } from "@/lib/store";
import { supabaseServer } from "@/lib/supabase";
import { safeNext } from "@/lib/url";

/** Google chuyển về đây sau khi người dùng đồng ý; đổi mã thành phiên đăng nhập. */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNext(url.searchParams.get("next"));
  if (!hasSupabase || !code) return NextResponse.redirect(new URL("/dang-nhap?loi=that-bai", request.url));

  const sb = await supabaseServer();
  const { data, error } = await sb.auth.exchangeCodeForSession(code);
  if (error || !data.user) return NextResponse.redirect(new URL("/dang-nhap?loi=that-bai", request.url));

  try {
    await store.updateProfile(data.user.id, { lastSeenAt: new Date().toISOString() });
  } catch {
    // Không ghi được giờ đăng nhập thì vẫn cho vào.
  }
  return NextResponse.redirect(new URL(next, request.url));
}
