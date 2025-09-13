"use client";
import React, { useDeferredValue, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { coursesAction } from "@/app/actions/coursers";
import DurationFilter from "./filters/DurationFilter";
import LanguageFilter from "./filters/LangugeFilter";
import CategoryFilter from "./filters/CategoryFilter";

import CourseList from "./components/CourseGrid";
import { FilteredCourse } from "@/app/types/course";
import { Input } from "@/components/ui/input";
import { Loader, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import QuickCategoryBar from "./components/QuickCategoryBar";

type FilterState = {
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

  const { data: courseData, isFetching: isCourseLoading } = useQuery({
    queryKey: ["client-courses"],
    queryFn: coursesAction.courses.getAllCoursesUP,
  });

  console.log("courseData", courseData?.courses);


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

  return (
    <>
      <QuickCategoryBar
        selectedCategories={filters.categories}
        setSelectedCategories={updateCategoryFilter}
      ></QuickCategoryBar>
      <div className="max-w-7xl mx-auto pt-10">
        <div className="flex flex-row">
          <div className="w-[30%] px-4">
            <Button
              className="cursor-pointer"
              onClick={clearFitlers}
              variant={"outline"}
            >
              Clear filters
            </Button>
          </div>
          <div className="w-[70%] flex justify-between px-4">
            <div className="relative w-1/2 flex items-center">
              <Search className="absolute left-3 text-gray-400" />
              <Input
                className="border-2 h-10 border-primary-light/60 pl-10"
                placeholder="Search courses by title or category..."
                value={filters.searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="text-gray-800">
              {isCourseLoading ? (
                <Loader className="h-5 w-5 animate-spin"></Loader>
              ) : (
                <span>{`Filtered Courses: ${
                  filteredCourses.length || 0
                }`}</span>
              )}
            </div>
          </div>
        </div>
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
          <div className="w-[70%] p-4 h-[650px] overflow-y-auto">
            <CourseList courses={filteredCourses} isLoading={isCourseLoading} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CoursePageContent;
