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
      d.points?.join(" "),
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
  /** Có đúng cả cụm từ đã gõ. */
  exact: boolean;
  snippet?: { before: string; match: string; after: string };
};

const WINDOW = 90;
const isAlnum = (c: string | undefined) => !!c && /[a-z0-9]/.test(c);

/**
 * Tìm theo trọn tiếng: phải bắt đầu ở đầu một tiếng (gõ "de" không khớp giữa "đề nghị" → "nghi"…).
 * Từ ngắn (≤ 3 chữ) còn phải kết thúc ở cuối tiếng; từ dài cho khớp đầu tiếng (đang gõ dở vẫn ra).
 */
function find(text: string, w: string, from = 0): number {
  let at = text.indexOf(w, from);
  while (at >= 0) {
    const okStart = !isAlnum(text[at - 1]) || !isAlnum(w[0]);
    const okEnd = w.length > 3 || !isAlnum(text[at + w.length]) || !isAlnum(w[w.length - 1]);
    if (okStart && okEnd) return at;
    at = text.indexOf(w, at + 1);
  }
  return -1;
}

const has = (text: string | undefined, w: string) => !!text && find(text, w) >= 0;

/** Vị trí có đủ mọi từ trong một khoảng ngắn quanh từ dài nhất; -1 nếu không có. */
function near(text: string, ws: string[]): number {
  const [key, ...rest] = [...ws].sort((x, y) => y.length - x.length);
  // Từ ngắn (tu, che, xe…) gặp ở khắp nơi: khi đó chỉ chấp nhận đứng sát nhau.
  const win = key!.length <= 3 ? 14 : key!.length <= 5 ? 40 : WINDOW;
  let at = find(text, key!);
  for (let n = 0; at >= 0 && n < 400; n++) {
    const s = Math.max(0, at - win);
    const around = text.slice(s, at + key!.length + win);
    if (rest.every((w) => has(around, w))) return at;
    at = find(text, key!, at + 1);
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
 * Mọi từ phải có mặt (theo trọn tiếng). Văn bản có đúng cụm từ hoặc các từ đứng gần nhau được giữ lại và xếp trước;
 * chỉ khi không có văn bản nào như vậy mới hiện các văn bản có từ rải rác. Khớp ở tên, số hiệu xếp trước nữa.
 */
export function search(q: string, body: Map<string, Body> | null): Hit[] {
  const ws = words(q);
  if (!ws.length) return [];
  const phrase = ws.join(" ");
  const longest = [...ws].sort((x, y) => y.length - x.length)[0]!;
  const hits: Hit[] = [];
  for (const d of DOCUMENTS) {
    const meta = META.get(d.id)!;
    const b = body?.get(d.id);
    if (!ws.every((w) => has(meta, w) || has(b?.folded, w))) continue;
    const inMeta = ws.every((w) => has(meta, w));
    let score = ws.filter((w) => has(meta, w)).length * 10 + (inMeta ? 30 : 0);
    if (has(fold(d.name), phrase) || has(fold(d.number), phrase)) score += 60;
    let close = inMeta && (ws.length === 1 || near(meta, ws) >= 0);
    let exact = has(meta, phrase);
    let snippet: Hit["snippet"];
    if (b) {
      let at = find(b.folded, phrase);
      let len = phrase.length;
      if (at >= 0) exact = true;
      else if (ws.length > 1) {
        at = near(b.folded, ws);
        len = longest.length;
      }
      if (at >= 0) {
        close = true;
        score += 20;
        snippet = cut(b.raw, at, len);
      } else {
        const p = find(b.folded, longest);
        if (p >= 0) snippet = cut(b.raw, p, longest.length);
      }
    }
    if (ws.length === 1) close = true;
    if (exact) score += 80;
    hits.push({ d, score, close, exact, snippet });
  }
  const good = hits.filter((h) => h.exact || h.close);
  return (good.length ? good : hits).sort(
    (a, b) => b.score - a.score || b.d.date.localeCompare(a.d.date),
  );
}
