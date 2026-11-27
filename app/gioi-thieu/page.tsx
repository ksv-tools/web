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
        image="/anh/phien-toa-vks-hue.jpg"
        credit={{ text: "Ảnh: VKSND thành phố Huế (vkshue.gov.vn)", href: "https://vkshue.gov.vn" }}
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
            <figure className="photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={withBase("/anh/don-vi.webp")}
                alt="Cán bộ, Kiểm sát viên Viện kiểm sát nhân dân khu vực 3, tỉnh Ninh Bình trong buổi sinh hoạt chuyên đề"
                width={1440}
                height={960}
                loading="lazy"
              />
              <figcaption>Tập thể Viện kiểm sát nhân dân khu vực 3, tỉnh Ninh Bình.</figcaption>
            </figure>

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
              Ảnh trụ sở và phiên tòa giả định ở trang chủ, trang này: Viện kiểm sát nhân dân thành phố Huế (vkshue.gov.vn). Các ảnh minh họa khác lấy từ{" "}
              <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer">
                Unsplash
              </a>{" "}
              (miễn phí bản quyền). Ảnh tập thể đơn vị do {AUTHOR_UNIT} cung cấp.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
