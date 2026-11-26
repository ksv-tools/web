"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./Auth";
import { Avatar } from "./Avatar";
import { Icon } from "./Icon";

export function AccountView() {
  const { user, ready, signOut } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (ready && !user) router.replace("/dang-nhap?next=/tai-khoan");
  }, [ready, user, router]);
  if (!user) return <p className="muted">Đang tải…</p>;

  const until = new Date(user.until).toLocaleDateString("vi-VN");
  return (
    <>
      <div className="panel status-card">
        <Avatar name={user.name || user.email} src={user.picture} />
        <div style={{ flex: 1, minWidth: 200 }}>
          <h2>{user.name || user.email}</h2>
          <p>{user.email} · đăng nhập bằng Google</p>
        </div>
        <div className="row-actions">
          <button type="button" className="btn btn-ghost btn-sm" onClick={signOut}>
            <Icon name="logout" size={18} /> Đăng xuất
          </button>
        </div>
      </div>
      <div className="panel">
        <h3>Phiên đăng nhập</h3>
        <dl className="kv">
          <dt>Trên trình duyệt này</dt>
          <dd>đến hết ngày {until}</dd>
          <dt>Máy dùng chung</dt>
          <dd>nhớ bấm Đăng xuất khi dùng xong</dd>
        </dl>
      </div>
      <p className="muted">
        Bạn đã có thể tải mọi công cụ. <Link href="/cong-cu" className="link">Xem công cụ</Link>
      </p>
    </>
  );
}
