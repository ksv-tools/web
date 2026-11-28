import type { Metadata } from "next";
import { AdminAccounts } from "@/components/AdminAccounts";
import { AdminDocs } from "@/components/AdminDocs";
import { PageHead } from "@/components/PageHead";

export const metadata: Metadata = { title: "Quản trị" };

export default function AdminPage() {
  return (
    <>
      <PageHead title="Quản trị" crumbs={[{ href: "/quan-tri", label: "Quản trị" }]} />
      <section className="section" style={{ paddingTop: 48 }}>
        <div className="wrap stack" style={{ maxWidth: 980 }}>
          <AdminAccounts />
          <AdminDocs />
        </div>
      </section>
    </>
  );
}
