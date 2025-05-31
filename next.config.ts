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
    domains: ["d1qu0ys0a2oc3d.cloudfront.net"],
  },
  env: {
    CLOUDFLARE_STREAM_TOKEN: process.env.CLOUDFLARE_STREAM_TOKEN,
    CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
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
