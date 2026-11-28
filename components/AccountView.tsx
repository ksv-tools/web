"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./Auth";
import { Avatar } from "./Avatar";
import { Icon } from "./Icon";
import { PendingNotice } from "./LoginBox";
import { SavedDocsPanel } from "./SavedDocsPanel";

export function AccountView() {
  const { user, ready, approved, signOut } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (ready && !user) router.replace("/dang-nhap?next=/tai-khoan");
  }, [ready, user, router]);
  if (!user) return <p className="muted">Đang tải…</p>;
  if (!approved)
    return (
      <>
        <PendingNotice />
        <SavedDocsPanel />
      </>
    );

  return (
    <>
      <div className="panel status-card">
        <Avatar name={user.name || user.email} src={user.picture} />
        <div style={{ flex: 1, minWidth: 200 }}>
          <h2>{user.name || user.email}</h2>
          <p>
            {user.email}
            {user.unit ? ` · ${user.unit}` : ""}
          </p>
        </div>
        <div className="row-actions">
          <button type="button" className="btn btn-ghost btn-sm" onClick={signOut}>
            <Icon name="logout" size={18} /> Đăng xuất
          </button>
        </div>
      </div>
      <SavedDocsPanel />
      <div className="panel">
        <h3>Tài khoản</h3>
        <dl className="kv">
          <dt>Trạng thái</dt>
          <dd>
            <span className="vb-effect is-con">{user.status}</span>
          </dd>
          {user.role && (
            <>
              <dt>Chức vụ</dt>
              <dd>{user.role}</dd>
            </>
          )}
          <dt>Đăng nhập bằng</dt>
          <dd>{user.via || "—"}</dd>
          <dt>Phiên đăng nhập</dt>
          <dd>không hết hạn trên trình duyệt này; máy dùng chung nhớ bấm Đăng xuất</dd>
        </dl>
      </div>
      {user.admin && (
        <div className="panel">
          <h3>Quản trị</h3>
          <p className="muted" style={{ margin: "4px 0 12px" }}>
            Duyệt tài khoản đăng ký mới, tải văn bản nội bộ lên máy chủ.
          </p>
          <Link href="/quan-tri" className="btn btn-primary btn-sm">
            Vào trang Quản trị
          </Link>
        </div>
      )}
      <p className="muted">
        Bạn đã có thể tải mọi công cụ và xem văn bản nội bộ.{" "}
        <Link href="/cong-cu" className="link">
          Xem công cụ
        </Link>
      </p>
    </>
  );
}
