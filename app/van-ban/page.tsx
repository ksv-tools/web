import type { Metadata } from "next";
import { Suspense } from "react";
import { DocsBrowser } from "@/components/DocsBrowser";
import { PageHead } from "@/components/PageHead";

export const metadata: Metadata = {
  title: "Văn bản hướng dẫn",
  description:
    "Văn bản pháp luật và hướng dẫn nghiệp vụ theo lĩnh vực: hình sự, dân sự, thi hành án, khiếu nại tố cáo, văn bản Đảng.",
};

export default function DocsPage() {
  return (
    <>
      <PageHead
        title="Tra cứu văn bản"
        image="/anh/don-vi-tuyen-truyen.webp"
        lead="Luật, thông tư, giải đáp nghiệp vụ — tìm trong cả nội dung, đọc toàn văn ngay trên web."
        crumbs={[{ href: "/van-ban", label: "Văn bản" }]}
        compact
      />
      <section className="section vb-section">
        <Suspense>
          <DocsBrowser />
        </Suspense>
        <div className="wrap">
          <p className="doc-disclaimer">
            Danh mục do người quản trị tổng hợp để tham khảo và đang được bổ sung dần. Trước khi áp dụng, hãy đối chiếu
            bản gốc và tình trạng hiệu lực trên cổng thông tin của cơ quan ban hành.
          </p>
        </div>
      </section>
    </>
  );
}
