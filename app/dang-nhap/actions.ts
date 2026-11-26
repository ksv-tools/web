"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { demoMode, hasSupabase, PROVIDERS, type ProviderId } from "@/lib/config";
import { DEMO_ADMIN_EMAIL, DEMO_COOKIE } from "@/lib/session";
import { store } from "@/lib/store";
import { supabaseServer } from "@/lib/supabase";
import { safeNext } from "@/lib/url";

async function origin(): Promise<string> {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3100";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function signIn(form: FormData) {
  const provider = String(form.get("provider")) as ProviderId;
  if (!PROVIDERS.some((p) => p.id === provider)) redirect("/dang-nhap");
  const next = safeNext(form.get("next"));

  if (hasSupabase) {
    const sb = await supabaseServer();
    const { data, error } = await sb.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${await origin()}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (error || !data.url) redirect(`/dang-nhap?loi=${encodeURIComponent(provider)}`);
    redirect(data.url);
  }

  if (demoMode) {
    const asAdmin = form.get("admin") === "1";
    const id = asAdmin ? "demo-admin" : `demo-${provider}`;
    if (!(await store.getProfile(id))) {
      await store.createProfile({
        id,
        email: asAdmin ? DEMO_ADMIN_EMAIL : `thu-${provider}@vidu.test`,
        fullName: asAdmin ? "Quản trị (thử)" : `Người dùng thử ${PROVIDERS.find((p) => p.id === provider)!.label}`,
        avatarUrl: null,
        provider,
        status: asAdmin ? "approved" : "pending",
      });
    }
    (await cookies()).set(DEMO_COOKIE, id, { httpOnly: true, sameSite: "lax", path: "/" });
    redirect(next);
  }

  redirect("/dang-nhap?loi=chua-cau-hinh");
}

export async function signOut() {
  if (hasSupabase) {
    const sb = await supabaseServer();
    await sb.auth.signOut();
  }
  (await cookies()).delete(DEMO_COOKIE);
  redirect("/");
}
