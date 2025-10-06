import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { arrayMove } from "@dnd-kit/sortable";
import { immer } from "zustand/middleware/immer";
import { Lesson, LessonsStatus } from "../types/course";
import { coursesAction } from "../actions/coursers";

export type LocalLesson = {
  lessonId: string;
  title: string;
  isDirty?: boolean;
  shortDesc?: string;
  duration?: number;
  videoUrl?: string;
  isPreview?: boolean;
  order?: number;
  status?: LessonsStatus;
};

interface LessonState {
  // State
  courseId: string | null;
  lessons: LocalLesson[];
  selectedLessonId: string | null;
  hydrated: boolean;
  loading: boolean;
  error: Error | null;

  // Selectors
  selectedLesson: LocalLesson | null;

  // Actions
  setCourseId: (courseId: string) => void;
  setHydrated: (hydrated: boolean) => void;
  setSelectedLesson: (lessonId: string) => void;
  addLesson: (lesson: Omit<LocalLesson, "id" | "order">) => void;
  updateLesson: (id: string, updates: Partial<Omit<LocalLesson, "id">>) => void;
  deleteLesson: (id: string) => void;
  resetStore: () => void;
  setLessons: (lessons: LocalLesson[]) => void;
  reorderLessons: (activeId: string, overId: string) => void;
  markAllSaved: () => void;

  // Async actions
  fetchLessons: (courseId: string) => Promise<void>;
}

export const useLessonStore = create<LessonState>()(
  persist(
    immer((set, get) => ({
      courseId: null,
      lessons: [],
      selectedLessonId: null,
      selectedLesson: null,
      hydrated: false,
      loading: false,
      error: null,

      setHydrated: (hydrated: boolean) =>
        set(() => ({
          hydrated,
        })),

      setCourseId: (courseId: string) =>
        set((state) => {
          if (state.courseId !== courseId) {
            return {
              courseId,
              lessons: [],
              selectedLessonId: null,
              selectedLesson: null,
              loading: true,
              error: null,
            };
          }
          return { courseId };
        }),

      setLessons: (lessons: LocalLesson[]) =>
        set(() => ({
          lessons,
          loading: false,
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
                status: "waiting",
                ...lesson,
                order: state.lessons.length,
                isDirty: true,
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
              state.selectedLessonId === id ? null : state.selectedLesson,
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

      resetStore: () =>
        set(() => ({
          lessons: [],
          selectedLessonId: null,
          selectedLesson: null,
          loading: false,
          error: null,
        })),

      fetchLessons: async (courseId: string) => {
        const state = get();
        if (state.courseId === courseId && state.lessons.length > 0) {
          return;
        }

        set({ loading: true, error: null });

        try {
          const [lessonsResponse, courseResponse] = await Promise.all([
            coursesAction.lessons.getLessons(courseId),
            coursesAction.courses.getCourse(courseId),
          ]);

          const courseData = courseResponse?.cousre || null;
          const lessonsOrder = courseData?.lessonOrder || [];

          const orderMap = new Map();
          lessonsOrder.forEach((item: { lessonId: string; sort: number }) => {
            orderMap.set(item.lessonId, item.sort);
          });

          if (lessonsResponse) {
            const processedLessons = lessonsResponse.map(
              (lesson: Lesson, index: number) => {
                const order = orderMap.has(lesson.lessonId)
                  ? orderMap.get(lesson.lessonId)
                  : index;

                return {
                  lessonId: lesson.lessonId,
                  title: lesson.title,
                  shortDesc: lesson.shortDesc || "",
                  duration: lesson.duration || 0,
                  videoUrl: lesson.playbackId || "",
                  isPreview: lesson.isPreview || false,
                  status: lesson.status || "waiting",
                  order: order,
                  isDirty: false,
                };
              }
            );
            const sortedLessons = [...processedLessons].sort(
              (a: LocalLesson, b: LocalLesson) =>
                (a.order !== undefined ? a.order : 999) -
                (b.order !== undefined ? b.order : 999)
            );

            set({
              lessons: sortedLessons,
              loading: false,
              hydrated: true,
              courseId,
            });
          }
        } catch (error) {
          console.error("Failed to fetch lessons:", error);
          set({
            error: error instanceof Error ? error : new Error(String(error)),
            loading: false,
          });
        }
      },
    })),
    {
      name: "lesson-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        courseId: state.courseId,
        lessons: state.lessons,
        selectedLessonId: state.selectedLessonId,
      }),
      onRehydrateStorage() {
        return (state, error) => {
          if (!error && state) {
            state.setHydrated(true);
          }
        };
      },
    }
  )
);
