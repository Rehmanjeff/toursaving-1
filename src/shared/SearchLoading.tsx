"use client";

import React, { FC } from "react";
import CarSkeleton from "@/skeletons/Car";

export interface SearchLoadingProps {}

const SearchLoading: FC<SearchLoadingProps> = () => {

   return (
      <div className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
         <CarSkeleton />
         <CarSkeleton />
         <CarSkeleton />
         <CarSkeleton />
         <CarSkeleton />
         <CarSkeleton />
         <CarSkeleton />
         <CarSkeleton />
      </div>
   );
}
 
export default SearchLoading;