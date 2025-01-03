import { BookedAdditionalService, Booking, CarDataType, FlightDetails, Passenger, Trip } from "@/data/types";
import { ChaufferServiceType, TransferServiceType, UserSearch, Location, DriveType } from "../(client-components)/type";
import axios from 'axios';
import { NextResponse } from 'next/server';
import { formatDate, formatDateDescriptive, generateRandomNumber } from "@/utils/common";

export function rewriteSearch(search : UserSearch, response : any) : UserSearch{

   let inputSearch = search;
   const startPlaceId = response[0].start_place.place_id;
   const finishPlaceId = response[0].finish_place.place_id;

   if(inputSearch.type == 'transfer' && inputSearch.transfer && inputSearch.transfer.pickUp && inputSearch.transfer.destination){

      inputSearch.transfer.pickUp.id = startPlaceId;
      inputSearch.transfer.destination.id = finishPlaceId;
   }else if(inputSearch.type == 'chauffer' && inputSearch.chauffer && inputSearch.chauffer.pickUp){

      inputSearch.chauffer.pickUp.id = startPlaceId;
   }

   return inputSearch;
}

export function getCarSubTotal(car : any, search : UserSearch){

   let total = 0;

   if(search.type == 'chauffer'){

      let bookingHours = car.minimum_duration/3600;
      if(search.chauffer?.hours){

         bookingHours = bookingHours <= search.chauffer.hours ? search.chauffer.hours : bookingHours;
      }

      const subTotal = car.price_per_hour * bookingHours;
      total += subTotal;

   }else if(search.type == 'transfer'){

      total += car.price;
   }

   return total;
}

export async function isBookingPossible(search: UserSearch, lang: string, car: CarDataType){

   let startPlaceId = null;
   let pickUpDateTime = null;

   if(search.type == 'transfer'){

      let datee = search.transfer?.startDate as number;
      startPlaceId = search.transfer?.pickUp?.id;
      pickUpDateTime = formatDate(datee.toString(), search.transfer?.startTime as string);
   }else if(search.type == 'chauffer'){

      let datee = search.chauffer?.startDate as number;
      startPlaceId = search.chauffer?.pickUp?.id;
      pickUpDateTime = formatDate(datee.toString(), search.chauffer?.startTime as string);
   }

   const url = `https://sandbox.iway.io/transnextgen/v4/orders/check-time?lang=${lang}&user_id=${process.env.IWAY_USER_ID}`;
   const headers = {
      'Authorization': `Bearer ${process.env.IWAY_API_TOKEN}`,
      'Content-Type': 'application/json'
   };
   const data = {
      'price_id': car.priceId,
      'pickup_time': pickUpDateTime,
      'start_place_id': startPlaceId,
   }

   try {

      const response = await axios.post(url, data, { headers });
      return response.data
   } catch (error) {

      return null;
   }
}

export async function createBooking(trip : Trip, search: UserSearch, car: CarDataType, lang: string, bookingNumber: string){

   let startPlaceId = null;
   let pickUpDateTime = null;
   let additionalServices : any = null;
   let searchType : TransferServiceType | ChaufferServiceType | null = null;
   let finishLocation = null;
   let isRent: boolean = true;
   let rentDuration: number = 0;
   
   if (search.type == 'transfer') {
      isRent = false;
      searchType = search.transfer as TransferServiceType;
      finishLocation = {
         "address": searchType?.destination?.name,
         "place_id": searchType?.destination?.id,
         "location": searchType?.destination?.coords,
         "flight_number": trip.flight ? trip.flight.number : "",
         "terminal_number": trip.flight ? trip.flight.terminal : "",
         "time": ""
      }
   } else if (search.type == 'chauffer') {
      searchType = search.chauffer as ChaufferServiceType;
      rentDuration = search.chauffer?.hours as number
   }
   
   let datee = searchType?.startDate as number;
   pickUpDateTime = formatDate(datee.toString(), searchType?.startTime as string);

   if(trip.additionalServices){
      additionalServices = trip.additionalServices.map((item) => ({ "id": item.id }));
   }

   const passengers = trip.passengers.map((passenger) => {
      const { name, phoneNumber, email } = passenger;
      const phone = phoneNumber ? `${phoneNumber.countryCode}${phoneNumber.number}` : '';
      return { name, phone, email };
   })

   const url = `https://sandbox.iway.io/transnextgen/v4/orders?lang=${lang}`;
   const headers = {
      "Authorization": `Bearer ${process.env.IWAY_API_TOKEN}`,
      "Content-Type": "application/json"
   };
   const data = {
      "user_id": process.env.IWAY_USER_ID,
      "lang": lang,
      "trips": [
         {
            "user_id": process.env.IWAY_USER_ID,
            "price_id": car.priceId,
            "currency": car.currency.toUpperCase(),
            "passengers_number": trip.passengersNumber,
            "adults_amount": trip.adultsNumber,
            "children_amount": trip.childrenNumber,
            "text_tablet": trip.flight?.greetingSign ?? '',
            "comment": trip.notes,
            "passengers": passengers,
            "internal_number": bookingNumber,
            "additional_services": additionalServices,
            "send_params": {
               "send_client_voucher": false,
               "send_admin_voucher": false,
               "send_client_doc": false,
               "send_admin_doc": false
            },
            "platform": 7,
            "flexible_tariff": false,
            "flexible_tariff_agreement": false,
            "address": "",
            "location": '',
            "additional_address": true,
            "start_location": {
               "address": searchType?.pickUp?.name,
               "place_id": startPlaceId,
               "location": searchType?.pickUp?.coords,
               "flight_number": trip.flight ? trip.flight.number : '',
               "terminal_number": trip.flight ? trip.flight.terminal : '',
               "time": pickUpDateTime
            },
            "finish_location": finishLocation,
            "additional_change_itinerary": 1,
            "additional_wait": 1,
            "fare_on_toll_road": 1,
            "is_rent": isRent,
            "duration": rentDuration * 3600,
            "lang": lang
         }
      ],
   }

   const response = await fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(data) });
   const json = await response.json()
   if (json.error) {
      return { success : false, error: json.error, data: data };
   }

   return { success : true, error: null, data: json.result[0] };   
}

export async function fetchBooking(booking: any){

   let bookingDetails : Booking;
   
   const headers = {
      Authorization: `Bearer ${process.env.IWAY_API_TOKEN}`,
   };
   const iwayUser = process.env.IWAY_USER_ID;
   const url = `https://sandbox.iway.io/transnextgen/v4/orders/trips?lang=${booking.lang}&user_id=${iwayUser}&order_id=${booking.lookup_number}`;
   const apiResponse = await fetch(url, {
      headers: {
         ...headers
      }
   });

   let response = await apiResponse.json();

   if (!response.result || !response.result.orders) {

      if (response.error) {
         
         return { success : false, error: response.error.message, bookingDetails: null };
      } else {
         
         return { success : false, error: response.error.message, bookingDetails: null };
      }
   } else if (response.result.orders.length == 0) {

      return { success : false, error: 'booking not found', bookingDetails: null };
   } else {

      const bookingData = response.result.orders[0];
      let flightDet : FlightDetails | null;
      let destination : Location | null;

      if (bookingData.arrival_number != '' || bookingData.departure_number != '') {
         flightDet = {
            number: bookingData.arrival_number != '' ? bookingData.arrival_number : bookingData.departure_number,
            terminal: bookingData.start_place.terminal_number != '' ? bookingData.start_place.terminal_number : bookingData.finish_place.terminal_number,
            greetingSign: bookingData.table
         }
      } else {
         flightDet = null;
      }

      const passengers = bookingData.passengers.map((passenger: any) => ({
         name: passenger.name,
         email: passenger.email,
         phoneNumber: {
            countryCode: '',
            number: passenger.phone
         }
      }));

      const pickup : Location = {
         id: bookingData.location_address_object.geo_data.place_id,
         name: bookingData.location_address_object.address,
      }

      if (booking.drive_type == 'transfer') {
         destination = {
            id: bookingData.destination_address_object.geo_data.place_id,
            name: bookingData.destination_address_object.address, 
         }
      } else {
         destination = null;
      }
      
      bookingDetails = {
         number: bookingData.internal_number,
         driveType: booking.drive_type as DriveType,
         status: booking.status,
         car: {
            title: bookingData.car_data.title,
            shortDescription: bookingData.car_data.models,
            seats: bookingData.car_data.capacity,
            featuredImage: process.env.NEXT_PUBLIC_IWAY_CAR_PHOTO_URI + "/" + bookingData.car_data.photo
         },
         passengers: {
            total: bookingData.passengers_number,
            adults: bookingData.adults_amount,
            children: bookingData.children_amount,
            list: passengers,
         },
         pickUp: pickup,
         destination: destination,
         startDateTime: formatDateDescriptive(new Date(bookingData.date_arrival).getTime()),
         endDateTime: bookingData.date_departure ? formatDateDescriptive(new Date(bookingData.date_departure).getTime()) : null,
         hours: booking.drive_type == 'chauffer' ? bookingData.duration / 3600 : null,
         voucher: booking.voucher,
         supplier: 'iway',
         lookupNumber: booking.lookup_number,
         payment: {
            id: booking.payment.id,
            bookingNumber: booking.booking_number,
            serviceProvider: booking.payment.service_provider,
            lookupNumber: booking.payment.lookup_number,
            amount: booking.payment.amount,
            currency: booking.payment.currency,
            method: booking.payment.method,
            createdAt: booking.payment.created_at
         },
         currency: bookingData.currency,
         lang: bookingData.lang,
         notes: bookingData.notes,
         canCancel: false,
         createdAt: booking.created_at.getTime(),
         updatedAt: booking.updated_at.getTime()
      }

      if (flightDet) {
         bookingDetails.flight = flightDet;
      }

      return { success : true, error: null, bookingDetails: bookingDetails };
   }
}