import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { type NavItem, NavLinks } from "./NavLinks";
import { Prefs } from "./Prefs";
import { UserMenu } from "./UserMenu";

const ITEMS: NavItem[] = [
  { href: "/", label: "Trang chủ" },
  { href: "/cong-cu", label: "Công cụ" },
  { href: "/van-ban", label: "Văn bản" },
  { href: "/huong-dan", label: "Hướng dẫn" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
];

export function Header() {
  return (
    <header className="header">
      <div className="wrap header-in">
        <Logo />
        <NavLinks items={ITEMS} className="nav" />
        <div className="header-end">
          <Prefs />
          <UserMenu />
          <MobileMenu>
            <NavLinks items={ITEMS} className="nav-mobile" />
          </MobileMenu>
        </div>
      </div>
    </header>
  );
}
