"use client";

import StartRating from "@/components/StartRating";
import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import LikeSaveBtns from "@/components/LikeSaveBtns";
import Badge from "@/shared/Badge";
import { Booking } from "@/data/types";
import { getCurrencySymbol } from "@/utils/currency";
import { getErrorMessage } from "@/utils/common";
import Notification from '@/shared/Notification';
import { useNotification } from "@/hooks/useNotification";
import useFileDownload from "@/hooks/useFileDonwload";
import PayDoneLoading from "@/shared/PayDoneLoading";
import EmptyState from "@/shared/EmptyState";

export interface PayPageProps {}

const PayPage: FC<PayPageProps> = () => {

   const [booking, setBooking] = useState<Booking|null>(null);
   const [isLoading, setIsLoading] = useState<boolean>(true);
   const [hasError, setHasError] = useState<false | string>(false);
   const { notification, showNotification, hideNotification } = useNotification();
   const { downloadLink } = useFileDownload();

   const handleDownloadClick = (file: string) => {
      downloadLink({
         filePath: file,
      }).handleDownload();
   };

   useEffect(() => {

      const fetchBooking = () => {

         const bookingNumber = localStorage.getItem('tour-booking-number');
         if(bookingNumber){

            setIsLoading(true);
            fetch(`/api/booking/read/${bookingNumber}`).then((response) => response.json()).then((data) => {
               
               if (data.response.success) {

                  setBooking(data.response.data as Booking);
               } else {
                  
                  showNotification(data.response.error, 'error');
                  setTimeout(() => { hideNotification() }, 3000);
               }

               setIsLoading(false);
            }).catch((error) => {
               const err = getErrorMessage(error);
               setIsLoading(false);
               showNotification(err, 'error');
               setTimeout(() => { hideNotification() }, 3000);
            });
         } else {
            setIsLoading(false);
            showNotification('Some required data is missing', 'error');
            setTimeout(() => { hideNotification() }, 3000);
         }
      }

      fetchBooking();
   }, []);

   const renderCar = () => {
      return (
         <>
            {booking && (
               <div className="listingSection__wrap !space-y-6">
                  {booking.car && (
                     <>
                        <div className="flex justify-between items-center">
                           <Badge color="green" name={booking.car.title} />
                           <LikeSaveBtns />
                        </div>
                        <div className="flex flex-col-reverse gap-1 md:flex-row md:gap-0 items-start">
                           <div className="flex flex-col gap-6">
                              <div>
                                 <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
                                 {booking.car.shortDescription} or similar
                                 </h2>
                              </div>
                              <div className="flex items-center space-x-4">
                                 <span>
                                    Supplier: 
                                    <span className="ml-1"> Iway</span>
                                 </span>
                                 <span>·</span>
                                 <StartRating />
                              </div>
                           </div>
                           <div className="flex items-center ml-auto">
                              <Image className="w-full" layout="fixed" width={300} height={150} src={booking.car.featuredImage as string} alt="car image" />
                           </div>
                        </div>
                     </>
                  )}
                  {booking.passengers && booking.passengers.list && (
                     <>
                        <div className="w-full border-b border-neutral-100 dark:border-neutral-700"></div>
                        <h3 className="text-lg font-semibold">Passengers</h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                           {booking.passengers.list.map((passenger : any) => (
                              <div key={passenger.email} className="relative flex items-start space-x-3 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="w-5 h-5 lg:w-7 lg:h-7">
                                    <path stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"></path>
                                 </svg>
                                 <div className="min-w-0 flex-1">
                                    <div className="focus:outline-none">
                                       <p className="text-sm font-medium text-gray-900">{passenger.name}</p>
                                       <p className="truncate text-sm text-gray-500">{passenger.email}</p>
                                       <p className="truncate text-sm text-gray-500">{passenger.phoneNumber.countryCode}{passenger.phoneNumber.number}</p>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </>
                  )} 
               </div>
            )}
         </>
      );
   };

   const renderSummary = () => {
      return (
         <>
            {booking && (
               <div className="mt-6 border border-neutral-200 dark:border-neutral-700 rounded-3xl flex flex-col sm:flex-row divide-y sm:divide-x sm:divide-y-0 divide-neutral-200 dark:divide-neutral-700">
                  <div className="flex-1 p-5 flex space-x-4">
                     <svg className="w-8 h-8 text-neutral-300 dark:text-neutral-6000" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.33333 8.16667V3.5M18.6667 8.16667V3.5M8.16667 12.8333H19.8333M5.83333 24.5H22.1667C23.4553 24.5 24.5 23.4553 24.5 22.1667V8.16667C24.5 6.878 23.4553 5.83333 22.1667 5.83333H5.83333C4.54467 5.83333 3.5 6.878 3.5 8.16667V22.1667C3.5 23.4553 4.54467 24.5 5.83333 24.5Z" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                     </svg>
                     <div className="flex flex-col">
                        <span className="text-sm text-neutral-400">Pick up</span>
                        <div className="flex flex-col mt-1.5 text-sm font-medium text-gray-900">
                           <span>{booking.startDateTime}</span>
                           <span>{booking.pickUp.name}</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex-1 p-5 flex space-x-4">
                     <svg className="w-8 h-8 text-neutral-300 dark:text-neutral-6000" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.33333 8.16667V3.5M18.6667 8.16667V3.5M8.16667 12.8333H19.8333M5.83333 24.5H22.1667C23.4553 24.5 24.5 23.4553 24.5 22.1667V8.16667C24.5 6.878 23.4553 5.83333 22.1667 5.83333H5.83333C4.54467 5.83333 3.5 6.878 3.5 8.16667V22.1667C3.5 23.4553 4.54467 24.5 5.83333 24.5Z" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                     </svg>
                     <div className="flex flex-col">
                        <span className="text-sm text-neutral-400">{booking.driveType == 'chauffer' ? 'Duration' : 'Destination'}</span>
                        <div className="flex flex-col mt-1.5 text-sm font-medium text-gray-900">
                              {booking.driveType == 'rental' && <span>{booking.endDateTime}</span>}
                              {(booking.driveType == 'transfer' || booking.driveType == 'rental') && <span>{booking.destination?.name}</span>}
                              {booking.driveType == 'chauffer' && <span>{booking.hours} Hours</span>}
                        </div>
                     </div>
                  </div>
               </div>
            )}
         </>
      );
   };

   const renderHighlights = () => {
      return (
         <>
            {booking && (
               <div className="space-y-6">
                  <h3 className="text-2xl font-semibold">Booking detail</h3>
                  <div className="flex flex-col space-y-4">
                     <div className="flex text-neutral-6000 dark:text-neutral-300">
                        <span className="flex-1">Booking number</span>
                        <span className="flex-1 font-medium text-neutral-900 dark:text-neutral-100">
                           #{booking.number}
                        </span>
                     </div>
                     <div className="flex text-neutral-6000 dark:text-neutral-300">
                        <span className="flex-1">Total</span>
                        <span className="flex-1 font-medium text-neutral-900 dark:text-neutral-100">
                           {getCurrencySymbol(booking.currency)}{booking.payment.amount.toFixed(2)}
                        </span>
                     </div>
                     <div className="flex text-neutral-6000 dark:text-neutral-300">
                        <span className="flex-1">Payment status</span>
                        <span className="flex-1 font-medium text-neutral-900 dark:text-neutral-100">
                           <span className="rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-600 ring-1 ring-inset ring-green-600/20 w-fit">
                              Paid
                           </span>
                        </span>
                     </div>
                     <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                        <span className="flex-1">Payment method</span>
                        <span className="flex-1 font-medium text-neutral-900 dark:text-neutral-100">
                           {booking.payment.method}
                        </span>
                     </div>
                  </div>
               </div>
            )}
         </>
      );
   };
   
   const renderContent = () => {
      return (
         <div className="w-full flex flex-col sm:rounded-2xl space-y-10 px-0 sm:p-6 xl:p-8">
            {isLoading || booking ? (
               <>
                  <h2 className="text-3xl lg:text-4xl font-semibold">
                     Congratulation 🎉
                  </h2>
                  <div className="border-b border-neutral-200 dark:border-neutral-700"></div>
                  <div className="space-y-6">
                     <h3 className="text-2xl font-semibold">Your booking</h3>
                     {isLoading && <PayDoneLoading />}
                     {renderCar()}
                     {renderSummary()}
                  </div>
               </>
               ) : (
               <EmptyState />
            )}
            {renderHighlights()}
         
            {booking && (
               <div className="flex flex-row items-center justify-start !mt-16 space-x-2">
                  <button onClick={() => handleDownloadClick(`/pdf/${booking.voucher}`)} className="rounded-full bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
                     Download Voucher
                  </button>
                  <div className="cursor-pointer py-2 px-3.5 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center ">
                     <span className="text-sm font-medium">Go to dashboard</span>
                  </div>
               </div>
            )}
         </div>
      );
   };

   return (
      <div className={`nc-PayPage`}>
         <main className="container mt-11 mb-24 lg:mb-32 ">
            <div className="max-w-4xl mx-auto">
               {renderContent()}
            </div>
         </main>
         {notification.show && <Notification type={notification.type} message={notification.message} />}
      </div>
   );
};

export default PayPage;
