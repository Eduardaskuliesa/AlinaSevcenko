"use client";
import { enrolledCourseActions } from "@/app/actions/enrolled-course";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import CourseLayout from "./CourseLayout";

interface MyLearningPagepProps {
  userId: string | null;
}

const MyLearningPage = ({ userId }: MyLearningPagepProps) => {
  const { data } = useQuery({
    queryKey: ["user-client-courses"],
    queryFn: () => enrolledCourseActions.getUsersCourses(userId as string),
  });

  console.log("MyLearningPage data", data);
  return (
    <div>
      <CourseLayout courseData={data?.cousre || []} />
    </div>
  );
};

export default MyLearningPage;
