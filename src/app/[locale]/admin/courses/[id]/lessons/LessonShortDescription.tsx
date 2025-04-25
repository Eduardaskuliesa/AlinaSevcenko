import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlignLeft } from "lucide-react";

interface LessonShortDescriptionProps {
  initialValue?: string;
  onChange: (value: string) => void;
}

const LessonShortDescription: React.FC<LessonShortDescriptionProps> = ({
  initialValue = "",
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="mb-8">
      <Label
        htmlFor="lessonShortDescription"
        className="text-base font-semibold flex items-center gap-2 mb-2"
      >
        <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-secondary/20">
          <AlignLeft size={16} className="text-white" />
        </div>
        Lesson Description
      </Label>
      <div className="border-2 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-secondary focus-within:border-transparent transition-all bg-white">
        <Textarea
          id="lessonShortDescription"
          placeholder="A brief description of this lesson"
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 min-h-24 p-4 text-base resize-none bg-white"
          value={initialValue}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default LessonShortDescription;