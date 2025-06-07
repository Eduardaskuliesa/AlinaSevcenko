"use client";
import { Play } from "lucide-react";
import Link from "next/link";
import React from "react";
import { motion } from "motion/react";

const StartLearningButton = () => {
  return (
    <Link href={"/my-courses/courses"} className="">
      <motion.button
        className="bg-primary-light hover:bg-primary-light/80 text-gray-800 px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
        whileTap={{ scale: 0.96 }}
      >
        <Play className="w-4 h-4" />
        Start Learning
      </motion.button>
    </Link>
  );
};

export default StartLearningButton;
