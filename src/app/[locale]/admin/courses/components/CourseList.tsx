"use client";
import React from "react";
import CourseCard from "./CourseCard";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { coursesAction } from "@/app/actions/coursers";
import { CourseCardSkeleton } from "./CourseCardSkeleton";

interface CourseListProps {
  filters: {
    search: string;
    categoryId: string;
  };
  coursesQuery: UseQueryResult;
}

const CourseList = ({ filters }: CourseListProps) => {
  const { data, isLoading: isFetching } = useQuery({
    queryKey: ["courses"],
    queryFn: () => coursesAction.courses.getCourses(),
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  });

  const courses = data?.courses || [];

  const filteredCourses = courses.filter((course) => {
    const searchTerm = filters.search.toLowerCase().trim();
    let matchesSearch = true;

    if (searchTerm) {
      const title = course.title.toLowerCase();
      const words = title.split(/\s+/);
      const searchWords = searchTerm.split(/\s+/);

      matchesSearch = searchWords.some(
        (searchWord) =>
          title.includes(searchWord) ||
          words.some(
            (word) =>
              word.includes(searchWord) ||
              // Fuzzy - allow one character difference
              (searchWord.length > 3 &&
                word.length > 3 &&
                (word.includes(
                  searchWord.substring(0, searchWord.length - 1)
                ) ||
                  searchWord.includes(word.substring(0, word.length - 1))))
          )
      );
    }

    const matchesCategory =
      filters.categoryId === "all" ||
      course.categories?.some((cat) => cat.categoryId === filters.categoryId);

    return matchesSearch && matchesCategory;
  });

  if (isFetching) {
    return (
      <div className="grid sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <CourseCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (filteredCourses.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-medium mb-2">No courses found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
      {filteredCourses.map((course) => (
        <CourseCard key={course.courseId} course={course} />
      ))}
    </div>
  );
};

export default CourseList;
