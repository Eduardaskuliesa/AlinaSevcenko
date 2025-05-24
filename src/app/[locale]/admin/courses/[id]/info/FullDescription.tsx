import React from "react";
import { Label } from "@/components/ui/label";
import { AlignLeft } from "lucide-react";
import { CourseEditor } from "@/components/tiptap-templates/course-editor";

interface FullDescriptionProps {
  initialValue?: string;
  onChange: (value: string) => void;
}

const FullDescription: React.FC<FullDescriptionProps> = ({
  initialValue = "",
  onChange,
}) => {

  console.log("FullDescription initialValue:", initialValue);
  return (
    <div className="mb-4 lg:mb-8">
      <Label
        htmlFor="fullDescription"
        className="text-sm lg:text-base font-semibold flex items-center gap-2 mb-2"
      >
        <div className="bg-primary w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center ring-4 ring-secondary/20">
          <AlignLeft className="text-white w-4 h-4 lg:w-5 lg:h-5" />
        </div>
        Full Description
      </Label>
      <div className="border-2 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-secondary focus-within:border-transparent transition-all">
        <CourseEditor 
          initialValue={initialValue} 
          onChange={onChange} 
        />
      </div>
    </div>
  );
};

export default FullDescription;
