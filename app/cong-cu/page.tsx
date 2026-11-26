import type { Metadata } from "next";
import { Suspense } from "react";
import { ToolsBrowser, ToolsView } from "@/components/ToolsBrowser";

export const metadata: Metadata = { title: "Công cụ" };

export default function ToolsPage() {
  return (
    <Suspense fallback={<ToolsView />}>
      <ToolsBrowser />
    </Suspense>
  );
}
