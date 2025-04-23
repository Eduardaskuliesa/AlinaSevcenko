import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlignLeft } from "lucide-react";

interface FullDescriptionProps {
  initialValue?: string;
  onChange: (value: string) => void;
}

const FullDescription: React.FC<FullDescriptionProps> = ({
  initialValue = "",
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="mb-8">
      <Label
        htmlFor="fullDescription"
        className="text-base font-semibold flex items-center gap-2 mb-2"
      >
        <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-secondary/20">
          <AlignLeft size={16} className="text-white" />
        </div>
        Full Description
      </Label>
      <div className="border-2 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-secondary focus-within:border-transparent transition-all bg-white">
        <Textarea
          id="fullDescription"
          placeholder="Provide a detailed description of your course content, learning outcomes, and target audience"
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 min-h-60 p-4 text-base resize-none bg-white"
          value={initialValue}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default FullDescription;