/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React from "react";
import { AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { coursesAction } from "@/app/actions/coursers";
import { useParams } from "next/navigation";
import { Course } from "@/app/types/course";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const isPublished = course.isPublished;
  const canBePublsihed = Object.values(completionStatus).every(
    (status) => status === true
  );

  const completedSteps = Object.values(completionStatus).filter(Boolean).length;
  const totalSteps = Object.keys(completionStatus).length;

  const incompleteSteps = Object.entries(completionStatus)
    .filter(([_, value]) => !value)
    .map(([key]) => {
      const stepNames: Record<string, string> = {
        title: "Course Title",
        description: "Course Description",
        price: "Pricing Plan",
        category: "Category",
        lessons: "Lessons",
        thumbnail: "Course Thumbnail",
      };
      return stepNames[key] || key;
    });

  if (isPublished) {
    return (
      <div className="bg-primary-light/50 lg:p-3 rounded-md">
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-gray-800 mr-3 flex-shrink-0" />
          <p className="text-gray-800 font-medium">This course is published</p>
        </div>
      </div>
    );
  }

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
    <div className="bg-amber-100 px-1 py-2 sm:p-3 rounded-md mb-2">
      <div className="flex items-center">
        <AlertTriangle className="h-4 w-5 mr-2 sm:h-5 sm:w-5 text-amber-500 sm:mr-3 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-gray-800 text-sm sm:text-base font-medium flex items-center justify-between">
            <span>This course can&#39;t be published yet</span>
            <span className="text-gray-700 font-normal flex items-center">
              {/* Only show completed steps text on larger screens */}
              <span className="hidden sm:inline ml-2">
                Steps completed ({completedSteps}/{totalSteps})
              </span>
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <button
                      className="ml-2 cursor-help"
                      aria-label="View missing requirements"
                    >
                      <HelpCircle className="h-5 w-5 mr-4 md:mr-0 text-gray-500" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    align="end"
                    sideOffset={5}
                    className="p-3 bg-white border border-primary-light/60 shadow-lg rounded-md w-64 z-50"
                  >
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-gray-800 border-b border-gray-200 pb-1">
                        Missing requirements:
                      </h4>
                      <ul className="list-none text-sm space-y-2">
                        {incompleteSteps.map((step, index) => (
                          <li key={index} className="flex items-start">
                            <div className="mr-2 mt-0.5">
                              <AlertTriangle className="h-3.5 w-3.5  text-amber-500" />
                            </div>
                            <span className="text-gray-700">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AlertComponent;
