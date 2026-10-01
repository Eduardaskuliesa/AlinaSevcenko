import type { Metadata } from "next";
import { adminPageMetadata } from "@/app/lib/seo";
import CourseSettingsClient from "./CourseSettingsClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return adminPageMetadata(locale, "settings");
}

export const dynamic = "force-static";

export default async function CourseSettingsPage() {
  return <CourseSettingsClient />;
}
