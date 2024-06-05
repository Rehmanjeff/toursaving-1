"use client";

import { Tab } from "@headlessui/react";
import React, { FC, Fragment, useState, useEffect } from "react";
import visaPng from "@/images/vis.png";
import mastercardPng from "@/images/mastercard.svg";
import Input from "@/shared/Input";
import Label from "@/components/Label";
import ButtonPrimary from "@/shared/ButtonPrimary";
import { format } from 'date-fns';
import Image from "next/image";
import { BookedAdditionalService, CarDataType, Passenger, Trip } from "@/data/types";
import { UserSearch } from "../(client-components)/type";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCouch } from "@fortawesome/free-solid-svg-icons";
import { getCurrencySymbol } from "@/utils/currency";
import ChoosePassengers from "@/components/ChoosePassengers";
import ChooseChildSeats from "@/components/ChooseChildSeats";
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { isValidExpiration, creditCardNumberRegExp, getErrorMessage } from "@/utils/common";
import BookingFailure from "@/shared/BookingFailure";
import Notification from '@/shared/Notification';
import { useNotification } from "@/hooks/useNotification";
import useNextRouter from "@/hooks/useNextRouter";
import { PathName } from "@/routers/types";

export interface CheckOutPagePageMainProps {
  className?: string;
}

const CheckOutPagePageMain: FC<CheckOutPagePageMainProps> = ({
  className = "",
}) => {

   const supplier = 'iway';
   const [car, setCar] = useState<CarDataType|null>(null);
   const [search, setSearch] = useState<UserSearch | null>(null);
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [hasError, setHasError] = useState<false | string>(false);
   const [bookedAdditionalServices, setBookedAdditionalServices] = useState<BookedAdditionalService[]>([]);
   const hasAirport = (search && search.transfer?.pickUp?.isAirport) || (search && search.transfer?.destination?.isAirport) || (search?.chauffer?.pickUp?.isAirport) ? true : false;
   const hasGreetingSign = (search && search.transfer?.pickUp?.isAirport) || (search && search.chauffer?.pickUp?.isAirport) ? true : false;
   const [countryOptions, setCountryOptions] = useState([
      { value: "+973", label: "Bahrain" },
      { value: "+971", label: "UAE" },
      { value: "+966", label: "Saudi Arabia" }
   ]);
   const { notification, showNotification, hideNotification } = useNotification();
   const { redirectTo } = useNextRouter();
   
   const passenger : Passenger = {
      name : '',
      email: '',
      phoneNumber: {
         countryCode: countryOptions[0].value,
         number: ''
      }
   }

   const [trip, setTrip] = useState<Trip>({
      passengers : [passenger],
      passengersNumber: 1,
      adultsNumber: 1,
      childrenNumber: 0,
      flight: {
         number: '',
         terminal: '',
         greetingSign: ''
      },
      additionalServices: [],
      notes: '',
      supplier: supplier,
      subTotal: 0,
      additionalServiceTotal: 0,
      grandTotal: 0
   });

   const childSeatServices = car?.additionalServices?.filter(
      (item) => item.category == 'baby_seat'
   );

   const cardSchema = yup.object().shape({
      number: yup.string().required('Card number is required').matches(creditCardNumberRegExp, 'Invalid credit card number format'),
      name: yup.string().required('Card name is required'),
      expiration: yup.string().required('card expiration is required').test('expiration', 'Invalid expiration date', isValidExpiration),
      cvc: yup.string().required('CVC is required').length(3, 'CVC should be a 3 digit number'),
   });

   const flightSchema = yup.object().shape({
      number: yup.string().required('Flight number is required'),
      terminal: yup.string(),
      greetingSign: yup.string()
   });

   const schema = yup.object().shape({
      passengers: yup.array().of(
         yup.object().shape({
            name: yup.string().required('Name is required'),
            email: yup.string().email('Invalid email format').required('Email is required'),
            phoneNumber: yup.object().shape({
               number: yup.string().required('Phone number is required'),
               countryCode: yup.string().required('Country code is required'),
            })
         })
      ),
      flight: yup.lazy((value) => hasAirport ? flightSchema : yup.object({}) ),
      notes: yup.string(),
      card: cardSchema
   });

   const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
      resolver: yupResolver(schema),
   });

   const onSubmit = (data: any) => {
      
      if(!isLoading){

         const updatedPassengers = trip.passengers.map((passenger, index) => {
            const updatedPassenger = data.passengers[index];
            return {
               ...passenger,
               ...updatedPassenger
            };
         });
   
         const updatedTrip = {
            ...trip,
            passengers: updatedPassengers,
            notes: data.notes,
            flight: data.flight
         }
   
         setTrip(updatedTrip);
         setIsLoading(true);

         fetch('/api/booking/check', {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'search': search, 'lang': 'en', 'car' : car})
         }).then((response) => response.json()).then((data) => {
            if ((data.response && data.response.error === null && data.response.result && data.response.result.allow_booking === true) || search?.type == 'chauffer') {
               
               fetch('/api/booking/confirm', {
                  method: 'POST', 
                  headers: {'Content-Type': 'application/json'}, 
                  body: JSON.stringify({'search': search, 'lang': 'en', 'car' : car, trip: updatedTrip})
               }).then((response) => response.json()).then((data) => {
      
                  setIsLoading(false);
                  if (data.response.error) {
                     throw data.response.error;
                  } else {
                     localStorage.removeItem('tour-checkout-vehicle');
                     localStorage.removeItem('tour-search');
                     localStorage.setItem('tour-booking-number', data.response.booking);
                     redirectTo('/pay-done' as any);
                  }
               }).catch((error) => {

                  const err = getErrorMessage(error);
                  setIsLoading(false);
                  showNotification(err, 'error');
                  setTimeout(() => { hideNotification() }, 3000);
               });
            } else {

               setIsLoading(false);
               setHasError('Sorry we cannot create a booking with your selected pickup date and vehicle. Click the button to start your book again')
            }
         }).catch((error) => {

            const err = getErrorMessage(error);
            setIsLoading(false);
            showNotification(err, 'error');
            setTimeout(() => { hideNotification() }, 3000);
         });
      }
   }

   useEffect(() => {

      const search = localStorage.getItem('tour-search');
      const car = localStorage.getItem('tour-checkout-vehicle');

      if(search){
         setSearch(JSON.parse(search) as UserSearch);
      }

      if(car){
         setCar(JSON.parse(car) as CarDataType);
      }

      if(car && search){

         let subTotal = 0;
         if (supplier == 'iway') {
            const c = JSON.parse(car);
            subTotal = parseFloat(c.grandTotal);
         }

         const updatedTrip = {
            ...trip,
            subTotal: subTotal,
            grandTotal: subTotal,
         }
         setTrip(updatedTrip);
      }
   }, []);

   useEffect(() => {

      if(car && search){
         
         const servicesTotal = bookedAdditionalServices.reduce((total:number, service:any) => total + service.price * service.frequency, 0);
         const updatedTrip = {
            ...trip,
            additionalServices: bookedAdditionalServices,
            additionalServiceTotal: servicesTotal,
            grandTotal: trip.subTotal + servicesTotal,
         }
         setTrip(updatedTrip);
      }

   }, [bookedAdditionalServices]);

   const handleTripPassengersChange = (adults: number, children: number) => {
      const totalPassengers = adults + children;
    
      if (totalPassengers > trip.passengers.length) {
         const newPassenger: Passenger = {
            name: '',
            email: '',
            phoneNumber: {
               countryCode: countryOptions[0].value,
               number: ''
            }
         }
         const updatedTrip = {
            ...trip,
            passengers: [...trip.passengers, newPassenger],
            passengersNumber: totalPassengers,
            adultsNumber: adults,
            childrenNumber: children
         }

         setTrip(updatedTrip);
      } else if (totalPassengers < trip.passengers.length) {
         const updatedTrip = {
            ...trip,
            passengers: trip.passengers.slice(0, totalPassengers),
            passengersNumber: totalPassengers,
            adultsNumber: adults,
            childrenNumber: children
         }
         setTrip(updatedTrip);
      }
   }

   const handleChildSeatsChange = (index: number, value: number) => {
      const selectedService = childSeatServices?.[index];
      if (selectedService) {
         const existingServiceIndex = bookedAdditionalServices.findIndex(service => service.id === selectedService.id);
         if (existingServiceIndex !== -1) {
            if (value === 0) {
               const updatedServices = [...bookedAdditionalServices];
               updatedServices.splice(existingServiceIndex, 1);
               setBookedAdditionalServices(updatedServices);
            } else {
               const updatedServices = [...bookedAdditionalServices];
               updatedServices[existingServiceIndex].frequency = value;
               setBookedAdditionalServices(updatedServices);
            }
         } else {
            setBookedAdditionalServices(prevServices => [...prevServices, { id: selectedService.id, category: selectedService.category, type: selectedService.type, frequency: value, price: selectedService.price }]);
         }
      }
   }

   const renderSidebar = () => {
      return (
         <div className="w-full flex flex-col sm:rounded-2xl lg:border border-neutral-200 dark:border-neutral-700 space-y-6 sm:space-y-8 px-0 sm:p-6 xl:p-8">
         <div className="flex flex-col sm:flex-row">
            <div className="flex-shrink-0 w-full sm:w-40">
               <div className="rounded-2xl overflow-hidden">
                  {car && (<Image alt="car image" layout="fixed" width={300} height={150} src={car.featuredImage as string} />)}
               </div>
            </div>
            <div className="pb-5 sm:px-5 space-y-3">
               <div>
                  <span className="text-base font-medium mt-1 block">
                     {car?.shortDescription} or similar
                  </span>
               </div>
               <div className="flex items-center space-x-3 text-sm text-neutral-500 dark:text-neutral-400">
                  <FontAwesomeIcon icon={faCouch} className="text-neutral-500 dark:text-neutral-400" />
                  <span>{car?.seats} seats</span>
               </div>
            </div>
         </div>
         <div className="flex flex-col space-y-4">
            <h3 className="text-2xl font-semibold">Price detail</h3>
            {car && car.priceBreakdown.length && car.priceBreakdown.map((item, index) => (
               <div key={index} className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                  <span>{item.name}</span>
                  <span>{getCurrencySymbol(car?.currency ? car?.currency : 'usd')}{item.price}</span>
               </div>
            ))}
            {trip?.additionalServiceTotal > 0 && (<div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
               <span>
                  Additional services
               </span>
               <span>
                  {getCurrencySymbol(car?.currency ? car?.currency : 'usd')}{trip?.additionalServiceTotal}
               </span>
            </div>)}
            <div className="border-b border-neutral-200 dark:border-neutral-700"></div>
            <div className="flex justify-between font-semibold">
               <span>Total</span>
               <span>{getCurrencySymbol(car?.currency ? car?.currency : 'usd')}{trip?.grandTotal}</span>
            </div>
         </div>
         </div>
      );
   };

   const renderBookingSummary = () => {
      return (
         <div>
            <div>
               <h3 className="text-2xl font-semibold">Booking summary</h3>
            </div>
            {search && search.type && (<div className="mt-6 border border-neutral-200 dark:border-neutral-700 rounded-3xl flex flex-col sm:flex-row divide-y sm:divide-x sm:divide-y-0 divide-neutral-200 dark:divide-neutral-700 overflow-hidden z-10">
               <button className="text-left flex-1 p-5 flex justify-between space-x-5" type="button">
                  <div className="flex flex-col">
                     <span className="text-sm text-neutral-400">Pick up</span>
                     <div className="flex flex-col mt-1.5 text-md">
                        <span>{format(parseInt(search[search.type]?.startDate?.toString() ?? '', 10), 'EEEE, MMMM d')} - {search[search.type]?.startTime}</span>
                        <span>{search[search.type]?.pickUp?.name}</span>
                     </div>
                  </div>
               </button>

               <button className="text-left flex-1 p-5 flex justify-between space-x-5" type="button">
                  <div className="flex flex-col">
                     <span className="text-sm text-neutral-400">
                        {search.type == 'chauffer' ? 'Duration' : 'Destination'}
                     </span>
                     <div className="flex flex-col mt-1.5 text-md">
                        {search.type == 'rental' && <span>{format(parseInt(search[search.type]?.endDate?.toString() ?? '', 10), 'EEEE, MMMM d')} . {search[search.type]?.endTime}</span>}
                        {search.type == 'transfer' && <span>{search[search.type]?.destination?.name}</span>}
                        {search.type == 'chauffer' && <span>{search[search.type]?.hours} Hours</span>}
                        {search.type == 'rental' && search[search.type]?.type == 'different-destination' && (<span>{search[search.type]?.dropOff?.name}</span>)}
                     </div>
                  </div>
               </button>
            </div>)}
         </div>
      );
   }

   const renderChildSeats = () => {

      if (trip.childrenNumber > 0 && childSeatServices && childSeatServices.length) {
         return (
            <div className="mb-12">
               <ChooseChildSeats maxSeats={trip.childrenNumber} services={childSeatServices} handleChange={handleChildSeatsChange} />
            </div>
         );
      } else {
         return null;
      }
   }

   const renderPassengerDetails = () => {
      return (
         <div>
            <div>
               <h3 className="text-2xl font-semibold">Passengers' Details</h3>
               <div className="w-14 border-b border-neutral-200 dark:border-neutral-700 my-5"></div>
            </div>
            <div className="mb-12 relative">
               {car && (<ChoosePassengers maxPassengers={car.seats} onChange={(adults, children) => handleTripPassengersChange(adults, children)} />)}
            </div>
            <div>
               { renderChildSeats() }
            </div>
            <div className="flex flex-col space-y-5">
            {trip.passengers.map((item, index) => (
            <div key={index} className="flex flex-col space-y-5">
               <div className="flex space-x-5">
                  <div className="flex-1 space-y-1">
                     <Label>First and last name</Label>
                     <Input type="text" placeholder="David Burner" error={errors.passengers && errors.passengers[index] && errors.passengers[index]?.name ? errors.passengers[index]?.name?.message : ''} {...register(`passengers[${index}].name` as `passengers.${number}.name`)} />
                  </div>
                  <div className="flex-1 space-y-1">
                     <Label>Email</Label>
                     <Input type="text" placeholder="user@hotmail.com" error={errors.passengers && errors.passengers[index] && errors.passengers[index]?.email ? errors.passengers[index]?.email?.message : ''} {...register(`passengers[${index}].email` as `passengers.${number}.email`)} />
                  </div>
               </div>
               <div className="space-y-1">
                  <Label>Contact number</Label>
                  <div className="flex items-start gap-1 mt-2">
                     <select {...register(`passengers[${index}].phoneNumber.countryCode` as `passengers.${number}.phoneNumber.countryCode`)} className="w-auto border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900 rounded-2xl text-sm font-normal h-11">
                        {countryOptions.map((option) => (
                           <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                     </select>
                     <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 flex items-start">
                           <span className="flex items-center w-14 justify-center px-2 h-11 border-r text-sm bg-transparent border-colo-neutral-200">
                              {watch(`passengers[${index}].phoneNumber.countryCode` as any) || item.phoneNumber.countryCode}
                           </span>  
                        </div>
                        <Input type="text" className="py-1.5 pl-16" error={errors.passengers && errors.passengers[index] && errors.passengers[index]?.phoneNumber ? errors.passengers[index]?.phoneNumber?.number?.message : ''} {...register(`passengers[${index}].phoneNumber.number` as `passengers.${number}.phoneNumber.number`)} />
                     </div>
                  </div>
               </div>
               <div className="border-b border-dashed border-neutral-200 dark:border-neutral-700"></div>
            </div>
            ))}
            </div>
         </div>
      );
   }

   const renderPaymentDetails = () => {
      return (
         <div>
            <h3 className="text-2xl font-semibold">Pay with</h3>
            <div className="w-14 border-b border-neutral-200 dark:border-neutral-700 my-5"></div>

            <div className="mt-6">
               <Tab.Group>
                  <Tab.List className="flex my-5 gap-1">
                     <Tab as={Fragment}>
                        {({ selected }) => (
                        <button
                           className={`px-4 py-1.5 sm:px-6 sm:py-2.5  rounded-full flex items-center justify-center focus:outline-none  ${
                              selected
                              ? "bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900"
                              : " text-neutral-6000 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                           }`}
                        >
                           <span className="mr-2.5">Credit card</span>
                           <Image className="w-8" src={visaPng} alt="visa" />
                           <Image className="w-8" src={mastercardPng} alt="mastercard" />
                        </button>
                        )}
                     </Tab>
                  </Tab.List>
                  <Tab.Panels>
                     <Tab.Panel className="space-y-5">
                        <div className="space-y-1">
                           <Label>Card number </Label>
                           <Input type="number" placeholder="111112222999" error={errors.card?.number?.message} {...register('card.number' as any)} />
                        </div>
                        <div className="space-y-1">
                           <Label>Card holder </Label>
                           <Input placeholder="John Doe" error={errors.card?.name?.message} {...register('card.name' as any)} />
                        </div>
                        <div className="flex space-x-5">
                           <div className="flex-1 space-y-1">
                              <Label>Expiration month and year </Label>
                              <Input type="month" error={errors.card?.expiration?.message} {...register('card.expiration' as any)} />
                           </div>
                           <div className="flex-1 space-y-1">
                              <Label>CVC </Label>
                              <Input type="number" placeholder="123" error={errors.card?.cvc?.message} {...register('card.cvc' as any)} />
                           </div>
                        </div>
                     </Tab.Panel>
                  </Tab.Panels>
               </Tab.Group>
               <div className="pt-8">
                  <ButtonPrimary isLoading={isLoading} onClick={handleSubmit(onSubmit)}>Confirm and pay</ButtonPrimary>
                  {hasError && (<BookingFailure message={hasError} buttonUrl="/" buttonText="Book" />)}
               </div>
            </div>
         </div>
      );
   }

   const renderFlightDetails = () => {
      return (
         <div className="flex flex-col space-y-5">
            <div>
               <h3 className="text-2xl font-semibold">Flight Details</h3>
               <div className="w-14 border-b border-neutral-200 dark:border-neutral-700 my-5"></div>
            </div>
            <div className="flex space-x-5">
               <div className="flex-1 space-y-1">
                  <Label>Flight number </Label>
                  {/*  @ts-ignore */}
                  <Input type="text" placeholder="BH9727" defaultValue={trip.flight.number} error={errors.flight?.number?.message} {...register('flight.number' as any)} />
               </div>
               <div className="flex-1 space-y-1">
                  <Label>Arrival terminal </Label>
                  <Input placeholder="Terminal no 1" defaultValue={trip?.flight?.terminal} {...register('flight.terminal' as any)} />
               </div>
            </div>
         </div>
      );
   }

   const renderAdditionalNote = () => {
      return (
         <div className="flex flex-col space-y-5">
            <div>
               <h3 className="text-2xl font-semibold">Notes</h3>
               <div className="w-14 border-b border-neutral-200 dark:border-neutral-700 my-5"></div>
            </div>
            <div className="flex space-x-5">
               <div className="flex-1 space-y-1">
                  <Input type="text" placeholder="E.g information about kids, large luggage" {...register('notes' as any)} />
               </div>
            </div>
         </div>
      );
   }

   const renderGreetingSign = () => {
      return (
         <div className="flex flex-col space-y-5">
            <div className="flex space-x-5">
               <div className="flex-1 space-y-1">
                  <Label>Greeting sign </Label>
                  {/*  @ts-ignore */}
                  <Input type="text" defaultValue={trip.flight.greetingSign} {...register('flight.greetingSign' as any)} />
               </div>
            </div>
         </div>
      );
   }

   const renderMain = () => {
      return (
         <div className="w-full flex flex-col sm:rounded-2xl sm:border border-neutral-200 dark:border-neutral-700 space-y-8 px-0 sm:p-6 xl:p-8">
            <h2 className="text-3xl lg:text-4xl font-semibold">Confirm and payment</h2>
            <div className="border-b border-neutral-200 dark:border-neutral-700"></div>
            {renderBookingSummary()}
            {hasAirport && renderFlightDetails()}
            {hasGreetingSign && renderGreetingSign()}
            {renderPassengerDetails()}
            {renderAdditionalNote()}
            {renderPaymentDetails()}
            {notification.show && <Notification type={notification.type} message={notification.message} />}
         </div>
      );
   };

   return (
      <div className={`nc-CheckOutPagePageMain ${className}`}>
         <main className="container mt-11 mb-24 lg:mb-32 flex flex-col-reverse lg:flex-row">
            <div className="w-full lg:w-3/5 xl:w-2/3 lg:pr-10 ">{renderMain()}</div>
            <div className="hidden lg:block flex-grow">{renderSidebar()}</div>
         </main>
      </div>
   );
};

export default CheckOutPagePageMain;
