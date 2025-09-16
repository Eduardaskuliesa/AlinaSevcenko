/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { coursesAction } from "@/app/actions/coursers";
import { enrolledCourseActions } from "@/app/actions/enrolled-course";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import LessonList from "./LessonList";
import { useCoursePlayerStore } from "@/app/store/useCoursePlayerStore";

interface CoursePlayerPageClient {
  courseId?: string;
  userId: string | undefined;
}

const CoursePlayerPageClient = ({
  courseId,
  userId,
}: CoursePlayerPageClient) => {
  const { selectedLessonId, setSelectedLessonId, updateSelectedLessonId } =
    useCoursePlayerStore();
  const { data: learningData } = useQuery({
    queryKey: ["learning-course-data", userId, courseId],
    queryFn: () =>
      enrolledCourseActions.getLearningData(
        courseId as string,
        userId as string
      ),
  });

  useEffect(() => {
    const loadLastWatchedLesson = async () => {
      if (!learningData?.lessons?.[0]?.lessonId || !courseId || !userId) {
        return;
      }
      if (learningData?.course?.lastLessonId === null) {
        await coursesAction.courses.updateLastPlayedLesson(
          courseId,
          userId,
          learningData.lessons[0].lessonId,
          0
        );
        setSelectedLessonId(learningData.lessons[0].lessonId);
      }
      if (learningData?.course?.lastLessonId) {
        setSelectedLessonId(learningData.course.lastLessonId);
      }
    };

    loadLastWatchedLesson();
  }, [
    learningData?.course?.lastLessonId,
    courseId,
    userId,
    learningData?.lessons,
    setSelectedLessonId,
  ]);

  useEffect(() => {
    const updateLastWatchedTime = async () => {
      if (!learningData?.course?.lastLessonId || !courseId || !userId) {
        return;
      }
      await coursesAction.courses.updateLastWatchedTime(courseId, userId);
    };

    updateLastWatchedTime();
  }, [courseId, userId]);

  const playbackId = learningData?.lessons?.find((lesson) => {
    return lesson.lessonId === learningData?.course?.lastLessonId;
  })?.playbackId;
  
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
    <div className="text-gray-50 h-[calc(100vh-64px)]">
      <div className="flex flex-row h-full ">
        <div className="w-full bg-blue-50"></div>
        <LessonList
          lessons={learningData?.lessons || []}
          currentLessonId={selectedLessonId || undefined}
          onLessonSelect={(lessonId) => {
            setSelectedLessonId(lessonId);
            updateSelectedLessonId(
              courseId as string,
              userId as string,
              lessonId,
              0
            );
          }}
        />
      </div>
    </div>
  );
};

export default CoursePlayerPageClient;
