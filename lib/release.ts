/** Bản phát hành mới nhất của các app chạy trên máy, đọc từ GitHub Releases (lưu tạm 10 phút). */

export type Release = {
  version: string;
  publishedAt: string;
  fileName: string;
  size: number;
  url: string;
};

/** Kho chứa bản cài của từng công cụ chạy trên máy. */
const RELEASE_REPOS: Record<string, { repo: string; asset: string }> = {
  "tach-ho-so": { repo: "daiyeusu/tach-ho-so-ban-cai", asset: "TachHoSo.exe" },
};

export async function latestRelease(slug: string): Promise<Release | null> {
  const src = RELEASE_REPOS[slug];
  if (!src) return null;
  try {
    const res = await fetch(`https://api.github.com/repos/${src.repo}/releases/latest`, {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "hop-cong-cu" },
      next: { revalidate: 600 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      tag_name: string;
      published_at: string;
      assets: { name: string; size: number; browser_download_url: string }[];
    };
    const asset = data.assets.find((a) => a.name === src.asset);
    if (!asset) return null;
    return {
      version: data.tag_name.replace(/^v/, ""),
      publishedAt: data.published_at,
      fileName: asset.name,
      size: asset.size,
      url: asset.browser_download_url,
    };
  } catch {
    return null;
  }
}

export function formatSize(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(0)} MB`;
}
