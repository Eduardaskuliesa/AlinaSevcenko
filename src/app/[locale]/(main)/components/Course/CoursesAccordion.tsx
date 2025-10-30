"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "@/i18n/navigation";
import type { FilteredCourse } from "@/app/types/course";
import { ChevronDown, BookOpen } from "lucide-react";
import { useState } from "react";

interface CoursesAccordionProps {
  lithuanianCourses: FilteredCourse[];
  russianCourses: FilteredCourse[];
  translations: {
    lithuanianCourses: string;
    russianCourses: string;
    noCourses: string;
  };
}

function CustomChevron({ isOpen }: { isOpen: boolean }) {
  return (
    <div
      className={`p-1 bg-secondary-light rounded-full transition-transform duration-300 ${
        isOpen ? "rotate-180" : ""
      }`}
    >
      <ChevronDown className="w-5 h-5" />
    </div>
  );
}

export default function CoursesAccordion({
  lithuanianCourses,
  russianCourses,
  translations,
}: CoursesAccordionProps) {
  const [openItem, setOpenItem] = useState<string>("");

  return (
    <Accordion
      onValueChange={setOpenItem}
      value={openItem}
      type="single"
      collapsible
      className="w-full"
    >
      {lithuanianCourses.length > 0 && (
        <AccordionItem value="lithuanian" className="border-none mb-4">
          <AccordionTrigger className="group px-6 py-4 rounded-xl bg-gradient-to-r from-secondary to-secondary/80 text-gray-800 font-semibold text-lg transition-all duration-300 hover:no-underline shadow-md hover:shadow-lg shadow-primary/80 hover:shadow-primary flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5" />
              <span>{translations.lithuanianCourses}</span>
            </div>
            <CustomChevron isOpen={openItem === "lithuanian"} />
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-2">
            <div className="space-y-3">
              {lithuanianCourses.map((course) => (
                <Link
                  key={course.courseId}
                  href={`/main-courses/${course.slug}`}
                  className="block px-5 py-3 bg-secondary-light hover:bg-secondary-light/80 shadow-sm shadow-primary border-2 border-primary/60 transition-all duration-300 rounded-lg group"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  {course.shortDescription && (
                    <p className="text-gray-800 text-base leading-relaxed line-clamp-2">
                      {course.shortDescription}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      )}

      {russianCourses.length > 0 && (
        <AccordionItem value="russian" className="border-none">
          <AccordionTrigger className="group px-6 py-4 rounded-xl bg-gradient-to-r from-secondary to-secondary/80 text-gray-800 font-semibold text-lg transition-all duration-300 hover:no-underline shadow-md hover:shadow-lg shadow-primary/80 hover:shadow-primary flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5" />
              <span>{translations.russianCourses}</span>
            </div>
            <CustomChevron isOpen={openItem === "russian"} />
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-2">
            <div className="space-y-3">
              {russianCourses.map((course) => (
                <Link
                  key={course.courseId}
                  href={`/courses/${course.slug}`}
                  className="block px-5 py-3 bg-secondary-light hover:bg-secondary-light/80 shadow-sm shadow-primary border-2 border-primary/60 transition-all duration-300 rounded-lg group"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  {course.shortDescription && (
                    <p className="text-gray-800 text-base leading-relaxed line-clamp-2">
                      {course.shortDescription}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
}
