"use client";

import { usePathname } from "next/navigation";
import { Icon } from "./Icon";

/** Nút menu trên điện thoại. Đổi trang thì menu tự đóng (key theo đường dẫn tạo lại thẻ details). */
export function MobileMenu({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <details className="menu-btn" key={path}>
      <summary aria-label="Mở menu">
        <Icon name="menu" />
      </summary>
      {children}
    </details>
  );
}
