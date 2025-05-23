'use client';
import { BackButton } from '../components/AnimteBackButton';
import PreviewPlayer from './components/PreviewPlayer';
import LessonDescription from '../components/LessonDescription';
import LessonContent from '../components/LessonContent';
import { Course, Lesson } from '@/app/types/course';

interface CoursePageClientProps {
  course: Course;
  previewLesson: Lesson;
  courseLessons: Lesson[];
}

export default function CoursePageClient({ 
  course, 
  previewLesson, 
  courseLessons 
}: CoursePageClientProps) {
  return (
    <>
      <header className="h-[5rem] bg-primary w-full flex">
        <div className="max-w-6xl w-full mx-auto">
          <h1 className="text-5xl font-times mt-4 font-semibold text-gray-100">
            {course?.title}
          </h1>
        </div>
      </header>

      <section className="flex gap-8 mx-auto max-w-7xl">
        <div className="w-[70%] h-auto px-4 py-4">
          <BackButton />
          {previewLesson && <PreviewPlayer lessonData={previewLesson} />}
          <LessonDescription courseData={course} />
          <LessonContent courseLessons={courseLessons ?? []} />
        </div>
        <div className="w-[30%] bg-slate-900 max-h-[550px]"></div>
      </section>
    </>
  );
}