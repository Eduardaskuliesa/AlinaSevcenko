import { withNextVideo } from "next-video/process";
import type { NextConfig } from "next";
import createNextIntilPlugin from "next-intl/plugin";

const withNextIntl = createNextIntilPlugin();

const nextConfig: NextConfig = {
  /* config options here */

  experimental: {
    viewTransition: true,
  },
  images: {
    domains: ["d1qu0ys0a2oc3d.cloudfront.net", "flagcdn.com"],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];

      config.externals.push("sharp");
    }
    return config;
  },
};

export default withNextVideo(withNextIntl(nextConfig), { folder: "no" });
