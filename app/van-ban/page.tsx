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
        title="Văn bản hướng dẫn"
        image="/anh/van-ban.jpg"
        lead="Luật, thông tư liên tịch, nghị quyết Hội đồng Thẩm phán, giải đáp nghiệp vụ của Tòa án, Viện kiểm sát, liên ngành và địa phương — chia theo lĩnh vực để tra cứu nhanh."
        crumbs={[{ href: "/van-ban", label: "Văn bản hướng dẫn" }]}
      />
      <section className="section" style={{ paddingTop: 0 }}>
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
