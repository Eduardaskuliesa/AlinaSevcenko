"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { coursesAction } from "@/app/actions/coursers";
import DurationFilter from "./filters/DurationFilter";
import LanguageFilter from "./filters/LangugeFilter";
import CategoryFilter from "./filters/CategoryFilter";
import Image from "next/image";
import { convertTime } from "@/app/utils/converToMinutes";
import { Heart, ShoppingBag } from "lucide-react";
import CourseList from "./components/CourseGrid";

type FilterState = {
  durations: string[];
  languages: string[];
  categories: string[];
};

const CoursePageContent = () => {
  const [filters, setFilters] = useState<FilterState>({
    durations: [],
    languages: [],
    categories: [],
  });

  const { data: courseData, isLoading: isCourseLoading } = useQuery({
    queryKey: ["client-courses"],
    queryFn: () => coursesAction.courses.getAllCoursesUP(),
  });

  const coursesWithLowestPrices = courseData?.courses.map((course) => {
    const lowestPrice =
      course.accessPlans && course.accessPlans.length > 0
        ? course.accessPlans
            .map((plan) => plan?.price)
            .reduce((a, b) => Math.min(a, b), Infinity)
        : null;

    return {
      courseId: course.courseId,
      lowestPrice,
    };
  });

  console.log("Lowest Price:", coursesWithLowestPrices);

  const testCourse = courseData?.courses[0];
  const updateDurationFilter = (durations: string[]) => {
    setFilters((prev) => ({ ...prev, durations }));
  };

  const updateLanguageFilter = (languages: string[]) => {
    setFilters((prev) => ({ ...prev, languages }));
  };

  const updateCategoryFilter = (categories: string[]) => {
    setFilters((prev) => ({ ...prev, categories }));
  };

  return (
    <>
      <div className="max-w-7xl mx-auto pt-16">
        <div className="flex flex-row">
          <div className="w-[30%] p-4 flex flex-col h-[600px]">
            <DurationFilter
              selectedDurations={filters.durations}
              setSelectedDurations={updateDurationFilter}
            />
            <LanguageFilter
              selectedLanguages={filters.languages}
              setSelectedLanguages={updateLanguageFilter}
            />

            <CategoryFilter
              selectedCategories={filters.categories}
              setSelectedCategories={updateCategoryFilter}
            />
          </div>
          <div className="w-[70%] p-4 h-[650px]  overflow-y-auto">
            <CourseList
              courses={courseData?.courses}
              isLoading={isCourseLoading}
            ></CourseList>
          </div>
        </div>
      </div>
    </>
  );
};

export default CoursePageContent;
