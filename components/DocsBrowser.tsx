"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { withBase } from "@/lib/config";
import { type Hit, loadBodies, search } from "@/lib/doc-search";
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
  docFile,
  docHref,
  fieldName,
  fmtDate,
  getDoc,
  groupName,
  issuerName,
  typeName,
} from "@/lib/documents";
import { useSavedDocs } from "@/lib/saved-docs";
import { Icon } from "./Icon";

const DEFAULT_GROUP: GroupId = "luat";
const SAVED = "da-luu";
type View = GroupId | typeof SAVED;
type Filters = { issuer?: IssuerId; type?: DocTypeId };

const byDateDesc = (a: LegalDoc, b: LegalDoc) => b.date.localeCompare(a.date);

/**
 * Tra cứu văn bản kiểu cổng văn bản: lĩnh vực ở thanh trên, ô tìm kiếm lớn, ba cột:
 * trái (nhóm văn bản, bộ lọc), giữa (danh sách văn bản), phải (kho văn bản, văn bản mới cập nhật).
 */
export function DocsBrowser() {
  const sp = useSearchParams();
  const router = useRouter();
  const field = FIELDS.find((f) => f.id === sp.get("linh-vuc")) ?? FIELDS[0]!;
  const nhom = sp.get("nhom");
  const view: View =
    nhom === SAVED
      ? SAVED
      : (GROUPS.find((g) => g.id === nhom)?.id ?? DEFAULT_GROUP);
  const urlQ = sp.get("q") ?? "";

  const [q, setQ] = useState(urlQ);
  useEffect(() => setQ(urlQ), [urlQ]);

  const submit = (value: string) => {
    const p = new URLSearchParams(sp.toString());
    if (value.trim()) p.set("q", value.trim());
    else p.delete("q");
    router.replace(`/van-ban?${p.toString()}`, { scroll: false });
  };

  return (
    <div className="vb">
      <nav className="vb-fields" aria-label="Lĩnh vực">
        <div className="wrap vb-fields-in">
          {FIELDS.map((f) => (
            <Link
              key={f.id}
              href={`/van-ban?linh-vuc=${f.id}`}
              aria-current={f.id === field.id && !urlQ ? "page" : undefined}
              className={f.ready ? "" : "is-soon"}
              scroll={false}
            >
              {f.name}
            </Link>
          ))}
        </div>
      </nav>

      <div className="vb-searchbar">
        <form
          className="wrap vb-search"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            submit(q);
          }}
        >
          <Icon name="search" size={22} />
          <input
            type="search"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              if (!e.target.value) submit("");
            }}
            placeholder="Nhập số hiệu, tên văn bản, người ký hoặc nội dung cần tìm (gõ không dấu cũng được)…"
            aria-label="Tìm văn bản"
          />
          <button type="submit" className="btn btn-primary">
            Tìm kiếm
          </button>
        </form>
      </div>

      <div className="wrap vb-layout">
        {urlQ ? (
          <SearchResults q={urlQ} />
        ) : field.ready ? (
          <FieldDocs key={`${field.id}-${view}`} field={field.id} view={view} />
        ) : (
          <div className="vb-main">
            <div className="field-soon">
              <Icon name="book" size={34} />
              <h2>{field.name}</h2>
              <p>
                Mục này đang được tổng hợp, sẽ cập nhật trong thời gian tới.
              </p>
            </div>
          </div>
        )}
        <SideInfo />
      </div>
    </div>
  );
}

/* ---------------- Lĩnh vực: nhóm văn bản + bộ lọc + danh sách ---------------- */

function FieldDocs({ field, view }: { field: FieldId; view: View }) {
  const { saved } = useSavedDocs();
  const [f, setF] = useState<Filters>({});
  const inField = useMemo(
    () => DOCUMENTS.filter((d) => d.field === field),
    [field],
  );

  const base =
    view === SAVED
      ? saved.map((id) => getDoc(id)).filter((d): d is LegalDoc => Boolean(d))
      : inField.filter((d) => d.group === view);
  const pass = (d: LegalDoc, skip?: keyof Filters) =>
    (skip === "issuer" || !f.issuer || d.issuer === f.issuer) &&
    (skip === "type" || !f.type || d.type === f.type);
  // Luật giữ thứ tự sắp sẵn; nhóm khác xếp mới nhất trước.
  const list = base
    .filter((d) => pass(d))
    .sort((a, b) =>
      view === "luat"
        ? DOCUMENTS.indexOf(a) - DOCUMENTS.indexOf(b)
        : view === SAVED
          ? 0
          : byDateDesc(a, b),
    );
  const count = (k: keyof Filters, v: string) =>
    base.filter((d) => pass(d, k) && d[k] === v).length;
  const toggle = <K extends keyof Filters>(k: K, v: Filters[K]) =>
    setF((cur) => ({ ...cur, [k]: cur[k] === v ? undefined : v }));

  const facet = <K extends keyof Filters>(
    k: K,
    title: string,
    items: { id: NonNullable<Filters[K]>; name: string }[],
  ) => {
    const shown = items.filter((it) => count(k, it.id) > 0 || f[k] === it.id);
    if (shown.length < 2 && !f[k]) return null;
    return (
      <section className="vb-card vb-facet" key={k}>
        <h3 className="vb-card-head">{title}</h3>
        <ul>
          {shown.map((it) => (
            <li key={it.id}>
              <button
                type="button"
                aria-pressed={f[k] === it.id}
                onClick={() => toggle(k, it.id)}
              >
                <span>{it.name}</span>
                <b>{count(k, it.id)}</b>
              </button>
            </li>
          ))}
        </ul>
      </section>
    );
  };

  const title = view === SAVED ? "Văn bản đã lưu" : groupName(view);

  return (
    <>
      <aside className="vb-side">
        <section className="vb-card">
          <h3 className="vb-card-head">{fieldName(field)}</h3>
          <ul className="vb-groups">
            {GROUPS.map((g) => (
              <li key={g.id}>
                <Link
                  href={`/van-ban?linh-vuc=${field}&nhom=${g.id}`}
                  aria-current={g.id === view ? "page" : undefined}
                  scroll={false}
                >
                  <span>{g.name}</span>
                  <b>{inField.filter((d) => d.group === g.id).length}</b>
                </Link>
              </li>
            ))}
            <li className="vb-groups-saved">
              <Link
                href={`/van-ban?linh-vuc=${field}&nhom=${SAVED}`}
                aria-current={view === SAVED ? "page" : undefined}
                scroll={false}
              >
                <span>
                  <Icon name="star" size={15} /> Văn bản đã lưu
                </span>
                <b>{saved.length}</b>
              </Link>
            </li>
          </ul>
        </section>
        {facet("issuer", "Cơ quan ban hành", ISSUERS)}
        {facet("type", "Loại văn bản", DOC_TYPES)}
      </aside>

      <section className="vb-main vb-card">
        <header className="vb-main-head">
          <h2>{title}</h2>
          <span>
            {list.length} văn bản
            {(f.issuer || f.type) && (
              <button
                type="button"
                className="link-btn"
                onClick={() => setF({})}
              >
                Bỏ lọc
              </button>
            )}
          </span>
        </header>
        {list.length ? (
          <ol className="vb-list">
            {list.map((d, i) => (
              <DocRow key={d.id} d={d} n={i + 1} />
            ))}
          </ol>
        ) : view === SAVED ? (
          <p className="empty">
            Chưa lưu văn bản nào. Bấm ☆ Lưu ở văn bản cần dùng lại để đưa vào
            đây.
          </p>
        ) : (
          <p className="empty">
            Mục này chưa có văn bản.{" "}
            <Link href="/de-xuat" className="link">
              Đề xuất văn bản
            </Link>
          </p>
        )}
      </section>
    </>
  );
}

/* ---------------- Kết quả tìm kiếm (mọi lĩnh vực) ---------------- */

function SearchResults({ q }: { q: string }) {
  const [body, setBody] = useState<Awaited<
    ReturnType<typeof loadBodies>
  > | null>(null);
  const [scope, setScope] = useState<{ field?: FieldId; group?: GroupId }>({});
  useEffect(() => {
    let live = true;
    loadBodies().then((b) => live && setBody(b));
    return () => {
      live = false;
    };
  }, []);
  useEffect(() => setScope({}), [q]);

  const hits = useMemo(() => search(q, body), [q, body]);
  const shown = hits.filter(
    (h) =>
      (!scope.field || h.d.field === scope.field) &&
      (!scope.group || h.d.group === scope.group),
  );

  const fields = FIELDS.map((f) => ({
    ...f,
    n: hits.filter((h) => h.d.field === f.id).length,
    groups: GROUPS.map((g) => ({
      ...g,
      n: hits.filter((h) => h.d.field === f.id && h.d.group === g.id).length,
    })).filter((g) => g.n),
  })).filter((f) => f.n);

  return (
    <>
      <aside className="vb-side">
        <section className="vb-card">
          <h3 className="vb-card-head">Lọc kết quả</h3>
          <ul className="vb-groups">
            <li>
              <button
                type="button"
                aria-pressed={!scope.field}
                onClick={() => setScope({})}
              >
                <span>Tất cả</span>
                <b>{hits.length}</b>
              </button>
            </li>
            {fields.map((f) => (
              <li key={f.id}>
                <button
                  type="button"
                  aria-pressed={scope.field === f.id && !scope.group}
                  onClick={() => setScope({ field: f.id })}
                >
                  <span>{f.name}</span>
                  <b>{f.n}</b>
                </button>
                <ul className="vb-subgroups">
                  {f.groups.map((g) => (
                    <li key={g.id}>
                      <button
                        type="button"
                        aria-pressed={
                          scope.field === f.id && scope.group === g.id
                        }
                        onClick={() => setScope({ field: f.id, group: g.id })}
                      >
                        <span>{g.name}</span>
                        <b>{g.n}</b>
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      </aside>

      <section className="vb-main vb-card">
        <header className="vb-main-head">
          <h2>Kết quả tìm “{q}”</h2>
          <span>
            {shown.length} văn bản
            {!body && " · đang tải nội dung toàn văn…"}
            <Link href="/van-ban" className="link-btn" scroll={false}>
              Xóa tìm kiếm
            </Link>
          </span>
        </header>
        {shown.length ? (
          <ol className="vb-list">
            {shown.map((h, i) => (
              <DocRow key={h.d.id} d={h.d} n={i + 1} hit={h} showPlace />
            ))}
          </ol>
        ) : body ? (
          <p className="empty">
            Không tìm thấy văn bản phù hợp. Thử bỏ bớt từ, hoặc{" "}
            <Link href="/de-xuat" className="link">
              đề xuất văn bản còn thiếu
            </Link>
            .
          </p>
        ) : (
          <p className="empty">Đang tìm…</p>
        )}
      </section>
    </>
  );
}

/* ---------------- Một văn bản trong danh sách ---------------- */

function DocRow({
  d,
  n,
  hit,
  showPlace,
}: {
  d: LegalDoc;
  n: number;
  hit?: Hit;
  showPlace?: boolean;
}) {
  const { saved, toggle } = useSavedDocs();
  const [openRel, setOpenRel] = useState(false);
  const isSaved = saved.includes(d.id);
  const related = (d.related ?? [])
    .map((id) => getDoc(id))
    .filter((x): x is LegalDoc => Boolean(x));

  return (
    <li className="vb-item">
      <span className="vb-no">{String(n).padStart(2, "0")}</span>
      <div className="vb-item-main">
        <Link className="vb-title" href={docHref(d)}>
          {d.name}
        </Link>
        {d.title !== d.name && <p className="vb-sub">{d.title}</p>}
        {hit?.snippet && (
          <p className="vb-snippet">
            {hit.snippet.before}
            <mark>{hit.snippet.match}</mark>
            {hit.snippet.after}
          </p>
        )}
        {d.note && <p className="vb-note">{d.note}</p>}
        <div className="vb-actions">
          <Link href={docHref(d)}>Xem toàn văn</Link>
          {d.hasFile && (
            <a href={withBase(docFile(d))} download>
              <Icon name="download" size={15} /> Tải về
            </a>
          )}
          {related.length > 0 && (
            <button
              type="button"
              onClick={() => setOpenRel((v) => !v)}
              aria-expanded={openRel}
            >
              <Icon name="link" size={15} /> Văn bản liên quan ({related.length}
              )
            </button>
          )}
          <button
            type="button"
            onClick={() => toggle(d.id)}
            aria-pressed={isSaved}
            className={isSaved ? "is-on" : ""}
          >
            <Icon name="star" size={15} /> {isSaved ? "Đã lưu" : "Lưu"}
          </button>
        </div>
        {openRel && (
          <ul className="vb-related">
            {related.map((r) => (
              <li key={r.id}>
                <Link href={docHref(r)}>{r.name}</Link>
                <span>
                  {r.number} · {fmtDate(r.date)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="vb-box">
        <div className="vb-box-head">{typeName(d.type)}</div>
        <dl>
          <dt>Số hiệu</dt>
          <dd>{d.number}</dd>
          <dt>{d.date.length > 4 ? "Ban hành" : "Năm"}</dt>
          <dd>{fmtDate(d.date)}</dd>
          <dt>Cơ quan</dt>
          <dd>{d.issuerDetail ?? issuerName(d.issuer)}</dd>
          {d.signers && (
            <>
              <dt>Người ký</dt>
              <dd>{d.signers.join(", ")}</dd>
            </>
          )}
          {showPlace && (
            <>
              <dt>Mục</dt>
              <dd>
                {fieldName(d.field)} · {groupName(d.group)}
              </dd>
            </>
          )}
          {d.effect && (
            <>
              <dt>Hiệu lực</dt>
              <dd>
                <span className={`vb-effect is-${d.effect}`}>
                  {EFFECT_LABEL[d.effect].text}
                </span>
              </dd>
            </>
          )}
        </dl>
      </div>
    </li>
  );
}

/* ---------------- Cột phải: kho văn bản, văn bản mới cập nhật ---------------- */

function SideInfo() {
  const latest = useMemo(() => [...DOCUMENTS].sort(byDateDesc).slice(0, 8), []);
  const withText = DOCUMENTS.filter((d) => d.hasFile).length;
  const fields = FIELDS.filter((f) => f.ready).length;
  return (
    <aside className="vb-aside">
      <section className="vb-card">
        <h3 className="vb-card-head">Kho văn bản</h3>
        <div className="vb-stats">
          <div>
            <b>{DOCUMENTS.length}</b>
            <span>Văn bản</span>
          </div>
          <div>
            <b>{withText}</b>
            <span>Có toàn văn</span>
          </div>
          <div>
            <b>{fields}</b>
            <span>Lĩnh vực</span>
          </div>
        </div>
      </section>
      <section className="vb-card">
        <h3 className="vb-card-head">Văn bản mới cập nhật</h3>
        <ol className="vb-latest">
          {latest.map((d) => (
            <li key={d.id}>
              <Link href={docHref(d)}>{d.name}</Link>
              <span>
                {fmtDate(d.date)} · {fieldName(d.field)}
              </span>
            </li>
          ))}
        </ol>
      </section>
      <Link href="/de-xuat" className="vb-card vb-suggest">
        <b>Đề xuất đăng văn bản</b>
        <span>Văn bản hữu ích chưa có trên trang? Gửi để bổ sung.</span>
      </Link>
    </aside>
  );
}
