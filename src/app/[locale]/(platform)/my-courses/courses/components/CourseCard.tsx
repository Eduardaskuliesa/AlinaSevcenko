"use client";
import Image from "next/image";
import { Clock, BookOpen, Play, CheckCircle2 } from "lucide-react";
import { convertTime } from "@/app/utils/converToMinutes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { EnrolledCourse } from "@/app/types/enrolled-course";
import { motion } from "framer-motion";
import Link from "next/link";
import { format } from "date-fns";

interface CourseCardProps {
  course: EnrolledCourse;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const totalLessons = Object.keys(course.lessonProgress).length;
  const completedLessons = Object.values(course.lessonProgress).filter(
    (lesson) => lesson.progress === 100
  ).length;

  const getExpirationInfo = (expiresAt: string) => {
    if (expiresAt === "lifetime") {
      return { text: "Lifetime Access", color: "bg-green-100 text-green-800" };
    }

    const expirationDate = new Date(expiresAt);
    const now = new Date();
    const daysLeft = Math.ceil(
      (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysLeft < 0) {
      return { text: "Expired", color: "bg-red-100 text-red-800" };
    } else if (daysLeft <= 7) {
      return {
        text: `${daysLeft} days left`,
        color: "bg-orange-100 text-orange-800",
      };
    } else {
      return {
        text: `Expires ${format(expirationDate, "MMM dd")}`,
        color: "bg-blue-100 text-blue-800",
      };
    }
  };

  const expiration = getExpirationInfo(course.expiresAt);

  return (
    <Link href={`/learn/${course.courseId}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.4,
          ease: "easeInOut",
        }}
        viewport={{ once: true }}
        className="flex flex-row border shadow-sm border-primary-light/60 group hover:bg-gray-50 rounded-md bg-white p-4 mb-4 cursor-pointer pb-4"
      >
        <div className="relative min-w-[300px] min-h-[150px] max-h-[200px] overflow-hidden rounded-md">
          <Image
            quality={100}
            height={240}
            width={240}
            alt="Course Thumbnail"
            src={
              course?.thumbnailImage || "/placeholder.svg?height=180&width=300"
            }
            className="object-cover w-full h-full group-hover:scale-[1.02] transition-transform duration-300 ease-out transform-gpu"
          />

          {/* Progress Badge */}
          <Badge
            variant="secondary"
            className="absolute top-2 left-2 border-white border text-gray-800 text-xs font-bold"
          >
            {course.overallProgress}% Complete
          </Badge>

          {/* Completion Badge */}
          {course.overallProgress === 100 && (
            <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 justify-between ml-6">
          <div className="flex flex-row justify-between w-full mb-auto">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2">
                {course?.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {course?.shortDescription}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span>{totalLessons} lessons</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{convertTime(course?.duration)}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>
                    {completedLessons}/{totalLessons} lessons completed
                  </span>
                  <span>{course.overallProgress}%</span>
                </div>
                <Progress value={course.overallProgress} className="h-2" />
              </div>
            </div>

            {/* Access Status */}
            <div className="ml-4 min-w-[120px] flex justify-end">
              <Badge
                variant="secondary"
                className={`px-3 py-1 rounded-full font-semibold text-sm h-fit ${expiration.color}`}
              >
                {expiration.text}
              </Badge>
            </div>
          </div>

          <div className="flex justify-between items-center w-full mt-4">
            {/* Last accessed info */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>
                Last accessed:{" "}
                {format(
                  new Date(course.lastWatchedAt || Date.now()),
                  "MMM dd, yyyy"
                )}
              </span>
            </div>

            {/* Action button */}
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 text-sm font-medium"
              onClick={(e) => {
                e.preventDefault();
                // Handle continue/start action
              }}
            >
              {course.overallProgress > 0 ? "Continue" : "Start"}
              <Play className="w-4 h-4 mr-2 group-hover:translate-x-2 transition-all" />
            </Button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default CourseCard;
