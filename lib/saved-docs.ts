"use client";

/**
 * Văn bản đã lưu: ghi trong trình duyệt (localStorage). Khi đã đăng nhập thì đồng bộ theo tài khoản
 * (cột "Văn bản đã lưu" của trang Tài khoản trong Google Sheet), nên máy khác đăng nhập cũng thấy.
 */
import { useSyncExternalStore } from "react";

const KEY = "ksv-van-ban-da-luu";
const listeners = new Set<() => void>();
let cache: string[] | null = null;
const EMPTY: string[] = [];

function read(): string[] {
  if (cache) return cache;
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    cache = Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(ids: string[], push = true) {
  cache = ids;
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    /* trình duyệt chặn lưu trữ: vẫn giữ trong phiên này */
  }
  listeners.forEach((l) => l());
  if (push) schedulePush();
}

/* ---------------- Đồng bộ với tài khoản ---------------- */

type Remote = {
  get: () => Promise<string[] | null>;
  set: (ids: string[]) => Promise<void>;
};
let remote: Remote | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;

function schedulePush() {
  if (!remote) return;
  clearTimeout(timer);
  const r = remote;
  timer = setTimeout(() => void r.set(read()), 800);
}

/** Gọi khi đăng nhập: gộp danh sách trên máy với danh sách của tài khoản. Gọi với null khi đăng xuất. */
export async function connectSaved(r: Remote | null) {
  remote = r;
  if (!r) return;
  const server = await r.get();
  if (!server || remote !== r) return;
  const local = read();
  const merged = [...local, ...server.filter((id) => !local.includes(id))];
  write(merged, false);
  if (merged.length !== server.length || merged.some((id, i) => id !== server[i])) void r.set(merged);
}

function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      l();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

export function useSavedDocs() {
  const saved = useSyncExternalStore(subscribe, read, () => EMPTY);
  const toggle = (id: string) =>
    write(saved.includes(id) ? saved.filter((x) => x !== id) : [id, ...saved]);
  const remove = (id: string) => write(saved.filter((x) => x !== id));
  return { saved, toggle, remove };
}
