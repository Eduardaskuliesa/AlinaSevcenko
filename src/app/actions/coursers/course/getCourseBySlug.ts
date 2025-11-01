"use server";
import { getSlugs } from "./getSlugs";
import { getCourseClient } from "./getCourseClient";

export async function getCourseBySlug(slug: string) {
  const slugsData = await getSlugs();

  const matchedSlug = slugsData?.slugs?.find((s) => s.slug === slug);

  if (!matchedSlug?.courseId) {
    return null;
  }

  const courseResponse = await getCourseClient(matchedSlug.courseId);

  return courseResponse.course;
}
