import type { Metadata } from "next";
import { Suspense } from "react";
import { DocViewer } from "@/components/DocViewer";

export const metadata: Metadata = { title: "Xem văn bản" };

export default function DocViewPage() {
  return (
    <Suspense>
      <DocViewer />
    </Suspense>
  );
}
