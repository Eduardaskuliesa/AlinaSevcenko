import type { Metadata } from "next";
import { pageMetadata } from "@/app/lib/seo";
import React from "react";
import WishlistWrapper from "./componets/WishlistWrapper";
import PageWrapper from "../../components/PageWrapper";
import Navigation from "../components/Navigation";
import { getTranslations } from "next-intl/server";

const WishlistPage = async () => {
  const t = await getTranslations("MyCourses.WishlistPage");

  return (
    <>
      <header className="h-auto bg-primary w-full flex">
        <div className="max-w-4xl px-4 md:px-2 w-full mx-auto">
          <h1 className="text-4xl mb-[1rem] xs:text-5xl font-times mt-8 xs:mb-[1.5rem] font-semibold text-gray-100">
            {t("title")}
          </h1>
          <Navigation />
        </div>
      </header>
      <PageWrapper>
        <WishlistWrapper />
      </PageWrapper>
    </>
  );
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({ locale, page: "wishlist", path: "/my-courses/wishlist", index: false });
}

export default WishlistPage;
