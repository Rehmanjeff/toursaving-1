"use client";

import React, { Fragment, useState, useRef, useEffect } from "react";
import { FC } from "react";
import { Popover, Transition } from "@headlessui/react";
import NcInputNumber from "./NcInputNumber";

export interface ChoosePassengersProps {
   className?: string;
   maxPassengers:number;
   onChange: (adults: number, children: number) => void;
}


const ChoosePassengers: FC<ChoosePassengersProps> = ({
   className = "",
   maxPassengers,
   onChange
}) => {

   const getOutputString = (adults : number, children : number) => {

      let response = '';
      response += adults > 1 || adults == 0 ? adults + ' adults' : adults + ' adult';
      response += children > 1 || children == 0 ? ', ' + children + ' children' : ', ' + children + ' child';

      return response;
   }

   const defaultAdults : number = 1;
   const defaultChildren : number = 0;
   const [adults, setAdults] = useState<number>(defaultAdults);
   const [children, setChildren] = useState<number>(defaultChildren);
   const [maxAdults, setMaxAdults] = useState<number>(maxPassengers);
   const [maxChildren, setMaxChildren] = useState<number>(maxPassengers - 1);
   const [output, setOutput] = useState<string>(getOutputString(defaultAdults, defaultChildren));

   const handleChangeData = (value: number, type: string) => {

      const diff = maxPassengers - value;
      if(type == 'adults'){

         setAdults(value);
         setMaxChildren(diff);
      }else if(type == 'children'){

         setChildren(value);
         setMaxAdults(diff);
      }
   };

   useEffect(() => {

      setOutput(getOutputString(adults, children));
      onChange(adults, children);
   },[adults, children]);

   const popoverRef = useRef<HTMLButtonElement>(null);

   return (
      <>
         <Popover className={`FlightDateRangeInput relative flex ${className}`}>
         {({ open }) => (
            <>
               <div className={`z-10 flex items-center focus:outline-none`}>
               <Popover.Button ref={popoverRef} className={`z-10 flex relative items-center space-x-3 focus:outline-none  w-fit`}>
                  <div className="text-blue-500 border-b border-blue-500 border-dashed cursor-pointer"> 
                     {output}
                  </div>
               </Popover.Button>
               </div>

               {open && (<div className="h-8 absolute self-center top-1/2 -translate-y-1/2 z-0 -left-0.5 right-10 bg-white dark:bg-neutral-800"></div>)}

               <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
               >
                  <Popover.Panel className="absolute left-0 z-20 mt-3 top-full w-screen max-w-sm transform px-4 sm:px-0">
                     <div className="overflow-hidden rounded-3xl shadow-lg ring-1 ring-black ring-opacity-5 bg-white dark:bg-neutral-800 p-8">
                        <NcInputNumber
                           className="w-full"
                           defaultValue={adults}
                           onChange={(value) => handleChangeData(value, "adults")}
                           max={maxAdults}
                           min={1}
                           label="Adults"
                           desc="Ages 4 or above"
                        />
                        <NcInputNumber
                           className="w-full mt-6"
                           defaultValue={children}
                           onChange={(value) =>
                              handleChangeData(value, "children")
                           }
                           max={maxChildren}
                           label="Children"
                           desc="Upto 4 years"
                        />
                     </div>
                  </Popover.Panel>
               </Transition>
            </>
         )}
         </Popover>
      </>
   );
};

export default ChoosePassengers;
