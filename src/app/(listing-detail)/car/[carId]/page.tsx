"use client";

import React, { FC, useEffect, useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import FiveStartIconForRate from "@/components/FiveStartIconForRate";
import StartRating from "@/components/StartRating";
import Badge from "@/shared/Badge";
import ButtonCircle from "@/shared/ButtonCircle";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Input from "@/shared/Input";
import Image from "next/image";
import LikeSaveBtns from "@/components/LikeSaveBtns";
import HeroSearchFormSmall from "@/app/(client-components)/(HeroSearchFormSmall)/HeroSearchFormSmall";
import { PathName } from "@/routers/types";
import { CarDataType } from "@/data/types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCouch } from '@fortawesome/free-solid-svg-icons'
import { UserSearch } from "@/app/(client-components)/type";
import { capitalizeFirstLetter } from "@/utils/random";
import { format } from 'date-fns';
import { getCurrencySymbol } from "@/utils/currency";
import { faClock } from '@fortawesome/free-solid-svg-icons'
import useNextRouter from "@/hooks/useNextRouter";
import CarDetailsLoading from "@/shared/CarDetailsLoading";

export interface ListingCarDetailPageProps {params: { carId: string }}

const ListingCarDetailPage: FC<ListingCarDetailPageProps> = ({params}) => {

   const [editSearch, setEditSearch] = useState<boolean>(false);
   const [car, setCar] = useState<CarDataType|null>(null);
   const [isLoading, setIsLoading] = useState<Boolean>(true);
   const [search, setSearch] = useState<UserSearch | null>(null);
   const [alert, setAlert] = useState<string | boolean>(false);
   const { carId } = params;
   const { redirectTo } = useNextRouter();
   
   useEffect(() => {

      fetch('/api/car', {
         method: 'POST', 
         headers: {'Content-Type': 'application/json'}, 
         body: JSON.stringify({
            'id': carId
         })})
         .then((response) => response.json())
         .then((data) => {
            setIsLoading(false);
            setCar(data.car as CarDataType);
            setSearch(data.search as UserSearch);
         })
         .catch((error) => {
            setIsLoading(false);
            console.error('Error fetching data:', error);
         });
   },[]);

   useEffect(() => {

      localStorage.setItem('tour-search', JSON.stringify(search));
      localStorage.setItem('tour-checkout-vehicle', JSON.stringify(car));
   },[search]);

   const handleCheckout = () => {

      let hasError = false;
      if(search && search.chauffer && search.chauffer.hours && car && car.chauffer){

         if(search.chauffer.hours < car.chauffer.minimumHours){
            hasError = true;
            setAlert('This vehicle comes with booking duration of minimum '+ car.chauffer.minimumHours +' hours');
         }
      }

      if(!hasError){

         redirectTo('/checkout' as PathName);
      }
   }

   const toggleEditSearch = () => {

      setEditSearch(!editSearch);
   }

   const syncBookingHours = () => {

      const currentSearch = localStorage.getItem('tour-search');
      if(currentSearch){

         let newSearch = JSON.parse(currentSearch) as UserSearch;
         if(newSearch && newSearch.chauffer && car && car.chauffer){
            newSearch.chauffer.hours = car.chauffer.minimumHours;
         }

         setSearch(newSearch);
         redirectTo('/checkout' as PathName);
      }
   }
   
   const renderSection1 = () => {
      return (
         <div className="listingSection__wrap !space-y-6">
         <div className="flex justify-between items-center">
            <Badge color="green" name={car?.title} />
            <LikeSaveBtns />
         </div>

         <div className="flex flex-col-reverse gap-1 md:flex-row md:gap-0 items-start">
            <div className="flex flex-col gap-6">
               <div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">{car?.shortDescription} or similar</h2>
               </div>
               <div className="flex items-center space-x-4">
                  <span>
                     Supplier: 
                     <span className="ml-1"> {car?.supplier}</span>
                  </span>
                  <span>·</span>
                  <StartRating />
               </div>
            </div>
            <div className="flex items-center ml-auto">
               <Image className="w-full" layout="fixed" width={300} height={150} src={car?.featuredImage as string} alt="car image" />
            </div>
         </div>
         <div className="w-full border-b border-neutral-100 dark:border-neutral-700" />
            <div className="flex items-center justify-between xl:justify-start space-x-8 xl:space-x-12 text-sm text-neutral-700 dark:text-neutral-300">
               <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 text-center sm:text-left sm:space-x-3 ">
                  <FontAwesomeIcon icon={faCouch} className="text-neutral-500 dark:text-neutral-400" />
                  <span className="">{car?.seats} seats</span>
               </div>
               {car && car.chauffer && (<div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 text-center sm:text-left sm:space-x-3 ">
                  <FontAwesomeIcon icon={faClock} className="text-neutral-500 dark:text-neutral-400" />
                  <span className="">{car.chauffer.minimumHours} hours minimum</span>
               </div>)}
            </div>
         </div>
      );
   };

   const renderSection3 = () => {
      return (
         <div className="listingSection__wrap">
            <div>
               <h2 className="text-2xl font-semibold">Include </h2>
               <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
                  Included in the price
               </span>
            </div>
            <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm text-neutral-700 dark:text-neutral-300 ">
               <div className="flex items-center space-x-3">
                  <i className="las la-check-circle text-2xl"></i>
                  <span>Free cancellation for upto 12 hours</span>
               </div>
               {car && car.additionalServices?.map((item) => {
                  if (item.defaultInclude.toString() == 'true') {
                     return <div key={item.id} className="flex items-center space-x-3"><i className="las la-check-circle text-2xl"></i><span>{item.name}</span></div>;
                  }
               })}
            </div>
         </div>
      );
   };

   const renderSection6 = () => {
      return (
         <div className="listingSection__wrap">
         <h2 className="text-2xl font-semibold">Reviews (23 reviews)</h2>
         <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
            <div className="space-y-5">
            <FiveStartIconForRate iconClass="w-6 h-6" className="space-x-0.5" />
            <div className="relative">
               <Input fontClass="" sizeClass="h-16 px-4 py-3" rounded="rounded-3xl" placeholder="Share your thoughts ..." />
               <ButtonCircle className="absolute right-2 top-1/2 transform -translate-y-1/2" size=" w-12 h-12 ">
                  <ArrowRightIcon className="w-5 h-5" />
               </ButtonCircle>
            </div>
         </div>
         </div>
      );
   };

   const renderSection8 = () => {
      return (
         <div className="listingSection__wrap">
            <h2 className="text-2xl font-semibold">Extras</h2>  
            <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {car && car.additionalServices?.map((item) => {
               if (item.defaultInclude.toString() == 'false') {
                  return <div key={item.id} className="rounded-md bg-gray-50 px-6 py-5 sm:flex sm:items-start sm:justify-between">
                     <div className="sm:flex sm:items-start">
                        <div className="mt-3 sm:ml-4 sm:mt-0">
                           <div className="text-sm font-medium text-gray-900">{item.name}</div>
                           <div className="mt-1 text-sm text-gray-600 sm:flex sm:items-center">
                              <div>{item.currency ? getCurrencySymbol(item.currency) : ''}{item.price}</div>
                           </div>
                        </div>
                     </div>
                     <div className="mt-4 sm:ml-6 sm:mt-0 sm:flex-shrink-0">
                        <button type="button" className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Add</button>
                     </div>
                  </div>;
               }
            })}
            </div>
         </div>
      );
   };

   const renderSidebarPrice = () => {
      return (
         <div className="listingSectionSidebar__wrap shadow-xl">
            <div className="flex justify-between items-center">
               <span className="text-3xl font-semibold">

                  {getCurrencySymbol(car?.currency ? car?.currency : 'usd')}
                  {car && search && search.type === 'transfer' && (
                     <>{car.grandTotal}</>
                  )}
                  {car && car.chauffer && search && search.type === 'chauffer' && search.chauffer && search.chauffer.hours && (
                     <>{car.chauffer.ratePerHour} / Hr</>
                  )}
               </span>
               {car && car.chauffer && search && search.type === 'chauffer' && search.chauffer && search.chauffer.hours && (
                  <span className="text-neutral-500 dark:text-neutral-400">
                     Min Hours: {car.chauffer.minimumHours}
                  </span>
               )}
            </div>
            <form className="border border-neutral-200 dark:border-neutral-700 rounded-2xl">
      
            </form>
            <div className="flex flex-col space-y-4 ">

               {search && search.type == 'chauffer' && car && car.priceBreakdown.length && car.priceBreakdown.map((item, index) => (
                  <div className="flex flex-col space-y-4" key={index} >
                     <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                        <span>{item.name}</span>
                        <span>{getCurrencySymbol(car?.currency ? car?.currency : 'usd')}{item.price}</span>
                     </div>
                     <div className="border-b border-neutral-200 dark:border-neutral-700"></div>
                  </div>
               ))}
               <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{getCurrencySymbol(car?.currency ? car?.currency : 'usd')}{car?.grandTotal}</span>
               </div>
            </div>
            <ButtonPrimary onClick={handleCheckout}>Reserve</ButtonPrimary>
            {alert && (<div className="rounded-md bg-yellow-50 p-4 mt-4">
               <div className="flex flex-col ml-3">
                  <div className="mt-2 text-sm text-yellow-600 flex flex-col items-start w-full">
                     <p>{alert}</p>
                     <p className="mt-5">
                        <span onClick={syncBookingHours} className="whitespace-nowrap font-medium hover:text-yellow-800 hover:border-yellow-800 cursor-pointer border-yellow-600 text-sm rounded-2xl px-2 py-1 border">Yes, proceed</span>
                     </p>
                  </div>
               </div>
            </div>)}
         </div>
      );
   };

   const renderSidebarDetail = () => {
      return (
         <div className="listingSection__wrap lg:shadow-xl">
            <div className="flex flex-row items-center">
               {search && search.type && (<span className="text-2xl font-semibold block">{capitalizeFirstLetter(search.type)} service</span>)}
               <ButtonCircle onClick={toggleEditSearch} type="button" className="ml-auto" size="w-10 h-10">
                  <i className="las la-edit text-xl"></i>
               </ButtonCircle>
            </div>
            <div className="mt-8 flex">
               <div className="flex-shrink-0 flex flex-col items-center">
                  <span className="block w-6 h-6 rounded-full border border-neutral-400"></span>
                  <span className="block flex-grow border-l border-neutral-400 border-dashed my-1"></span>
                  <span className="block w-6 h-6 rounded-full border border-neutral-400"></span>
               </div>
               {search && search.type && (<div className="ml-4 space-y-14 text-sm">
                  <div className="flex flex-col space-y-2">
                     <span className=" text-neutral-500 dark:text-neutral-400">
                        {format(parseInt(search[search.type]?.startDate?.toString() ?? '', 10), 'EEEE, MMMM d')} - {search[search.type]?.startTime}
                     </span>
                     <span className="font-semibold">
                        {search[search.type]?.pickUp?.name}
                     </span>
                  </div>
                  <div className="flex flex-col space-y-2">
                     {search.type == 'rental' && <span className=" text-neutral-500 dark:text-neutral-400">{format(parseInt(search[search.type]?.endDate?.toString() ?? '', 10), 'EEEE, MMMM d')} . {search[search.type]?.endTime}</span>}
                     {search.type == 'transfer' && <span className="font-semibold">{search[search.type]?.destination?.name}</span>}
                     {search.type == 'chauffer' && <span className="font-semibold">{search[search.type]?.hours} Hours</span>}
                  </div>
               </div>)}
            </div>
         </div>
      );
   };

   if(isLoading){

      return (<CarDetailsLoading />)
   }else{
      
      return (
         <div className={` nc-ListingCarDetailPage `}>
            <div className="hidden lg:block mt-10">
               {editSearch && search && (<HeroSearchFormSmall search={search} />)}
            </div>
            <main className=" relative z-10 mt-11 flex flex-col lg:flex-row ">
               <div className="w-full lg:w-3/5 xl:w-2/3 space-y-8 lg:pr-10 lg:space-y-10">
                  {renderSection1()}
                  <div className="block lg:hidden">{renderSidebarDetail()}</div>
                  {renderSection3()}
                  {renderSection6()}
               </div>
   
               <div className="block flex-grow mt-14 lg:mt-0">
                  {renderSidebarDetail()}
                  <div className="hidden lg:block mt-10 sticky top-28">
                     {renderSidebarPrice()}
                  </div>
               </div>
            </main>
         </div>
      );
   }
};

export default ListingCarDetailPage;

