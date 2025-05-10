"use client";
import React, { useState } from "react";
import PageHeading from "./components/PageHeading";
import CourseList from "./components/CourseList";
import { useQuery } from "@tanstack/react-query";
import { coursesAction } from "@/app/actions/coursers";

const CoursePageWrapper = () => {
  const [filters, setFilters] = useState({
    search: "",
    categoryId: "all",
  });

  const coursesQuery = useQuery({
    queryKey: ["courses"],
    queryFn: () => coursesAction.courses.getCourses(),
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  });
  return (
    <>
      <PageHeading
        filters={filters}
        onFilterChange={setFilters}
        isLoadingCourses={coursesQuery.isFetching}
      />
      <CourseList filters={filters} coursesQuery={coursesQuery} />
    </>
  );
};

export default CoursePageWrapper;
