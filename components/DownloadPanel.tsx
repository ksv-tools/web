import Link from "next/link";
import { type Release, formatSize } from "@/lib/release";
import type { SessionUser } from "@/lib/session";
import { Icon } from "./Icon";

/** Khung tải app: hiện nút tải hoặc lý do chưa tải được, tùy trạng thái tài khoản và hạn mức. */
export function DownloadPanel({
  slug,
  release,
  user,
  usedToday,
  error,
}: {
  slug: string;
  release: Release | null;
  user: SessionUser | null;
  usedToday: number;
  error?: string;
}) {
  const left = user ? Math.max(0, user.quota - usedToday) : 0;
  const date = release ? new Date(release.publishedAt).toLocaleDateString("vi-VN") : "";

  let action: React.ReactNode;
  if (!release) {
    action = <p className="panel-msg">Chưa lấy được bản cài mới nhất. Thử lại sau ít phút.</p>;
  } else if (!user) {
    action = (
      <>
        <Link href={`/dang-nhap?next=/cong-cu/${slug}`} className="btn btn-primary">
          Đăng nhập để tải
        </Link>
        <p className="panel-msg">Cần đăng nhập và được duyệt mới tải được.</p>
      </>
    );
  } else if (user.status === "pending") {
    action = (
      <>
        <span className="btn btn-primary" aria-disabled="true">
          <Icon name="download" size={18} /> Tải về
        </span>
        <p className="panel-msg">Tài khoản đang chờ duyệt. Bạn sẽ tải được ngay khi được duyệt.</p>
      </>
    );
  } else if (user.status === "locked") {
    action = <div className="alert alert-err">Tài khoản đã bị khóa.</div>;
  } else if (left === 0) {
    action = (
      <>
        <span className="btn btn-primary" aria-disabled="true">
          <Icon name="download" size={18} /> Tải về
        </span>
        <p className="panel-msg">Bạn đã dùng hết {user.quota} lượt tải hôm nay. Lượt tải được làm mới lúc 0 giờ.</p>
      </>
    );
  } else {
    action = (
      <>
        <a href={`/tai-ve/${slug}`} className="btn btn-primary">
          <Icon name="download" size={18} /> Tải về ({formatSize(release.size)})
        </a>
        <p className="panel-msg">
          Còn {left}/{user.quota} lượt tải hôm nay.
        </p>
      </>
    );
  }

  return (
    <div className="panel panel-brand">
      <h2>Tải app</h2>
      {error && <div className="alert alert-err">{error}</div>}
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
