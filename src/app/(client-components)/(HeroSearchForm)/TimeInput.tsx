"use client";

import React, { Fragment, useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import { FC } from "react";
import { ClockIcon } from "@heroicons/react/24/outline";
import ClearDataButton from "./ClearDataButton";

export interface TimeInputProps {
   fieldClassName?: string;
   className?: string;
   placeholder?: string;
   desc: string
}

const timeData = [ '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'];

const TimeInput: FC<TimeInputProps> = ({
   fieldClassName = "[ nc-hero-field-padding ]",
   className = "[ nc-flex-1 ]",
   placeholder = 'Choose time',
   desc = ''
}) => {
   const [inputValue, setInputValue] = useState("");

   const handleChangeData = (value: string) => {

      setInputValue(value);
   };

   return (
      <Popover className={`flex relative ${className}`}>
         {({ open }) => (
            <>
               <div
                  className={`flex-1 z-10 flex items-center focus:outline-none ${
                  open ? "nc-hero-field-focused" : ""
                  }`}
               >
                  <Popover.Button
                  className={`relative z-10 flex-1 flex text-left items-center ${fieldClassName} space-x-3 focus:outline-none`}
                  >
                     <div className="text-neutral-300 dark:text-neutral-400">
                        <ClockIcon className="w-5 h-5 lg:w-7 lg:h-7" />
                     </div>
                     <div className="flex-grow text-left">
                        <span className="block xl:text-lg font-semibold">
                           {inputValue ? inputValue : placeholder}
                        </span>
                        <span className="block mt-1 text-sm text-neutral-400 leading-none font-light">
                           {desc}
                        </span>
                        {inputValue && open && (
                           <ClearDataButton onClick={() => {setInputValue("")}} />
                        )}
                     </div>
                  </Popover.Button>
               </div>

               {open && (
                  <div className="h-8 absolute self-center top-1/2 -translate-y-1/2 z-0 -left-0.5 right-0.5 bg-white dark:bg-neutral-800"></div>
               )}

               <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
               >
                  <div className="absolute right-0 z-40 w-full sm:min-w-[340px] max-h-[300px] overflow-y-auto max-w-sm bg-white dark:bg-neutral-800 top-full mt-3 py-5 sm:py-6 rounded-3xl shadow-xl">
                  {timeData.map((item) => (
                     <div key={item} onClick={() => handleChangeData(item)} className="px-4 sm:px-8 cursor-pointer rounded-md py-3 hover:bg-neutral-50 dark:hover:bg-neutral-700">{item}</div>
                  ))}
                  </div>
               </Transition>
            </>
         )}
      </Popover>
   );
};

export default TimeInput;
