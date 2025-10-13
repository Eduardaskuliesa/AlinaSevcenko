import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { coursesAction } from "../actions/coursers";

interface LessonProgress {
  progress: number;
  completed: boolean;
}

interface CoursePlayerState {
  selectedLessonId: string | null;
  allLessonsIds: string[];
  isLessonChanging?: boolean;
  lessonProgressMap: Record<string, LessonProgress>;

  setAllLesonsIds: (lessonIds: string[]) => void;
  setSelectedLessonId: (lessonId: string) => void;
  setIsLessonChanging: (changing: boolean) => void;
  updateSelectedLessonId: (
    courseId: string,
    userId: string,
    lessonId: string,
    lastWatchTime: number
  ) => Promise<void>;
  updateLessonProgress: (
    lessonId: string,
    progress: number,
    completed: boolean
  ) => void;
  nextLesson: (courseId: string, userId: string) => void;
  previousLesson: (courseId: string, userId: string) => void;
}

export const useCoursePlayerStore = create<CoursePlayerState>()(
  persist(
    immer((set) => ({
      selectedLessonId: null,
      allLessonsIds: [],
      lessonProgressMap: {},

      setAllLesonsIds: (lessonsIds) => {
        set((state) => {
          state.allLessonsIds = lessonsIds;
        });
      },

      setSelectedLessonId: (lessonId) =>
        set((state) => {
          state.selectedLessonId = lessonId;
        }),

      setIsLessonChanging: (changing) =>
        set((state) => {
          state.isLessonChanging = changing;
        }),

      updateLessonProgress: (lessonId, progress, completed) =>
        set((state) => {
          const currentProgress =
            state.lessonProgressMap[lessonId]?.progress || 0;

          if (progress > currentProgress) {
            state.lessonProgressMap[lessonId] = {
              progress,
              completed,
            };
          }
        }),

      updateSelectedLessonId: async (
        courseId,
        userId,
        lessonId,
        lastWatchTime
      ) => {
        await coursesAction.courses.updateLastPlayedLesson(
          courseId,
          userId,
          lessonId,
          lastWatchTime
        );
      },

      nextLesson: (courseId: string, userId: string) =>
        set((state) => {
          const currentIndex = state.allLessonsIds.indexOf(
            state.selectedLessonId || ""
          );
          if (
            currentIndex !== -1 &&
            currentIndex < state.allLessonsIds.length - 1
          ) {
            const nextLessonId = state.allLessonsIds[currentIndex + 1];
            state.selectedLessonId = nextLessonId;
            coursesAction.courses.updateLastPlayedLesson(
              courseId,
              userId,
              nextLessonId,
              0
            );
          }
        }),

      previousLesson: (courseId: string, userId: string) =>
        set((state) => {
          const currentIndex = state.allLessonsIds.indexOf(
            state.selectedLessonId || ""
          );
          if (currentIndex > 0) {
            const prevLessonId = state.allLessonsIds[currentIndex - 1];
            state.selectedLessonId = prevLessonId;

            coursesAction.courses.updateLastPlayedLesson(
              courseId,
              userId,
              prevLessonId,
              0
            );
          }
        }),
    })),
    {
      name: "course-player-storage",
      partialize: (state) => ({
        selectedLessonId: state.selectedLessonId,
        lessonProgressMap: state.lessonProgressMap,
      }),
    }
  )
);
