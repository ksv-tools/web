import type { Metadata } from "next";
import { PageHead } from "@/components/PageHead";
import { AUTHOR, AUTHOR_UNIT } from "@/lib/config";

export const metadata: Metadata = { title: "Chính sách bảo vệ dữ liệu" };

export default function PolicyPage() {
  return (
    <>
      <PageHead
        title="Chính sách bảo vệ dữ liệu"
        image="/anh/chinh-sach.jpg"
        lead="Trang thu thập những gì, dùng vào việc gì, và cách yêu cầu xóa."
        crumbs={[{ href: "/chinh-sach", label: "Chính sách bảo vệ dữ liệu" }]}
      />
      <section className="section" style={{ paddingTop: 56 }}>
        <div className="wrap">
          <article className="prose" style={{ maxWidth: 760 }}>
            <h2>Dữ liệu được lưu</h2>
            <p>
              Khi bạn tạo tài khoản, trang lưu họ tên, đơn vị, chức vụ, số điện thoại (nếu điền), email và trạng thái duyệt.
              Mật khẩu chỉ lưu dạng mã băm một chiều: không ai đọc lại được, kể cả người quản trị. Khi đăng nhập bằng Google,
              trang nhận họ tên và email do Google xác nhận. Trình duyệt của bạn giữ một vé đăng nhập đến khi bấm Đăng xuất.
              Mỗi khi bạn tải một công cụ, trang ghi lại:
            </p>
            <ul>
              <li>họ tên và địa chỉ email;</li>
              <li>công cụ, phiên bản và thời điểm tải.</li>
            </ul>
            <p>
              Khi bạn gửi đề xuất tài liệu, trang ghi lại họ tên, email và nội dung đề xuất để người quản trị xem xét và
              liên hệ khi cần. Tệp bạn đính kèm được gửi thẳng vào email của người quản trị, không lưu trên trang. Không
              gửi tài liệu chứa bí mật nhà nước hoặc hồ sơ vụ án.
            </p>
            <p>
              Trang <strong>không</strong> nhận mật khẩu Google của bạn, không đọc thư, danh bạ hay tệp trong tài khoản
              Google, và không nhận file hồ sơ. Các công cụ xử lý hồ sơ chạy trên máy của bạn.
            </p>

            <h2>Mục đích</h2>
            <ul>
              <li>biết ai đang dùng công cụ nào để hỗ trợ khi có lỗi;</li>
              <li>theo dõi việc phát hành công cụ;</li>
              <li>liên hệ khi có bản cập nhật quan trọng hoặc lỗi cần báo.</li>
            </ul>
            <p>Dữ liệu không được bán, không chia sẻ cho bên thứ ba, không dùng để quảng cáo.</p>

            <h2>Nơi lưu và người được xem</h2>
            <p>
              Tài khoản, lượt tải và đề xuất được ghi vào một bảng tính Google Sheets riêng của người quản trị trang ({AUTHOR},{" "}
              {AUTHOR_UNIT}). Chỉ người quản trị xem được.
            </p>

            <h2>Yêu cầu xóa dữ liệu</h2>
            <p>
              Bạn có thể yêu cầu xóa tài khoản và toàn bộ lượt tải gắn với email của mình bất cứ lúc nào bằng cách liên hệ người quản
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
