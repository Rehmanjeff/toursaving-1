"use client";

import React, { Fragment, useState, useRef } from "react";
import { FC } from "react";
import DatePicker from "react-datepicker";
import { Popover, Transition } from "@headlessui/react";
import { CalendarIcon } from "@heroicons/react/24/outline";
import DatePickerCustomHeaderTwoMonth from "@/components/DatePickerCustomHeaderTwoMonth";
import DatePickerCustomDay from "@/components/DatePickerCustomDay";
import ClearDataButton from "./ClearDataButton";
import TimePicker from '@/shared/TimePicker';
import ButtonPrimary from "@/shared/ButtonPrimary";

export interface DateTimeInputProps {
  className?: string;
  size: 'small' | 'normal';
  placeHolder?: string;
  date: Date | null;
  time: string;
  onDateTimeChange: (selectedDate: Date | null, selectedTime: string, inputIdentifier?: string) => void;
  inputIdentifier?: string;
}

const DateTimeInput: FC<DateTimeInputProps> = ({
  className = "",
  size = "normal",
  placeHolder = "Date and time",
  date,
  time,
  onDateTimeChange,
  inputIdentifier,
}) => {
   const [startDate, setStartDate] = useState<Date | null>(date);
   const [selectedTime, setSelectedTime] = useState(time);

   const handleTimeSelect = (time: string) => {
      setSelectedTime(time);
      onDateTimeChange(startDate, time, inputIdentifier);
   };
   const resetValue = () => {
      setStartDate(date);
      setSelectedTime(time);
      onDateTimeChange(startDate, time, inputIdentifier);
   };

   const popoverRef = useRef<HTMLButtonElement>(null);

   const onChangeDate = (dates: [Date | null]) => {
      const [start] = dates;
      setStartDate(start);
      onDateTimeChange(start, selectedTime);
   };

   const handleSubmitButton = () => {

      if (popoverRef.current && popoverRef.current instanceof HTMLButtonElement) {
         popoverRef.current.click();
      }
   }

   const renderInput = () => {
      return (
         <>
         {size == 'normal' && (<div className="text-neutral-300 dark:text-neutral-400">
            <CalendarIcon className="w-5 h-5 lg:w-7 lg:h-7" />
         </div>)}
         <div className="flex-grow text-left">
            <span className="block xl:text-lg font-semibold">
               {startDate?.toLocaleDateString("en-US", {month: "short", day: "2-digit"}) || "Choose date"} - {selectedTime ? selectedTime : ''}
            </span>
            <span className="block mt-1 text-sm text-neutral-400 leading-none font-light">
               {placeHolder}
            </span>
         </div>
         </>
      );
   };

   return (
      <>
         <Popover className={`FlightDateRangeInput relative flex ${className}`}>
         {({ open }) => (
            <>
               <div className={`flex-1 z-10 flex items-center focus:outline-none ${open ? "nc-hero-field-focused" : "" }`}>
               <Popover.Button ref={popoverRef} className={`flex-1 z-10 flex relative [ ${size=='normal'?'nc-hero-field-padding':'nc-hero-field-padding--small'} ] items-center space-x-3 focus:outline-none `}>
                  {renderInput()}
                  {startDate && open && (<ClearDataButton onClick={resetValue} />)}
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
               <Popover.Panel className="absolute left-1/2 z-20 mt-3 top-full w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl">
                  <div className="overflow-hidden rounded-3xl shadow-lg ring-1 ring-black ring-opacity-5 bg-white dark:bg-neutral-800 p-8">
                     <DatePicker
                        selected={startDate}
                        onChange={(date:any) => onChangeDate([date])}
                        monthsShown={2}
                        showPopperArrow={false}
                        inline
                        renderCustomHeader={(p:any) => (
                           <DatePickerCustomHeaderTwoMonth {...p} />
                        )}
                        renderDayContents={(day:any, date:any) => (
                           <DatePickerCustomDay dayOfMonth={day} date={date} />
                        )}
                     />
                     <div className="flex flex-col">
                        <div className="flex flex-col mt-5">
                           <h2 className="text-sm lg:text-base font-medium my-5">Choose Time</h2>
                           <TimePicker time={selectedTime} onTimeSelect={handleTimeSelect} />
                        </div>
                        <div className="ml-auto mt-5">
                           <ButtonPrimary type="button" onClick={handleSubmitButton}>Done</ButtonPrimary>
                        </div>
                     </div>
                  </div>
               </Popover.Panel>
               </Transition>
            </>
         )}
         </Popover>
      </>
   );
};

export default DateTimeInput;
