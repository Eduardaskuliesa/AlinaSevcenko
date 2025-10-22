"use client";
import { ArrowDown } from "lucide-react";
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

interface DurationFilterProps {
  selectedDurations: string[];
  setSelectedDurations: (durations: string[]) => void;
}

const DurationFilter = ({
  selectedDurations,
  setSelectedDurations,
}: DurationFilterProps) => {
  const t = useTranslations("CoursesPage");
  const [isOpen, setIsOpen] = useState(true);
  const durations = ["0-1 hour", "1-3 hours", "3-6 hours", "5-10 hours"];

  const getDurationLabel = (duration: string) => {
    switch (duration) {
      case "0-1 hour":
        return t("durationOptions.0-1");
      case "1-3 hours":
        return t("durationOptions.1-3");
      case "3-6 hours":
        return t("durationOptions.3-6");
      case "5-10 hours":
        return t("durationOptions.5-10");
      default:
        return duration;
    }
  };

  const toggleDuration = (duration: string) => {
    if (selectedDurations.includes(duration)) {
      setSelectedDurations(selectedDurations.filter((d) => d !== duration));
    } else {
      setSelectedDurations([...selectedDurations, duration]);
    }
  };

  return (
    <div className="py-4 border-b border-t border-primary-light">
      <div
        className="flex flex-row justify-between w-full items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <p className="text-xl font-semibold text-gray-800">{t("duration")}</p>
        <div
          className={`p-1 bg-primary-light rounded-md transition-transform duration-200 ${
            isOpen ? "" : "rotate-180"
          }`}
        >
          <ArrowDown className="h-5 w-5 text-gray-800" />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col mt-2 space-y-2 pt-2">
              {durations.map((duration) => (
                <div
                  key={duration}
                  className="flex items-center space-x-4 cursor-pointer"
                  onClick={() => toggleDuration(duration)}
                >
                  <Checkbox
                    id={`duration-${duration}`}
                    checked={selectedDurations.includes(duration)}
                    className="cursor-pointer"
                    onCheckedChange={() => toggleDuration(duration)}
                  />
                  <label
                    htmlFor={`duration-${duration}`}
                    className="text-gray-800 cursor-pointer w-full"
                  >
                    {getDurationLabel(duration)}
                  </label>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DurationFilter;
