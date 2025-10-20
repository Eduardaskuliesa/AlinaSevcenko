"use client";
import { useCartStore } from "@/app/store/useCartStore";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const WishlistWrapper = () => {
  const { wishlistItems, removeFromWishlist, addToCart } = useCartStore();
  const userId = useSession().data?.user.id || "";
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleAddToCart = (item: (typeof wishlistItems)[0]) => {
    addToCart(item, item.isFromPrice);
    setRemovingId(item.courseId);
    setTimeout(() => {
      removeFromWishlist(item.courseId, userId);
      setRemovingId(null);
    }, 300);
  };

  const handleRemove = (courseId: string) => {
    setRemovingId(courseId);
    setTimeout(() => {
      removeFromWishlist(courseId, userId);
      setRemovingId(null);
    }, 300);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10">
        <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
        <Link href="/courses" className="text-pink-900 underline font-medium">
          Browse courses
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pb-4">
      {wishlistItems.map((item) => (
        <motion.div
          key={item.courseId}
          animate={
            removingId === item.courseId
              ? { opacity: 0, scale: 0.95 }
              : { opacity: 1, scale: 1 }
          }
          transition={{ duration: 0.3 }}
          className="border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
        >
          <div className="relative aspect-video w-full">
            <Image
              quality={90}
              src={item.imageUrl || "/placeholder.svg"}
              alt={item.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="p-4 space-y-1">
            <div className="">
              <h3 className="font-semibold text-base line-clamp-2 leading-tight">
                {item.title}
              </h3>
            </div>

            <div className="text-lg font-bold text-gray-800">
              {item.isFromPrice && "From "}€{item.price.toFixed(2)}
            </div>

            <div className="flex gap-2 pt-2">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => handleAddToCart(item)}
                className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-2 rounded-md transition-colors text-sm"
              >
                Add to Cart
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => handleRemove(item.courseId)}
                className="flex-1 border border-gray-300 bg-primary-light hover:bg-primary-light/80 text-gray-700 font-medium py-2 rounded-md transition-colors text-sm"
              >
                Remove
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default WishlistWrapper;
