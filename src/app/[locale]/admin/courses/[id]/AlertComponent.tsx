"use client";
import React from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { coursesAction } from "@/app/actions/coursers";
import { useParams } from "next/navigation";
import { Course } from "@/app/types/course";

const AlertComponent = () => {
  const params = useParams();
  const courseId = params.id as Course["courseId"];

  const { data, isLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => coursesAction.courses.getCourse(courseId),
  });

  const course = data?.cousre;

  if (isLoading || !course) {
    return null;
  }

  if (course.publishedAt) {
    return null;
  }

  const completionStatus = course.completionStatus || {};
  const canBePublsihed = Object.values(completionStatus).every(
    (status) => status === true
  );

  const completedSteps = Object.values(completionStatus).filter(Boolean).length;
  const totalSteps = Object.keys(completionStatus).length;

  if (canBePublsihed) {
    return (
      <div className="bg-green-100 p-3 rounded-md">
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
          <p className="text-gray-800 font-medium">
            This course is ready to be published
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-100 p-3 rounded-md">
      <div className="flex items-center">
        <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0" />
        <p className="text-gray-800 font-medium">
          This course can&#39;t be published yet
          <span className="text-gray-700 font-normal ml-2">
            Steps completed ({completedSteps}/{totalSteps})
          </span>
        </p>
      </div>
    </div>
  );
};

export default AlertComponent;
