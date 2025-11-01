"use client";
import { motion } from "framer-motion";
import { ArrowLeftCircleIcon } from "lucide-react";
import Link from "next/link";
import { memo } from "react";
import { useTranslations } from "next-intl";

export const BackButton = memo(() => {
  const t = useTranslations("Learning.BackButton");
  
  return (
    <Link href="/my-courses/courses">
      <motion.div
        className="bg-primary-light text-base text-gray-800 hover:bg-primary-light/80 rounded-lg items-center py-2 px-3 w-auto inline-flex shadow-md transition-colors duration-300"
        whileHover={{ transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.94 }}
      >
        <div className="flex items-center overflow-hidden">
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowLeftCircleIcon className="h-5 w-5 mr-2" />
          </motion.div>

          <motion.span
            className="font-medium"
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {t("backToMyCourses")}
          </motion.span>
        </div>
      </motion.div>
    </Link>
  );
});

BackButton.displayName = "BackButton";
