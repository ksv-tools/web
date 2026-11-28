/**
 * Danh mục công cụ. Thêm công cụ mới: thêm một mục vào TOOLS (trạng thái "soon" để hiện là "Sắp có"),
 * rồi khi làm xong thì tạo trang app/cong-cu/<slug>/page.tsx và đổi trạng thái thành "ready".
 */

export type AreaId = "hinh-su" | "dan-su" | "hanh-chinh" | "thi-hanh-an" | "chung";

export const AREAS: { id: AreaId; name: string; note: string }[] = [
  { id: "hinh-su", name: "Hình sự", note: "Thực hành quyền công tố, kiểm sát điều tra, truy tố, xét xử" },
  { id: "dan-su", name: "Dân sự", note: "Kiểm sát giải quyết vụ việc dân sự, hôn nhân gia đình, kinh doanh thương mại, lao động" },
  { id: "hanh-chinh", name: "Hành chính", note: "Kiểm sát giải quyết vụ án hành chính" },
  { id: "thi-hanh-an", name: "Thi hành án", note: "Kiểm sát tạm giữ, tạm giam, thi hành án hình sự và dân sự" },
  { id: "chung", name: "Dùng chung", note: "Xử lý hồ sơ, văn bản, số liệu cho mọi khâu công tác" },
];

export type ToolStatus = "ready" | "soon";
/** "desktop": app tải về chạy trên máy (tính lượt tải). "web": dùng ngay trên trang. */
export type ToolKind = "desktop" | "web";

export type Tool = {
  slug: string;
  name: string;
  short: string;
  areas: AreaId[];
  status: ToolStatus;
  kind: ToolKind;
  icon: IconName;
};

export type IconName = "scissors" | "clock" | "scale" | "coins" | "file" | "book" | "list";

export const TOOLS: Tool[] = [
  {
    slug: "tach-ho-so",
    name: "Tách hồ sơ scan",
    short: "Chia file PDF scan thành từng văn bản, tự đặt tên và lập mục lục.",
    areas: ["chung", "hinh-su", "dan-su", "hanh-chinh"],
    status: "ready",
    kind: "desktop",
    icon: "scissors",
  },
  {
    slug: "thoi-han-to-tung",
    name: "Tính thời hạn tố tụng",
    short: "Thời hạn tạm giữ, tạm giam, điều tra, truy tố theo BLTTHS.",
    areas: ["hinh-su", "thi-hanh-an"],
    status: "soon",
    kind: "web",
    icon: "clock",
  },
  {
    slug: "tong-hop-hinh-phat",
    name: "Tổng hợp hình phạt",
    short: "Tổng hợp hình phạt nhiều tội, nhiều bản án; trừ thời gian tạm giam.",
    areas: ["hinh-su", "thi-hanh-an"],
    status: "soon",
    kind: "web",
    icon: "scale",
  },
  {
    slug: "an-phi",
    name: "Tính án phí, lệ phí",
    short: "Án phí sơ thẩm, phúc thẩm, có và không có giá ngạch.",
    areas: ["dan-su", "hanh-chinh"],
    status: "soon",
    kind: "web",
    icon: "coins",
  },
  {
    slug: "thoi-hieu",
    name: "Tính thời hiệu",
    short: "Thời hiệu truy cứu TNHS, khởi kiện; hạn kháng cáo, kháng nghị.",
    areas: ["hinh-su", "dan-su", "hanh-chinh"],
    status: "soon",
    kind: "web",
    icon: "list",
  },
  {
    slug: "mau-van-ban",
    name: "Mẫu văn bản",
    short: "Mẫu văn bản nghiệp vụ điền nhanh, xuất ra Word.",
    areas: ["chung", "hinh-su", "dan-su", "hanh-chinh", "thi-hanh-an"],
    status: "soon",
    kind: "web",
    icon: "file",
  },
];

/** Ảnh minh họa của công cụ: public/anh/cong-cu/<slug>.jpg (ảnh Unsplash, giấy phép miễn phí). */
export const toolImage = (t: Tool) => `/anh/cong-cu/${t.slug}.jpg`;

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function areaName(id: AreaId): string {
  return AREAS.find((a) => a.id === id)?.name ?? id;
}
