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
import Link from "next/link";
import CartSummary from "./components/CartSummary";

const CartPage = () => {
  const { cartItems, hydrated } = useCartStore();

  const { data: freshCartItems, isLoading } = useQuery({
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
    enabled: cartItems.length > 0 && hydrated,
  });

  if (!hydrated) {
    return (
      <>
        <header className="h-[5rem] bg-primary w-full flex">
          <div className="max-w-6xl w-full mx-auto">
            <h1 className="text-5xl font-times mt-4 font-semibold flex items-center text-gray-100">
              Shopping Cart
              <Loader className="h-8 w-8 ml-2 animate-spin"></Loader>
            </h1>
          </div>
        </header>
        <section className="flex gap-8 mx-auto max-w-7xl">
          <div className="w-[70%] h-auto px-4 py-4 mt-2 items-center justify-center">
            <Loader className="h-8 w-8 animate-spin mx-auto" />
          </div>
          <CartSummarySkeleton />
        </section>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <header className="h-[5rem] bg-primary w-full flex">
          <div className="max-w-6xl w-full mx-auto">
            <h1 className="text-5xl font-times mt-4 font-semibold flex items-center text-gray-100">
              Shopping Cart
              {isLoading && (
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
          {cartItems.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              <h2 className="text-2xl font-semibold">Your cart is empty</h2>
              <Link href={"/courses"} className=" underline">
                Browse courses
              </Link>
            </div>
          ) : (
            freshCartItems?.map((item, index) => (
              <CartPageItem
                key={item.cousre?.courseId}
                accessPlanId={cartItems[index].accessPlanId}
                item={item.cousre as Course}
              />
            ))
          )}
        </div>
        <CartSummary />
      </section>
    </>
  );
};

export default CartPage;
