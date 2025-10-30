import { Course } from "@/app/types/course";
import {FaRegCreditCard} from 'react-icons/fa'
import React from "react";

interface CoursePriceProps {
  courseAccessPlans: Course["accessPlans"];
}

const CoursePrice = ({ courseAccessPlans }: CoursePriceProps) => {
  const sortedAccessPlans =
    courseAccessPlans?.sort((a, b) => a.price - b.price) || [];
  const priceFrom = sortedAccessPlans[0]?.price || 0;

  return (
    <>
      <div className="mt-4 px-2 text-lg underline">
        Course price starts from:{" "}
        <span className="text-green-600">{priceFrom}€</span>{" "}
      </div>
      <div className="bg-secondary relative text-2xl text-gray-950 hover:bg-secondary/80 transition-colors hover:cursor-pointer font-medium tracking-wide w-full py-3 rounded-xl mt-2 shadow-md flex items-center justify-center">
        <FaRegCreditCard size={24} className="absolute left-5 font-bold"></FaRegCreditCard>
        Buy
      </div>
    </>
  );
};

export default CoursePrice;
