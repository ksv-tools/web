import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Icon } from "@/components/Icon";
import { LoginBox } from "@/components/LoginBox";
import { withBase } from "@/lib/config";

export const metadata: Metadata = { title: "Đăng nhập" };

export default function LoginPage() {
  return (
    <div className="auth">
      <section className="auth-side" style={{ "--side-img": `url(${withBase("/anh/don-vi-bien-tru-so.webp")})` } as React.CSSProperties}>
        <div>
          <span className="eyebrow" style={{ color: "inherit", opacity: 0.75 }}>
            KSV Tools
          </span>
          <h2>Không gian tiện ích số dành cho Kiểm sát viên</h2>
          <ul>
            <li>
              <Icon name="check" size={20} /> Đăng nhập bằng tài khoản Google sẵn có, không cần mật khẩu mới
            </li>
            <li>
              <Icon name="check" size={20} /> Đăng nhập một lần, dùng trong 30 ngày
            </li>
            <li>
              <Icon name="check" size={20} /> Hồ sơ xử lý trên máy của bạn, không đưa lên trang
            </li>
          </ul>
        </div>
        <small>Trang cá nhân, không phải trang thông tin chính thức của Viện kiểm sát nhân dân.</small>
      </section>

      <section className="auth-main">
        <div className="auth-box">
          <h1>Đăng nhập</h1>
          <p>Dùng tài khoản Google để tiếp tục.</p>

          <Suspense>
            <LoginBox />
          </Suspense>

          <p className="auth-foot">
            Khi đăng nhập, bạn đồng ý với <Link href="/chinh-sach">chính sách bảo vệ dữ liệu</Link>. Mỗi lượt tải công cụ được ghi
            lại kèm họ tên và email của bạn.
          </p>
        </div>
      </section>
    </div>
  );
}
