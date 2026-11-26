import Link from "next/link";
import { SITE_NAME } from "@/lib/config";

/** Logo chữ của trang. Không dùng huy hiệu ngành để trang không bị hiểu là trang chính thức của cơ quan. */
export function Logo() {
  return (
    <Link href="/" className="logo" aria-label={`${SITE_NAME}, về trang chủ`}>
      <span className="logo-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v18M7 21h10M4.5 7h15" />
          <path d="M4.5 7 2 12.5a2.5 2.5 0 0 0 5 0L4.5 7ZM19.5 7 17 12.5a2.5 2.5 0 0 0 5 0L19.5 7Z" />
        </svg>
      </span>
      <span className="logo-text">{SITE_NAME}</span>
    </Link>
  );
}
