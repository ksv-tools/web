"use client";

import Link from "next/link";
import { useState } from "react";
import { fold } from "@/lib/doc-search";
import { type LegalDoc, fieldName, fmtDate, getDoc, groupName } from "@/lib/documents";
import { useSavedDocs } from "@/lib/saved-docs";
import { Icon } from "./Icon";

/** Trang Tài khoản: danh sách văn bản đã lưu (đồng bộ theo tài khoản), lọc nhanh, mở hoặc bỏ lưu. */
export function SavedDocsPanel() {
  const { saved, remove } = useSavedDocs();
  const [q, setQ] = useState("");
  const docs = saved.map((id) => getDoc(id)).filter((d): d is LegalDoc => Boolean(d));
  const needle = fold(q.trim());
  const shown = needle
    ? docs.filter((d) => fold([d.name, d.number, d.title].join(" ")).includes(needle))
    : docs;

  return (
    <div className="panel saved-panel">
      <div className="acc-head">
        <h3>
          Văn bản đã lưu <span className="saved-count">{docs.length}</span>
        </h3>
        <Link href="/van-ban?nhom=da-luu" className="btn btn-ghost btn-sm">
          Mở ở trang Văn bản
        </Link>
      </div>
      {docs.length === 0 ? (
        <p className="empty">
          Chưa lưu văn bản nào. Ở trang{" "}
          <Link href="/van-ban" className="link">
            Văn bản
          </Link>
          , bấm ☆ Lưu ở văn bản hay dùng để đưa vào đây; danh sách đi theo tài khoản, đăng nhập máy khác vẫn thấy.
        </p>
      ) : (
        <>
          {docs.length > 5 && (
            <input
              className="acc-search saved-search"
              placeholder="Lọc theo tên, số hiệu…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          )}
          <ul className="saved-list">
            {shown.map((d) => (
              <li key={d.id}>
                <div className="saved-info">
                  <Link href={`/van-ban/xem?id=${d.id}`} className="saved-name">
                    {d.name}
                  </Link>
                  <span className="muted saved-meta">
                    {d.number} · {fmtDate(d.date)} · {fieldName(d.field)} · {groupName(d.group)}
                  </span>
                </div>
                <div className="saved-actions">
                  <Link href={`/van-ban/xem?id=${d.id}`} className="btn btn-outline btn-sm">
                    Xem
                  </Link>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => remove(d.id)} title="Bỏ lưu">
                    <Icon name="star" size={16} /> Bỏ lưu
                  </button>
                </div>
              </li>
            ))}
            {shown.length === 0 && <li className="muted">Không có văn bản khớp.</li>}
          </ul>
        </>
      )}
    </div>
  );
}
