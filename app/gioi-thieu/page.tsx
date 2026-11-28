import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/PageHead";
import { AUTHOR, AUTHOR_UNIT, withBase } from "@/lib/config";

export const metadata: Metadata = { title: "Giới thiệu" };

export default function AboutPage() {
  return (
    <>
      <PageHead
        title="Giới thiệu"
        image="/anh/don-vi-ky-ket.webp"
        lead="Công cụ nhỏ cho những việc lặp đi lặp lại trong công tác kiểm sát."
        crumbs={[{ href: "/gioi-thieu", label: "Giới thiệu" }]}
      />
      <section className="section" style={{ paddingTop: 56 }}>
        <div className="wrap">
          <article className="prose" style={{ maxWidth: 760 }}>
            <h2>Vì sao có trang này</h2>
            <p>
              Tách hồ sơ scan, tính thời hạn, tổng hợp hình phạt, soạn văn bản theo mẫu — những việc tốn thời gian mà
              không cần chuyên môn. Công cụ ở đây làm thay phần đó, được dùng thử trong công việc thực tế trước khi chia sẻ.
            </p>

            <h2>Người thực hiện</h2>
            <div className="author">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={withBase("/anh/tac-gia.webp")} alt={AUTHOR} width={800} height={1000} loading="lazy" />
              <p>
                <strong>{AUTHOR}</strong>
                <span>{AUTHOR_UNIT}</span>
              </p>
            </div>

            <h2>Lưu ý</h2>
            <p>
              Đây là trang cá nhân chia sẻ công cụ giữa các đồng nghiệp,{" "}
              <strong>không phải trang thông tin chính thức của Viện kiểm sát nhân dân</strong>. Kết quả do công cụ tạo ra
              chỉ để hỗ trợ; người dùng tự kiểm tra và chịu trách nhiệm với văn bản, số liệu của mình.
            </p>
            <p>
              Xem thêm <Link href="/chinh-sach" className="link">chính sách bảo vệ dữ liệu</Link>.
            </p>
            <p className="muted" style={{ fontSize: 13.5 }}>
              Ảnh ở trang chủ, trang Giới thiệu, Văn bản và Đăng nhập do {AUTHOR_UNIT} và người thực hiện cung cấp. Các ảnh minh họa khác lấy từ{" "}
              <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer">
                Unsplash
              </a>{" "}
              (miễn phí bản quyền).
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
