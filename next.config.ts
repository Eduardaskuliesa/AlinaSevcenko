import type { NextConfig } from "next";
import createNextIntilPlugin from "next-intl/plugin";


const withNextIntl = createNextIntilPlugin()

const nextConfig: NextConfig = {
  /* config options here */
};

export default withNextIntl(nextConfig);
