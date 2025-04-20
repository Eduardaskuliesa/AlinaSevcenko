"use client";
import React from "react";
import { motion } from "motion/react";

interface CardWrapperProps {
  children: React.ReactNode;
}

const CardWrapper = ({ children }: CardWrapperProps) => {
  return (
    <div className="bg-gray-100 max-w-xl w-full h-auto rounded-md sm:rounded-2xl border-2 border-gray-800 px-8 lg:px-16 py-10">
      <motion.div
        key="card-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default CardWrapper;
