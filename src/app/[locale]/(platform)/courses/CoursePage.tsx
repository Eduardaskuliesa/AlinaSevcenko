"use client";
import React, { useDeferredValue, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { coursesAction } from "@/app/actions/coursers";
import CourseList from "./components/CourseGrid";
import { FilteredCourse } from "@/app/types/course";
import QuickCategoryBar from "./components/QuickCategoryBar";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import SearchBar from "./components/SearchBar";
import Filter from "./components/Filter";

export type FilterState = {
  durations: string[];
  languages: string[];
  categories: string[];
  searchTerm: string;
};

const CoursePageContent = () => {
  const [filters, setFilters] = useState<FilterState>({
    durations: [],
    languages: [],
    categories: [],
    searchTerm: "",
  });

  const searchParams = useSearchParams();
  const router = useRouter();

  const { data: courseData, isLoading: isCourseLoading } = useQuery({
    queryKey: ["client-courses"],
    queryFn: coursesAction.courses.getAllCoursesUP,
  });

  const clearFitlers = () => {
    setFilters({
      durations: [],
      languages: [],
      categories: [],
      searchTerm: "",
    });
  };

  const deferredFilters = useDeferredValue(filters);

  const updateDurationFilter = (durations: string[]) => {
    setFilters((prev) => ({ ...prev, durations }));
  };

  const updateLanguageFilter = (languages: string[]) => {
    setFilters((prev) => ({ ...prev, languages }));
  };

  const updateCategoryFilter = (categories: string[]) => {
    setFilters((prev) => ({ ...prev, categories }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, searchTerm: e.target.value }));
  };

  const getDurationKey = (durationSeconds: number): string => {
    const hours = durationSeconds / 3600;
    if (hours <= 1) return "0-1 hour";
    if (hours <= 3) return "1-3 hours";
    if (hours <= 6) return "3-6 hours";
    if (hours <= 10) return "5-10 hours";
    return "5-10 hours";
  };

  const fuzzyMatch = (text: string, searchTerm: string): boolean => {
    if (!searchTerm) return true;

    const normalizedText = text.toLowerCase();
    const normalizedSearch = searchTerm.toLowerCase();

    return normalizedText.includes(normalizedSearch);
  };

  const filteredCourses = React.useMemo(() => {
    if (!courseData?.courses || courseData.courses.length === 0) {
      return [];
    }

    return courseData.courses.filter((course: FilteredCourse) => {
      if (deferredFilters.searchTerm.trim()) {
        const titleMatches = fuzzyMatch(
          course.title,
          deferredFilters.searchTerm
        );
        const categoryMatches = course.categories.some((cat) =>
          fuzzyMatch(cat.title, deferredFilters.searchTerm)
        );

        if (!titleMatches && !categoryMatches) {
          return false;
        }
      }

      if (deferredFilters.durations.length > 0) {
        const durationKey = getDurationKey(course.duration);
        if (!deferredFilters.durations.includes(durationKey)) {
          return false;
        }
      }

      if (
        deferredFilters.languages.length > 0 &&
        !deferredFilters.languages.includes(course.language)
      ) {
        return false;
      }

      if (deferredFilters.categories.length > 0) {
        const courseCategories = course.categories.map((cat) => cat.categoryId);
        const hasMatchingCategory = deferredFilters.categories.some(
          (categoryId) => courseCategories.includes(categoryId)
        );
        if (!hasMatchingCategory) {
          return false;
        }
      }

      return true;
    });
  }, [courseData?.courses, deferredFilters]);

  useEffect(() => {
    if (searchParams.get("error") === "course-not-available") {
      toast.error("This course is not currently available");
      router.replace("/lt/courses");
    }
  }, [searchParams, router]);

  return (
    <>
      <QuickCategoryBar
        selectedCategories={filters.categories}
        setSelectedCategories={updateCategoryFilter}
      />
      <div className="max-w-7xl mx-auto pt-4 md:pt-10">
        <SearchBar
          clearFitlers={clearFitlers}
          filters={filters}
          isCourseLoading={isCourseLoading}
          handleSearchChange={handleSearchChange}
          filteredCourselength={filteredCourses.length}
        />
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-[30%] sticky top-0 z-10 lg:block lg:px-2 lg:pt-2 md:p-4 flex flex-col lg:h-[600px]">
            <Filter
              clearFitlers={clearFitlers}
              filters={filters}
              updateCategoryFilter={updateCategoryFilter}
              updateDurationFilter={updateDurationFilter}
              updateLanguageFilter={updateLanguageFilter}
            />
          </div>
          <div className="w-full lg:w-[70%] pb-6 lg:p-4 lg:h-[650px] overflow-y-auto">
            <CourseList courses={filteredCourses} isLoading={isCourseLoading} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CoursePageContent;
