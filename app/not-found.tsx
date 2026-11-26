import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="wrap" style={{ textAlign: "center" }}>
        <span className="eyebrow">404</span>
        <h1 className="h-section">Không tìm thấy trang</h1>
        <p className="lead" style={{ margin: "16px auto 32px" }}>
          Trang bạn tìm không tồn tại hoặc bạn không có quyền xem.
        </p>
        <Link href="/" className="btn btn-primary">
          Về trang chủ
        </Link>
      </div>
    </section>
  );
}
