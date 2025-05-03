import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { arrayMove } from "@dnd-kit/sortable";
import { immer } from "zustand/middleware/immer";

export type LocalLesson = {
  lessonId: string;
  title: string;
  isDirty?: boolean;
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
  markAllSaved: () => void;
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
            lesson.lessonId === id
              ? { ...lesson, ...updates, isDirty: true }
              : lesson
          );

          const updatedSelectedLesson =
            state.selectedLessonId === id
              ? { ...state.selectedLesson, ...updates, isDirty: true }
              : state.selectedLesson;

          return {
            lessons: updatedLessons,
            selectedLesson: updatedSelectedLesson,
          };
        }),

      deleteLesson: (id) =>
        set((state) => {
          const deletedIndex = state.lessons.findIndex(
            (lesson) => lesson.lessonId === id
          );

          const newLessons = state.lessons.filter(
            (lesson) => lesson.lessonId !== id
          );

          const updatedLessons = newLessons.map((lesson, index) => {
            const originalIndex = state.lessons.findIndex(
              (l) => l.lessonId === lesson.lessonId
            );

            const isDirtyDueToReordering = originalIndex > deletedIndex;

            return {
              ...lesson,
              order: index,
              isDirty: isDirtyDueToReordering || lesson.isDirty || false,
            };
          });

          return {
            lessons: updatedLessons,
            selectedLessonId:
              state.selectedLessonId === id ? null : state.selectedLessonId,
            selectedLesson:
              state.selectedLessonId === id ? null : state.selectedLesson, // Add this line
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

          if (oldIndex === newIndex) return state;

          const reorderedLessons = arrayMove(state.lessons, oldIndex, newIndex);

          const minIndex = Math.min(oldIndex, newIndex);
          const maxIndex = Math.max(oldIndex, newIndex);

          const updatedLessons = reorderedLessons.map((lesson, index) => {
            if (index >= minIndex && index <= maxIndex) {
              return {
                ...lesson,
                order: index,
                isDirty: true,
              };
            }
            return {
              ...lesson,
              order: index,
            };
          });

          return {
            lessons: updatedLessons,
          };
        }),
      markAllSaved: () =>
        set((state) => ({
          lessons: state.lessons.map((lesson) => ({
            ...lesson,
            isDirty: false,
          })),
        })),
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
            state?.setHydrated(true);
          }
        };
      },
    }
  )
);
