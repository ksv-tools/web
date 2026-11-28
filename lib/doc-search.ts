/**
 * Tìm văn bản trên trình duyệt: theo tên, số hiệu, trích yếu, người ký và cả nội dung toàn văn
 * (public/tim-kiem/noi-dung.json, tạo bằng scripts/build-search-index.py; chỉ tải khi bắt đầu tìm).
 * Gõ không dấu vẫn tìm ra: mọi chữ được "gấp" về không dấu, chữ thường, giữ nguyên độ dài để cắt trích đoạn.
 */
import { withBase } from "./config";
import {
  DOCUMENTS,
  type LegalDoc,
  fieldName,
  groupName,
  issuerName,
  typeName,
} from "./documents";

/** Bỏ dấu từng ký tự (giữ độ dài chuỗi để vị trí khớp với bản gốc). */
export function fold(s: string): string {
  let out = "";
  for (const ch of s.normalize("NFC")) {
    const base = ch.normalize("NFD")[0] ?? ch;
    out +=
      base === "đ" || base === "Đ"
        ? "d"
        : base.toLowerCase().length === 1
          ? base.toLowerCase()
          : base;
  }
  return out;
}

export function words(q: string): string[] {
  return fold(q)
    .split(/[\s,.;:()"“”/]+/)
    .filter((w) => w.length > 0);
}

function metaText(d: LegalDoc): string {
  return fold(
    [
      d.name,
      d.number,
      d.title,
      d.note,
      d.issuerDetail ?? issuerName(d.issuer),
      typeName(d.type),
      d.signers?.join(" "),
      fieldName(d.field),
      groupName(d.group),
    ]
      .filter(Boolean)
      .join(" "),
  );
}

const META = new Map(DOCUMENTS.map((d) => [d.id, metaText(d)]));

type Body = { raw: string; folded: string };
let bodies: Map<string, Body> | null = null;
let loading: Promise<Map<string, Body>> | null = null;

/** Tải chỉ mục toàn văn (một lần). */
export function loadBodies(): Promise<Map<string, Body>> {
  if (bodies) return Promise.resolve(bodies);
  loading ??= fetch(withBase("/tim-kiem/noi-dung.json"))
    .then((r) => (r.ok ? r.json() : {}))
    .then((obj: Record<string, string>) => {
      bodies = new Map(
        Object.entries(obj).map(([id, raw]) => {
          const nfc = raw.normalize("NFC");
          return [id, { raw: nfc, folded: fold(nfc) }];
        }),
      );
      return bodies;
    })
    .catch(() => (bodies = new Map()));
  return loading;
}

export type Hit = {
  d: LegalDoc;
  score: number;
  /** Các từ khóa đứng gần nhau (trong một đoạn) hoặc cùng nằm trong tên, trích yếu. */
  close: boolean;
  snippet?: { before: string; match: string; after: string };
};

const WINDOW = 90;

/** Vị trí có đủ mọi từ trong một khoảng ngắn quanh từ dài nhất; -1 nếu không có. */
function near(text: string, ws: string[]): number {
  const [key, ...rest] = [...ws].sort((x, y) => y.length - x.length);
  let at = text.indexOf(key!);
  for (let n = 0; at >= 0 && n < 400; n++) {
    const win = text.slice(Math.max(0, at - WINDOW), at + key!.length + WINDOW);
    if (rest.every((w) => win.includes(w))) return at;
    at = text.indexOf(key!, at + 1);
  }
  return -1;
}

function cut(raw: string, at: number, len: number): Hit["snippet"] {
  const s = Math.max(0, at - 110);
  const e = Math.min(raw.length, at + len + 160);
  return {
    before: (s > 0 ? "…" : "") + raw.slice(s, at),
    match: raw.slice(at, at + len),
    after: raw.slice(at + len, e) + (e < raw.length ? "…" : ""),
  };
}

/**
 * Mọi từ phải có mặt. Nếu có văn bản chứa các từ đứng gần nhau (hoặc cùng trong tên, trích yếu) thì chỉ hiện
 * những văn bản đó, tránh lẫn kết quả có từ rải rác; khớp ở tên, số hiệu được xếp trước.
 */
export function search(q: string, body: Map<string, Body> | null): Hit[] {
  const ws = words(q);
  if (!ws.length) return [];
  const phrase = ws.join(" ");
  const hits: Hit[] = [];
  for (const d of DOCUMENTS) {
    const meta = META.get(d.id)!;
    const b = body?.get(d.id);
    if (!ws.every((w) => meta.includes(w) || b?.folded.includes(w))) continue;
    const inMeta = ws.every((w) => meta.includes(w));
    let score = ws.filter((w) => meta.includes(w)).length * 10 + (inMeta ? 30 : 0);
    if (fold(d.name).includes(phrase) || fold(d.number).includes(phrase)) score += 60;
    let close = inMeta;
    let snippet: Hit["snippet"];
    if (b) {
      let at = b.folded.indexOf(phrase);
      let len = phrase.length;
      if (at < 0 && ws.length > 1) {
        at = near(b.folded, ws);
        len = at >= 0 ? [...ws].sort((x, y) => y.length - x.length)[0]!.length : 0;
      }
      if (at >= 0) {
        close = true;
        score += 20 + Math.min(15, b.folded.split(ws[0]!).length - 1);
        snippet = cut(b.raw, at, len);
      } else {
        const w = [...ws].sort((x, y) => y.length - x.length)[0]!;
        const p = b.folded.indexOf(w);
        if (p >= 0) snippet = cut(b.raw, p, w.length);
      }
    }
    hits.push({ d, score, close, snippet });
  }
  const closeHits = hits.filter((h) => h.close);
  return (closeHits.length ? closeHits : hits).sort(
    (a, b) => b.score - a.score || b.d.date.localeCompare(a.d.date),
  );
}
