import { UserType } from "./user"

export interface BookingType {
   number: string;
   user: UserType;
   supplier: string;
   status: string;
}

export interface BookingSummaryType {
   number: string;
   user?: UserType;
   supplier: string;
   status: string;
   total:number;
   dateTime:string;
}