"use client";

import CarCard from "@/components/CarCard";
import React, { useState } from "react";
import ButtonSecondary from "@/shared/ButtonSecondary";
import { CarDataType } from "@/data/types";
import { PathName } from "@/routers/types";

const AccountSavelists = () => {
  
   const cars : CarDataType[] = [];

  const renderSection1 = () => {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h2 className="text-3xl font-semibold">Saved cars</h2>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

        <div className="mt-8">
            <div className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
               {cars.filter((_, i) => i < 8).map((stay) => (
                  <CarCard key={stay.id} car={stay} />
               ))}
            </div>
            <div className="flex mt-11 justify-center items-center">
               <ButtonSecondary>Show me more</ButtonSecondary>
            </div>
        </div>
      </div>
    );
  };

  return renderSection1();
};

export default AccountSavelists;
