import { CartItem } from "@/app/types/cart";
import { cn } from "@/lib/tiptap-utils";
import Link from "next/link";
import React, { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { useCartStore } from "@/app/store/useCartStore";
import { useTranslations } from "next-intl";


function CartListItem({ item, isLast }: { item: CartItem; isLast: boolean }) {
  const t = useTranslations("CartList");
  
  return (
    <div className={cn("p-3", !isLast && "border-b border-primary-light")}>
      <Link href={`/courses/${item.slug}?price=${item.price}`}>
        <div className="flex gap-2">
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
              {item.isFromPrice ? `${t("from")} ` : ""}${item.price.toFixed(2)}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

function GoToCartButton({
  setOpenDropdown,
}: {
  setOpenDropdown: Dispatch<SetStateAction<string | null>>;
}) {
  const t = useTranslations("CartList");
  const { totalPrice } = useCartStore();
  const closeDropdown = () => {
    setOpenDropdown(null);
  };
  return (
    <div className="p-3 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-1px_rgba(0,0,0,0.06)]">
      <p className="text-lg font-medium text-gray-800 mb-2">
        {t("total")}:{totalPrice}$
      </p>
      <Link
        onClick={() => {
          closeDropdown();
        }}
        href={"/cart"}
      >
        <motion.button
          whileTap={{ scale: 0.96, translateY: 2 }}
          className="w-full bg-primary-light border hover:bg-primary-light/80 text-gray-800 font-medium py-1 rounded-md transition-colors"
        >
          {t("goToCart")}
        </motion.button>
      </Link>
    </div>
  );
}

const CartList = ({
  openDropdown,
  setOpenDropdown,
}: {
  openDropdown: string | null;
  setOpenDropdown: Dispatch<SetStateAction<string | null>>;
}) => {
  const t = useTranslations("CartList");
  const { cartItems } = useCartStore();
  return (
    <div
      className={cn(
        "absolute right-0 mt-2 rounded-md shadow-lg bg-white z-10 border border-primary-light w-64",
        "transition-all duration-200",
        openDropdown === "cart"
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-1 pointer-events-none invisible"
      )}
    >
      <div className="">
        {cartItems.length > 0 ? (
          <>
            {cartItems.map((item, index) => (
              <CartListItem
                key={item.courseId}
                item={item}
                isLast={index === cartItems.length - 1}
              />
            ))}
            <GoToCartButton setOpenDropdown={setOpenDropdown} />
          </>
        ) : (
          <div className="text-center py-4">
            <h3 className="text-base font-medium mb-2">{t("yourCartIsEmpty")}</h3>
            <Link href={"/courses"}>
              <p className="text-pink-900 font-medium text-base">
                {t("keepShopping")}
              </p>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartList;
