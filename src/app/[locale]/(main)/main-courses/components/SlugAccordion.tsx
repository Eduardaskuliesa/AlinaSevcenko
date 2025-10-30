"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronDown, FileText, BookOpen } from "lucide-react";
import { useState } from "react";
import type { Course, Lesson } from "@/app/types/course"; // Adjust types as needed
import LessonContent from "@/app/[locale]/(platform)/courses/components/LessonContent";
import LessonDescription from "@/app/[locale]/(platform)/courses/components/LessonDescription";

interface CourseAccordionProps {
  courseData: Course;
  courseLessons: Lesson[];
}

function CustomChevron({ isOpen }: { isOpen: boolean }) {
  return (
    <div
      className={`p-1 bg-primary rounded-full transition-transform duration-300 ${
        isOpen ? "rotate-180" : ""
      }`}
    >
      <ChevronDown className="w-5 h-5" />
    </div>
  );
}

export default function CourseAccordion({
  courseData,
  courseLessons,
}: CourseAccordionProps) {
  const [openItem, setOpenItem] = useState<string>("");

  return (
    <Accordion
      onValueChange={setOpenItem}
      value={openItem}
      type="single"
      collapsible
      className="w-full"
    >
      <AccordionItem value="description" className="border-none mb-4 mt-4">
        <AccordionTrigger className="group px-6 py-4 rounded-xl bg-primary-light text-gray-800 font-semibold text-lg transition-all duration-300 hover:no-underline shadow-md  shadow-primary/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5" />
            <span>Course Description</span>
          </div>
          <CustomChevron isOpen={openItem === "description"} />
        </AccordionTrigger>
        <AccordionContent className="">
          <LessonDescription courseData={courseData} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="content" className="border-none">
        <AccordionTrigger className="group px-6 py-4 rounded-xl bg-primary-light  text-gray-800 font-semibold text-lg transition-all duration-300 hover:no-underline shadow-md  shadow-primary/80  flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5" />
            <span>Course Content</span>
          </div>
          <CustomChevron isOpen={openItem === "content"} />
        </AccordionTrigger>
        <AccordionContent className="">
          <LessonContent courseLessons={courseLessons} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
