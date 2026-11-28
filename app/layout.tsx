import type { Metadata } from "next";
import { AuthProvider } from "@/components/Auth";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PREFS_BOOT } from "@/components/Prefs";
import { SavedSync } from "@/components/SavedSync";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/config";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description: SITE_TAGLINE,
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREFS_BOOT }} />
      </head>
      <body>
        <AuthProvider>
          <SavedSync />
          <Header />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
