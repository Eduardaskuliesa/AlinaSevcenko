import React from "react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

interface PerspectiveTextProps {
  label: string;
}

const PerspectiveText = ({ label }: PerspectiveTextProps) => {
  return (
    <div
      style={{
        transformStyle:"preserve-3d",
      }}
      className="w-full h-full group flex items-center justify-center"
    >
      <p className="">
        {label}
      </p>
      <p
        style={{
          transformOrigin: "bottom center",
          transform: "rotateX(-90deg) translateY(10px)",
        }}
        className="absolute opacity-0 "
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
  const t = useTranslations("MainNav");

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
          <PerspectiveText label={t("menu")} />
        </div>
        <div className="absolute top-full bg-gray-100 text-gray-800 h-full w-full uppercase">
          <PerspectiveText label={t("close")} />
        </div>
      </motion.div>
    </div>
  );
};

export default NavButton;
