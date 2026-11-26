import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { PageHead } from "@/components/PageHead";
import { defaultDailyQuota, isAdminEmail } from "@/lib/config";
import { fmtTime, STATUS_LABEL } from "@/lib/format";
import { getUser } from "@/lib/session";
import { startOfTodayVN, store, type UserStatus } from "@/lib/store";
import { getTool } from "@/lib/tools";
import { setQuota, setStatus } from "./actions";

export const metadata: Metadata = { title: "Quản trị" };

const FILTERS: { id: UserStatus | "all"; label: string }[] = [
  { id: "pending", label: "Chờ duyệt" },
  { id: "approved", label: "Đã duyệt" },
  { id: "locked", label: "Đã khóa" },
  { id: "all", label: "Tất cả" },
];

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ tab?: string; loc?: string }> }) {
  const me = await getUser();
  if (!me) redirect("/dang-nhap?next=/quan-tri");
  if (!me.isAdmin) notFound();

  const sp = await searchParams;
  const tab = sp.tab === "luot-tai" ? "luot-tai" : "nguoi-dung";
  const [profiles, downloads] = await Promise.all([store.listProfiles(), store.listDownloads({ limit: 500 })]);
  const today = startOfTodayVN();
  const usedToday = new Map<string, number>();
  for (const d of downloads) if (d.createdAt >= today) usedToday.set(d.userId, (usedToday.get(d.userId) ?? 0) + 1);

  const counts = { pending: 0, approved: 0, locked: 0, all: profiles.length };
  for (const p of profiles) counts[p.status]++;
  const filter = (FILTERS.find((f) => f.id === sp.loc)?.id ?? (counts.pending ? "pending" : "all")) as UserStatus | "all";
  const shown = filter === "all" ? profiles : profiles.filter((p) => p.status === filter);

  return (
    <>
      <PageHead
        title="Quản trị"
        lead={`${counts.pending} người chờ duyệt · ${counts.approved} người đang dùng · ${downloads.filter((d) => d.createdAt >= today).length} lượt tải hôm nay`}
        crumbs={[{ href: "/quan-tri", label: "Quản trị" }]}
      />
      <section className="section" style={{ paddingTop: 32 }}>
        <div className="wrap">
          <nav className="admin-tabs">
            <Link href="/quan-tri" aria-current={tab === "nguoi-dung" ? "page" : undefined}>
              Người dùng ({profiles.length})
            </Link>
            <Link href="/quan-tri?tab=luot-tai" aria-current={tab === "luot-tai" ? "page" : undefined}>
              Lượt tải
            </Link>
          </nav>

          {tab === "nguoi-dung" ? (
            <>
              <div className="tool-meta" style={{ marginBottom: 20 }}>
                {FILTERS.map((f) => (
                  <Link
                    key={f.id}
                    href={`/quan-tri?loc=${f.id}`}
                    className={`tag ${filter === f.id ? "tag-ready" : ""}`}
                  >
                    {f.label} ({counts[f.id]})
                  </Link>
                ))}
              </div>
              {shown.length ? (
                <div className="table-wrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Người dùng</th>
                        <th>Trạng thái</th>
                        <th>Đăng ký</th>
                        <th>Tải hôm nay</th>
                        <th>Lượt/ngày</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shown.map((p) => {
                        const admin = isAdminEmail(p.email) || p.id === me.id;
                        const st = STATUS_LABEL[p.status];
                        return (
                          <tr key={p.id}>
                            <td>
                              <div className="person">
                                <Avatar name={p.fullName || p.email} src={p.avatarUrl} />
                                <div>
                                  <b>{p.fullName || "(không tên)"}</b>
                                  <small>
                                    {p.email} · {p.provider}
                                  </small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className={`tag ${st.cls}`}>{admin ? "Quản trị" : st.text}</span>
                            </td>
                            <td>{fmtTime(p.createdAt)}</td>
                            <td>{usedToday.get(p.id) ?? 0}</td>
                            <td>
                              <form action={setQuota} className="quota-form">
                                <input type="hidden" name="id" value={p.id} />
                                <input
                                  name="quota"
                                  type="number"
                                  min={0}
                                  max={1000}
                                  defaultValue={p.dailyQuota ?? ""}
                                  placeholder={String(defaultDailyQuota)}
                                  aria-label={`Số lượt tải mỗi ngày của ${p.fullName || p.email}`}
                                />
                                <button type="submit" className="btn btn-ghost btn-sm">
                                  Lưu
                                </button>
                              </form>
                            </td>
                            <td>
                              {admin ? (
                                <span className="muted">—</span>
                              ) : (
                                <div className="row-actions">
                                  {p.status !== "approved" && (
                                    <form action={setStatus}>
                                      <input type="hidden" name="id" value={p.id} />
                                      <button name="status" value="approved" className="btn btn-primary btn-sm">
                                        {p.status === "locked" ? "Mở khóa" : "Duyệt"}
                                      </button>
                                    </form>
                                  )}
                                  {p.status !== "locked" && (
                                    <form action={setStatus}>
                                      <input type="hidden" name="id" value={p.id} />
                                      <button name="status" value="locked" className="btn btn-outline btn-sm">
                                        {p.status === "pending" ? "Từ chối" : "Khóa"}
                                      </button>
                                    </form>
                                  )}
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="empty">Không có ai trong mục này.</p>
              )}
              <p className="muted" style={{ fontSize: 14, marginTop: 16 }}>
                Ô lượt/ngày để trống là dùng mức mặc định ({defaultDailyQuota} lượt). Nhập 0 để chặn tải nhưng vẫn cho
                đăng nhập.
              </p>
            </>
          ) : downloads.length ? (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Thời gian</th>
                    <th>Người tải</th>
                    <th>Công cụ</th>
                    <th>Phiên bản</th>
                  </tr>
                </thead>
                <tbody>
                  {downloads.map((d) => (
                    <tr key={d.id}>
                      <td>{fmtTime(d.createdAt)}</td>
                      <td>
                        <b style={{ color: "var(--ink)", fontWeight: 500 }}>{d.fullName || d.email}</b>
                        <br />
                        <small className="muted">{d.email}</small>
                      </td>
                      <td>{getTool(d.tool)?.name ?? d.tool}</td>
                      <td>{d.version}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="empty">Chưa có lượt tải nào.</p>
          )}
        </div>
      </section>
    </>
  );
}
