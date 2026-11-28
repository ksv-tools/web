"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { LegalDoc } from "@/lib/documents";
import { api, useAuth } from "./Auth";
import { Icon } from "./Icon";

/** Tải file văn bản nội bộ từ máy chủ (cần tài khoản đã duyệt), trả về Blob. */
export async function fetchInternal(token: string, id: string): Promise<{ blob?: Blob; error?: string }> {
  const r = await api("doc", { token, id });
  if (!r.ok || typeof r.data !== "string") return { error: r.error ?? "Không lấy được văn bản." };
  const bin = atob(r.data);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return { blob: new Blob([bytes], { type: String(r.type ?? "application/pdf") }) };
}

/** Khung khóa: văn bản nội bộ, cần đăng nhập tài khoản đã duyệt. */
export function InternalLock({ d, compact }: { d: LegalDoc; compact?: boolean }) {
  const { user } = useAuth();
  const next = `/van-ban/xem?id=${d.id}`;
  return (
    <div className={compact ? "lock-note" : "lock-box"}>
      <Icon name="lock" size={compact ? 16 : 30} />
      <div>
        <b>Văn bản nội bộ</b>
        <p>
          {user
            ? "Tài khoản của bạn đang chờ duyệt. Được duyệt xong sẽ xem và tải được văn bản này."
            : "Chỉ tài khoản đã được duyệt mới xem và tải được văn bản này."}
        </p>
        {!user && (
          <div className="row-actions">
            <Link href={`/dang-nhap?next=${encodeURIComponent(next)}`} className="btn btn-primary btn-sm">
              Đăng nhập
            </Link>
            <Link href={`/dang-nhap?tab=dang-ky&next=${encodeURIComponent(next)}`} className="btn btn-outline btn-sm">
              Tạo tài khoản
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

/** Xem văn bản nội bộ ngay trên trang (đã duyệt). */
export function InternalViewer({ d }: { d: LegalDoc }) {
  const { user, ready, approved } = useAuth();
  const [url, setUrl] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!user || !approved) return;
    let live = true;
    let made = "";
    fetchInternal(user.token, d.id).then(({ blob, error }) => {
      if (!live) return;
      if (blob) setUrl((made = URL.createObjectURL(blob)));
      else setErr(error ?? "");
    });
    return () => {
      live = false;
      if (made) URL.revokeObjectURL(made);
    };
  }, [user, approved, d.id]);

  if (!ready) return <p className="empty">Đang tải…</p>;
  if (!approved) return <InternalLock d={d} />;
  if (err) return <p className="empty">{err}</p>;
  if (!url) return <p className="empty">Đang tải văn bản từ máy chủ…</p>;
  return (
    <>
      <iframe src={`${url}#view=FitH`} title={`Toàn văn ${d.number}`} />
      <p className="doc-mobile-hint">
        <a href={url} download={`${d.id}.pdf`} className="link">
          Tải văn bản
        </a>
      </p>
    </>
  );
}

/** Nút "Tải về" cho văn bản nội bộ trong danh sách. */
export function InternalDownload({ d }: { d: LegalDoc }) {
  const { user, approved } = useAuth();
  const [busy, setBusy] = useState(false);
  if (!user || !approved)
    return (
      <Link href={`/dang-nhap?next=${encodeURIComponent(`/van-ban/xem?id=${d.id}`)}`}>
        <Icon name="lock" size={15} /> Đăng nhập để tải
      </Link>
    );
  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        const { blob, error } = await fetchInternal(user.token, d.id);
        setBusy(false);
        if (!blob) return alert(error);
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${d.id}.pdf`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 5000);
      }}
    >
      <Icon name="download" size={15} /> {busy ? "Đang tải…" : "Tải về"}
    </button>
  );
}
