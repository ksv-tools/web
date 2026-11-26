import type { Metadata } from "next";
import { PageHead } from "@/components/PageHead";
import { AUTHOR, AUTHOR_UNIT } from "@/lib/config";

export const metadata: Metadata = { title: "Chính sách bảo vệ dữ liệu" };

export default function PolicyPage() {
  return (
    <>
      <PageHead
        title="Chính sách bảo vệ dữ liệu"
        lead="Trang thu thập những gì, dùng vào việc gì, và cách yêu cầu xóa."
        crumbs={[{ href: "/chinh-sach", label: "Chính sách bảo vệ dữ liệu" }]}
      />
      <section className="section" style={{ paddingTop: 56 }}>
        <div className="wrap">
          <article className="prose" style={{ maxWidth: 760 }}>
            <h2>Dữ liệu được lưu</h2>
            <p>Khi bạn đăng nhập bằng Google, trang chỉ lưu:</p>
            <ul>
              <li>họ tên, địa chỉ email và ảnh đại diện do Google cung cấp;</li>
              <li>thời điểm đăng ký và lần đăng nhập gần nhất;</li>
              <li>lịch sử tải công cụ: công cụ nào, phiên bản nào, lúc nào.</li>
            </ul>
            <p>
              Trang <strong>không</strong> nhận mật khẩu Google của bạn, không đọc thư, danh bạ hay tệp trong tài khoản
              Google, và không nhận file hồ sơ. Các công cụ xử lý hồ sơ chạy trên máy của bạn.
            </p>

            <h2>Mục đích</h2>
            <ul>
              <li>xác nhận bạn là đồng nghiệp trước khi cho dùng công cụ;</li>
              <li>giới hạn số lượt tải mỗi ngày và theo dõi việc phát hành công cụ;</li>
              <li>liên hệ khi có bản cập nhật quan trọng hoặc lỗi cần báo.</li>
            </ul>
            <p>Dữ liệu không được bán, không chia sẻ cho bên thứ ba, không dùng để quảng cáo.</p>

            <h2>Nơi lưu và người được xem</h2>
            <p>
              Dữ liệu lưu trên dịch vụ cơ sở dữ liệu Supabase. Chỉ người quản trị trang ({AUTHOR}, {AUTHOR_UNIT}) xem
              được danh sách người dùng và lịch sử tải.
            </p>

            <h2>Yêu cầu xóa dữ liệu</h2>
            <p>
              Bạn có thể yêu cầu xóa tài khoản và toàn bộ dữ liệu liên quan bất cứ lúc nào bằng cách liên hệ người quản
              trị trang. Dữ liệu được xóa trong vòng 7 ngày kể từ khi nhận yêu cầu. Bạn cũng có thể gỡ quyền truy cập của
              trang trong phần cài đặt bảo mật của tài khoản Google.
            </p>

            <h2>Căn cứ</h2>
            <p>
              Chính sách này được xây dựng theo quy định của pháp luật Việt Nam về bảo vệ dữ liệu cá nhân. Khi đăng
              nhập, bạn đồng ý cho trang xử lý các dữ liệu nêu trên cho các mục đích nêu trên.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
