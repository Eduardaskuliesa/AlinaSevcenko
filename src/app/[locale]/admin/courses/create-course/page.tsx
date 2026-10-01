import type { Metadata } from "next";
import { adminPageMetadata } from "@/app/lib/seo";
import CreateCourseForm from "./CreateCourseForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return adminPageMetadata(locale, "createCourse");
}

export const dynamic = "force-static";

export default function CreateCourseServerPage() {
  return (
    <div className="px-2 lg:p-6 space-y-6 max-w-7xl mx-auto">
      <CreateCourseForm />
    </div>
  );
}
