"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = { href: string; label: string };

/** Liên kết menu, tô màu mục đang xem. */
export function NavLinks({ items, className }: { items: NavItem[]; className: string }) {
  const path = usePathname();
  return (
    <nav className={className} aria-label="Menu chính">
      {items.map((it) => {
        const active = it.href === "/" ? path === "/" : path.startsWith(it.href);
        return (
          <Link key={it.href} href={it.href} aria-current={active ? "page" : undefined}>
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
