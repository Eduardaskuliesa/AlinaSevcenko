import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getAppUrl } from "./appUrl";

export type SeoPage =
  | "home"
  | "courses"
  | "contact"
  | "login"
  | "register"
  | "forgotPassword"
  | "resetPassword"
  | "verifyEmail"
  | "cart"
  | "checkout"
  | "checkoutSuccess"
  | "myCourses"
  | "wishlist"
  | "profile"
  | "learn";

const OG_LOCALE: Record<string, string> = { lt: "lt_LT", ru: "ru_RU" };

/** Localized page metadata with canonical URL and LT/RU alternates. */
export async function pageMetadata({
  locale,
  page,
  path = "",
  index = true,
}: {
  locale: string;
  page: SeoPage;
  path?: string;
  index?: boolean;
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Seo" });
  const title = t(`${page}.title`);
  const description = t(`${page}.description`);
  const url = `/${locale}${path}`;

  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `/${l}${path}`])
  );

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { ...languages, "x-default": `/${routing.defaultLocale}${path}` },
    },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: t("site.name"),
      locale: OG_LOCALE[locale] ?? OG_LOCALE.lt,
      alternateLocale: Object.entries(OG_LOCALE)
        .filter(([l]) => l !== locale)
        .map(([, v]) => v),
      images: [{ url: "/AlinaPhoto.jpg", alt: t("site.name") }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/AlinaPhoto.jpg"],
    },
  };
}

/** Defaults for the whole site: title template, base URL, description. */
export async function rootMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Seo" });
  return {
    metadataBase: new URL(getAppUrl()),
    title: {
      default: t("site.defaultTitle"),
      template: `%s | ${t("site.name")}`,
    },
    description: t("site.description"),
    applicationName: t("site.name"),
    authors: [{ name: t("site.name") }],
    openGraph: {
      type: "website",
      siteName: t("site.name"),
      locale: OG_LOCALE[locale] ?? OG_LOCALE.lt,
      images: [{ url: "/AlinaPhoto.jpg", alt: t("site.name") }],
    },
  };
}

export type AdminSeoPage =
  | "courses"
  | "createCourse"
  | "categories"
  | "info"
  | "lessons"
  | "seo"
  | "settings"
  | "editor";

export async function adminPageMetadata(
  locale: string,
  page: AdminSeoPage
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "AdminSeo" });
  return { title: t(page) };
}
