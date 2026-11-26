import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/PageHead";

export const metadata: Metadata = { title: "Hướng dẫn" };

export default function GuidePage() {
  return (
    <>
      <PageHead
        title="Hướng dẫn sử dụng"
        lead="Đăng nhập bằng Google, rồi dùng hoặc tải công cụ."
        crumbs={[{ href: "/huong-dan", label: "Hướng dẫn" }]}
      />
      <section className="section" style={{ paddingTop: 56 }}>
        <div className="wrap">
          <article className="prose" style={{ maxWidth: 760 }}>
            <h2>1. Đăng nhập</h2>
            <p>
              Vào <Link href="/dang-nhap" className="link">Đăng nhập</Link>, chọn <em>Tiếp tục với Google</em>. Google mở
              một cửa sổ nhỏ để bạn chọn tài khoản. Không cần tạo mật khẩu mới. Trình duyệt nhớ đăng nhập trong 30 ngày.
            </p>

            <h2>2. Dùng công cụ</h2>
            <ul>
              <li>
                <strong>Công cụ dùng ngay</strong> chạy trong trình duyệt; dữ liệu bạn nhập không gửi lên trang.
              </li>
              <li>
                <strong>Công cụ tải về máy</strong> là app Windows. Đăng nhập xong, nút <em>Tải về</em> hiện ở trang
                của công cụ. App có sẵn chức năng tự cập nhật nên
                thường chỉ cần tải một lần.
              </li>
            </ul>

            <h2>Câu hỏi thường gặp</h2>
            <h3>Tải về bị Windows cảnh báo?</h3>
            <p>
              App chưa ký số nên Windows SmartScreen có thể hiện cảnh báo lần đầu mở. Chọn <em>More info → Run anyway</em>{" "}
              nếu bạn tải từ trang này.
            </p>
            <h3>Có được chia sẻ file app cho người khác?</h3>
            <p>Mong bạn giới thiệu đồng nghiệp tự đăng nhập để tải, giúp người quản trị biết ai đang dùng và báo khi có lỗi.</p>
            <h3>Có được tải hồ sơ lên trang?</h3>
            <p>Không. Trang không nhận file hồ sơ. Tuyệt đối không đăng tài liệu mật hay hồ sơ vụ án lên bất kỳ đâu trên trang.</p>
          </article>
        </div>
      </section>
    </>
  );
}
