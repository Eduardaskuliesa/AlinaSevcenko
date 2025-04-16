import React from "react";
import { motion } from "motion/react";

interface NavBarBodyProps {
  isActive: boolean;
  children: React.ReactNode;
}

const variants = {
  open: {
    width: 350,
    height: 550,
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

const NavBarBody: React.FC<NavBarBodyProps> = ({ isActive, children }) => {
  return (
    <motion.div
      variants={variants}
      animate={isActive ? "open" : "closed"}
      initial="closed"
      className="bg-primary rounded-[25px] relative sm:w-auto w-full "
    >
      {children}
    </motion.div>
  );
};

export default NavBarBody;
