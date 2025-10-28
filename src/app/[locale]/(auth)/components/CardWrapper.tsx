"use client";
import React, { Suspense } from "react";

interface CardWrapperProps {
  children: React.ReactNode;
}

const CardWrapper = ({ children }: CardWrapperProps) => {
  return (
    <div className="bg-gray-100 max-w-xl w-full h-auto rounded-md sm:rounded-2xl border-2 mb-4 border-gray-800 px-4 lg:px-10 py-6">
      <div className="fadeInUp">
        <Suspense>{children}</Suspense>
      </div>
    </div>
  );
};

export default CardWrapper;
