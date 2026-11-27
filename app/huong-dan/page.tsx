import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/PageHead";

export const metadata: Metadata = { title: "Hướng dẫn" };

export default function GuidePage() {
  return (
    <>
      <PageHead
        title="Hướng dẫn sử dụng"
        image="/anh/huong-dan.jpg"
        lead="Đăng nhập, dùng hoặc tải công cụ, và tạo khóa API khi cần dùng chức năng AI."
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

            <h2 id="khoa-api">3. Tạo khóa API cho chức năng AI</h2>
            <p>
              Một số công cụ có chức năng nâng cao dùng AI (ví dụ đọc chữ viết tay). Chức năng này <strong>tắt sẵn</strong>;
              muốn dùng thì bạn tạo một khóa API (một dãy ký tự bí mật) rồi dán vào phần <em>Cài đặt</em> của công cụ.
              Không có khóa, công cụ vẫn chạy bình thường.
            </p>

            <h3>Khóa Gemini (Google)</h3>
            <p>Công cụ Tách hồ sơ scan dùng loại khóa này. Có gói miễn phí, giới hạn số lượt dùng mỗi ngày.</p>
            <ol>
              <li>
                Mở{" "}
                <a href="https://aistudio.google.com/apikey" className="link" target="_blank" rel="noopener noreferrer">
                  aistudio.google.com/apikey
                </a>{" "}
                và đăng nhập bằng tài khoản Google.
              </li>
              <li>Lần đầu vào, đọc và đồng ý điều khoản của Google AI Studio.</li>
              <li>
                Bấm <strong>Create API key</strong> (Tạo khóa API). Nếu được hỏi chọn dự án, chọn dự án có sẵn hoặc để
                Google tạo dự án mới.
              </li>
              <li>
                Khóa hiện ra, thường bắt đầu bằng <code>AIza</code>. Bấm biểu tượng sao chép.
              </li>
              <li>
                Mở công cụ, vào <strong>Cài đặt</strong>, dán khóa vào ô khóa Gemini và lưu.
              </li>
            </ol>
            <p>
              Muốn dùng nhiều hơn hạn mức miễn phí: trong AI Studio chọn <em>Set up billing</em> để gắn thẻ thanh toán cho
              dự án; khi đó tính phí theo lượng dùng.
            </p>

            <h3>Khóa ChatGPT (OpenAI)</h3>
            <p>
              Dành cho công cụ có hỗ trợ ChatGPT. Lưu ý: khóa API <strong>tính phí riêng</strong>, không đi kèm gói
              ChatGPT Plus, và phải nạp tiền trước mới dùng được.
            </p>
            <ol>
              <li>
                Mở{" "}
                <a href="https://platform.openai.com" className="link" target="_blank" rel="noopener noreferrer">
                  platform.openai.com
                </a>{" "}
                và đăng nhập (dùng được tài khoản ChatGPT sẵn có).
              </li>
              <li>
                Vào <strong>Settings → Billing</strong>, thêm phương thức thanh toán và nạp số tiền tối thiểu.
              </li>
              <li>
                Vào{" "}
                <a href="https://platform.openai.com/api-keys" className="link" target="_blank" rel="noopener noreferrer">
                  API keys
                </a>
                , bấm <strong>Create new secret key</strong>, đặt tên dễ nhớ (ví dụ tên công cụ), bấm tạo.
              </li>
              <li>
                Chép khóa ngay (bắt đầu bằng <code>sk-</code>). Khóa <strong>chỉ hiện một lần</strong>; nếu quên, phải tạo
                khóa mới.
              </li>
              <li>Mở công cụ, vào Cài đặt, dán khóa và lưu.</li>
            </ol>

            <h3>Giữ khóa an toàn</h3>
            <ul>
              <li>Khóa như mật khẩu: không gửi qua tin nhắn, email, không chụp màn hình chia sẻ.</li>
              <li>Mỗi người tự tạo khóa của mình, không dùng chung.</li>
              <li>Nghi bị lộ thì vào trang tạo khóa, xóa khóa cũ và tạo khóa mới.</li>
              <li>Chỉ bật AI khi cần và tuân thủ quy định bảo mật của đơn vị.</li>
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
