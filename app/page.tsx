import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ToolCard } from "@/components/ToolCard";
import { SignedOutOnly } from "@/components/UserMenu";
import { withBase } from "@/lib/config";
import { FIELDS } from "@/lib/documents";
import { TOOLS } from "@/lib/tools";

/** Ảnh đơn vị chạy luân phiên ở đầu trang chủ. */
const SLIDES = [
  "/anh/don-vi-tap-the.webp",
  "/anh/don-vi-ky-ket.webp",
  "/anh/don-vi-tuyen-truyen.webp",
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-slides" aria-hidden="true" style={{ backgroundImage: `url(${withBase(SLIDES[0])})` }}>
          {SLIDES.map((src, i) => (
            <div
              key={src}
              className="hero-slide"
              style={{ backgroundImage: `url(${withBase(src)})`, animationDelay: `${i * 6}s`, animationDuration: `${SLIDES.length * 6}s` }}
            />
          ))}
        </div>
        <div className="wrap hero-in">
          <span className="hero-brand">KSV Tools</span>
          <h1>Không gian tiện ích số dành cho Kiểm sát viên</h1>
          <p className="hero-motto">Đơn giản · Thuận tiện · Hiệu quả</p>
          <div className="hero-actions">
            <Link href="/cong-cu" className="btn btn-primary btn-lg">
              Khám phá công cụ <Icon name="arrow" size={18} />
            </Link>
            <Link href="/van-ban" className="btn btn-light btn-lg">
              Tra cứu văn bản
            </Link>
            <SignedOutOnly>
              <Link href="/dang-nhap" className="btn btn-ghost-light btn-lg">
                Đăng nhập
              </Link>
            </SignedOutOnly>
          </div>
        </div>
      </section>

      <section className="section" id="cong-cu">
        <div className="wrap">
          <div className="section-head">
            <h2 className="h-section">Công cụ nghiệp vụ</h2>
            <Link href="/cong-cu" className="link">
              Tất cả công cụ <Icon name="arrow" size={18} />
            </Link>
          </div>
          <div className="tool-grid">
            {TOOLS.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap">
          <div className="section-head">
            <h2 className="h-section">Văn bản hướng dẫn</h2>
            <Link href="/van-ban" className="link">
              Tra cứu văn bản <Icon name="arrow" size={18} />
            </Link>
          </div>
          <div className="field-grid">
            {FIELDS.map((f) => (
              <Link
                key={f.id}
                href={`/van-ban?linh-vuc=${f.id}`}
                className={f.ready ? "field-card" : "field-card is-soon"}
              >
                <img src={withBase(`/anh/linh-vuc/${f.id}.jpg`)} alt="" loading="lazy" width={800} height={500} />
                <span className="field-card-text">
                  <b>{f.name}</b>
                  <span>{f.ready ? "Xem văn bản" : "Đang tổng hợp"}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="trust" aria-label="Nguyên tắc">
        <div className="wrap trust-in">
          <span>
            <Icon name="monitor" size={22} /> Xử lý ngay trên máy của bạn
          </span>
          <span>
            <Icon name="lock" size={22} /> Đăng nhập Google để tải
          </span>
          <span>
            <Icon name="shield" size={22} /> Không chứa tài liệu mật
          </span>
        </div>
      </section>
    </>
  );
}
