import React, { useState, useLayoutEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock, Unlock } from "lucide-react";

interface LessonAccessTypeProps {
  isPublshed?: boolean;
  initialValue?: boolean;
  onChange: (isFree: boolean) => void;
}

const LessonAccessType: React.FC<LessonAccessTypeProps> = ({
  initialValue,
  isPublshed,
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
    <div className="mb-4 sm:mb-8">
      <Label className="text-sm sm:text-base font-semibold flex items-center gap-2 mb-2">
        <div className="bg-primary w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center ring-4 ring-secondary/20">
          {isFree ? (
            <Unlock className="text-white w-4 sm:w-5 h-4 sm:h-5" />
          ) : (
            <Lock className="text-white w-4 sm:w-5 h-4 sm:h-5" />
          )}
        </div>
        Lesson Access Type
      </Label>
      <div className="border-2 rounded-lg p-3 sm:p-4 bg-white flex gap-2 sm:gap-4">
        <Button
          type="button"
          disabled={isPublshed}
          variant={isFree ? "default" : "ghost"}
          onClick={() => {
            setIsFree(true);
            onChange(true);
          }}
          className={`flex-1 h-8 sm:h-10 text-xs sm:text-sm bg-gray-100 ${
            isFree ? "bg-primary text-white" : ""
          }`}
        >
          <Unlock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          Free Preview
        </Button>
        <Button
          disabled={isPublshed}
          type="button"
          variant={!isFree ? "default" : "ghost"}
          onClick={() => {
            setIsFree(false);
            onChange(false);
          }}
          className={`flex-1 h-8 sm:h-10 text-xs sm:text-sm bg-gray-100 ${
            !isFree ? "bg-primary text-white" : ""
          }`}
        >
          <Lock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          Paid Access
        </Button>
      </div>
    </div>
  );
};

export default LessonAccessType;
