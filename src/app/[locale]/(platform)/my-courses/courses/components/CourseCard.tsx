import type { EnrolledCourse } from "@/app/types/enrolled-course";
import { convertTime } from "@/app/utils/converToMinutes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock4, Play, Star } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";

interface CourseCardProps {
  courseData: EnrolledCourse;
}

const CourseCard = ({ courseData }: CourseCardProps) => {
  console.log("courseLessonProgress", courseData.lessonProgress);
  const totalLessons = Object.keys(courseData.lessonProgress).length;
  const completedLessons = Object.values(courseData.lessonProgress).filter(
    (lesson) => lesson.progress === 100
  ).length;
  const progressPercentage = Math.round(
    (completedLessons / courseData.lessonCount) * 100
  );

  const formatExpirationDate = (expiresAt: string) => {
    if (expiresAt === "lifetime") {
      return {
        text: "Lifetime Access",
        color: "bg-green-100 text-green-800",
        showStar: true,
      };
    }

    const expirationDate = new Date(expiresAt);
    const now = new Date();
    const daysLeft = Math.ceil(
      (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysLeft < 0) {
      return {
        text: "Expired",
        color: "bg-red-100 text-red-800",
        showStar: false,
      };
    } else if (daysLeft <= 7) {
      return {
        text: `${daysLeft} days left`,
        color: "bg-orange-100 text-orange-800",
        showStar: false,
      };
    } else {
      return {
        text: `Expires ${format(expirationDate, "MMM dd")}`,
        color: "bg-blue-100 text-blue-800",
        showStar: false,
      };
    }
  };

  const expiration = formatExpirationDate(courseData.expiresAt);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white py-0 flex">
      <CardContent className="p-0">
        {/* Image Section */}
        <div className="relative h-[14rem] w-full">
          <Image
            src={
              courseData.thumbnailImage ||
              "/placeholder.svg?height=128&width=350" ||
              "/placeholder.svg"
            }
            alt={courseData.title}
            fill
            className="object-cover object-center"
          />
          <div className="absolute top-2 left-2">
            <Badge
              variant="secondary"
              className={`text-xs ${expiration.color}`}
            >
              {expiration.showStar && <Star></Star>}
              {expiration.text}
            </Badge>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-3 space-y-2">
          {/* Title */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 line-clamp-1 leading-tight">
              {courseData.title}
            </h3>
          </div>

          {/* Description */}
          <div>
            <p className="text-base text-gray-600 line-clamp-2 leading-relaxed h-12">
              {courseData.shortDescription}
            </p>
          </div>

          {/* Course Stats */}
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              <span>{totalLessons} lessons</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock4 className="w-3 h-3" />
              <span>{convertTime(courseData.duration)}</span>
            </div>
          </div>

          {/* Progress Section */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium text-gray-900">
                {completedLessons}/{totalLessons} ({courseData.overallProgress}
                %)
              </span>
            </div>
            <Progress
              value={courseData.overallProgress}
              className="h-1.5 bg-gray-200"
            />
          </div>

          {/* Action Button */}
          <div className="mt-auto pt-2">
            <Button
              variant="default"
              className="w-full flex items-center justify-center gap-1 text-gray-50"
            >
              <Play className="w-3 h-3" />
              <span className="text-base font-medium ">
                {progressPercentage > 0 ? "Continue" : "Start"}
              </span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
