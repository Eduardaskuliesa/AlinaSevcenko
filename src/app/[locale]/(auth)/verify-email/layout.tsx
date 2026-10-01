import type { Metadata } from "next";
import { pageMetadata } from "@/app/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({ locale, page: "verifyEmail", path: "/verify-email", index: false });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
