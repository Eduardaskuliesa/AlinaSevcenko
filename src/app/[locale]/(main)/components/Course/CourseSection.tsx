import { coursesAction } from "@/app/actions/coursers";
import React from "react";
import { getTranslations } from "next-intl/server";
import CoursesAccordion from "./CoursesAccordion";

const CourseSection = async ({
  locale,
}: {
  locale: string;
}) => {
  const courses = await coursesAction.courses.getAllCoursesUP();
  const t = await getTranslations({ locale, namespace: "HomePage" });

  const lithuanianCourses = courses.courses.filter(
    (course) => course.language === "lt"
  );

  const russianCourses = courses.courses.filter(
    (course) => course.language === "ru"
  );

  if (lithuanianCourses.length === 0 && russianCourses.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-times leading-relaxed text-gray-950 text-center">
        {t("coursesTitle")}
      </h2>
      <CoursesAccordion
        lithuanianCourses={lithuanianCourses}
        russianCourses={russianCourses}
        translations={{
          lithuanianCourses: t("lithuanianCourses"),
          russianCourses: t("russianCourses"),
          noCourses: t("noCourses"),
        }}
      />
    </section>
  );
};

export default CourseSection;
