import { type NextRequest, NextResponse } from "next/server";
import { latestRelease } from "@/lib/release";
import { getUser } from "@/lib/session";
import { startOfTodayVN, store } from "@/lib/store";
import { getTool } from "@/lib/tools";

/**
 * Tải app: kiểm tra đăng nhập, trạng thái duyệt và hạn mức trong ngày, ghi lượt tải, rồi chuyển sang file cài.
 * Chỉ ghi lượt tải khi mọi điều kiện đều đạt.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool || tool.status !== "ready" || tool.kind !== "desktop") {
    return new NextResponse("Không tìm thấy công cụ", { status: 404 });
  }
  const back = (loi?: string) =>
    NextResponse.redirect(new URL(`/cong-cu/${slug}${loi ? `?loi=${loi}` : ""}`, request.url), 303);

  const user = await getUser();
  if (!user) return NextResponse.redirect(new URL(`/dang-nhap?next=/cong-cu/${slug}`, request.url), 303);
  if (user.status === "pending") return back("cho-duyet");
  if (user.status === "locked") return back("bi-khoa");

  const used = await store.countDownloadsSince(user.id, startOfTodayVN());
  if (used >= user.quota) return back("het-luot");

  const release = await latestRelease(slug);
  if (!release) return back("khong-tai-duoc");

  await store.addDownload(user.id, slug, release.version);
  return NextResponse.redirect(release.url, 303);
}
