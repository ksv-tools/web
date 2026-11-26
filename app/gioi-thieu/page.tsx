import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/PageHead";
import { AUTHOR, AUTHOR_UNIT } from "@/lib/config";

export const metadata: Metadata = { title: "Giới thiệu" };

export default function AboutPage() {
  return (
    <>
      <PageHead
        title="Giới thiệu"
        lead="Công cụ nhỏ cho những việc lặp đi lặp lại trong công tác kiểm sát."
        crumbs={[{ href: "/gioi-thieu", label: "Giới thiệu" }]}
      />
      <section className="section" style={{ paddingTop: 56 }}>
        <div className="wrap">
          <article className="prose" style={{ maxWidth: 760 }}>
            <h2>Vì sao có trang này</h2>
            <p>
              Nhiều việc trong công tác kiểm sát tốn thời gian mà không cần đến chuyên môn: tách và đặt tên hàng trăm
              trang hồ sơ scan, tính đi tính lại thời hạn, tổng hợp hình phạt, soạn văn bản theo mẫu. Các công cụ ở đây
              được làm ra để giảm bớt phần việc đó, giữ thời gian cho phần nghiệp vụ.
            </p>
            <p>
              Công cụ được làm và dùng thử trong công việc thực tế trước khi chia sẻ. Công cụ mới được thêm dần theo nhu
              cầu; nếu bạn có việc lặp đi lặp lại muốn tự động hóa, hãy góp ý với người quản trị.
            </p>

            <h2>Người thực hiện</h2>
            <p>
              <strong>{AUTHOR}</strong>, {AUTHOR_UNIT}.
            </p>

            <h2>Lưu ý</h2>
            <p>
              Đây là trang cá nhân chia sẻ công cụ giữa các đồng nghiệp,{" "}
              <strong>không phải trang thông tin chính thức của Viện kiểm sát nhân dân</strong>. Kết quả do công cụ tạo ra
              chỉ để hỗ trợ; người dùng tự kiểm tra và chịu trách nhiệm với văn bản, số liệu của mình.
            </p>
            <p>
              Xem thêm <Link href="/chinh-sach" className="link">chính sách bảo vệ dữ liệu</Link>.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
