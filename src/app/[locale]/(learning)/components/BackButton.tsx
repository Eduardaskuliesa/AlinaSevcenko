"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftCircleIcon } from "lucide-react";
import Link from "next/link";
import { memo } from "react";

export const BackButton = memo(() => {
  return (
    <Link href="/my-courses/courses">
      <motion.div
        className="bg-primary-light text-gray-800 hover:bg-primary-light/80 rounded-lg items-center py-2 px-3 w-auto inline-flex shadow-md transition-colors duration-300"
        whileHover={{ transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.94 }}
      >
        <AnimatePresence mode="wait">
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
              Back to my courses
            </motion.span>
          </div>
        </AnimatePresence>
      </motion.div>
    </Link>
  );
});

BackButton.displayName = "BackButton";