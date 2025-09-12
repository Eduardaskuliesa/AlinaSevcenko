import React from "react";
import { Loader } from "lucide-react";

const PaymentListSkeleton = () => {
  return (
    <div className="flex items-center justify-center">
        <Loader className="animate-spin h-10 w-10"></Loader>
    </div>
  );
};
export default PaymentListSkeleton;
