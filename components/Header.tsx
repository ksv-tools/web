import Link from "next/link";
import { getUser } from "@/lib/session";
import { Avatar } from "./Avatar";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { type NavItem, NavLinks } from "./NavLinks";

export async function Header() {
  const user = await getUser();
  const items: NavItem[] = [
    { href: "/", label: "Trang chủ" },
    { href: "/cong-cu", label: "Công cụ" },
    { href: "/huong-dan", label: "Hướng dẫn" },
    { href: "/gioi-thieu", label: "Giới thiệu" },
  ];
  if (user?.isAdmin) items.push({ href: "/quan-tri", label: "Quản trị" });

  return (
    <header className="header">
      <div className="wrap header-in">
        <Logo />
        <NavLinks items={items} className="nav" />
        <div className="header-end">
          {user ? (
            <Link href="/tai-khoan" className="user-chip" title="Tài khoản của tôi">
              <Avatar name={user.fullName || user.email} src={user.avatarUrl} />
              <span className="user-name">{user.fullName || user.email}</span>
            </Link>
          ) : (
            <Link href="/dang-nhap" className="btn btn-primary btn-sm">
              Đăng nhập
            </Link>
          )}
          <MobileMenu>
            <NavLinks items={items} className="nav-mobile" />
          </MobileMenu>
        </div>
      </div>
    </header>
  );
}
