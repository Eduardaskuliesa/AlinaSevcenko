"use client";
import { Course } from "@/app/types/course";
import { FaRegCreditCard } from "react-icons/fa";
import React from "react";
import { CartItem } from "@/app/types/cart";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface CoursePriceProps {
  course: Course;
}

const CoursePrice = ({ course }: CoursePriceProps) => {
  const t = useTranslations("CourseSlugPage");
  const sortedAccessPlans =
    course?.accessPlans.sort((a, b) => a.price - b.price) || [];
  const priceFrom = sortedAccessPlans[0]?.price || 0;

  const cookieItem: CartItem = {
    courseId: course.courseId,
    title: course.title,
    accessPlanId: sortedAccessPlans[0]?.id || "",
    language: course.language,
    lessonCount: course.lessonCount,
    accessDuration: sortedAccessPlans[0]?.duration || 0,
    duration: course.duration,
    imageUrl: course.thumbnailImage,
    price: priceFrom,
    slug: course.slug,
    userId: "",
    isFromPrice: true,
  };
  return (
    <>
      <div className="mt-4 px-2 text-lg underline">
        {t("coursePriceFrom")}{" "}
        <span className="text-green-600">{priceFrom}€</span>{" "}
      </div>
      <Link
        onClick={() =>
          (document.cookie = `pendingItem=${encodeURIComponent(
            JSON.stringify(cookieItem)
          )}; path=/; max-age=600`)
        }
        href="/cart"
        className="ignore-progress bg-secondary relative text-2xl text-gray-950 hover:bg-secondary/80 transition-colors hover:cursor-pointer font-medium tracking-wide w-full py-3 rounded-xl mt-2 shadow-md flex items-center justify-center"
      >
        <FaRegCreditCard
          size={24}
          className="absolute left-5 font-bold"
        ></FaRegCreditCard>
        {t("buy")}
      </Link>
    </>
  );
};

export default CoursePrice;
