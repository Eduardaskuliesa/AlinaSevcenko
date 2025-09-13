"use client";
import { coursesAction } from "@/app/actions/coursers";
import { enrolledCourseActions } from "@/app/actions/enrolled-course";
import { getOrGenerateTokens } from "@/app/utils/media-tokens";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

interface CoursePlayerPageClient {
  courseId?: string;
  userId: string | undefined;
}

const CoursePlayerPageClient = ({
  courseId,
  userId,
}: CoursePlayerPageClient) => {
  const [tokens, setTokens] = useState<{
    thumbnailToken: string;
    playbackToken: string;
    storyboardToken: string;
  } | null>(null);
  const [isTokensLoading, setIsTokensLoading] = useState(false);

  // console.log("enrolledCourseData", enrolledCourseData);

  const { data: learningData } = useQuery({
    queryKey: ["learning-course-data", courseId, userId],
    queryFn: () =>
      enrolledCourseActions.getLearningData(
        courseId as string,
        userId as string
      ),
  });
  console.log("learningDataLessons", learningData?.lessons);
  console.log("learningDataCourse", learningData?.course);
  // const lastLessonPlayebackId = lessonsData?.filter(
  //   (lesson) => lesson.lessonId === enrolledCourseData?.cousre?.lastLessonId
  // )[0].playbackId || "";
  // console.log("lastLessonPlayebackId", lastLessonPlayebackId);

  // useEffect(() => {
  //   const loadTokens = async () => {
  //     if (playbackId) {
  //       setIsTokensLoading(true);
  //       try {
  //         const fetchedTokens = await getOrGenerateTokens(playbackId);
  //         setTokens(fetchedTokens);
  //       } catch (error) {
  //         console.error("Error loading tokens:", error);
  //         setTokens(null);
  //       } finally {
  //         setIsTokensLoading(false);
  //       }
  //     }
  //   };

  //   loadTokens();
  // });
  return (
    <div className="text-gray-50">
      {courseId}, {userId}
    </div>
  );
};

export default CoursePlayerPageClient;
