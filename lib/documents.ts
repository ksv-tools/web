/**
 * Văn bản pháp luật và hướng dẫn nghiệp vụ, chia theo 6 lĩnh vực; mỗi lĩnh vực chia nhóm: luật, thông tư, hướng dẫn.
 *
 * Thêm văn bản: thêm một mục vào DOCUMENTS (chọn lĩnh vực `field` và nhóm `group`). Chỉ ghi văn bản đã đối chiếu bản gốc.
 * Văn bản được đọc ngay trên web: file PDF đặt trong public/van-ban-goc/ (tên file = `id`), trang /van-ban/xem?id=...
 * hiển thị toàn văn. Văn bản quy phạm pháp luật và văn bản hành chính không thuộc đối tượng bảo hộ quyền tác giả
 * (Luật Sở hữu trí tuệ, Điều 15) nên được đăng lại toàn văn; lấy bản từ nguồn chính thức (Công báo, vbpl.vn, cổng
 * thông tin của cơ quan ban hành).
 */

import { HINH_SU } from "./documents-hinh-su";

/** Sáu lĩnh vực của mục Văn bản. `ready: false` thì hiện "Đang xây dựng". */
export type FieldId = "hinh-su" | "dan-su" | "tha-hinh-su" | "tha-dan-su" | "khieu-nai" | "dang";

export const FIELDS: { id: FieldId; name: string; ready: boolean }[] = [
  { id: "hinh-su", name: "Hình sự", ready: true },
  { id: "dan-su", name: "Dân sự", ready: false },
  { id: "tha-hinh-su", name: "Thi hành án hình sự", ready: false },
  { id: "tha-dan-su", name: "Thi hành án dân sự", ready: false },
  { id: "khieu-nai", name: "Khiếu nại, tố cáo", ready: false },
  { id: "dang", name: "Văn bản Đảng", ready: false },
];

/** Nhóm văn bản trong một lĩnh vực. */
export type GroupId = "luat" | "thong-tu" | "huong-dan" | "dia-phuong";

export const GROUPS: { id: GroupId; name: string }[] = [
  { id: "luat", name: "Luật và bộ luật" },
  { id: "thong-tu", name: "Thông tư, thông tư liên tịch" },
  { id: "huong-dan", name: "Văn bản hướng dẫn, giải đáp" },
  { id: "dia-phuong", name: "Văn bản liên ngành làm án tỉnh Ninh Bình" },
];

export type IssuerId = "quoc-hoi" | "chinh-phu" | "lien-nganh" | "hdtp" | "tandtc" | "vksndtc" | "bo-nganh" | "dia-phuong";

export const ISSUERS: { id: IssuerId; name: string }[] = [
  { id: "quoc-hoi", name: "Quốc hội, UBTVQH" },
  { id: "chinh-phu", name: "Chính phủ" },
  { id: "lien-nganh", name: "Liên ngành trung ương" },
  { id: "hdtp", name: "Hội đồng Thẩm phán TANDTC" },
  { id: "tandtc", name: "Tòa án nhân dân tối cao" },
  { id: "vksndtc", name: "Viện kiểm sát nhân dân tối cao" },
  { id: "bo-nganh", name: "Bộ, ngành khác" },
  { id: "dia-phuong", name: "Ngành, liên ngành địa phương" },
];

export type DocTypeId =
  | "bo-luat"
  | "luat"
  | "nq-qh"
  | "nghi-dinh"
  | "ttlt"
  | "thong-tu"
  | "nghi-quyet"
  | "giai-dap"
  | "huong-dan"
  | "quy-che"
  | "khac";

export const DOC_TYPES: { id: DocTypeId; name: string }[] = [
  { id: "bo-luat", name: "Bộ luật" },
  { id: "luat", name: "Luật" },
  { id: "nq-qh", name: "Nghị quyết Quốc hội, UBTVQH" },
  { id: "nghi-dinh", name: "Nghị định" },
  { id: "ttlt", name: "Thông tư liên tịch" },
  { id: "thong-tu", name: "Thông tư" },
  { id: "nghi-quyet", name: "Nghị quyết HĐTP" },
  { id: "giai-dap", name: "Giải đáp, công văn" },
  { id: "huong-dan", name: "Hướng dẫn" },
  { id: "quy-che", name: "Quy chế, quyết định" },
  { id: "khac", name: "Khác" },
];

/** "con": còn hiệu lực; "sua-doi": còn hiệu lực, đã được sửa đổi; "het": hết hiệu lực. Không ghi nếu chưa rõ. */
export type Effect = "con" | "sua-doi" | "het";

export const EFFECT_LABEL: Record<Effect, { text: string; cls: string }> = {
  con: { text: "Còn hiệu lực", cls: "tag-ready" },
  "sua-doi": { text: "Đã được sửa đổi", cls: "tag-warn" },
  het: { text: "Hết hiệu lực", cls: "tag-err" },
};

export type LegalDoc = {
  /** Mã ngắn, không dấu, dùng làm địa chỉ trang và tên file, ví dụ "nq-02-2018-hdtp". */
  id: string;
  /** Tên dễ tìm, hiện ở danh sách, ví dụ "Bộ luật Hình sự 2015, sửa đổi bổ sung 2025". */
  name: string;
  /** Số hiệu, ví dụ "02/2018/NQ-HĐTP". */
  number: string;
  /** Trích yếu. */
  title: string;
  /** Ngày ban hành, dạng YYYY-MM-DD (chỉ biết năm thì ghi YYYY). */
  date: string;
  field: FieldId;
  group: GroupId;
  issuer: IssuerId;
  /** Tên cơ quan ban hành cụ thể, ghi khi cần (ví dụ cơ quan địa phương, các bộ ký liên tịch). */
  issuerDetail?: string;
  type: DocTypeId;
  effect?: Effect;
  /** Ghi chú ngắn: văn bản sửa đổi, thay thế... */
  note?: string;
  /** Có file toàn văn trong public/van-ban-goc/<id>.pdf. Chưa có thì trang xem hiện "đang cập nhật". */
  hasFile?: boolean;
  /** Nguồn của bản toàn văn, ví dụ "Công báo" hoặc "vbpl.vn". */
  source?: string;
};

/**
 * Danh sách đang được người quản trị duyệt (bản để duyệt: danh-sach-van-ban/*.xlsx).
 * Chỉ thêm vào đây những văn bản đã duyệt "Đăng".
 */
export const DOCUMENTS: LegalDoc[] = [...HINH_SU];

export function issuerName(id: IssuerId): string {
  return ISSUERS.find((i) => i.id === id)?.name ?? id;
}

export function fieldName(id: FieldId): string {
  return FIELDS.find((f) => f.id === id)?.name ?? id;
}

export function typeName(id: DocTypeId): string {
  return DOC_TYPES.find((t) => t.id === id)?.name ?? id;
}

/** Ngày dạng dd/mm/yyyy; chỉ có năm thì giữ năm. */
export function fmtDate(iso: string): string {
  return iso.split("-").reverse().join("/");
}

export function getDoc(id: string | null): LegalDoc | undefined {
  return id ? DOCUMENTS.find((d) => d.id === id) : undefined;
}

/** Trang đọc văn bản trên web. */
export const docHref = (d: LegalDoc) => `/van-ban/xem?id=${d.id}`;

/** Đường dẫn file toàn văn (chưa thêm đường dẫn gốc của web). */
export const docFile = (d: LegalDoc) => `/van-ban-goc/${d.id}.pdf`;
