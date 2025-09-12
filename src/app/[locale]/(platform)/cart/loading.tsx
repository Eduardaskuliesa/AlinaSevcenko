import { Loader } from "lucide-react";
import React from "react";
import { CartSummarySkeleton } from "./components/skeletons/CartSummarySkeleton";

const loading = () => {
  return (
    <>
      <header className="h-[5rem] bg-primary w-full flex">
        <div className="max-w-6xl w-full mx-auto">
          <h1 className="text-5xl font-times mt-4 font-semibold flex items-center text-gray-100">
            Shopping Cart
            <Loader className="text-2xl ml-2 animate-spin"></Loader>
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
};

export default loading;
