import type { NextConfig } from "next";
import createNextIntilPlugin from "next-intl/plugin";

const withNextIntl = createNextIntilPlugin();

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    viewTransition: true,
  },
};

export default withNextIntl(nextConfig);
