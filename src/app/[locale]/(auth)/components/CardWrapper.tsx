import React from "react";

interface CardWrapperProps {
  children: React.ReactNode;
}

const CardWrapper = ({ children }: CardWrapperProps) => {
  return (
    <div className="bg-gray-100 max-w-xl  w-full h-auto rounded-md sm:rounded-2xl border-2 border-gray-800 px-8 lg:px-16 py-10">
      {children}
    </div>
  );
};

export default CardWrapper;
