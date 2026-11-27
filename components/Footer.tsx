import Link from "next/link";
import { AUTHOR, AUTHOR_UNIT } from "@/lib/config";
import { TOOLS } from "@/lib/tools";
import { Logo } from "./Logo";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="wrap footer-in">
        <div>
          <Logo />
          <p className="footer-about">
            Trang cá nhân chia sẻ công cụ hỗ trợ nghiệp vụ giữa các đồng nghiệp. Không phải trang thông tin chính thức của
            Viện kiểm sát nhân dân.
          </p>
        </div>
        <div>
          <h3>Công cụ</h3>
          <ul>
            {TOOLS.filter((t) => t.status === "ready").map((t) => (
              <li key={t.slug}>
                <Link href={`/cong-cu/${t.slug}`}>{t.name}</Link>
              </li>
            ))}
            <li>
              <Link href="/cong-cu">Tất cả công cụ</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3>Thông tin</h3>
          <ul>
            <li>
              <Link href="/van-ban">Văn bản hướng dẫn</Link>
            </li>
            <li>
              <Link href="/de-xuat">Đề xuất tài liệu</Link>
            </li>
            <li>
              <Link href="/huong-dan">Hướng dẫn sử dụng</Link>
            </li>
            <li>
              <Link href="/gioi-thieu">Giới thiệu</Link>
            </li>
            <li>
              <Link href="/chinh-sach">Chính sách bảo vệ dữ liệu</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3>Tài khoản</h3>
          <ul>
            <li>
              <Link href="/dang-nhap">Đăng nhập</Link>
            </li>
            <li>
              <Link href="/tai-khoan">Tài khoản của tôi</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="wrap">
          <span>
            © {year} {AUTHOR} · {AUTHOR_UNIT}
          </span>
          <span>Không đăng tải tài liệu mật hay hồ sơ vụ án lên trang này.</span>
        </div>
      </div>
    </footer>
  );
}
