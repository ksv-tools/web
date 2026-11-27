"use client";

import Link from "next/link";
import { useState } from "react";
import { FIELDS } from "@/lib/documents";
import { GoogleButton, sendSuggestion, useAuth } from "./Auth";

const MAX_FILE = 10 * 1024 * 1024;

/** Đọc tệp thành chuỗi base64 (bỏ phần "data:...;base64,"). */
function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1] ?? "");
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

/** Người đọc đề xuất người quản trị đăng một tài liệu. Cần đăng nhập Google để tránh thư rác. */
export function SuggestForm() {
  const { user, ready } = useAuth();
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [fileError, setFileError] = useState("");
  const [picked, setPicked] = useState(false);

  if (!ready) return <p className="muted">Đang tải…</p>;
  if (!user)
    return (
      <div className="panel">
        <h3>Đăng nhập để gửi đề xuất</h3>
        <p className="panel-msg" style={{ marginTop: 0, marginBottom: 16 }}>
          Đề xuất được gửi kèm họ tên, email Google của bạn để người quản trị liên hệ khi cần.
        </p>
        <GoogleButton width={300} />
      </div>
    );

  if (state === "done")
    return (
      <div className="alert alert-ok">
        Đã gửi đề xuất. Cảm ơn bạn! Người quản trị sẽ xem xét và đăng nếu phù hợp.{" "}
        <button type="button" className="link-btn" onClick={() => setState("idle")}>
          Gửi đề xuất khác
        </button>
      </div>
    );

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    const upload = f.get("file");
    const hasFile = upload instanceof File && upload.size > 0;
    if (hasFile && upload.size > MAX_FILE) {
      setFileError("Tệp lớn hơn 10 MB. Vui lòng nén lại hoặc gửi link.");
      return;
    }
    setState("sending");
    const ok = await sendSuggestion(user!, {
      docName: get("docName"),
      number: get("number"),
      field: get("field"),
      link: get("link"),
      message: get("message"),
      file: hasFile ? { name: upload.name, type: upload.type, data: await toBase64(upload) } : undefined,
    });
    setState(ok ? "done" : "error");
  }

  return (
    <form className="form" onSubmit={submit}>
      <label>
        <span>
          Tên tài liệu <b className="req">*</b>
        </span>
        <input name="docName" required maxLength={300} placeholder="Ví dụ: Hướng dẫn liên ngành về xử lý vật chứng" />
      </label>
      <div className="form-row">
        <label>
          <span>Số hiệu (nếu có)</span>
          <input name="number" maxLength={120} placeholder="Ví dụ: 01/HDLN-CA-VKS-TA" />
        </label>
        <label>
          <span>Lĩnh vực</span>
          <select name="field" defaultValue="Hình sự">
            {FIELDS.map((x) => (
              <option key={x.id}>{x.name}</option>
            ))}
            <option>Khác</option>
          </select>
        </label>
      </div>
      <label>
        <span>Link xem tài liệu (nếu có)</span>
        <input name="link" type="url" maxLength={500} placeholder="https://..." />
      </label>
      <label>
        <span>Tệp văn bản (nếu không có link)</span>
        <input
          name="file"
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={(e) => {
            const file = e.target.files?.[0];
            setPicked(Boolean(file));
            setFileError(file && file.size > MAX_FILE ? "Tệp lớn hơn 10 MB. Vui lòng nén lại hoặc gửi link." : "");
          }}
        />
        <small className="muted" style={{ fontWeight: 400 }}>
          PDF, Word hoặc ảnh chụp, tối đa 10 MB. Tệp được gửi thẳng vào email người quản trị, không đăng công khai.
        </small>
      </label>
      {fileError && <div className="alert alert-err">{fileError}</div>}
      {picked && (
        <label className="check">
          <input type="checkbox" name="notSecret" required />
          <span>
            Tôi xác nhận tệp <b>không chứa bí mật nhà nước</b> (không có dấu Mật, Tối mật, Tuyệt mật) và không phải hồ sơ
            vụ án.
          </span>
        </label>
      )}
      <label>
        <span>Ghi chú</span>
        <textarea name="message" rows={4} maxLength={2000} placeholder="Tài liệu dùng vào việc gì, ai ban hành, có file ở đâu…" />
      </label>
      {state === "error" && <div className="alert alert-err">Chưa gửi được. Vui lòng thử lại sau.</div>}
      <p className="muted" style={{ fontSize: 13.5, margin: 0 }}>
        Gửi với tên <b>{user.name || user.email}</b>. Không gửi tài liệu mật hoặc hồ sơ vụ án. Xem{" "}
        <Link href="/chinh-sach" className="link">
          chính sách dữ liệu
        </Link>
        .
      </p>
      <div>
        <button type="submit" className="btn btn-primary" disabled={state === "sending"}>
          {state === "sending" ? "Đang gửi…" : "Gửi đề xuất"}
        </button>
      </div>
    </form>
  );
}
