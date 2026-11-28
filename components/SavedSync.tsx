"use client";

import { useEffect } from "react";
import { connectSaved } from "@/lib/saved-docs";
import { api, useAuth } from "./Auth";

/** Nối danh sách văn bản đã lưu với tài khoản đang đăng nhập. */
export function SavedSync() {
  const { user } = useAuth();
  const token = user?.token;
  useEffect(() => {
    if (!token || token.startsWith("demo.")) {
      void connectSaved(null);
      return;
    }
    void connectSaved({
      get: async () => {
        const r = await api("saved-get", { token });
        return r.ok ? ((r.ids as string[]) ?? []) : null;
      },
      set: async (ids) => {
        await api("saved-set", { token, ids });
      },
    });
  }, [token]);
  return null;
}
