interface LessonListProps {
  lessons: Array<{
    lessonId: string;
    title: string;
    duration: number;
    isPreview: boolean;
  }>;
  currentLessonId?: string;
  onLessonSelect: (lessonId: string) => void;
}

const LessonList = ({
  lessons,
  currentLessonId,
  onLessonSelect,
}: LessonListProps) => {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}min`;
  };

  return (
    <div className="min-w-[300px] bg-white h-full overflow-y-auto">
      <div className="p-4 border-b-2 border-primary-light/60">
        <h2 className="font-semibold text-gray-900">Course content</h2>
      </div>

      <div className="divide-y">
        {lessons.map((lesson, index) => (
          <div
            key={lesson.lessonId}
            onClick={() => onLessonSelect(lesson.lessonId)}
            className={`p-4 cursor-pointer hover:bg-secondary-light/70 ${
              currentLessonId === lesson.lessonId
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
                  {lesson.isPreview && (
                    <span className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                      Preview
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-400 ml-2">{index + 1}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default LessonList;