import type { Metadata } from "next";
import Link from "next/link";
import { DownloadPanel } from "@/components/DownloadPanel";
import { PageHead } from "@/components/PageHead";
import { latestRelease } from "@/lib/release";

export const metadata: Metadata = {
  title: "Tách hồ sơ scan",
  description: "Chia file PDF scan nhiều tài liệu thành từng văn bản, đặt tên theo tiêu đề, xếp theo ngày, lập mục lục.",
};

export default async function TachHoSoPage() {
  const release = await latestRelease("tach-ho-so");

  return (
    <>
      <PageHead
        title="Tách hồ sơ scan"
        lead="Thả một file PDF scan gồm nhiều tài liệu ghép liền nhau, nhấn Tách. App chia thành từng văn bản, đặt tên theo tiêu đề đọc được, xếp theo thời gian và lập mục lục."
        crumbs={[
          { href: "/cong-cu", label: "Công cụ" },
          { href: "/cong-cu/tach-ho-so", label: "Tách hồ sơ scan" },
        ]}
      >
        <div className="tool-meta" style={{ marginTop: 24 }}>
          <span className="tag tag-ready">Tải về máy</span>
          <span className="tag">Dùng chung</span>
          <span className="tag">Hình sự</span>
          <span className="tag">Dân sự</span>
          <span className="tag">Hành chính</span>
        </div>
      </PageHead>

      <section className="section" style={{ paddingTop: 56 }}>
        <div className="wrap tool-layout">
          <article className="prose">
            <h2>App làm được gì</h2>
            <ul className="feature-list">
              <li>
                <b>Tự chia tài liệu</b>
                <span>Nhận trang đầu của từng văn bản trong tập scan và cắt thành file riêng, giữ nguyên trang gốc.</span>
              </li>
              <li>
                <b>Đặt tên theo tiêu đề</b>
                <span>Tên file theo tiêu đề và ngày trên văn bản; lời khai có thêm họ tên người khai.</span>
              </li>
              <li>
                <b>Xếp theo thời gian</b>
                <span>Đánh số thứ tự theo ngày; cùng tiêu đề, cùng ngày thì thêm (1), (2), (3).</span>
              </li>
              <li>
                <b>Lập mục lục</b>
                <span>Xuất kèm file mục lục Excel và file nén toàn bộ kết quả.</span>
              </li>
              <li>
                <b>Xử lý bản scan khó</b>
                <span>Bỏ trang trắng, xoay trang ngược, chia bản scan A3 hai mặt thành trang A4.</span>
              </li>
              <li>
                <b>Tách nhiều file một lúc</b>
                <span>Kéo thả nhiều file PDF, app tách lần lượt, mỗi file một thư mục kết quả.</span>
              </li>
            </ul>

            <h2>Cách dùng</h2>
            <ol>
              <li>Tải app ở khung bên cạnh, bấm đúp file <strong>TachHoSo.exe</strong>. Không cần cài đặt.</li>
              <li>Kéo file PDF scan vào cửa sổ app, nhấn <strong>Tách</strong>. Mỗi trang mất khoảng 3 giây.</li>
              <li>
                Xem bảng kết quả: <strong>ô vàng</strong> là chỗ app chưa chắc chắn, gõ để sửa hoặc nhấn <em>Đúng rồi</em>.
              </li>
              <li>
                Chia sai trang thì mở <strong>Chia trang</strong>, bấm cây kéo giữa hai trang để cắt hoặc gộp, rồi tách lại.
              </li>
            </ol>
            <p>
              App tự kiểm tra bản mới trong <strong>Cài đặt → Cập nhật app</strong>; cài đặt và kết quả cũ được giữ nguyên.
            </p>

            <h2>Máy đọc được gì</h2>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Không dùng AI</th>
                    <th>Có khóa Gemini</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Ranh giới, loại tài liệu</td>
                    <td>Có (đọc chữ trên máy)</td>
                    <td>Có</td>
                  </tr>
                  <tr>
                    <td>Tiêu đề, họ tên in sẵn</td>
                    <td>Có</td>
                    <td>Có</td>
                  </tr>
                  <tr>
                    <td>Ngày, giờ, tên viết tay</td>
                    <td>Để trống, không đoán</td>
                    <td>AI đọc</td>
                  </tr>
                  <tr>
                    <td>Dữ liệu gửi ra ngoài</td>
                    <td>Không</td>
                    <td>Ảnh cắt phần đầu trang và dòng ngày ký, gửi lên Google</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>Lưu ý bảo mật</h2>
            <p>
              Không dùng AI thì app xử lý <strong>hoàn toàn trên máy</strong>, không gửi gì ra ngoài. Khi bật AI, một phần
              ảnh trang (tiêu đề, vài dòng đầu, dòng ngày ký) được gửi lên Google để đọc chữ viết tay. Phần này có thể chứa
              họ tên và một phần nội dung.
            </p>
            <p>
              Nếu dùng AI, hãy dùng khóa Gemini <strong>gói trả phí</strong> (dữ liệu gói miễn phí có thể được Google dùng
              để cải thiện sản phẩm) và kiểm tra quy định của đơn vị trước khi dùng với hồ sơ thật.
            </p>
          </article>

          <aside className="aside">
            <DownloadPanel slug="tach-ho-so" initial={release} />
            <div className="panel">
              <h3>Yêu cầu máy</h3>
              <p className="panel-msg" style={{ marginTop: 0 }}>
                Windows 10 hoặc 11, có trình duyệt Edge hoặc Chrome (Windows có sẵn Edge). Không cần quyền quản trị máy.
              </p>
            </div>
            <div className="panel">
              <h3>Cần hỗ trợ?</h3>
              <p className="panel-msg" style={{ marginTop: 0 }}>
                Xem <Link href="/huong-dan" className="link">hướng dẫn chung</Link> hoặc liên hệ người quản trị trang.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
