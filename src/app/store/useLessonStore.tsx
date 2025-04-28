import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { arrayMove } from "@dnd-kit/sortable";
import { immer } from "zustand/middleware/immer";
import { artificialDelay } from "../utils/artificialDelay";

export type LocalLesson = {
  lessonId: string;
  title: string;
  shortDesc?: string;
  duration?: number;
  videoUrl?: string;
  isPreview?: boolean;
  order?: number;
};

interface LessonState {
  // State
  lessons: LocalLesson[];
  selectedLessonId: string | null;
  hydrated: boolean;

  // Selectors
  selectedLesson: LocalLesson | null;

  // Actions
  setHydrated: (hydrated: boolean) => void;
  setSelectedLesson: (lessonId: string) => void;
  addLesson: (lesson: Omit<LocalLesson, "id" | "order">) => void;
  updateLesson: (id: string, updates: Partial<Omit<LocalLesson, "id">>) => void;
  deleteLesson: (id: string) => void;
  reorderLessons: (activeId: string, overId: string) => void;
}

export const useLessonStore = create<LessonState>()(
  persist(
    immer((set) => ({
      lessons: [],
      selectedLessonId: null,
      selectedLesson: null,
      hydrated: false,

      setHydrated: () =>
        set(() => ({
          hydrated: true,
        })),

      setSelectedLesson: (lessonId: string) =>
        set((state) => ({
          selectedLesson:
            state.lessons.find((lesson) => lesson.lessonId === lessonId) ||
            null,
          selectedLessonId: lessonId,
        })),

      addLesson: (lesson) =>
        set((state) => {
          return {
            lessons: [
              ...state.lessons,
              {
                ...lesson,
              },
            ],
          };
        }),

      updateLesson: (id, updates) =>
        set((state) => {
          const updatedLessons = state.lessons.map((lesson) =>
            lesson.lessonId === id ? { ...lesson, ...updates } : lesson
          );

          const updatedSelectedLesson =
            state.selectedLessonId === id
              ? { ...state.selectedLesson, ...updates }
              : state.selectedLesson;

          return {
            lessons: updatedLessons,
            selectedLesson: updatedSelectedLesson,
          };
        }),

      deleteLesson: (id) =>
        set((state) => {
          const newLessons = state.lessons.filter(
            (lesson) => lesson.lessonId !== id
          );

          const updatedLessons = newLessons.map((lesson, index) => ({
            ...lesson,
            order: index,
          }));

          return {
            lessons: updatedLessons,
            selectedLessonId:
              state.selectedLessonId === id ? null : state.selectedLessonId,
          };
        }),

      reorderLessons: (activeId, overId) =>
        set((state) => {
          const oldIndex = state.lessons.findIndex(
            (lesson) => lesson.lessonId === activeId
          );
          const newIndex = state.lessons.findIndex(
            (lesson) => lesson.lessonId === overId
          );

          const reorderedLessons = arrayMove(state.lessons, oldIndex, newIndex);

          const updatedLessons = reorderedLessons.map((lesson, index) => ({
            ...lesson,
            order: index,
          }));

          return {
            lessons: updatedLessons,
          };
        }),
    })),
    {
      name: "lesson-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        lessons: state.lessons,
      }),
      onRehydrateStorage() {
        return (state, error) => {
          if (!error) {
            artificialDelay(2);
            state?.setHydrated(true);
          }
        };
      },
    }
  )
);
