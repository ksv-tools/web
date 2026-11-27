"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { withBase } from "@/lib/config";
import { EFFECT_LABEL, GROUPS, docFile, fieldName, fmtDate, getDoc, issuerName, typeName } from "@/lib/documents";
import { Icon } from "./Icon";
import { PageHead } from "./PageHead";

/** Trang đọc toàn văn một văn bản ngay trên web (file PDF trong public/van-ban-goc/). */
export function DocViewer() {
  const d = getDoc(useSearchParams().get("id"));

  if (!d) {
    return (
      <>
        <PageHead title="Không tìm thấy văn bản" crumbs={[{ href: "/van-ban", label: "Văn bản hướng dẫn" }]} />
        <section className="section" style={{ paddingTop: 48 }}>
          <div className="wrap">
            <p className="empty">
              Văn bản không có hoặc đã được gỡ. <Link href="/van-ban" className="link">Về danh mục văn bản</Link>
            </p>
          </div>
        </section>
      </>
    );
  }

  const file = withBase(docFile(d));
  const group = GROUPS.find((g) => g.id === d.group)?.name;

  return (
    <>
      <PageHead
        title={d.name}
        lead={d.title !== d.name ? d.title : undefined}
        crumbs={[
          { href: "/van-ban", label: "Văn bản hướng dẫn" },
          { href: `/van-ban?linh-vuc=${d.field}`, label: fieldName(d.field) },
        ]}
      >
        <div className="tool-meta" style={{ marginTop: 20 }}>
          {d.effect && <span className={`tag ${EFFECT_LABEL[d.effect].cls}`}>{EFFECT_LABEL[d.effect].text}</span>}
          <span className="tag">{typeName(d.type)}</span>
          {group && <span className="tag">{group}</span>}
        </div>
      </PageHead>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="wrap doc-view">
          <aside className="doc-info panel">
            <dl className="kv">
              <dt>Số hiệu</dt>
              <dd>{d.number}</dd>
              <dt>{d.date.length > 4 ? "Ngày ban hành" : "Năm"}</dt>
              <dd>{fmtDate(d.date)}</dd>
              <dt>Cơ quan ban hành</dt>
              <dd>{d.issuerDetail ?? issuerName(d.issuer)}</dd>
              {d.effect && (
                <>
                  <dt>Hiệu lực</dt>
                  <dd>{EFFECT_LABEL[d.effect].text}</dd>
                </>
              )}
              {d.source && (
                <>
                  <dt>Nguồn bản gốc</dt>
                  <dd>{d.source}</dd>
                </>
              )}
            </dl>
            {d.note && <p className="doc-note">{d.note}</p>}
            {d.hasFile && (
              <div className="doc-actions">
                <a href={file} target="_blank" rel="noopener" className="btn btn-primary btn-sm">
                  Mở toàn màn hình
                </a>
                <a href={file} download className="btn btn-outline btn-sm">
                  <Icon name="download" size={16} /> Tải về
                </a>
              </div>
            )}
          </aside>

          <div className="doc-paper">
            {d.hasFile ? (
              <>
                <iframe src={d.html ? file : `${file}#view=FitH`} title={`Toàn văn ${d.number}`} />
                <p className="doc-mobile-hint">
                  Điện thoại không hiện được văn bản ở đây?{" "}
                  <a href={file} target="_blank" rel="noopener" className="link">
                    Mở văn bản
                  </a>
                </p>
              </>
            ) : (
              <p className="empty">
                Toàn văn đang được cập nhật. Bạn có file văn bản này?{" "}
                <Link href="/de-xuat" className="link">
                  Gửi đề xuất
                </Link>
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
