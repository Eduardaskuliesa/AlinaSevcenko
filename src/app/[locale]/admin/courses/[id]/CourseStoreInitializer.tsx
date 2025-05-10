"use client";

import { useLessonStore } from "@/app/store/useLessonStore";
import { useEffect } from "react";

interface CourseStoreInitializerProps {
  courseId: string;
}

export default function CourseStoreInitializer({
  courseId,
}: CourseStoreInitializerProps) {
  const { fetchLessons } = useLessonStore();

  useEffect(() => {
    if (courseId) {
      fetchLessons(courseId);
    }
  }, [courseId, fetchLessons]);

  return null;
}
