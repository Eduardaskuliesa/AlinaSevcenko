// stores/coursePlayerStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { coursesAction } from "../actions/coursers";

interface CoursePlayerState {
  selectedLessonId: string | null;
  setSelectedLessonId: (lessonId: string) => void;
  updateSelectedLessonId: (
    courseId: string,
    userId: string,
    lessonId: string,
    lastWatchTime: number
  ) => Promise<void>;
}

export const useCoursePlayerStore = create<CoursePlayerState>()(
  persist(
    immer((set) => ({
      selectedLessonId: null,
      setSelectedLessonId: (lessonId) =>
        set((state) => {
          state.selectedLessonId = lessonId;
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
        set((state) => {
          state.selectedLessonId = lessonId;
        });
      },
    })),
    { name: "course-player-storage" }
  )
);
