import type { NextConfig } from "next";

/**
 * Web xuất ra trang tĩnh (thư mục out/) để đưa lên GitHub Pages.
 * BASE_PATH = "/web" khi chạy ở https://ksv-tools.github.io/web; "/" hoặc để trống khi có tên miền riêng.
 */
const basePath = (process.env.BASE_PATH ?? "").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: { unoptimized: true },
};

export default nextConfig;
