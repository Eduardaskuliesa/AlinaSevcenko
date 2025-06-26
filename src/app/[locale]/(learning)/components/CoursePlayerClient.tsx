"use client";
import React from "react";

interface CoursePlayerClientProps {
  courseId?: string;
  userId: string | undefined;
}

const CoursePlayerClient = ({ courseId, userId }: CoursePlayerClientProps) => {
  return (
    <div className="text-gray-50">
      {courseId}, {userId}
    </div>
  );
};

export default CoursePlayerClient;
