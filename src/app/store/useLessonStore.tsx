import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { arrayMove } from "@dnd-kit/sortable";
import { immer } from "zustand/middleware/immer";
import { artificialDelay } from "../utils/artificialDelay";

export type Lesson = {
  id: string;
  title: string;
  shortDescription?: string;
  videoUrl?: string;
  order?: number;
};

interface LessonState {
  // State
  lessons: Lesson[];
  selectedLessonId: string | null;
  hydrated: boolean;

  // Selectors
  selectedLesson: Lesson | null;

  // Actions
  setHydrated: (hydrated: boolean) => void;
  setSelectedLesson: (lessonId: string) => void;
  addLesson: (lesson: Omit<Lesson, "id" | "order">) => void;
  updateLesson: (id: string, updates: Partial<Omit<Lesson, "id">>) => void;
  deleteLesson: (id: string) => void;
  reorderLessons: (activeId: string, overId: string) => void;
}

export const useLessonStore = create<LessonState>()(
  persist(
    immer((set) => ({
      // Initial state
      lessons: [
        {
          id: "lesson-1",
          title: "Introduction to Course",
          shortDescription: "Welcome to the course!",
          videoUrl: "",
          order: 0,
        },
        {
          id: "lesson-2",
          title: "Basic Concepts",
          shortDescription: "Learn the fundamentals",
          videoUrl: "",
          order: 1,
        },
        {
          id: "lesson-3",
          title: "Advanced Techniques",
          shortDescription: "Taking it to the next level",
          videoUrl: "",
          order: 2,
        },
        {
          id: "lesson-4",
          title: "Final Project",
          shortDescription: "Put everything together",
          videoUrl: "",
          order: 3,
        },
      ],
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
            state.lessons.find((lesson) => lesson.id === lessonId) || null,
          selectedLessonId: lessonId,
        })),

      addLesson: (lesson) =>
        set((state) => {
          const newId = `lesson-${state.lessons.length + 1}`;
          const newOrder = state.lessons.length;

          return {
            lessons: [
              ...state.lessons,
              {
                ...lesson,
                id: newId,
                order: newOrder,
              },
            ],
          };
        }),

      updateLesson: (id, updates) =>
        set((state) => ({
          lessons: state.lessons.map((lesson) =>
            lesson.id === id ? { ...lesson, ...updates } : lesson
          ),
        })),

      deleteLesson: (id) =>
        set((state) => {
          const newLessons = state.lessons.filter((lesson) => lesson.id !== id);

          // Update order after deletion
          const updatedLessons = newLessons.map((lesson, index) => ({
            ...lesson,
            order: index,
          }));

          return {
            lessons: updatedLessons,
            // If we deleted the selected lesson, clear selection
            selectedLessonId:
              state.selectedLessonId === id ? null : state.selectedLessonId,
          };
        }),

      reorderLessons: (activeId, overId) =>
        set((state) => {
          const oldIndex = state.lessons.findIndex(
            (lesson) => lesson.id === activeId
          );
          const newIndex = state.lessons.findIndex(
            (lesson) => lesson.id === overId
          );

          const reorderedLessons = arrayMove(state.lessons, oldIndex, newIndex);

          // Update order after reordering
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
