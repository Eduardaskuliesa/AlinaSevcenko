"use client";
import { useParams } from "next/navigation";

export const useGetCourseId = () => {
  const params = useParams();
  const courseId = params.id as string;
  return {
    courseId,
  };
};
