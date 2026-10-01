import type { MetadataRoute } from "next";
import { getAppUrl } from "./lib/appUrl";

export default function robots(): MetadataRoute.Robots {
  const base = getAppUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/*/admin",
        "/*/cart",
        "/*/checkout",
        "/*/my-courses",
        "/*/user",
        "/*/learn",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
