"use client";
import { Link } from "@/i18n/navigation";
import React from "react";
import { motion } from "motion/react";
import { useTransitionRouter } from "next-view-transitions";
import { pageAnimation } from "../../pageTransition";

interface NavItemsProps {
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  isActive: boolean;
}

const perspective = {
  initial: {
    opacity: 0,
    rotateX: 90,
    transalteY: 80,
    translateX: -20,
  },
  enter: (i: number) => ({
    opacity: 1,
    rotateX: 0,
    transalteY: 0,
    translateX: 0,
    transition: {
      duration: 0.6,
      delay: 0.35 + i * 0.08,
      ease: [0.215, 0.61, 0.355, 1],
    },
  }),
  exit: {
    opacity: 0,
    transition: { duration: 0.3, ease: [0.76, 0, 0.24, 1] },
  },
};

const Links = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Personal", href: "/personal" },
  { name: "Account", href: "/user/profile", skipTransition: true },
];

const NavItems: React.FC<NavItemsProps> = ({ setIsActive, isActive }) => {
  const router = useTransitionRouter();
  return (
    <div className="h-full px-[40px] pt-[100px] pb-[50px] box-border">
      <div className="flex flex-col gap-2">
        {Links.map((link, i) => (
          <div
            key={i}
            style={{ perspective: "120px", perspectiveOrigin: "top" }}
          >
            <motion.div
              variants={perspective}
              animate="enter"
              exit="exit"
              initial="initial"
              custom={i}
            >
              <Link
                onClick={(e) => {
                  e.preventDefault();
                  setIsActive(!isActive);
                  if (link.skipTransition) {
                    window.location.href = link.href;
                  } else {
                    router.push(link.href, {
                      onTransitionReady: pageAnimation,
                    });
                  }
                }}
                className="text-4xl"
                href={link.href}
              >
                {link.name}
              </Link>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NavItems;
