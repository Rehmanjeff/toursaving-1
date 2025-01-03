import { BookingType } from "./booking";

export interface UserType {
   id: number;
   firstName: string;
   lastName: string;
   fullName: string;
   email: string;
   phone: string;
   status: boolean;
   gender: 'male' | 'female';
   bookings?: BookingType[];
   dateTime: string;
}