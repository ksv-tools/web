/** Chỉ cho quay lại đường dẫn trong trang, tránh bị lợi dụng để chuyển sang trang lạ. */
export function safeNext(next: unknown): string {
  const s = typeof next === "string" ? next : "";
  return s.startsWith("/") && !s.startsWith("//") && !s.startsWith("/\\") ? s : "/tai-khoan";
}
