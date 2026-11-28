"use client";

import { useEffect, useState } from "react";
import { type Release, downloadUrl, formatSize, latestRelease } from "@/lib/release";
import Link from "next/link";
import { logDownload, useAuth } from "./Auth";
import { Icon } from "./Icon";

/**
 * Khung tải app. Chưa đăng nhập thì hiện nút Google; đăng nhập rồi thì hiện nút Tải về.
 * `initial` là thông tin bản cài lúc dựng web; trình duyệt lấy lại bản mới nhất khi mở trang.
 */
export function DownloadPanel({ slug, initial }: { slug: string; initial: Release | null }) {
  const { user, ready, approved, signOut } = useAuth();
  const [release, setRelease] = useState(initial);
  const url = downloadUrl(slug);

  useEffect(() => {
    latestRelease(slug).then((r) => r && setRelease(r));
  }, [slug]);

  const date = release ? new Date(release.publishedAt).toLocaleDateString("vi-VN") : "";

  let action: React.ReactNode;
  if (!url) {
    action = <p className="panel-msg">Chưa có bản cài.</p>;
  } else if (!ready) {
    action = <p className="panel-msg">Đang tải…</p>;
  } else if (!user) {
    action = (
      <>
        <Link href={`/dang-nhap?next=/cong-cu/${slug}`} className="btn btn-primary">
          <Icon name="lock" size={18} /> Đăng nhập để tải
        </Link>
        <p className="panel-msg">
          Cần tài khoản đã được duyệt.{" "}
          <Link href={`/dang-nhap?tab=dang-ky&next=/cong-cu/${slug}`} className="link">
            Tạo tài khoản
          </Link>
        </p>
      </>
    );
  } else if (!approved) {
    action = (
      <p className="panel-msg">
        Tài khoản <b>{user.email}</b> đang chờ duyệt. Được duyệt xong sẽ tải được app.
      </p>
    );
  } else {
    action = (
      <>
        <a
          href={url}
          className="btn btn-primary"
          onClick={() => logDownload(user, slug, release?.version ?? "")}
        >
          <Icon name="download" size={18} /> Tải về{release ? ` (${formatSize(release.size)})` : ""}
        </a>
        <p className="panel-msg">
          Đang đăng nhập: <b>{user.email}</b>.{" "}
          <button type="button" className="link-btn" onClick={signOut}>
            Đổi tài khoản
          </button>
        </p>
      </>
    );
  }

  return (
    <div className="panel panel-brand">
      <h2>Tải app</h2>
      {release && (
        <dl className="kv" style={{ marginBottom: 20 }}>
          <dt>Phiên bản</dt>
          <dd>{release.version}</dd>
          <dt>Ngày phát hành</dt>
          <dd>{date}</dd>
          <dt>Dung lượng</dt>
          <dd>{formatSize(release.size)}</dd>
          <dt>Hệ điều hành</dt>
          <dd>Windows 10, 11</dd>
        </dl>
      )}
      {action}
    </div>
  );
}
