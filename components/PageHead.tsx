import Link from "next/link";
import { withBase } from "@/lib/config";

export function PageHead({
  title,
  lead,
  crumbs = [],
  children,
  image,
  credit,
  compact,
}: {
  title: string;
  lead?: React.ReactNode;
  crumbs?: { href: string; label: string }[];
  children?: React.ReactNode;
  /** Ảnh nền, ví dụ "/anh/van-ban.jpg" (trong public/). */
  image?: string;
  /** Ghi nguồn ảnh (bắt buộc với ảnh lấy từ trang khác yêu cầu ghi nguồn). */
  credit?: { text: string; href: string };
  /** Phần đầu thấp gọn (trang tra cứu: để nội dung lên sát trên). */
  compact?: boolean;
}) {
  return (
    <section
      className={`page-head${image ? " has-photo" : ""}${compact ? " is-compact" : ""}`}
      style={image ? ({ "--ph-img": `url(${withBase(image)})` } as React.CSSProperties) : undefined}
    >
      <div className="wrap">
        <nav className="crumbs" aria-label="Đường dẫn">
          <Link href="/">Trang chủ</Link>
          {crumbs.map((c) => (
            <span key={c.href} style={{ display: "contents" }}>
              <span aria-hidden="true">/</span>
              <Link href={c.href}>{c.label}</Link>
            </span>
          ))}
        </nav>
        <h1>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
        {children}
        {credit && (
          <a className="photo-credit" href={credit.href} target="_blank" rel="noopener noreferrer">
            {credit.text}
          </a>
        )}
      </div>
    </section>
  );
}
