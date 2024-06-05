"use client";

import React, { FC } from "react";
import CarSkeleton from "@/skeletons/Car";

export interface CarDetailsLoadingProps {}

const CarDetailsLoading: FC<CarDetailsLoadingProps> = () => {

   return (
      <div className="grid grid-cols-1 mt-10">
         <div className="relative z-10 mt-11 flex flex-col lg:flex-row">
            <div className="w-full lg:w-3/5 xl:w-2/3 space-y-8 lg:pr-10 lg:space-y-10">
               <CarSkeleton />
               <CarSkeleton />
               <CarSkeleton />
            </div>
            <div className="hidden md:flex flex-col flex-grow mt-14 lg:mt-0 gap-10">
               <CarSkeleton />
               <CarSkeleton />
            </div>
         </div>
      </div>
   );
}
 
export default CarDetailsLoading;