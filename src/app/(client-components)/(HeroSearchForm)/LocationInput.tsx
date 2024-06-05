"use client";

import { ClockIcon, MapPinIcon } from "@heroicons/react/24/outline";
import React, { useState, useRef, useEffect, FC, ChangeEvent } from "react";
import ClearDataButton from "./ClearDataButton";
import { Location } from "@/app/(client-components)/type";
import LoaderIcon from "@/shared/LoaderIcon";
import Image from "next/image";

export interface LocationInputProps {
   placeHolder?: string;
   size: 'small' | 'normal';
   desc?: string;
   className?: string;
   divHideVerticalLineClass?: string;
   autoFocus?: boolean;
   location?: Location | null,
   onInputChange: (location: Location | null, inputIdentifier?: string) => void;
   inputIdentifier?: string;
   error?: string | null
}

const LocationInput: FC<LocationInputProps> = ({
   autoFocus = false,
   placeHolder = "Location",
   desc = "Where are you going?",
   className = "nc-flex-1.5",
   divHideVerticalLineClass = "left-10 -right-0.5",
   location = null,
   onInputChange,
   inputIdentifier,
   error = null,
   size='normal'
}) => {
   const containerRef = useRef<HTMLDivElement>(null);
   const inputRef = useRef<HTMLInputElement>(null);

   const [value, setValue] = useState(location ? location.name : '');
   const [locationResults, setLocationResults] = useState<Location[] | null>(null);
   const [isLoading, setIsLoading] = useState<Boolean>(false);
   const [showPopover, setShowPopover] = useState(autoFocus);

   const resetValue = () => {

      setValue('');
      onInputChange(null, inputIdentifier);
   };

   useEffect(() => {
      setShowPopover(autoFocus);
   }, [autoFocus]);

   useEffect(() => {

      if(showPopover == false){
         setLocationResults(null);
      }

      if (eventClickOutsideDiv) {
         document.removeEventListener("click", eventClickOutsideDiv);
      }
      showPopover && document.addEventListener("click", eventClickOutsideDiv);

      return () => {
         document.removeEventListener("click", eventClickOutsideDiv);
      };
   }, [showPopover]);

   useEffect(() => {
      if (showPopover && inputRef.current) {
         inputRef.current.focus();
      }
   }, [showPopover]);

   const eventClickOutsideDiv = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!showPopover || containerRef.current.contains(event.target as Node)) {
         return;
      }
      
      setShowPopover(false);
   };

   const handleSelectLocation = (item: Location) => {
      setValue(item.name);
      setShowPopover(false);
      onInputChange(item, inputIdentifier);
   };

   const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {

      const query = e.target.value;
      if(query.length > 2){

         setIsLoading(true);
         fetch(`/api/locations/${encodeURIComponent(query)}`)
            .then((response) => response.json())
            .then((data) => {
               let locations : Location[] = [];
               data.data.forEach((item:any) => {
                  const coords = item.geometry.location.lat + ',' + item.geometry.location.lng;
                  locations.push({id: item.place_id, name: item.name, icon: item.icon, coords: coords, desc: item.formatted_address, isAirport: item.types.includes('airport')});
               });

               setLocationResults(locations);
               setShowPopover(true);
               setIsLoading(false);
            })
            .catch((error) => {
               console.error('Error fetching data:', error);
               setIsLoading(false);
            });
      }else{

         setShowPopover(false);
      }

      setValue(query);
   }

   const renderSearchValue = () => {
      return (
         <>
         {locationResults && locationResults.map((item) => (
            <span onClick={() => handleSelectLocation(item)} key={item.id} className="flex flex-row items-start space-x-3 sm:space-x-4 px-4 sm:px-8 py-4 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer">
               <span className="block text-neutral-400 mt-2">
                  {item.icon && (<Image src={item.icon} alt="car main thumbnail" width="20" height="20" />)}
               </span>
               <span className="flex flex-col">
                  <span className="block font-medium text-neutral-700 dark:text-neutral-200">{item.name}</span>
                  {item.desc && (<span className="text-xs text-gray-400">{item.desc}</span>)}
               </span>
            </span>
         ))}
         </>
      );
   };

   return (
      <div className={`relative flex ${className}`} ref={containerRef}>
         <div onClick={() => setShowPopover(true)} className={`flex z-10 flex-1 relative [ ${size=='normal'?'nc-hero-field-padding':'nc-hero-field-padding--small'} ] flex-shrink-0 items-center space-x-3 cursor-pointer focus:outline-none text-left  ${showPopover ? "nc-hero-field-focused" : ""}`}>
            {size == 'normal' && (<div className="text-neutral-300 dark:text-neutral-400"><MapPinIcon className="w-5 h-5 lg:w-7 lg:h-7" /></div>)}
            <div className="flex-grow">
               <input className={`block w-full bg-transparent border-none focus:ring-0 p-0 focus:outline-none focus:placeholder-neutral-300 ${size=='normal'?'xl:text-lg':'xl:text-base'} font-semibold placeholder-neutral-800 dark:placeholder-neutral-200 truncate`} placeholder={placeHolder} value={value} autoFocus={showPopover} onChange={handleInputChange} ref={inputRef} />
               <span className="block mt-0.5 text-sm text-neutral-400 font-light ">
                  {error !== null && <span className="text-theme-red font-medium">{error}</span>}
                  {error === null && <span className="line-clamp-1">{!!value ? placeHolder : desc}</span>}
               </span>
               {value && (isLoading ? <div className="absolute right-1 lg:right-3 top-1/2 transform -translate-y-1/2"><LoaderIcon /></div> : <ClearDataButton onClick={resetValue} />)}
            </div>
         </div>

         {showPopover && (<div className={`h-8 absolute self-center top-1/2 -translate-y-1/2 z-0 bg-white dark:bg-neutral-800 ${divHideVerticalLineClass}`}></div>)}

         {showPopover && locationResults && locationResults!.length > 0 && (
         <div className="absolute left-0 z-40 w-full min-w-[300px] sm:min-w-[500px] bg-white dark:bg-neutral-800 top-full mt-3 py-3 sm:py-6 rounded-3xl shadow-xl max-h-96 overflow-y-auto">
            {renderSearchValue()}
         </div>
         )}
      </div>
   );
};

export default LocationInput;
