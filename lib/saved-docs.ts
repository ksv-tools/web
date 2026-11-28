"use client";

/** Văn bản đã lưu: ghi trong trình duyệt của người dùng (localStorage), không gửi đi đâu. */
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

function write(ids: string[]) {
  cache = ids;
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    /* trình duyệt chặn lưu trữ: vẫn giữ trong phiên này */
  }
  listeners.forEach((l) => l());
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
  return { saved, toggle };
}
