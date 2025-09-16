"use client";
import { enrolledCourseActions } from "@/app/actions/enrolled-course";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import CourseLayout from "./CourseLayout";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";

const MyLearningPage = () => {
  const userId = useSession().data?.user.id;

  const { data, isLoading } = useQuery({
    queryKey: ["user-client-courses"],
    queryFn: () => enrolledCourseActions.getUsersCourses(userId as string),
    enabled: !!userId,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
  });

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center">
          <Loader className="animate-spin r"></Loader>
        </div>
      ) : (
        <>
          {data?.cousre?.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              You have not enrolled in any courses yet.
            </div>
          ) : (
            <CourseLayout courseData={data?.cousre || []} />
          )}
        </>
      )}
    </div>
  );
};

export default MyLearningPage;
