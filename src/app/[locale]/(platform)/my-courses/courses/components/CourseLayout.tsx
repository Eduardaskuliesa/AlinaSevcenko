import type { EnrolledCourse } from "@/app/types/enrolled-course";
import CourseCard from "./CourseCard";

interface CourseLayoutProps {
  courseData: EnrolledCourse[];
}

const CourseLayout = ({ courseData }: CourseLayoutProps) => {
  return (
    <div className="space-y-4 pb-20">
      {courseData.map((course) => (
        <CourseCard key={course.courseId} course={course} />
      ))}
    </div>
  );
};

export default CourseLayout;
