"use client";
import React from "react";
import { GripVertical, Loader2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";

import { LocalLesson, useLessonStore } from "@/app/store/useLessonStore";
import { Skeleton } from "@/components/ui/skeleton";

interface SortableLessonProps {
  lesson: LocalLesson;
  index: number;
}

const SortableLesson: React.FC<SortableLessonProps> = ({ lesson, index }) => {
  const { setSelectedLesson, selectedLesson, hydrated } = useLessonStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.lessonId });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  if (!hydrated) {
    return (
      <Skeleton className="p-4  rounded-md shadow-sm border mb-2 border-gray-200 flex items-center justify-end">
        <Loader2 size={18} className="animate-spin mr-2 text-primary" />
      </Skeleton>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 bg-white rounded-md  ${
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
          <div className="mr-2 text-gray-800 w-6 border ring-2 ring-secondary-light h-6 flex items-center justify-center font-medium bg-primary-light rounded-full">
            {index + 1}
          </div>
          <h3 className="font-medium">{lesson.title}</h3>
        </div>
        <div
          {...attributes}
          {...listeners}
          data-drag-handle="true"
          className="cursor-grab active:cursor-grabbing hover:text-primary"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical size={18} className="text-gray-800" />
        </div>
      </div>
    </div>
  );
};

export default SortableLesson;
