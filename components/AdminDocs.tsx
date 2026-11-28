"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { DOCUMENTS, fmtDate } from "@/lib/documents";
import { api, useAuth } from "./Auth";

const MAX = 15 * 1024 * 1024;

function toBase64(file: File): Promise<string> {
  return new Promise((ok, fail) => {
    const r = new FileReader();
    r.onload = () => ok(String(r.result).split(",")[1] ?? "");
    r.onerror = () => fail(r.error);
    r.readAsDataURL(file);
  });
}

/** Trang quản trị: tải file văn bản nội bộ lên máy chủ Apps Script (chỉ chủ Sheet dùng được). */
export function AdminDocs() {
  const { user, ready } = useAuth();
  const [uploaded, setUploaded] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<Record<string, string>>({});
  const internal = DOCUMENTS.filter((d) => d.internal);

  const load = useCallback(async () => {
    if (!user?.admin) return;
    const r = await api("doc-list", { token: user.token });
    const list = (r.docs as { id: string; at: string }[] | undefined) ?? [];
    setUploaded(Object.fromEntries(list.map((x) => [x.id, x.at])));
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!ready) return <p className="muted">Đang tải…</p>;
  if (!user?.admin)
    return (
      <p className="empty">
        Trang này chỉ dành cho người quản trị (tài khoản Google đang chạy Google Sheet).{" "}
        <Link href="/dang-nhap?next=/quan-tri" className="link">
          Đăng nhập
        </Link>
      </p>
    );

  return (
    <div className="panel">
      <h2>Văn bản nội bộ</h2>
      <p className="muted" style={{ marginBottom: 16 }}>
        File chỉ lưu trong Google Sheet của bạn, không đưa lên web công khai. Chọn file PDF cho từng văn bản; tải lại sẽ thay
        file cũ. Danh sách văn bản nội bộ nằm ở <code>data/van-ban-noi-bo.json</code>.
      </p>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Văn bản</th>
            <th>Trên máy chủ</th>
            <th>Tải file lên</th>
          </tr>
        </thead>
        <tbody>
          {internal.map((d) => (
            <tr key={d.id}>
              <td>
                <b>{d.number}</b> · {fmtDate(d.date)}
                <br />
                <span className="muted">{d.name}</span>
              </td>
              <td>{uploaded[d.id] ? `Có (${new Date(uploaded[d.id]!).toLocaleDateString("vi-VN")})` : "Chưa có"}</td>
              <td>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > MAX) return setMsg((m) => ({ ...m, [d.id]: "Tệp quá 15 MB." }));
                    setMsg((m) => ({ ...m, [d.id]: "Đang tải lên…" }));
                    const r = await api("doc-upload", {
                      token: user.token,
                      id: d.id,
                      name: file.name,
                      type: file.type || "application/pdf",
                      data: await toBase64(file),
                    });
                    setMsg((m) => ({ ...m, [d.id]: r.ok ? "Đã tải lên." : (r.error ?? "Lỗi.") }));
                    e.target.value = "";
                    void load();
                  }}
                />
                {msg[d.id] && <p className="muted">{msg[d.id]}</p>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
