import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Icon, SocialIcon } from "@/components/Icon";
import { demoMode, hasSupabase, PROVIDERS } from "@/lib/config";
import { getUser } from "@/lib/session";
import { safeNext } from "@/lib/url";
import { signIn } from "./actions";

export const metadata: Metadata = { title: "Đăng nhập" };

const ERRORS: Record<string, string> = {
  "that-bai": "Đăng nhập chưa thành công. Vui lòng thử lại.",
  "chua-cau-hinh": "Trang chưa được cấu hình đăng nhập.",
  google: "Chưa đăng nhập được bằng Google.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; loi?: string }> }) {
  const sp = await searchParams;
  const next = safeNext(sp.next);
  if (await getUser()) redirect(next);

  return (
    <div className="auth">
      <section className="auth-side">
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
              <Icon name="check" size={20} /> Tài khoản được duyệt trước khi dùng
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

          {sp.loi && ERRORS[sp.loi] && <div className="alert alert-err">{ERRORS[sp.loi]}</div>}
          {!hasSupabase && !demoMode && <div className="alert alert-warn">Trang chưa được cấu hình đăng nhập.</div>}

          <form action={signIn} className="social">
            <input type="hidden" name="next" value={next} />
            {PROVIDERS.map((p) => (
              <button key={p.id} type="submit" name="provider" value={p.id} className="social-btn">
                <SocialIcon id={p.id} />
                <span>Tiếp tục với {p.label}</span>
              </button>
            ))}
          </form>

          {demoMode && (
            <form action={signIn} className="demo-box">
              <b>Chế độ thử trên máy.</b> Chưa kết nối Supabase nên nút trên tạo tài khoản giả (đang chờ duyệt).
              <input type="hidden" name="next" value={next} />
              <input type="hidden" name="provider" value="google" />
              <input type="hidden" name="admin" value="1" />
              <button type="submit" className="btn btn-outline btn-sm">
                Đăng nhập thử với quyền quản trị
              </button>
            </form>
          )}

          <p className="auth-foot">
            Khi đăng nhập, bạn đồng ý với <Link href="/chinh-sach">chính sách bảo vệ dữ liệu</Link>. Trang chỉ lưu họ tên,
            email, ảnh đại diện và lịch sử tải công cụ.
          </p>
        </div>
      </section>
    </div>
  );
}
