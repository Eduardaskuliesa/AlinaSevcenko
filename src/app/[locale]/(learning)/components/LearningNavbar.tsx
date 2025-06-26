"use client";
import { useQuery } from "@tanstack/react-query";
import { enrolledCourseActions } from "@/app/actions/enrolled-course";

const LearningNavbar = ({
  courseId,
  userId,
}: {
  courseId: string;
  userId: string;
}) => {
  const { data: courseData, isLoading: courseLoading } = useQuery({
    queryKey: ["learning-course", courseId],
    queryFn: () => enrolledCourseActions.getCourse(courseId, userId),
  });

  return (
    <div className="bg-primary py-3 px-10 text-xl font-medium text-gray-50 border-b-gray-50 border-b">
      <div className="flex">
        {courseLoading ? (
          <>
            <h3 className="h-7"></h3>
          </>
        ) : (
          <>
            <h3 className="pr-4 border-r-2">Alina Savcenko</h3>
            <h3 className="pl-4">{courseData?.cousre?.title}</h3>
          </>
        )}
      </div>
    </div>
  );
};
export default LearningNavbar;
