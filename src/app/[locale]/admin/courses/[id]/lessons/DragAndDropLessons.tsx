"use client";

import React, { useRef } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  Modifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import SortableLesson from "./SortableLesson";
import { useLessonStore } from "@/app/store/useLessonStore";

const DragAndDropLessons = () => {
  const { lessons, reorderLessons } = useLessonStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const modifiers: Modifier[] = [
    restrictToVerticalAxis,
    restrictToParentElement,
  ];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = () => {
    document.body.style.cursor = "grabbing";
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    document.body.style.cursor = "";

    if (over && active.id !== over.id) {
      reorderLessons(active.id.toString(), over.id.toString());
    }
  };

  return (
    <div ref={containerRef} className="w-full overflow-y-auto relative">
      <div className="border-2 max-h-[500px] h-full overflow-auto rounded-md shadow-md p-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          modifiers={modifiers}
        >
          <SortableContext
            items={lessons.map((lesson) => lesson.id)}
            strategy={verticalListSortingStrategy}
          >
            <div>
              {lessons.map((lesson, index) => (
                <SortableLesson key={lesson.id} lesson={lesson} index={index} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default DragAndDropLessons;
