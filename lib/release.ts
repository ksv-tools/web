/** Bản cài của các app chạy trên máy, lấy từ GitHub Releases của kho bản cài. */

export type Release = {
  version: string;
  publishedAt: string;
  size: number;
};

/** Kho chứa bản cài của từng công cụ chạy trên máy. */
export const RELEASE_REPOS: Record<string, { repo: string; asset: string }> = {
  "tach-ho-so": { repo: "ksv-tools/tach-ho-so-ban-cai", asset: "TachHoSo.exe" },
};

/** Đường tải luôn trỏ tới bản mới nhất, không cần dựng lại web khi phát hành bản mới. */
export function downloadUrl(slug: string): string | null {
  const src = RELEASE_REPOS[slug];
  return src ? `https://github.com/${src.repo}/releases/latest/download/${src.asset}` : null;
}

/** Thông tin bản mới nhất (phiên bản, ngày, dung lượng). Chạy được cả lúc dựng web lẫn trong trình duyệt. */
export async function latestRelease(slug: string): Promise<Release | null> {
  const src = RELEASE_REPOS[slug];
  if (!src) return null;
  try {
    const res = await fetch(`https://api.github.com/repos/${src.repo}/releases/latest`, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      tag_name: string;
      published_at: string;
      assets: { name: string; size: number }[];
    };
    const asset = data.assets.find((a) => a.name === src.asset);
    if (!asset) return null;
    return { version: data.tag_name.replace(/^v/, ""), publishedAt: data.published_at, size: asset.size };
  } catch {
    return null;
  }
}

export function formatSize(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(0)} MB`;
}
