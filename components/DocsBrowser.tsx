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

type Filters = { issuer?: IssuerId; type?: DocTypeId };

const DEFAULT_GROUP: GroupId = "luat";

/** Mục Văn bản: tab lĩnh vực, rồi tab nhóm văn bản; mỗi nhóm chỉ hiện văn bản của nhóm đó. */
export function DocsBrowser() {
  const sp = useSearchParams();
  const field = FIELDS.find((f) => f.id === sp.get("linh-vuc")) ?? FIELDS[0]!;
  const group = GROUPS.find((g) => g.id === sp.get("nhom"))?.id ?? DEFAULT_GROUP;

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
        <GroupDocs key={`${field.id}-${group}`} field={field.id} group={group} />
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

function GroupDocs({ field, group }: { field: FieldId; group: GroupId }) {
  const [q, setQ] = useState("");
  const [f, setF] = useState<Filters>({});

  const inField = useMemo(
    () =>
      DOCUMENTS.filter((d) => d.field === field).map((d) => ({
        d,
        text: fold([d.name, d.number, d.title, d.note, d.issuerDetail].join(" ")),
      })),
    [field],
  );

  const words = fold(q).split(/\s+/).filter(Boolean);
  const matched = inField.filter((x) => words.every((w) => x.text.includes(w))).map((x) => x.d);
  const inGroup = matched.filter((d) => d.group === group);
  const pass = (d: LegalDoc, skip?: keyof Filters) =>
    (skip === "issuer" || !f.issuer || d.issuer === f.issuer) && (skip === "type" || !f.type || d.type === f.type);

  // Luật giữ thứ tự sắp sẵn; nhóm khác xếp mới nhất trước.
  const list = inGroup
    .filter((d) => pass(d))
    .sort((a, b) => (group === "luat" ? DOCUMENTS.indexOf(a) - DOCUMENTS.indexOf(b) : b.date.localeCompare(a.date)));

  const toggle = <K extends keyof Filters>(k: K, v: Filters[K]) =>
    setF((cur) => ({ ...cur, [k]: cur[k] === v ? undefined : v }));
  const count = (k: keyof Filters, v: string) => inGroup.filter((d) => pass(d, k) && d[k] === v).length;
  const active = Boolean(q || f.issuer || f.type);

  // Khi đang tìm: số kết quả ở các nhóm khác, để bấm sang.
  const elsewhere = words.length
    ? GROUPS.filter((g) => g.id !== group)
        .map((g) => ({ ...g, n: matched.filter((d) => d.group === g.id).length }))
        .filter((g) => g.n)
    : [];

  const facet = <K extends keyof Filters>(k: K, title: string, items: { id: NonNullable<Filters[K]>; name: string }[]) => {
    const shown = items.filter((it) => count(k, it.id) > 0 || f[k] === it.id);
    if (shown.length < 2 && !f[k]) return null;
    return (
      <div className="facet" key={k}>
        <h3>{title}</h3>
        <ul>
          {shown.map((it) => (
            <li key={it.id}>
              <button type="button" className="facet-item" aria-pressed={f[k] === it.id} onClick={() => toggle(k, it.id)}>
                <span>{it.name}</span>
                <b>{count(k, it.id)}</b>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  const facets = [facet("issuer", "Cơ quan ban hành", ISSUERS), facet("type", "Loại văn bản", DOC_TYPES)].filter(Boolean);
  const groupCount = (g: GroupId) => inField.filter((x) => x.d.group === g).length;
  const groupName = GROUPS.find((g) => g.id === group)!.name;

  return (
    <>
      <nav className="group-tabs" aria-label="Nhóm văn bản">
        <div className="wrap group-tabs-in">
          {GROUPS.map((g) => (
            <Link
              key={g.id}
              href={`/van-ban?linh-vuc=${field}&nhom=${g.id}`}
              aria-current={g.id === group ? "page" : undefined}
              scroll={false}
            >
              {g.name}
              <b>{groupCount(g.id)}</b>
            </Link>
          ))}
        </div>
      </nav>

      <div className={`wrap docs-layout${facets.length ? "" : " no-facets"}`}>
        {facets.length > 0 && (
          <aside className="docs-filters" aria-label="Lọc văn bản">
            {facets}
          </aside>
        )}

        <form className="doc-search" role="search" onSubmit={(e) => e.preventDefault()}>
          <Icon name="search" size={20} />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Tìm trong mục ${groupName.toLowerCase()}…`}
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
          {elsewhere.length > 0 && (
            <p className="doc-elsewhere">
              Có kết quả ở mục khác:{" "}
              {elsewhere.map((g, i) => (
                <span key={g.id}>
                  {i > 0 && " · "}
                  <Link href={`/van-ban?linh-vuc=${field}&nhom=${g.id}`} className="link" scroll={false}>
                    {g.name} ({g.n})
                  </Link>
                </span>
              ))}
            </p>
          )}

          {list.length ? (
            <ol className="doc-list">
              {list.map((d) => (
                <DocItem key={d.id} d={d} />
              ))}
            </ol>
          ) : active ? (
            <p className="empty">Không tìm thấy văn bản phù hợp trong mục này.</p>
          ) : (
            <p className="empty">
              Mục này chưa có văn bản.{" "}
              <Link href="/de-xuat" className="link">
                Đề xuất văn bản
              </Link>
            </p>
          )}
        </div>
      </div>
    </>
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
