import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CourseCard from "./components/CourseCard";
import Link from "next/link";

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
    <div className=" xl:p-6 space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
        <Link href={'coursers/create-course'}>
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Create Course
          </Button>
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-8 w-full ring-secondary focus-visible:ring-[2px] "
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[180px] focus-visible:ring-[2px] ring-secondary">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-white focus-visible:ring-[2px]">
            <SelectItem
              className="hover:bg-secondary cursor-pointer"
              value="all"
            >
              All Categories
            </SelectItem>
            <SelectItem
              className="hover:bg-secondary cursor-pointer"
              value="development"
            >
              Development
            </SelectItem>
            <SelectItem
              className="hover:bg-secondary cursor-pointer"
              value="programming"
            >
              Programming
            </SelectItem>
            <SelectItem
              className="hover:bg-secondary cursor-pointer"
              value="design"
            >
              Design
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default CoursePage;
