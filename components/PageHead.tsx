import Link from "next/link";

export function PageHead({
  title,
  lead,
  crumbs = [],
  children,
}: {
  title: string;
  lead?: React.ReactNode;
  crumbs?: { href: string; label: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="page-head">
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
      </div>
    </section>
  );
}
