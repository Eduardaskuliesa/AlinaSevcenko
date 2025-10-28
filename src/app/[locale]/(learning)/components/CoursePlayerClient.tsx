/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { coursesAction } from "@/app/actions/coursers";
import { enrolledCourseActions } from "@/app/actions/enrolled-course";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import LessonList from "./LessonList";
import { useCoursePlayerStore } from "@/app/store/useCoursePlayerStore";
import LearningPlayer from "./LearningPlayer";

interface CoursePlayerPageClient {
  courseId?: string;
  userId: string | undefined;
}

const CoursePlayerPageClient = ({
  courseId,
  userId,
}: CoursePlayerPageClient) => {
  const queryClient = useQueryClient();
  const [useLessonProgress, setUseLessonProgress] = useState({});
  const { selectedLessonId, setSelectedLessonId, setAllLesonsIds } =
    useCoursePlayerStore();
  const { data: learningData, isLoading: learningDataLoading } = useQuery({
    queryKey: ["learning-course-data", userId, courseId],
    queryFn: () =>
      enrolledCourseActions.getLearningData(
        courseId as string,
        userId as string
      ),
  });

  const { data: lessonProgress, isLoading } = useQuery({
    queryKey: ["lesson-progress", userId, courseId],
    queryFn: () =>
      enrolledCourseActions.getLessonProgress(
        userId as string,
        courseId as string
      ),
  });

  useEffect(() => {
    if (lessonProgress && !isLoading) {
      setUseLessonProgress(lessonProgress);
    }
  }, [learningData?.course.lessonProgress, isLoading]);

  useEffect(() => {
    if (learningData?.needsSync) {
      enrolledCourseActions
        .syncCourseAction(courseId || "", userId || "")
        .then(() => {
          queryClient.invalidateQueries({
            queryKey: ["learning-course-data", userId, courseId],
          });
        });
    }
  }, [learningData?.needsSync, courseId, userId, queryClient]);

  useEffect(() => {
    console.log(selectedLessonId);
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
    if (learningData?.lessons) {
      const lessonIds = learningData.lessons.map((lesson) => lesson.lessonId);
      setAllLesonsIds(lessonIds);
    }
  }, [learningData?.lessons, setAllLesonsIds]);

  useEffect(() => {
    const updateLastWatchedTime = async () => {
      if (!learningData?.course?.lastLessonId || !courseId || !userId) {
        return;
      }
      await coursesAction.courses.updateLastWatchedTime(courseId, userId);
    };

    updateLastWatchedTime();
  }, [courseId, userId]);

  const currentLesson = learningData?.lessons?.find((lesson) => {
    return lesson.lessonId === selectedLessonId;
  });

  return (
    <div className="text-gray-50 bg-gray-50 ">
      <div className="flex flex-col xl:flex-row xl:h-[calc(100vh-73px)]">
        <div className="flex-1">
          {learningDataLoading ? (
            <div className="bg-black w-full h-[calc(100vh-73px)] flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-gray-600 border-t-white rounded-full animate-spin mb-4" />
            </div>
          ) : (
            <LearningPlayer
              setUseLessonProgress={setUseLessonProgress || {}}
              localLessonProgress={useLessonProgress}
              lessonProgress={lessonProgress || {}}
              userId={userId as string}
              courseId={courseId as string}
              currentLesson={currentLesson}
            />
          )}
        </div>
        <LessonList
          lessonProgress={useLessonProgress}
          userId={userId as string}
          courseId={courseId as string}
          lessons={learningData?.lessons || []}
        />
      </div>
    </div>
  );
};

export default CoursePlayerPageClient;
