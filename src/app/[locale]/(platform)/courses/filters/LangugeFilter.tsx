"use client";
import { ArrowDown } from "lucide-react";
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";

interface LanguageFilterProps {
  selectedLanguages: string[];
  setSelectedLanguages: (languages: string[]) => void;
}

const LanguageFilter = ({
  selectedLanguages,
  setSelectedLanguages,
}: LanguageFilterProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const languages = ["Lithuanian", "Russian"];

  const toggleLanguage = (language: string) => {
    if (selectedLanguages.includes(language)) {
      setSelectedLanguages(selectedLanguages.filter((l) => l !== language));
    } else {
      setSelectedLanguages([...selectedLanguages, language]);
    }
  };

  return (
    <div className="py-4 border-b border-primary-light">
      <div
        className="flex flex-row justify-between w-full items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <p className="text-xl font-semibold text-gray-800">Language</p>
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
              {languages.map((language) => (
                <div key={language} className="flex items-center space-x-4">
                  <Checkbox
                    id={`language-${language}`}
                    checked={selectedLanguages.includes(language)}
                    onCheckedChange={() => toggleLanguage(language)}
                  />
                  <label
                    htmlFor={`language-${language}`}
                    className="text-gray-800 cursor-pointer"
                  >
                    {language}
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

export default LanguageFilter;
