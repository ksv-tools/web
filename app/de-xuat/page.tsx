import type { Metadata } from "next";
import { PageHead } from "@/components/PageHead";
import { SuggestForm } from "@/components/SuggestForm";

export const metadata: Metadata = { title: "Đề xuất tài liệu" };

export default function SuggestPage() {
  return (
    <>
      <PageHead
        title="Đề xuất tài liệu"
        image="/anh/huong-dan.jpg"
        lead="Bạn biết một văn bản hướng dẫn, giải đáp hay tài liệu nghiệp vụ hữu ích chưa có trên trang? Gửi đề xuất để người quản trị xem xét đăng."
        crumbs={[
          { href: "/van-ban", label: "Văn bản hướng dẫn" },
          { href: "/de-xuat", label: "Đề xuất tài liệu" },
        ]}
      />
      <section className="section" style={{ paddingTop: 48 }}>
        <div className="wrap" style={{ maxWidth: 760 }}>
          <SuggestForm />
        </div>
      </section>
    </>
  );
}
