import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";

interface LessonTitleProps {
  initialValue?: string;
  onChange: (value: string) => void;
}

const LessonTitle: React.FC<LessonTitleProps> = ({
  initialValue,
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="mb-4 sm:mb-8">
      <Label
        htmlFor="lessonTitle"
        className="text-sm sm:text-base font-semibold flex items-center gap-2 mb-2"
      >
        <div className="bg-primary w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ring-4 ring-secondary/20">
          <BookOpen className="text-white w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        Lesson Title
      </Label>
      <div className="border-2 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-secondary focus-within:border-transparent transition-all bg-white">
        <Input
          id="lessonTitle"
          placeholder="Enter lesson title"
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-10 sm:h-14 px-3 sm:px-4 text-sm sm:text-base bg-white"
          value={initialValue}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default LessonTitle;