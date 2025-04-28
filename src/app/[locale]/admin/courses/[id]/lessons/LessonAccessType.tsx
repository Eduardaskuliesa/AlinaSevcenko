import React, { useState, useLayoutEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock, Unlock } from "lucide-react";

interface LessonAccessTypeProps {
  initialValue?: boolean;
  onChange: (isFree: boolean) => void;
}

const LessonAccessType: React.FC<LessonAccessTypeProps> = ({
  initialValue,
  onChange,
}) => {
  const [isFree, setIsFree] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useLayoutEffect(() => {
    if (initialValue !== undefined) {
      setIsFree(initialValue);
      setIsInitialized(true);
    }
  }, [initialValue]);

  if (!isInitialized) {
    return null;
  }

  return (
    <div className="mb-8">
      <Label className="text-base font-semibold flex items-center gap-2 mb-2">
        <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-secondary/20">
          {isFree ? (
            <Unlock size={16} className="text-white" />
          ) : (
            <Lock size={16} className="text-white" />
          )}
        </div>
        Lesson Access Type
      </Label>
      <div className="border-2 rounded-lg p-4 bg-white flex gap-4">
        <Button
          type="button"
          variant={isFree ? "default" : "ghost"}
          onClick={() => onChange(true)}
          className={`flex-1 bg-gray-100 ${
            isFree ? "bg-primary text-white" : ""
          }`}
        >
          <Unlock size={16} className="mr-2" />
          Free Preview
        </Button>
        <Button
          type="button"
          variant={!isFree ? "default" : "ghost"}
          onClick={() => onChange(false)}
          className={`flex-1 bg-gray-100 ${
            !isFree ? "bg-primary text-white" : ""
          }`}
        >
          <Lock size={16} className="mr-2" />
          Paid Access
        </Button>
      </div>
    </div>
  );
};

export default LessonAccessType;
