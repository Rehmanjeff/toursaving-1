"use client";

import React, { FC, useEffect, useState } from "react";
import LocationInput from "../LocationInput";
import DateTimeInput from "../DateTimeInput";
import IconButton from "@/shared/IconButton";
import HoursInput from "../HoursInput";
import useNextRouter from '@/hooks/useNextRouter';
import { PathName } from "@/routers/types";
import { ChaufferServiceType } from "@/app/(client-components)/type";
import { Location, SearchParams } from "@/app/(client-components)/type";
import { encodeIntoQuery } from "@/utils/userSearch";

export interface ChaufferSearchFormProps {
   userSearch? : ChaufferServiceType,
   size: 'small' | 'normal';
}

const ChaufferSearchForm: FC<ChaufferSearchFormProps> = ({
   userSearch,
   size = 'normal'
}) => {

   const [pickUpError, setPickUpError] = useState<string | null>(null);

   const defaultDate = new Date(new Date());
   defaultDate.setDate(defaultDate.getDate() + 1);
   const defaultTime = "12:00 am";
   const defaultHours = 4;

   const { redirectTo } = useNextRouter();
   const [chaufferSearch, setChaufferSearch] = useState<ChaufferServiceType>(userSearch ? userSearch : {
      pickUp: null,
      hours: defaultHours,
      startDate: defaultDate.getTime(),
      startTime: defaultTime
   });

   const handleLocationInputChange = (location: Location | null, inputIdentifier: string) => {
      if(inputIdentifier == 'pickUp'){

         setPickUpError(null);
         setChaufferSearch((prevSearch) => ({
            ...prevSearch,
            pickUp: location
         }));
      }
   }

   const handleHoursChange = (selectedHours: string) => {

      setChaufferSearch((prevSearch) => ({
         ...prevSearch,
         hours: parseInt(selectedHours)
      }));
   }

   const handleDateTimeChange = (selectedDate: Date | null, selectedTime: string, identified: string) => {

      setChaufferSearch((prevSearch) => ({
         ...prevSearch,
         startDate: selectedDate ? selectedDate.getTime() : null,
         startTime: selectedTime
      }));
   }

   const handleSearch = () => {

      let hasError = false;
      if(chaufferSearch.pickUp == null){

         hasError = true
         setPickUpError('Please provide pick up location');
      }

      if(!hasError){

         const searchQuery = encodeIntoQuery({'chauffer' : chaufferSearch} as SearchParams);
         redirectTo('/search?' + searchQuery as PathName);
      }
   }

   return (
      <form className={`[ ${size=='normal' ? 'w-full relative mt-8 rounded-[40px] xl:rounded-[49px] rounded-t-2xl xl:rounded-t-3xl shadow-xl dark:shadow-2xl bg-white dark:bg-neutral-800' : 'w-full relative'} ]`}>
         <div className={`relative flex flex-row items-center [ ${size=='normal' ? '' : 'w-full rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800'} ]`}>
            <LocationInput error={pickUpError} onInputChange={(location) => handleLocationInputChange(location, "pickUp")} location={chaufferSearch.pickUp !== null ? chaufferSearch.pickUp : null} placeHolder="City or Airport" desc="Pick up location" className="flex-1" divHideVerticalLineClass="-inset-x-0.5" size={size} />
            <div className="self-center border-r border-slate-200 dark:border-slate-700 h-8"></div>
            <HoursInput hours={chaufferSearch.hours?.toString()} onHoursChange={handleHoursChange} desc="Booking hours" className="flex-1" size={size} />
            <div className="self-center border-r border-slate-200 dark:border-slate-700 h-8"></div>
            <DateTimeInput size={size} date={chaufferSearch.startDate ? new Date(chaufferSearch.startDate * 1) : null} time={chaufferSearch.startTime ? chaufferSearch.startTime : ''} onDateTimeChange={(date, time) => handleDateTimeChange(date, time, "start-date-time")} placeHolder="Pickup date and time" className="flex-1" />
            <div className={`[ ${size=='normal' ? 'pr-2 xl:pr-4' : 'pr-1'} ]`}>
               <IconButton type="button" className="text-white" onClick={handleSearch} />
            </div>
         </div>
      </form>
   );
};

export default ChaufferSearchForm;
