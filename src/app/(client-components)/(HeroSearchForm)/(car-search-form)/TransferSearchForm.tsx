"use client";

import React, { FC, useState } from "react";
import LocationInput from "../LocationInput";
import DateTimeInput from "../DateTimeInput";
import IconButton from "@/shared/IconButton";
import useNextRouter from '@/hooks/useNextRouter';
import { PathName } from "@/routers/types";
import { TransferServiceType } from "@/app/(client-components)/type";
import { Location, SearchParams } from "@/app/(client-components)/type";
import { encodeIntoQuery } from "@/utils/userSearch";

export interface TransferSearchFormProps {
   userSearch? : TransferServiceType,
   size: 'small' | 'normal';
}

const TransferSearchForm: FC<TransferSearchFormProps> = ({
   userSearch,
   size = 'normal'
}) => {

   const [pickUpError, setPickUpError] = useState<string | null>(null);
   const [destinationError, setDestinationError] = useState<string | null>(null);

   const defaultDate = new Date(new Date());
   defaultDate.setDate(defaultDate.getDate() + 1);
   const defaultTime = "12:00 am";

   const { redirectTo } = useNextRouter();
   const [transferSearch, setTransferSearch] = useState<TransferServiceType>(userSearch ? userSearch : {
      pickUp: null,
      destination: null,
      startDate: defaultDate.getTime(),
      startTime: defaultTime
   });
   const handleLocationInputChange = (location: Location | null, inputIdentifier: string) => {
      if(inputIdentifier == 'pickUp'){

         setPickUpError(null);
         setTransferSearch((prevSearch) => ({
            ...prevSearch,
            pickUp: location
         }));
      }
      if(inputIdentifier == 'destination'){

         setDestinationError(null);
         setTransferSearch((prevSearch) => ({
            ...prevSearch,
            destination: location
         }));
      }
   }

   const handleDateTimeChange = (selectedDate: Date | null, selectedTime: string, identified: string) => {

      setTransferSearch((prevSearch) => ({
         ...prevSearch,
         startDate: selectedDate ? selectedDate.getTime() : null,
         startTime: selectedTime
      }));
   }

   const handleSearch = () => {

      let hasError = false;
      if(transferSearch.pickUp == null){

         hasError = true
         setPickUpError('Please provide pick up location');
      }
      if(transferSearch.destination == null){

         hasError = true
         setDestinationError('Please provide destination location');
      }

      if(!hasError){

         const searchQuery = encodeIntoQuery({'transfer' : transferSearch} as SearchParams);
         redirectTo('/search?' + searchQuery as PathName);
      }
   }

   return (
      <form className={`[ ${size=='normal' ? 'w-full relative mt-8 rounded-[40px] xl:rounded-[49px] rounded-t-2xl xl:rounded-t-3xl shadow-xl dark:shadow-2xl bg-white dark:bg-neutral-800' : 'w-full relative'} ]`}>
         <div className={`relative flex flex-row items-center [ ${size=='normal' ? '' : 'w-full rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800'} ]`}>
            <LocationInput location={transferSearch.pickUp !== null ? transferSearch.pickUp : null} error={pickUpError} onInputChange={(location) => handleLocationInputChange(location, "pickUp")} placeHolder="City or Airport" desc="Pick up location" className="flex-1" divHideVerticalLineClass="-inset-x-0.5" size={size} />
            <div className="self-center border-r border-slate-200 dark:border-slate-700 h-8"></div>
            <LocationInput location={transferSearch.destination !== null ? transferSearch.destination : null} error={destinationError} onInputChange={(location) => handleLocationInputChange(location, "destination")} placeHolder="City or Airport" desc="Destination location" className="flex-1" divHideVerticalLineClass="-inset-x-0.5" size={size} />
            <div className="self-center border-r border-slate-200 dark:border-slate-700 h-8"></div>
            <DateTimeInput size={size} date={transferSearch.startDate ? new Date(transferSearch.startDate * 1) : null} time={transferSearch.startTime ? transferSearch.startTime : ''} onDateTimeChange={(date, time) => handleDateTimeChange(date, time, "start-date-time")} placeHolder="Pickup date and time" className="flex-1" />
            <div className={`[ ${size=='normal' ? 'pr-2 xl:pr-4' : 'pr-1'} ]`}>
               <IconButton type="button" className="text-white" onClick={handleSearch} />
            </div>
         </div>
      </form>
   );
};

export default TransferSearchForm;
