"use client";

import React, { FC } from "react";
import IconButton from "@/shared/IconButton";
import useNextRouter from '@/hooks/useNextRouter';
import ButtonPrimary from "./ButtonPrimary";

export interface EmptyStateProps {}

const EmptyState: FC<EmptyStateProps> = () => {
   const { redirectTo } = useNextRouter();

   return (
      <div className="flex flex-col w-full items-center justify-center">
         <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
         </svg>
         <h3 className="mt-2 text-sm font-semibold text-gray-900">No results</h3>
         <p className="mt-1 text-sm text-gray-500">This route is not available at the moment.</p>
         <div className="mt-6">
            <ButtonPrimary onClick={() => {redirectTo('/')}}>Go to Home</ButtonPrimary>
         </div>
      </div>
   );
}
 
export default EmptyState;