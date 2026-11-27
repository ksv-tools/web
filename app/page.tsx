import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ToolCard } from "@/components/ToolCard";
import { SignedOutOnly } from "@/components/UserMenu";
import { withBase } from "@/lib/config";
import { FIELDS } from "@/lib/documents";
import { AREAS, TOOLS } from "@/lib/tools";

export default function Home() {
  const ready = TOOLS.filter((t) => t.status === "ready").length;
  return (
    <>
      <section className="hero" style={{ "--hero-img": `url(${withBase("/anh/don-vi-tap-the.webp")})` } as React.CSSProperties}>
        <div className="hero-photo" aria-hidden="true" />
        <div className="wrap hero-in">
          <span className="hero-brand">
            <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3v18M7 21h10M4.5 7h15" />
              <path d="M4.5 7 2 12.5a2.5 2.5 0 0 0 5 0L4.5 7ZM19.5 7 17 12.5a2.5 2.5 0 0 0 5 0L19.5 7Z" />
            </svg>
            KSV Tools
          </span>
          <h1>Không gian tiện ích số dành cho Kiểm sát viên</h1>
          <p className="hero-lead">
            Tích hợp các tiện ích xử lý tài liệu, số hóa hồ sơ, tính toán thời hạn và hỗ trợ công việc chuyên môn trên một
            nền tảng duy nhất.
          </p>
          <p className="hero-motto">Đơn giản · Thuận tiện · Hiệu quả</p>
          <div className="hero-actions">
            <Link href="/cong-cu" className="btn btn-primary btn-lg">
              Khám phá công cụ <Icon name="arrow" size={18} />
            </Link>
            <SignedOutOnly>
              <Link href="/dang-nhap" className="btn btn-light btn-lg">
                Đăng nhập
              </Link>
            </SignedOutOnly>
          </div>
          <a href="#cong-cu" className="hero-down" aria-label="Xem các công cụ">
            <Icon name="down" size={24} stroke={2} />
          </a>
        </div>
      </section>

      <section className="band" aria-label="Số liệu">
        <div className="wrap band-in">
          <div className="stat">
            <b>{ready}</b>
            <span>Công cụ đang dùng</span>
          </div>
          <div className="stat">
            <b>{TOOLS.length - ready}</b>
            <span>Công cụ đang làm</span>
          </div>
          <div className="stat">
            <b>~3s</b>
            <span>Tách mỗi trang hồ sơ</span>
          </div>
          <div className="stat">
            <b>0</b>
            <span>Hồ sơ lưu trên web</span>
          </div>
        </div>
      </section>

      <section className="section" id="cong-cu">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Công cụ</span>
              <h2 className="h-section">Công cụ nghiệp vụ</h2>
              <p className="lead">Mỗi công cụ giải quyết một việc cụ thể, lặp đi lặp lại trong công tác hằng ngày.</p>
            </div>
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
            <div>
              <span className="eyebrow">Tra cứu</span>
              <h2 className="h-section">Văn bản hướng dẫn</h2>
              <p className="lead">
                Luật, thông tư liên tịch, nghị quyết Hội đồng Thẩm phán, giải đáp nghiệp vụ — chia theo lĩnh vực công
                tác.
              </p>
            </div>
            <Link href="/van-ban" className="link">
              Tra cứu văn bản <Icon name="arrow" size={18} />
            </Link>
          </div>
          <div className="field-grid">
            {FIELDS.map((f) => (
              <Link key={f.id} href={`/van-ban?linh-vuc=${f.id}`} className="field-card">
                <Icon name="book" size={22} />
                <b>{f.name}</b>
                <span>{f.ready ? "Luật, thông tư, hướng dẫn, giải đáp" : "Đang tổng hợp"}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap areas">
          <div>
            <span className="eyebrow">Lĩnh vực</span>
            <h2 className="h-section">Theo khâu công tác</h2>
            <p className="lead">Chọn lĩnh vực để xem các công cụ phù hợp.</p>
          </div>
          <div className="area-list">
            {AREAS.map((a) => (
              <Link key={a.id} href={`/cong-cu?linh-vuc=${a.id}`} className="area-item">
                <b>
                  {a.name} <Icon name="arrow" size={16} />
                </b>
                <span>{a.note}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Nguyên tắc</span>
              <h2 className="h-section">An toàn với hồ sơ</h2>
            </div>
          </div>
          <div className="cols-3">
            <div className="note">
              <span className="note-icon">
                <Icon name="monitor" size={26} />
              </span>
              <div>
                <h3>Xử lý trên máy</h3>
                <p>Công cụ chạy trên máy tính hoặc trong trình duyệt của bạn. Trang này không nhận file hồ sơ.</p>
              </div>
            </div>
            <div className="note">
              <span className="note-icon">
                <Icon name="lock" size={26} />
              </span>
              <div>
                <h3>Đăng nhập để tải</h3>
                <p>Đăng nhập bằng tài khoản Google mới tải được công cụ. Mỗi lượt tải đều được ghi lại.</p>
              </div>
            </div>
            <div className="note">
              <span className="note-icon">
                <Icon name="shield" size={26} />
              </span>
              <div>
                <h3>Không có tài liệu mật</h3>
                <p>Trang chỉ chứa công cụ và tài liệu công khai, không đăng hồ sơ vụ án hay tài liệu mật.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
