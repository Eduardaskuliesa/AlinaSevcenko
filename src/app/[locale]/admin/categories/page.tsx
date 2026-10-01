import type { Metadata } from "next";
import { adminPageMetadata } from "@/app/lib/seo";
import { categoryActions } from "@/app/actions/category";
import { getQueryClient } from "@/app/lib/getQueryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import CategoryPage from "./CategoryPage";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return adminPageMetadata(locale, "categories");
}

export const dynamic = "force-static";


export default async function Page() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["categories"],
    queryFn: () => categoryActions.getCategories(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CategoryPage />
    </HydrationBoundary>
  );
}
