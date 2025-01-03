"use client";

import React, { FC } from "react";
import CarSkeleton from "@/skeletons/Car";

export interface PayDoneLoadingProps {}

const PayDoneLoading: FC<PayDoneLoadingProps> = () => {

   return (
      <div className="grid grid-cols-1 mt-10">
         <div className="relative z-10 mt-11 flex flex-col">
            <div className="w-full space-y-8 lg:pr-10 lg:space-y-10">
               <CarSkeleton />
            </div>
            <div className="relative z-10 mt-11 flex flex-col lg:flex-row">
               <div className="w-full lg:w-1/2 xl:w-1/2 space-y-8 lg:pr-10 lg:space-y-10">
                  <CarSkeleton />
               </div>
               <div className="w-full lg:w-1/2 xl:w-1/2 space-y-8 lg:pr-10 lg:space-y-10">
                  <CarSkeleton />
               </div>
            </div>
         </div>
      </div>
   );
}
 
export default PayDoneLoading;