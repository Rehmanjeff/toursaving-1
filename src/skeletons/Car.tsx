"use client";

import React from 'react';

const CarSkeleton = () => {
  return (
    <div className="rounded-3xl p-4 bg-gray-300 animate-pulse">
      <div className="flex flex-col">
         <div className="w-full h-24 bg-gray-400 mb-2"></div>
         <div className="space-y-4 h-24">
            <div className="h-3 bg-gray-400"></div>
            <div className="h-3 w-12 bg-gray-400"></div>
            <div className="flex flex-row">
               <div className="h-3 w-16 bg-gray-400"></div>
               <div className="h-3 ml-auto w-8 bg-gray-400"></div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default CarSkeleton;