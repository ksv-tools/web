"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  DOC_TYPES,
  DOCUMENTS,
  type DocTypeId,
  EFFECT_LABEL,
  FIELDS,
  type FieldId,
  GROUPS,
  type GroupId,
  ISSUERS,
  type IssuerId,
  type LegalDoc,
  docHref,
  fmtDate,
  issuerName,
  typeName,
} from "@/lib/documents";
import { Icon } from "./Icon";

/** Bỏ dấu, chữ thường: gõ "an treo" vẫn tìm ra "án treo". */
function fold(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

type Filters = { group?: GroupId; issuer?: IssuerId; type?: DocTypeId };

/** Mục Văn bản: thanh chọn lĩnh vực, rồi tìm kiếm và lọc theo nhóm, cơ quan, loại văn bản trong lĩnh vực đó. */
export function DocsBrowser() {
  const sp = useSearchParams();
  const field = FIELDS.find((f) => f.id === sp.get("linh-vuc")) ?? FIELDS[0]!;

  return (
    <>
      <nav className="field-tabs" aria-label="Lĩnh vực">
        <div className="wrap field-tabs-in">
          {FIELDS.map((f) => (
            <Link
              key={f.id}
              href={`/van-ban?linh-vuc=${f.id}`}
              aria-current={f.id === field.id ? "page" : undefined}
              className={f.ready ? "" : "is-soon"}
            >
              {f.name}
            </Link>
          ))}
        </div>
      </nav>
      {field.ready ? (
        <FieldDocs key={field.id} field={field.id} initialGroup={GROUPS.find((g) => g.id === sp.get("nhom"))?.id} />
      ) : (
        <div className="wrap">
          <div className="field-soon">
            <Icon name="book" size={34} />
            <h2>{field.name}</h2>
            <p>Mục này đang được tổng hợp, sẽ cập nhật trong thời gian tới.</p>
          </div>
        </div>
      )}
    </>
  );
}

function FieldDocs({ field, initialGroup }: { field: FieldId; initialGroup?: GroupId }) {
  const [q, setQ] = useState("");
  const [f, setF] = useState<Filters>({ group: initialGroup });

  const index = useMemo(
    () =>
      DOCUMENTS.filter((d) => d.field === field).map((d) => ({
        d,
        text: fold([d.name, d.number, d.title, d.note, d.issuerDetail].join(" ")),
      })),
    [field],
  );

  const words = fold(q).split(/\s+/).filter(Boolean);
  const matchText = index.filter((x) => words.every((w) => x.text.includes(w))).map((x) => x.d);
  const pass = (d: LegalDoc, skip?: keyof Filters) =>
    (skip === "group" || !f.group || d.group === f.group) &&
    (skip === "issuer" || !f.issuer || d.issuer === f.issuer) &&
    (skip === "type" || !f.type || d.type === f.type);
  // Luật giữ thứ tự sắp sẵn (bản hợp nhất trước, rồi bản gốc, luật sửa đổi); nhóm khác xếp mới nhất trước.
  const order = (d: LegalDoc) => DOCUMENTS.indexOf(d);
  const list = matchText
    .filter((d) => pass(d))
    .sort((a, b) => (a.group === "luat" && b.group === "luat" ? order(a) - order(b) : b.date.localeCompare(a.date)));

  const toggle = <K extends keyof Filters>(k: K, v: Filters[K]) =>
    setF((cur) => ({ ...cur, [k]: cur[k] === v ? undefined : v }));
  const count = (k: keyof Filters, v: string) => matchText.filter((d) => pass(d, k) && d[k] === v).length;
  const active = Boolean(q || f.group || f.issuer || f.type);

  const facet = <K extends keyof Filters>(k: K, title: string, items: { id: NonNullable<Filters[K]>; name: string }[]) => {
    // Nhóm văn bản luôn hiện đủ 3 nhóm; cơ quan và loại chỉ hiện mục có văn bản.
    const shown = items.filter((it) => k === "group" || count(k, it.id) > 0 || f[k] === it.id);
    if (!shown.length) return null;
    return (
      <div className="facet">
        <h3>{title}</h3>
        <ul>
          {shown.map((it) => {
            const n = count(k, it.id);
            const on = f[k] === it.id;
            return (
              <li key={it.id}>
                <button type="button" className="facet-item" aria-pressed={on} onClick={() => toggle(k, it.id)}>
                  <span>{it.name}</span>
                  <b>{n}</b>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  // Chưa chọn nhóm thì chia danh sách theo nhóm, mỗi nhóm một tiêu đề.
  const sections = f.group
    ? [{ id: f.group, name: GROUPS.find((g) => g.id === f.group)!.name, docs: list }]
    : GROUPS.map((g) => ({ ...g, docs: list.filter((d) => d.group === g.id) })).filter((s) => s.docs.length);

  return (
    <div className="wrap docs-layout">
      <aside className="docs-filters" aria-label="Lọc văn bản">
        {facet("group", "Nhóm văn bản", GROUPS)}
        {facet("issuer", "Cơ quan ban hành", ISSUERS)}
        {facet("type", "Loại văn bản", DOC_TYPES)}
      </aside>

      <form className="doc-search" role="search" onSubmit={(e) => e.preventDefault()}>
        <Icon name="search" size={20} />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm theo tên hoặc số hiệu, ví dụ: bộ luật hình sự, án treo, ma túy, 02/2018"
          aria-label="Tìm văn bản"
        />
      </form>

      <div className="doc-results">
        <div className="doc-bar">
          <span>
            <b>{list.length}</b> văn bản
          </span>
          {active && (
            <button
              type="button"
              className="link-btn"
              onClick={() => {
                setQ("");
                setF({});
              }}
            >
              Bỏ lọc
            </button>
          )}
        </div>

        {!index.length ? (
          <p className="empty">Danh mục đang được tổng hợp và rà soát hiệu lực, sẽ đăng trong thời gian tới.</p>
        ) : sections.length ? (
          sections.map((s) => (
            <section key={s.id} className="doc-section">
              <h2 className="doc-section-title">{s.name}</h2>
              {s.docs.length ? (
                <ol className="doc-list">
                  {s.docs.map((d) => (
                    <DocItem key={d.id} d={d} />
                  ))}
                </ol>
              ) : (
                <p className="empty">
                  Chưa có văn bản trong nhóm này.{" "}
                  <Link href="/de-xuat" className="link">
                    Đề xuất văn bản
                  </Link>
                </p>
              )}
            </section>
          ))
        ) : (
          <p className="empty">Không tìm thấy văn bản phù hợp.</p>
        )}
      </div>
    </div>
  );
}

function DocItem({ d }: { d: LegalDoc }) {
  return (
    <li className="doc-item">
      <Link className="doc-title" href={docHref(d)}>
        {d.name}
      </Link>
      <div className="doc-head">
        <span className="doc-num">{d.number}</span>
        <span className="doc-date">{d.date.length > 4 ? `Ban hành ${fmtDate(d.date)}` : `Năm ${d.date}`}</span>
        <span className="doc-date">{d.issuerDetail ?? issuerName(d.issuer)}</span>
      </div>
      {d.title !== d.name && <p className="doc-issuer">{d.title}</p>}
      {d.note && <p className="doc-note">{d.note}</p>}
      <div className="tool-meta">
        {d.effect && <span className={`tag ${EFFECT_LABEL[d.effect].cls}`}>{EFFECT_LABEL[d.effect].text}</span>}
        <span className="tag">{typeName(d.type)}</span>
        {!d.hasFile && <span className="tag tag-soon">Đang cập nhật toàn văn</span>}
        <Link className="doc-open" href={docHref(d)}>
          Xem văn bản <Icon name="arrow" size={15} />
        </Link>
      </div>
    </li>
  );
}
