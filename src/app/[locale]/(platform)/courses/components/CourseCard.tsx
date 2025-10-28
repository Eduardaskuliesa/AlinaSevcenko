"use client";
import Image from "next/image";
import { Clock, BookOpen } from "lucide-react";
import { convertTime } from "@/app/utils/converToMinutes";
import { Badge } from "@/components/ui/badge";
import { FilteredCourse } from "@/app/types/course";
import { motion } from "framer-motion";
import Link from "next/link";
import ActionButtonts from "./ActionButtonts";
import { useTranslations } from "next-intl";

interface CourseCardProps {
  course: FilteredCourse;
  lowestPrice: number | null;
}

const CourseCard = ({ course, lowestPrice }: CourseCardProps) => {
  const t = useTranslations("CoursesPage.courseCard");

  return (
    <Link href={`/courses/${course.slug}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.4,
          ease: "easeInOut",
        }}
        viewport={{ once: true }}
        className="flex flex-col md:flex-row border-b hover:bg-slate-50 px-1 cursor-pointer hover:shadow-lg border-primary pb-4"
      >
        <div className="relative w-full md:min-w-[300px] md:max-w-[300px] h-[250px] sm:h-[300px] md:h-[180px]">
          <Image
            quality={100}
            fill
            alt="Course Thumbnail"
            src={
              course?.thumbnailImage || "/placeholder.svg?height=180&width=300"
            }
            className="object-cover rounded-md"
          />

          {course.language && (
            <Badge
              variant="secondary"
              className="absolute top-2 left-2 uppercase border-white border text-gray-800 text-xs font-bold"
            >
              {course.language}
            </Badge>
          )}
        </div>

        <div className="flex flex-col flex-1 justify-between px-4 md:ml-6 mt-4 md:mt-0">
          <div className="flex flex-col md:flex-row justify-between w-full mb-auto">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2">
                {course?.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {course?.shortDescription}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span>{course.readyLessonCount} {t("lessons")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{convertTime(course?.duration)}</span>
                </div>
              </div>
            </div>

            <div className="md:ml-4 md:min-w-[120px] flex justify-start md:justify-end mt-2 md:mt-0">
              {lowestPrice !== null && (
                <div className="bg-secondary px-3 py-1 rounded-full text-orange-900 font-semibold text-sm h-fit">
                  {t("from")} €{lowestPrice.toFixed(2)}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-row justify-between items-center w-full mt-4 gap-3">
            <div className="flex flex-wrap gap-1">
              {course.categories?.map((category) => (
                <Badge
                  key={category.categoryId}
                  variant="secondary"
                  className="bg-primary-light shadow-md border-primary text-gray-800 text-xs"
                >
                  {category.title}
                </Badge>
              ))}
            </div>

            <ActionButtonts course={course} lowestPrice={lowestPrice} />
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default CourseCard;
