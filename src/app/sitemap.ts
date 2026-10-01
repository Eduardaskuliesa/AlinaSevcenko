import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getAppUrl } from "./lib/appUrl";

const STATIC_PATHS = ["", "/courses", "/contact", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getAppUrl();

  return STATIC_PATHS.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${base}/${locale}${path}`,
      changeFrequency: path === "" || path === "/courses" ? "weekly" : "yearly",
      priority: path === "" ? 1 : path === "/courses" ? 0.9 : 0.5,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${base}/${l}${path}`])
        ),
      },
    }))
  );
}
