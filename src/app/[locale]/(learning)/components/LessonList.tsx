import { useCoursePlayerStore } from "@/app/store/useCoursePlayerStore";
import { CheckCircle2 } from "lucide-react";

interface LessonListProps {
  lessons: Array<{
    lessonId: string;
    title: string;
    duration: number;
    isPreview: boolean;
  }>;
  courseId: string;
  userId: string;
}

const LessonList = ({ lessons, courseId, userId }: LessonListProps) => {
  const {
    setIsLessonChanging,
    selectedLessonId,
    setSelectedLessonId,
    updateSelectedLessonId,
    lessonProgressMap,
  } = useCoursePlayerStore();

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}min`;
  };

  return (
    <div className="min-w-[450px] h-full">
      <div className="divide-y sticky top-[0rem] h-fit overflow-y-auto bg-white">
        <div className="p-4 border-b-2 border-primary-light/60">
          <h2 className="font-semibold text-gray-900">Course content</h2>
        </div>
        {lessons.map((lesson, index) => {
          const isCompleted = lessonProgressMap[lesson.lessonId]?.completed;

          return (
            <div
              key={lesson.lessonId}
              onClick={() => {
                setSelectedLessonId(lesson.lessonId);
                setIsLessonChanging(true);
                updateSelectedLessonId(
                  courseId,
                  userId,
                  lesson.lessonId,
                  lesson.duration
                );
              }}
              className={`p-4 cursor-pointer hover:bg-secondary-light/70 ${
                selectedLessonId === lesson.lessonId
                  ? "bg-secondary-light border-l-2 border-primary"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                    {lesson.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{formatDuration(lesson.duration)}</span>
                    {isCompleted && (
                      <span className="flex items-center gap-1 bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3" />
                        Completed
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-400 ml-2">{index + 1}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default LessonList;
