import { UserType } from "./user"
import { Location } from "./location"

export type Currency = 'USD' | 'BHD'

export type DriveType = 'transfer' | 'chauffer' | 'rental'

export type BookingStatus = 'Created' | 'Unpaid' | 'Completed' | 'Cancelled'

export interface CarSummary {
   title: string;
   description: string;
   capacity: number;
   image: string;
}

export interface PassengersDetail {
   total: number;
   adults: number;
   children: number;
   list: [
      {
         name: string;
         email?: string;
         phoneNumber?: {
            countryCode: number;
            number: number;
         }
      }
   ]
}

export interface BookingType {
   number: string;
   lookupNumber: string;
   user: UserType | null;
   driveType: DriveType;
   car: CarSummary;
   passengers: PassengersDetail;
   pickUp: Location;
   destination: Location | null;
   startDateTime: string;
   endDateTime: string | null;
   hours: number | null;
   supplier: string;
   status: BookingStatus;
   total:number;
   currency:Currency;
   voucher: string;
   lang: string;
   notes: string | null;
   canCancel: boolean;
   dateTime:string;
}

export interface BookingSummaryType {
   number: string;
   user: UserType | null;
   supplier: string;
   status: string;
   total:number;
   currency:Currency;
   voucher: string;
   dateTime:string;
}