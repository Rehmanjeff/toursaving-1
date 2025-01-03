"use client";

import React, { Fragment, useState, useRef, useEffect } from "react";
import { FC } from "react";
import NcInputNumber from "./NcInputNumber";
import { CarAdditionalService } from "@/data/types";
import { getCurrencySymbol } from "@/utils/currency";

export interface ChooseChildSeatsProps {
   maxSeats: number;
   services: CarAdditionalService[];
   handleChange: (index: number, value: number) => void;
}

const ChooseChildSeats: FC<ChooseChildSeatsProps> = ({
   maxSeats,
   services,
   handleChange
}) => {

   const [inputValues, setInputValues] = useState<number[]>(new Array(services.length).fill(0));

   const handleInputChange = (index: number, value: number) => {
      
      const updatedInputValues = [...inputValues];
      updatedInputValues[index] = value;
      setInputValues(updatedInputValues);

      handleChange(index, value);
   }

   return (
      <>
      {services.map((service, index) => {
         const remainingSeats = maxSeats - inputValues.reduce((sum, value) => sum + value, 0) + inputValues[index];
         return (
            <div key={index} className="rounded-2xl shadow-sm ring-1 ring-black ring-opacity-5 bg-white dark:bg-neutral-800 p-8 my-4">
               <div className="flex flex-row">
                  <div className="flex flex-col">
                     <div>{service.name}</div>
                     <div className="font-semibold text-sm">+{getCurrencySymbol(service.currency ? service.currency : 'usd')}{service.price} per seat</div>
                  </div>
                  <div className="ml-auto">
                     <NcInputNumber
                        className="w-full"
                        defaultValue={0}
                        max={remainingSeats}
                        min={0}
                        onChange={(value) => handleInputChange(index, value)}
                     />
                  </div>
               </div>
            </div>
         );
      })}
   </>
   );
};

export default ChooseChildSeats;