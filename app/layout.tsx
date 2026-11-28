import type { Metadata } from "next";
import { Be_Vietnam_Pro, Roboto } from "next/font/google";
import { AuthProvider } from "@/components/Auth";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/config";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description: SITE_TAGLINE,
  robots: { index: false, follow: false },
};

/** Chữ thường: Roboto. Tiêu đề: Be Vietnam Pro (vẽ riêng cho tiếng Việt, dấu đẹp ở cỡ lớn). */
const roboto = Roboto({ subsets: ["latin", "vietnamese"], weight: ["400", "500", "700"], variable: "--font-body", display: "swap" });
const heading = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${roboto.variable} ${heading.variable}`}>
      <body>
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
