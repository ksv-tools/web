"use server";

import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/session";
import { store, type UserStatus } from "@/lib/store";

async function requireAdmin() {
  const me = await getUser();
  if (!me?.isAdmin) throw new Error("Không có quyền quản trị");
  return me;
}

const STATUSES: UserStatus[] = ["pending", "approved", "locked"];

export async function setStatus(form: FormData) {
  const me = await requireAdmin();
  const id = String(form.get("id"));
  const status = String(form.get("status")) as UserStatus;
  if (!STATUSES.includes(status) || id === me.id) return;
  await store.updateProfile(id, { status });
  revalidatePath("/quan-tri");
}

export async function setQuota(form: FormData) {
  await requireAdmin();
  const id = String(form.get("id"));
  const raw = String(form.get("quota") ?? "").trim();
  // Để trống: quay về hạn mức mặc định.
  const n = raw === "" ? null : Number.parseInt(raw, 10);
  if (n !== null && (!Number.isFinite(n) || n < 0 || n > 1000)) return;
  await store.updateProfile(id, { dailyQuota: n });
  revalidatePath("/quan-tri");
}
