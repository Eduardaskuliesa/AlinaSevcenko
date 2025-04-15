import React from "react";
import { motion } from "motion/react";

interface PerspectiveTextProps {
  label: string;
}

const PerspectiveText = ({ label }: PerspectiveTextProps) => {
  return (
    <div
      style={{
        transformStyle: "preserve-3d",
      }}
      className="w-full h-full group flex items-center justify-center hover:[transform:rotateX(90deg)] duration-[0.75s] ease-[cubic-bezier(0.76,0,0.24,1)]"
    >
      <p className="group-hover:-translate-y-full group-hover:opacity-0 duration-[0.75s] ease-[cubic-bezier(0.76,0,0.24,1)]">
        {label}
      </p>
      <p
        style={{
          transformOrigin: "bottom center",
          transform: "rotateX(-90deg) translateY(10px)",
        }}
        className="absolute opacity-0  group-hover:opacity-100 duration-[0.75s] ease-[cubic-bezier(0.76,0,0.24,1)]"
      >
        {label}
      </p>
    </div>
  );
};

interface NavButtonProps {
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
}

const NavButton: React.FC<NavButtonProps> = ({ isActive, setIsActive }) => {
  return (
    <div
      onClick={() => setIsActive(!isActive)}
      className="h-[40px] w-[100px] rounded-[25px] cursor-pointer bg-primary  overflow-hidden absolute top-0 right-0"
    >
      <motion.div
        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
        animate={{ top: isActive ? "-100%" : "0" }}
        className="relative h-[40px] w-[100px]"
      >
        <div className="h-full w-full flex items-center justify-center bg-primary uppercase">
          <PerspectiveText label="Menu" />
        </div>
        <div className="absolute top-full bg-gray-100 text-gray-800 h-full w-full uppercase">
          <PerspectiveText label="Close" />
        </div>
      </motion.div>
    </div>
  );
};

export default NavButton;
