"use client";
import Image from "next/image";
import { Heart, Clock, BookOpen, ShoppingBasket } from "lucide-react";
import { convertTime } from "@/app/utils/converToMinutes";
import { Badge } from "@/components/ui/badge";
import { FilteredCourse } from "@/app/types/course";

interface CourseCardProps {
  course: FilteredCourse;
  lowestPrice: number | null;
}

const CourseCard = ({ course, lowestPrice }: CourseCardProps) => {
  return (
    <div className="flex flex-row border-b border-primary pb-4 ">
      <div className="relative min-w-[300px] min-h-[150px] max-h-[200px]">
        <Image
          quality={100}
          height={240}
          width={240}
          alt="Course Thumbnail"
          src={
            course?.thumbnailImage || "/placeholder.svg?height=180&width=300"
          }
          className="object-cover w-full h-full rounded-md"
        />

        {course.language && (
          <Badge
            variant="secondary"
            className="absolute top-2 left-2 border-white border text-gray-800 text-xs font-bold"
          >
            {course.language}
          </Badge>
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

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4 text-primary" />
                <span>{course?.lessonCount} lessons</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-primary" />
                <span>{convertTime(course?.duration)}</span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="ml-4 min-w-[120px] flex justify-end">
            {lowestPrice !== null && (
              <div className="bg-secondary px-3 py-1 rounded-full text-orange-900 font-semibold text-sm h-fit">
                From ${lowestPrice.toFixed(2)}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center w-full mt-4">
          {/* Category badges on the left */}
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

          {/* Icons on the right */}
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-slate-100 bg-white shadow-sm border-primary border  transition-colors">
              <Heart className="h-5 w-5 text-primary transition-colors" />
            </button>
            <button className="p-2 rounded-full hover:bg-slate-100 bg-white shadow-sm border-primary border transition-colors">
              <ShoppingBasket className="h-5 w-5  text-primary transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
