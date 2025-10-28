"use client";
import { useCartStore } from "@/app/store/useCartStore";
import { cn } from "@/lib/utils";
import React, { Dispatch, SetStateAction, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { CartItem } from "@/app/types/cart";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

function WishListItem({ item, isLast }: { item: CartItem; isLast: boolean }) {
  const t = useTranslations("WishList");
  const { addToCart, removeFromWishlist } = useCartStore();
  const [isRemoving, setIsRemoving] = useState(false);

  const userId = useSession().data?.user.id || "";

  const handleAddToCart = () => {
    setIsRemoving(true);

    setTimeout(() => {
      addToCart(item, item.isFromPrice);
      removeFromWishlist(item.courseId, userId);
    }, 200);
  };

  return (
    <motion.div
      animate={
        isRemoving
          ? {
              opacity: 0,
              translateY: -10,
              scale: 0.98,
            }
          : {
              opacity: 1,
              translateY: 0,
              scale: 1,
            }
      }
      transition={{ duration: 0.3, ease: "easeIn" }}
      className={cn("p-3", !isLast && "border-b border-primary-light")}
    >
      <div className="flex gap-2 mb-3">
        <Image
          quality={90}
          src={item.imageUrl || "/placeholder.svg"}
          alt={item.title}
          width={50}
          height={50}
          className="h-[50px] w-[50px] rounded-md flex-shrink-0 object-cover"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-base line-clamp-2 leading-tight">
            {item.title}
          </h3>
          <div className="text-sm text-gray-600 font-medium">
            {item.isFromPrice ? `${t("from")} ` : ""}€{item.price.toFixed(2)}
          </div>
        </div>
      </div>
      <motion.button
        whileTap={{ scale: 0.96, translateY: 2 }}
        onClick={handleAddToCart}
        className="w-full border-primary-light border hover:bg-primary/30 text-pink-900 font-medium py-1 rounded-md transition-colors"
      >
        {t("addToCart")}
      </motion.button>
    </motion.div>
  );
}

function GoToWishListButton({
  setOpenDropdown,
}: {
  setOpenDropdown: Dispatch<SetStateAction<string | null>>;
}) {
  const t = useTranslations("WishList");
  const closeDropdown = () => {
    setOpenDropdown(null);
  };
  return (
    <div className="p-3 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-1px_rgba(0,0,0,0.06)]">
      <Link onClick={closeDropdown} href={"/my-courses/wishlist"}>
        <motion.button
          whileTap={{ scale: 0.96, translateY: 2 }}
          className="w-full bg-primary-light border hover:bg-primary-light/80 text-gray-800 font-medium py-1 rounded-md transition-colors"
        >
          {t("goToWishlist")}
        </motion.button>
      </Link>
    </div>
  );
}

const WhishList = ({
  openDropdown,
  setOpenDropdown,
}: {
  openDropdown: string | null;
  setOpenDropdown: Dispatch<SetStateAction<string | null>>;
}) => {
  const t = useTranslations("WishList");
  const { wishlistItems } = useCartStore();
  const pathname = usePathname();
  const isOnWishlistPage = pathname.endsWith("/my-courses/wishlist");

  return (
    <motion.div
      className={cn(
        "absolute right-0 mt-2 rounded-md shadow-lg bg-slate-50 z-10 border border-primary-light w-64",
        "transition-all duration-200",
        openDropdown === "wishlist"
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-1 pointer-events-none invisible"
      )}
    >
      {wishlistItems.length > 0 ? (
        <>
          {wishlistItems.map((item, index) => (
            <WishListItem
              key={item.courseId}
              item={item}
              isLast={index === wishlistItems.length - 1}
            />
          ))}
          {!isOnWishlistPage && (
            <GoToWishListButton setOpenDropdown={setOpenDropdown} />
          )}
        </>
      ) : (
        <div className="py-4">
          <div className="text-center">
            <h3 className="text-base font-medium mb-2">
              {t("yourWishlistIsEmpty")}
            </h3>
            <Link href={"/courses"} onClick={() => setOpenDropdown(null)}>
              <p className="text-pink-900 font-medium text-base">
                {t("exploreCourses")}
              </p>
            </Link>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default WhishList;
