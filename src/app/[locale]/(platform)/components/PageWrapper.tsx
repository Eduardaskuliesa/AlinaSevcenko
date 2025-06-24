import React from "react";

interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper = ({ children }: PageWrapperProps) => {
  return <div className="max-w-4xl w-full mx-auto pt-8">{children}</div>;
};

export default PageWrapper;
