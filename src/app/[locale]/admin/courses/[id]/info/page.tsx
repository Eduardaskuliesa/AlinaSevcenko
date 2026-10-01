import type { Metadata } from "next";
import { adminPageMetadata } from "@/app/lib/seo";
import ClientInfoPage from "./ClientInfoPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return adminPageMetadata(locale, "info");
}

export const dynamic = "force-static";

export default async function CourseSettingsPage() {
  return <ClientInfoPage />;
}
