import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // basePath/assetPrefix: only set in production so `npm run dev` works at localhost:3000/
  basePath: isProd ? "/rvlt-designlanguage/preview-v2" : "",
  assetPrefix: isProd ? "/rvlt-designlanguage/preview-v2" : "",
};

export default nextConfig;
