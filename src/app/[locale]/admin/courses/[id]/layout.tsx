import React from "react";
import NavBar from "./NavBar";
import AlertComponent from "./AlertComponent";
import { coursesAction } from "@/app/actions/coursers";

interface CourseIdLayoutProps {
  children: React.ReactNode;
  params: {
    id: string;
    locale?: string;
  };
}
export default async function CourseIdLayout({
  children,
  params,
}: CourseIdLayoutProps) {
  const resolvedParams = await Promise.resolve(params);
  const courseId = resolvedParams.id;

  const course = await coursesAction.courses.getCourse(courseId);

  console.log(course);

  return (
    <div className="max-w-7xl p-6">
      <NavBar />
      <AlertComponent />
      {/* Content */}
      <div className="pt-6">{children}</div>
    </div>
  );
}
