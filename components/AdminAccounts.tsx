"use client";

import { useCallback, useEffect, useState } from "react";
import { api, useAuth } from "./Auth";

type Account = {
  email: string;
  name: string;
  unit: string;
  role: string;
  phone: string;
  via: string;
  status: string;
  created: string;
  approved: string;
  note: string;
  notified: string;
  owner: boolean;
};

const OK = "Đã duyệt";
const PENDING = "Chờ duyệt";
const NO = "Từ chối";
const LOCK = "Khóa";

type Filter = "cho" | "duyet" | "khac" | "tat-ca";
const FILTERS: { id: Filter; label: string; test: (a: Account) => boolean }[] = [
  { id: "cho", label: "Chờ duyệt", test: (a) => a.status === PENDING },
  { id: "duyet", label: "Đã duyệt", test: (a) => a.status === OK },
  { id: "khac", label: "Từ chối, khóa", test: (a) => a.status === NO || a.status === LOCK },
  { id: "tat-ca", label: "Tất cả", test: () => true },
];

function day(v: string) {
  const d = v ? new Date(v) : null;
  return d && !isNaN(d.getTime()) ? d.toLocaleDateString("vi-VN") : "";
}

/** Trang Quản trị: duyệt, từ chối, khóa tài khoản. Duyệt / từ chối thì máy chủ gửi email báo ngay. */
export function AdminAccounts() {
  const { user } = useAuth();
  const [list, setList] = useState<Account[] | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState("");
  const [filter, setFilter] = useState<Filter>("cho");
  const [q, setQ] = useState("");

  const load = useCallback(async () => {
    if (!user?.admin) return;
    const r = await api("acc-list", { token: user.token });
    if (!r.ok) return setErr(r.error ?? "Không tải được danh sách.");
    setErr("");
    const accs = (r.accounts as Account[]) ?? [];
    accs.sort((a, b) => (b.created || "").localeCompare(a.created || ""));
    setList(accs);
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!user?.admin) return null;

  const set = async (a: Account, status: string) => {
    if (status === NO && !confirm(`Từ chối tài khoản ${a.email}? Người này sẽ nhận email báo.`)) return;
    if (status === LOCK && !confirm(`Khóa tài khoản ${a.email}? Người này sẽ mất quyền ngay.`)) return;
    setBusy(a.email);
    const r = await api("acc-set", { token: user.token, email: a.email, status });
    setBusy("");
    if (!r.ok) return setErr(r.error ?? "Không cập nhật được.");
    setList((l) => l?.map((x) => (x.email === a.email ? { ...x, status, approved: x.approved || (status === OK ? new Date().toISOString() : "") } : x)) ?? l);
  };

  const pending = list?.filter((a) => a.status === PENDING).length ?? 0;
  const needle = q.trim().toLowerCase();
  const shown = (list ?? [])
    .filter(FILTERS.find((f) => f.id === filter)!.test)
    .filter((a) => !needle || [a.name, a.email, a.unit, a.role].join(" ").toLowerCase().includes(needle));

  return (
    <div className="panel">
      <div className="acc-head">
        <h2>
          Tài khoản{" "}
          {pending > 0 && <span className="acc-badge">{pending} chờ duyệt</span>}
        </h2>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => void load()}>
          Tải lại
        </button>
      </div>
      <p className="muted" style={{ marginBottom: 14 }}>
        Duyệt hoặc từ chối thì người đăng ký nhận email báo ngay. Tài khoản đã duyệt dùng không hết hạn; khóa thì mất quyền
        ngay ở lần mở trang sau.
      </p>
      <div className="acc-tools">
        <div className="auth-tabs acc-filter" role="tablist">
          {FILTERS.map((f) => (
            <button key={f.id} type="button" role="tab" aria-selected={filter === f.id} onClick={() => setFilter(f.id)}>
              {f.label} {list ? `(${list.filter(f.test).length})` : ""}
            </button>
          ))}
        </div>
        <input className="acc-search" placeholder="Tìm tên, email, đơn vị…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {err && <p className="alert alert-err">{err}</p>}
      {!list ? (
        <p className="muted">Đang tải…</p>
      ) : shown.length === 0 ? (
        <p className="empty">Không có tài khoản nào.</p>
      ) : (
        <div className="acc-list">
          {shown.map((a) => (
            <div key={a.email} className="acc-row">
              <div className="acc-info">
                <b>{a.name || "(chưa có tên)"}</b>
                <span className={`acc-st acc-st-${a.status === OK ? "ok" : a.status === PENDING ? "wait" : "no"}`}>
                  {a.owner ? "Quản trị" : a.status}
                </span>
                <div className="muted">
                  {a.email}
                  {a.phone && ` · ${a.phone}`}
                </div>
                <div>
                  {[a.role, a.unit].filter(Boolean).join(" · ") || <span className="muted">Chưa ghi đơn vị</span>}
                </div>
                <div className="muted acc-meta">
                  Đăng ký {day(a.created)} qua {a.via || "?"}
                  {a.approved && ` · duyệt ${day(a.approved)}`}
                </div>
              </div>
              {!a.owner && (
                <div className="acc-actions">
                  {a.status !== OK && (
                    <button type="button" className="btn btn-primary btn-sm" disabled={busy === a.email} onClick={() => void set(a, OK)}>
                      {a.status === LOCK ? "Mở khóa" : "Duyệt"}
                    </button>
                  )}
                  {a.status === PENDING && (
                    <button type="button" className="btn btn-outline btn-sm" disabled={busy === a.email} onClick={() => void set(a, NO)}>
                      Từ chối
                    </button>
                  )}
                  {a.status === OK && (
                    <button type="button" className="btn btn-ghost btn-sm" disabled={busy === a.email} onClick={() => void set(a, LOCK)}>
                      Khóa
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
