import { Loader } from "lucide-react";
import React from "react";

const loading = () => {
  return <div className="max-w-7xl flex justify-center mb-4">
    <Loader size={32} className="animate-spin mt-10"></Loader>
  </div>;
};

export default loading;
