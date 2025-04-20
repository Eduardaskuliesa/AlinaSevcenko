import React from "react";

interface CardHeaderProps {
  text: string;
}

const CardHeader = ({ text }: CardHeaderProps) => {
  return (
    <h1 className="text-3xl md:text-4xl text-gray-800">{text}</h1>
  );
};

export default CardHeader;
