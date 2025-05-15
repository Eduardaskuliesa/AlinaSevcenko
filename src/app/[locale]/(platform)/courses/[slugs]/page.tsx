import { getCourseClient } from "@/app/actions/coursers/course/getCourseClient";
import { getSlugs } from "@/app/actions/coursers/course/getSlugs";

export const dynamicParams = false;
export const revalidate = 72000; // 20 hours revalidation

export async function generateStaticParams() {
  const slugsData = await getSlugs();
  const locales = ["lt", "ru"];

  const paths = [];

  for (const locale of locales) {
    for (const slug of slugsData?.slugs || []) {
      paths.push({
        locale,
        slugs: slug.slug,
      });
    }
  }

  return paths;
}

export default async function CourseIdPage({
  params,
}: {
  params: Promise<{ locale: string; slugs: string }>;
}) {
  const { slugs } = await params;

  const slugsData = await getSlugs();
  const matchedSlug = slugsData?.slugs?.find((slug) => slug.slug === slugs);
  const courseResponse = await getCourseClient(matchedSlug?.courseId as string);
  const course = courseResponse.course;
  const timestamp = Date().toString();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{course?.title}</h1>
      <p className="text-lg">{timestamp}</p>
      <p>{course?.description}</p>
    </div>
  );
}
