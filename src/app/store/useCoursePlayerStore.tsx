// stores/coursePlayerStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface CoursePlayerState {
  selectedLessonId: string | null;
  setSelectedLessonId: (lessonId: string) => void;
}

export const useCoursePlayerStore = create<CoursePlayerState>()(
  persist(
    immer((set) => ({
      selectedLessonId: null,
      setSelectedLessonId: (lessonId) =>
        set((state) => {
          state.selectedLessonId = lessonId;
        }),
    })),
    { name: "course-player-storage" }
  )
);
