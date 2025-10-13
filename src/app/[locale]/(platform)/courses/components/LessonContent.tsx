"use client";
import { Lesson } from "@/app/types/course";
import { convertTime } from "@/app/utils/converToMinutes";
import { ChevronDown } from "lucide-react";
import React, { useState } from "react";

const LessonContent = ({ courseLessons }: { courseLessons: Lesson[] }) => {
  const filteredLessons = courseLessons.filter(
    (lesson) => lesson.status === "ready"
  );

  const [expandedLessons, setExpandedLessons] = useState<
    Record<string, boolean>
  >({});
  const [expandAll, setExpandAll] = useState(true);

  const toggleLesson = (lessonId: string) => {
    setExpandedLessons((prev) => ({
      ...prev,
      [lessonId]: !prev[lessonId],
    }));
  };

  const toggleAllLessons = () => {
    const newExpandAll = !expandAll;
    setExpandAll(newExpandAll);

    const newExpandedLessons: Record<string, boolean> = {};
    filteredLessons.forEach((lesson) => {
      newExpandedLessons[lesson.lessonId] = newExpandAll;
    });

    setExpandedLessons(newExpandedLessons);
  };

  const totalLessons = filteredLessons.length;
  const totalDuration = filteredLessons.reduce(
    (acc, lesson) => acc + (lesson.duration || 0),
    0
  );

  return (
    <div className="mt-4 bg-white border-primary-light border rounded-lg p-2">
      <h2 className="text-2xl text-gray-800 font-bold mb-2">Course content</h2>

      <div className="flex justify-between items-center mb-3 text-sm px-2">
        <div className="text-gray-700">
          {totalLessons} lectures • {convertTime(totalDuration)} total length
        </div>
        <button
          onClick={toggleAllLessons}
          className="text-gray-700 font-medium hover:text-gray-800"
        >
          {expandAll ? "Collapse all lessons" : "Expand all lessons"}
        </button>
      </div>

      <div className="border border-primary-light rounded-md overflow-hidden bg-gray-50">
        {filteredLessons.map((lesson, index) => {
          const isExpanded = expandedLessons[lesson.lessonId] || false;

          return (
            <div
              key={lesson.lessonId}
              className={`${index > 0 ? "border-t border-gray-300" : ""}`}
            >
              <button
                onClick={() => toggleLesson(lesson.lessonId)}
                className="w-full flex justify-between items-center px-4 py-3 hover:bg-slate-50/40 transition-colors text-left"
              >
                <div className="flex items-center">
                  <div className="p-1 bg-primary-light rounded-md mr-4">
                    <ChevronDown
                      className={`h-4 w-4  text-gray-800 transition-transform duration-200 ${
                        isExpanded ? "transform rotate-180" : ""
                      }`}
                    />
                  </div>

                  <span className="font-semibold text-gray-800">
                    {lesson.title}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {convertTime(lesson.duration)}
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                  {lesson.shortDesc ? (
                    <p className="text-gray-700">{lesson.shortDesc}</p>
                  ) : (
                    <p className="italic text-gray-500">
                      No description available for this lesson.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LessonContent;
