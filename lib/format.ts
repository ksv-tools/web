export const STATUS_LABEL = {
  pending: { text: "Chờ duyệt", cls: "tag-warn" },
  approved: { text: "Đã duyệt", cls: "tag-ready" },
  locked: { text: "Đã khóa", cls: "tag-err" },
} as const;

export function fmtTime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
