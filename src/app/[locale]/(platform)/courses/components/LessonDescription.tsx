import { Course } from "@/app/types/course";
import React from "react";
import DOMPurify from 'dompurify';

const LessonDescription = ({ courseData }: { courseData: Course }) => {
  const sanitizedDescription = DOMPurify.sanitize(courseData.description || '');

  return (
    <div className="mt-2 bg-white p-2 border-primary-light border rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Description</h2>
      <div 
        dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
        className="prose prose-lg max-w-none"
      />
    </div>
  );
};

export default LessonDescription;