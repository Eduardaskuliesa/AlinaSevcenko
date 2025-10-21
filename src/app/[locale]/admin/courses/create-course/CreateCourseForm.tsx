"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { coursesAction } from "@/app/actions/coursers";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { CreateCourseInitialData } from "@/app/types/course";

const CreateCoursePage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [courseName, setCourseName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const locale = pathname.split("/")[1];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!courseName.trim()) {
      setError("Course name is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData: CreateCourseInitialData = {
        title: courseName,
        authorId: session?.user.id || "",
      };

      const result = await coursesAction.courses.createCourse(formData);

      if (result.success) {
        toast.success("Course created successfully!");
        router.push(`/${locale}/admin/courses/${result.courseId}/info`);
      } else {
        toast.error(result.message);
        setIsSubmitting(false);
      }
    } catch (error) {
      setIsSubmitting(false);
      toast.error("Failed to create course");
      console.error("Error creating course:", error);
    }
  };

  return (
    <div className="px-2 lg:p-6 space-y-6 max-w-7xl mx-auto">
      <Button
        variant="ghost"
        className="mb-6 pl-0 flex items-center hover:bg-gray-200"
        onClick={() => router.push(`/${locale}/admin/courses`)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to courses
      </Button>

      <Card className="max-w-lg py-5 bg-white">
        <CardHeader className="px-2 lg:px-6">
          <CardTitle className="text-2xl">Create New Course</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="px-2 lg:px-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="courseName" className="text-sm font-medium">
                  Course Name
                </label>
                <Input
                  id="courseName"
                  placeholder="Enter course name"
                  value={courseName}
                  onChange={(e) => {
                    setCourseName(e.target.value);
                    setError("");
                  }}
                  className={`${error ? "border-red-500" : ""} ring-secondary`}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between mt-4 px-2 lg:px-6">
            <Button
              type="button"
              variant="outline"
              className="w-1/3"
              onClick={() => router.push(`/${locale}/admin/courses`)}
            >
              Cancel
            </Button>
            <Button className="w-1/3" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Next"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreateCoursePage;
