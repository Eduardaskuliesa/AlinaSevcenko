import React from "react";
import { AlertTriangle } from "lucide-react";

const AlertComponent = () => {
  return (
    <div className="bg-amber-100 p-3 rounded-md">
      <div className="flex items-center">
        <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0" />
        <p className="text-gray-800 font-medium">
          This course can't be published yet
          <span className="text-gray-700 font-normal ml-2">
            Steps completed (5/6)
          </span>
        </p>
      </div>
    </div>
  );
};

export default AlertComponent;
