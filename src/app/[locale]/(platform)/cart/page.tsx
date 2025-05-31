"use client";
import { coursesAction } from "@/app/actions/coursers";
import { useCartStore } from "@/app/store/useCartStore";
import { Course } from "@/app/types/course";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { CartLoaderSkeleton } from "./components/CartLoderSkeleton";
import { CartSummarySkeleton } from "./components/CartSummarySkeleton";
import { CartPageItem } from "./components/CartPageItem";
import { Loader } from "lucide-react";

const CartPage = () => {
  const { cartItems } = useCartStore();

  const { data: freshCartItems, isFetching } = useQuery({
    queryKey: ["cartItems", cartItems.map((item) => item.courseId)],
    queryFn: async () => {
      return await Promise.all(
        cartItems.map(async (item) => {
          return await coursesAction.courses.getCourse(item.courseId);
        })
      );
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 2,
    enabled: cartItems.length > 0,
  });

  if (isFetching) {
    return (
      <>
        <header className="h-[5rem] bg-primary w-full flex">
          <div className="max-w-6xl w-full mx-auto">
            <h1 className="text-5xl font-times mt-4 font-semibold flex items-center text-gray-100">
              Shopping Cart
              {isFetching && (
                <Loader className="h-8 w-8 ml-2 animate-spin"></Loader>
              )}
            </h1>
          </div>
        </header>
        <section className="flex gap-8 mx-auto max-w-7xl">
          <div className="w-[70%] h-auto px-4 py-4 mt-2">
            {Array.from({ length: cartItems.length }).map((_, index) => (
              <CartLoaderSkeleton key={index} />
            ))}
          </div>
          <CartSummarySkeleton />
        </section>
      </>
    );
  }

  return (
    <>
      <header className="h-[5rem] bg-primary w-full flex">
        <div className="max-w-6xl w-full mx-auto">
          <h1 className="text-5xl font-times mt-4 font-semibold text-gray-100">
            Shopping Cart
          </h1>
        </div>
      </header>
      <section className="flex gap-8 mx-auto max-w-7xl">
        <div className="w-[70%] h-auto px-4 py-4 mt-2">
          {freshCartItems?.map((item, index) => (
            <CartPageItem
              key={item.cousre?.courseId}
              accessDuration={cartItems[index].accessDuration}
              item={item.cousre as Course}
            />
          ))}
        </div>
        <div className="w-[30%] h-[200px] mt-6 sticky top-[2rem] bg-white border-primary-light/60 border-2 rounded-lg p-4">
          <h3 className="font-semibold text-lg text-gray-800">Cart Summary</h3>
          <p className="text-gray-600 mt-2">Total: €0.00</p>
        </div>
      </section>
    </>
  );
};

export default CartPage;
