"use client";

import React from "react";
import { Plus } from "lucide-react";

interface AddPlanButtonProps {
  onClick: () => void;
  className?: string;
}

export const AddPlanButton: React.FC<AddPlanButtonProps> = ({
  onClick,
  className = "",
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white p-6 border-2 border-dashed border-gray-300 rounded-lg shadow-sm 
      flex flex-col items-center justify-center h-full min-h-[300px] transition-all duration-200
      hover:border-primary/60 hover:bg-gray-50 cursor-pointer ${className}`}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
          <Plus size={32} className="text-primary" />
        </div>
        <p className="text-lg font-medium text-gray-600">Add New Plan</p>
      </div>
    </div>
  );
};
