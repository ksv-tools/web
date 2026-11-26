import type { Metadata } from "next";
import { AccountView } from "@/components/AccountView";
import { PageHead } from "@/components/PageHead";

export const metadata: Metadata = { title: "Tài khoản" };

export default function AccountPage() {
  return (
    <>
      <PageHead title="Tài khoản của tôi" crumbs={[{ href: "/tai-khoan", label: "Tài khoản" }]} />
      <section className="section" style={{ paddingTop: 48 }}>
        <div className="wrap stack" style={{ maxWidth: 880 }}>
          <AccountView />
        </div>
      </section>
    </>
  );
}
