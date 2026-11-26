import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/app/dang-nhap/actions";
import { Avatar } from "@/components/Avatar";
import { Icon } from "@/components/Icon";
import { PageHead } from "@/components/PageHead";
import { fmtTime, STATUS_LABEL } from "@/lib/format";
import { getUser } from "@/lib/session";
import { startOfTodayVN, store } from "@/lib/store";
import { getTool } from "@/lib/tools";

export const metadata: Metadata = { title: "Tài khoản" };

export default async function AccountPage() {
  const user = await getUser();
  if (!user) redirect("/dang-nhap?next=/tai-khoan");
  const [downloads, usedToday] = await Promise.all([
    store.listDownloads({ userId: user.id, limit: 50 }),
    store.countDownloadsSince(user.id, startOfTodayVN()),
  ]);
  const st = STATUS_LABEL[user.status];

  return (
    <>
      <PageHead title="Tài khoản của tôi" crumbs={[{ href: "/tai-khoan", label: "Tài khoản" }]} />
      <section className="section" style={{ paddingTop: 48 }}>
        <div className="wrap stack" style={{ maxWidth: 880 }}>
          <div className="panel status-card">
            <Avatar name={user.fullName || user.email} src={user.avatarUrl} />
            <div style={{ flex: 1, minWidth: 200 }}>
              <h2>{user.fullName || user.email}</h2>
              <p>
                {user.email} · đăng nhập bằng {user.provider || "mạng xã hội"}
              </p>
            </div>
            <div className="row-actions">
              <span className={`tag ${st.cls}`}>{st.text}</span>
              {user.isAdmin && <span className="tag">Quản trị</span>}
              <form action={signOut}>
                <button type="submit" className="btn btn-ghost btn-sm">
                  <Icon name="logout" size={18} /> Đăng xuất
                </button>
              </form>
            </div>
          </div>

          {user.status === "pending" && (
            <div className="alert alert-warn" style={{ margin: 0 }}>
              Tài khoản đang chờ duyệt. Khi được duyệt, bạn tải được công cụ ngay, không cần đăng nhập lại.
            </div>
          )}
          {user.status === "locked" && (
            <div className="alert alert-err" style={{ margin: 0 }}>
              Tài khoản đã bị khóa. Liên hệ người quản trị trang nếu bạn cho rằng đây là nhầm lẫn.
            </div>
          )}
          {user.status === "approved" && (
            <div className="panel">
              <h3>Lượt tải hôm nay</h3>
              <dl className="kv">
                <dt>Đã dùng</dt>
                <dd>
                  {usedToday}/{user.quota}
                </dd>
                <dt>Làm mới</dt>
                <dd>0 giờ hằng ngày</dd>
              </dl>
            </div>
          )}

          <div>
            <h2 className="h-section" style={{ fontSize: 26, marginBottom: 16 }}>
              Lịch sử tải
            </h2>
            {downloads.length ? (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Thời gian</th>
                      <th>Công cụ</th>
                      <th>Phiên bản</th>
                    </tr>
                  </thead>
                  <tbody>
                    {downloads.map((d) => (
                      <tr key={d.id}>
                        <td>{fmtTime(d.createdAt)}</td>
                        <td>{getTool(d.tool)?.name ?? d.tool}</td>
                        <td>{d.version}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="muted">
                Chưa tải công cụ nào. <Link href="/cong-cu" className="link">Xem công cụ</Link>
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
