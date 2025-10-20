"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { enrolledCourseActions } from "@/app/actions/enrolled-course";
import { BackButton } from "./BackButton";

const LearningNavbar = ({
  courseId,
  userId,
}: {
  courseId: string;
  userId: string;
}) => {
  const { data: learningData, isFetching: courseLoading } = useQuery({
    queryKey: ["course-data", userId, courseId],
    queryFn: () => enrolledCourseActions.getLearningData(courseId, userId),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });

  return (
    <div className="bg-primary py-3 md:py-4 px-4 md:px-10 text-xl font-medium text-gray-50 border-b-gray-50 border-b">
      {courseLoading ? (
        <div className="h-10" />
      ) : (
        <div className="flex flex-col gap-3 md:flex-row-reverse md:items-center md:gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <h3 className="pr-0 sm:pr-4 sm:border-r-2 border-gray-50 truncate">
              Alina Savcenko
            </h3>
            <h3 className="truncate">{learningData?.course?.title}</h3>
          </div>
          <BackButton />
        </div>
      )}
    </div>
  );
};

export default LearningNavbar;
