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
          <h2>Tiện ích số cho Kiểm sát viên</h2>
          <ul>
            <li>
              <Icon name="check" size={20} /> Tạo tài khoản bằng email, hoặc dùng tài khoản Google sẵn có
            </li>
            <li>
              <Icon name="check" size={20} /> Tài khoản được duyệt: tải công cụ, xem văn bản nội bộ
            </li>
            <li>
              <Icon name="check" size={20} /> Văn bản công khai xem tự do, không cần đăng nhập
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
          <h1>Tài khoản</h1>

          <Suspense>
            <LoginBox />
          </Suspense>

          <p className="auth-foot">
            Khi đăng ký, đăng nhập, bạn đồng ý với <Link href="/chinh-sach">chính sách bảo vệ dữ liệu</Link>. Mật khẩu chỉ
            lưu dạng mã băm, người quản trị cũng không xem được. Mỗi lượt tải công cụ được ghi lại kèm họ tên, email.
          </p>
        </div>
      </section>
    </div>
  );
}
