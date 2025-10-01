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
  const { data: learningData, isLoading: courseLoading } = useQuery({
    queryKey: ["learning-course-data", userId, courseId],
    queryFn: () => enrolledCourseActions.getLearningData(courseId, userId),
  });

  return (
    <div className="bg-primary py-4 px-10 text-xl font-medium text-gray-50 border-b-gray-50 border-b">
      {courseLoading ? (
        <div className="h-10" />
      ) : (
        <div className="flex items-center gap-6">
          <BackButton />
          <div className="flex items-center gap-4">
            <h3 className="pr-4 border-r-2 border-gray-50">Alina Savcenko</h3>
            <h3>{learningData?.course?.title}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(LearningNavbar);
