"use client";
import React, { useEffect, useState } from "react";
import { GripVertical, Loader2, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";

import { LocalLesson, useLessonStore } from "@/app/store/useLessonStore";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCourseId } from "@/app/hooks/useGetCourseId";
import { DeleteModal } from "@/components/ui/DeleteModal";
import { coursesAction } from "@/app/actions/coursers";
import toast from "react-hot-toast";

interface SortableLessonProps {
  lesson: LocalLesson;
  index: number;
}

const SortableLesson: React.FC<SortableLessonProps> = ({ lesson, index }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setSelectedLesson, selectedLesson, hydrated, deleteLesson, lessons } =
    useLessonStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.lessonId });

  const { courseId } = useGetCourseId();

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await coursesAction.lessons.deleteLesson(
        courseId,
        lesson.lessonId
      );
      if (!response) {
        toast.error("Failed to delete lesson.");
        return;
      }
      if (response.success) {
        toast.success("Lesson deleted successfully.");
        deleteLesson(lesson.lessonId);
      }
    } catch (error) {
      console.error("Error deleting lesson:", error);
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
    }
  };

  useEffect(() => {
    console.log(lessons);
  }, [lessons]);

  if (!hydrated) {
    return (
      <Skeleton className="p-4  rounded-md shadow-sm border mb-2 border-gray-200 flex items-center justify-end">
        <Loader2 size={18} className="animate-spin mr-2 text-primary" />
      </Skeleton>
    );
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`p-4 bg-white group rounded-md group  ${
          isDragging ? "hover:cursor-grabbing" : "hover:cursor-pointer"
        } shadow-sm border mb-2 ${
          selectedLesson?.lessonId === lesson.lessonId
            ? "border-primary border"
            : isDragging
            ? "border-primary border-2 cursor-grab"
            : "border-gray-200 hover:border-primary"
        } transition-colors`}
        onClick={() => setSelectedLesson(lesson.lessonId)}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <div
              {...attributes}
              {...listeners}
              data-drag-handle="true"
              className="cursor-grab active:cursor-grabbing hover:text-primary"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical size={18} className="text-gray-800 mr-2" />
            </div>

            <div className="mr-2 text-gray-800 w-6 border ring-2 ring-secondary-light h-6 flex items-center justify-center font-medium bg-primary-light rounded-full">
              {index + 1}
            </div>
            <h3 className="font-medium">{lesson.title}</h3>
          </div>
          {selectedLesson?.lessonId === lesson.lessonId && (
            <Trash2
              onClick={() => setIsDialogOpen(true)}
              className="h-5 w-5 text-slate-600 hover:text-slate-900 cursor-pointer"
            />
          )}
        </div>
      </div>
      <DeleteModal
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="Delete Lesson"
        message="Are you sure you want to delete this lesson? This action cannot be undone."
        handleDeleted={handleDelete}
        confirmText="Delete"
        isLoading={isLoading}
      ></DeleteModal>
    </>
  );
};

export default SortableLesson;
