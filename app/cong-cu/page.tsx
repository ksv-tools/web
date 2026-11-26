import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/PageHead";
import { ToolCard } from "@/components/ToolCard";
import { AREAS, type AreaId, TOOLS } from "@/lib/tools";

export const metadata: Metadata = { title: "Công cụ" };

export default async function ToolsPage({ searchParams }: { searchParams: Promise<{ "linh-vuc"?: string }> }) {
  const sp = await searchParams;
  const area = AREAS.find((a) => a.id === sp["linh-vuc"])?.id as AreaId | undefined;
  const list = area ? TOOLS.filter((t) => t.areas.includes(area)) : TOOLS;

  return (
    <>
      <PageHead
        title="Công cụ"
        lead="Công cụ đã sẵn sàng và công cụ đang làm. Công cụ mới được thêm dần theo nhu cầu thực tế của đồng nghiệp."
        crumbs={[{ href: "/cong-cu", label: "Công cụ" }]}
      >
        <div className="tool-meta" style={{ marginTop: 28 }}>
          <Link href="/cong-cu" className={`tag ${!area ? "tag-ready" : ""}`}>
            Tất cả
          </Link>
          {AREAS.map((a) => (
            <Link key={a.id} href={`/cong-cu?linh-vuc=${a.id}`} className={`tag ${area === a.id ? "tag-ready" : ""}`}>
              {a.name}
            </Link>
          ))}
        </div>
      </PageHead>
      <section className="section" style={{ paddingTop: 56 }}>
        <div className="wrap">
          {list.length ? (
            <div className="tool-grid">
              {list.map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>
          ) : (
            <p className="empty">Chưa có công cụ cho lĩnh vực này.</p>
          )}
        </div>
      </section>
    </>
  );
}
