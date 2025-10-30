"use client";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import NavButton from "./NavButton";
import NavItems from "./NavItems";
import { AnimatePresence } from "motion/react";

const mobileVariants = {
  open: {
    width: "calc(100vw - 10px)",
    height: 350,
    top: "-14px",
    right: "-14px",
    transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
  },
  closed: {
    width: 100,
    height: 40,
    top: "0px",
    right: "0px",
    left: "auto",
    transition: { duration: 0.5, delay: 0.1, ease: [0.76, 0, 0.24, 1] },
  },
};

const desktopVariants = {
  open: {
    width: 350,
    height: 350,
    top: "-25px",
    right: "-25px",
    transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
  },
  closed: {
    width: 100,
    height: 40,
    top: "0px",
    right: "0px",
    transition: { duration: 0.5, delay: 0.1, ease: [0.76, 0, 0.24, 1] },
  },
};

const ClientNavBar = () => {
  const [isActive, setIsActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="fixed top-5 right-5 sm:top-10 sm:right-10 z-10">
      <motion.div
        variants={isMobile ? mobileVariants : desktopVariants}
        animate={isActive ? "open" : "closed"}
        initial="closed"
        className="bg-primary rounded-[25px] relative"
        style={{
          width: 350,
          height: 550,
          transformOrigin: "top right",
        }}
      >
        <AnimatePresence>
          {isActive && (
            <NavItems setIsActive={setIsActive} isActive={isActive} />
          )}
        </AnimatePresence>
      </motion.div>
      <NavButton isActive={isActive} setIsActive={setIsActive} />
    </div>
  );
};

export default ClientNavBar;
