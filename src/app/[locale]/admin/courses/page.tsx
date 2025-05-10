import React from "react";
import CourseCard from "./components/CourseCard";
import PageHeading from "./components/PageHeading";

const CoursePage = () => {
  const courses = [
    {
      id: "1",
      title: "Complete Web Development Bootcamp",
      price: 99.99,
      isPublished: true,
      imageUrl: "/placeholder.svg?height=220&width=400",
      category: "Development",
      language: "EN",
      completionStatus: {
        title: true,
        description: true,
        price: true,
        category: true,
        lessons: true,
        thumbnail: true,
      },
      completionPercentage: 100,
      canBePublished: true,
    },
    {
      id: "2",
      title: "Advanced React Patterns",
      price: 79.99,
      isPublished: false,
      imageUrl: "/placeholder.svg?height=220&width=400",
      category: "Programming",
      language: "LT",
      completionStatus: {
        title: true,
        description: false,
        price: true,
        category: true,
        lessons: false,
        thumbnail: false,
      },
      completionPercentage: 50,
      canBePublished: false,
    },
    {
      id: "3",
      title: "UI/UX Design Fundamentals",
      price: 59.99,
      isPublished: false,
      imageUrl: "/placeholder.svg?height=220&width=400",
      category: "Design",
      language: "RU",
      completionStatus: {
        title: true,
        description: false,
        price: false,
        category: false,
        lessons: false,
        thumbnail: false,
      },
      completionPercentage: 17,
      canBePublished: false,
    },
  ];

  return (
    <div className="xl:p-6 space-y-6 max-w-7xl">
      <PageHeading></PageHeading>

      <div className="grid sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default CoursePage;
