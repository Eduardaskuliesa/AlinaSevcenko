"use client";
import { useCartStore } from "@/app/store/useCartStore";
import { FilteredCourse } from "@/app/types/course";
import { Heart, ShoppingBasket } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import React, { useState } from "react";

const ActionButtons = ({
  course,
  lowestPrice,
}: {
  course: FilteredCourse;
  lowestPrice: number | null;
}) => {
  const {
    addToCart,
    removeFromCart,
    addToWishlist,
    removeFromWishlist,
    wishlistItems,
    cartItems,
  } = useCartStore();
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>(
    []
  );

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (isInWishlist) {
      removeFromWishlist(course.courseId);
    } else {
      addToWishlist(
        {
          courseId: course.courseId,
          title: course.title,
          slug: course.slug,
          price: lowestPrice || 0,
          imageUrl: course.thumbnailImage || "",
          accessDuration: course.duration || 0,
        },
        true
      ); // true = "from" price
    }

    const newHearts = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 60,
      y: (Math.random() - 0.5) * 60,
    }));

    setHearts((prev) => [...prev, ...newHearts]);

    setTimeout(() => {
      setHearts((prev) =>
        prev.filter(
          (heart) => !newHearts.some((newHeart) => newHeart.id === heart.id)
        )
      );
    }, 1000);
  };

  const isInWishlist = wishlistItems.some(
    (item) => item.courseId === course.courseId
  );

  const isInCartList = cartItems.some(
    (item) => item.courseId === course.courseId
  );

  const handleCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (isInCartList) {
      removeFromCart(course.courseId);
    } else {
      addToCart(
        {
          courseId: course.courseId,
          title: course.title,
          slug: course.slug,
          price: lowestPrice || 0,
          imageUrl: course.thumbnailImage || "",
          accessDuration: course.duration || 0,
        },
        true
      ); // true = "from" price
    }
  };

  return (
    <div className="flex items-center gap-2 relative">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleHeartClick}
        className="p-2 rounded-full hover:bg-slate-100 bg-white shadow-sm border-primary border transition-colors relative"
      >
        {isInWishlist ? (
          <Heart
            fill="#f7d09e"
            className="h-5 w-5 text-primary transition-colors"
          />
        ) : (
          <Heart className="h-5 w-5 text-primary transition-colors" />
        )}

        {/* Floating hearts */}
        <AnimatePresence>
          {hearts.map((heart) => (
            <motion.div
              key={heart.id}
              initial={{
                opacity: 1,
                scale: 0.5,
                x: 0,
                y: 0,
              }}
              animate={{
                opacity: 0,
                scale: 1.2,
                x: heart.x,
                y: heart.y - 20,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 pointer-events-none"
              style={{ transform: "translate(-50%, -50%)" }}
            >
              <Heart fill="#f7d09e" className="h-4 w-4 text-primary" />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleCartClick}
        className={`p-2 rounded-full hover:bg-slate-100 shadow-sm border-primary border transition-colors ${
          isInCartList ? "bg-primary/10" : "bg-white"
        }`}
      >
        <ShoppingBasket
          className={`h-5 w-5 transition-colors ${
            isInCartList ? "text-primary fill-current" : "text-primary"
          }`}
          fill={isInCartList ? "currentColor" : "none"}
        />
      </motion.button>
    </div>
  );
};

export default ActionButtons;
