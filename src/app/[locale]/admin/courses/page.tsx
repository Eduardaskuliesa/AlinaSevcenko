import type { Metadata } from "next";
import { adminPageMetadata } from "@/app/lib/seo";
import React from "react";
import CoursePageWrapper from "./CoursePageWrapper";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return adminPageMetadata(locale, "courses");
}

export const dynamic = "force-static";

const CoursePage = () => {
  return (
    <div className="px-2 xl:p-6 space-y-6 max-w-7xl">
      <CoursePageWrapper />
    </div>
  );
};

export default CoursePage;
