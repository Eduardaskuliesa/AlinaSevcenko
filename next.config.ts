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
};

export default withNextIntl(nextConfig);
