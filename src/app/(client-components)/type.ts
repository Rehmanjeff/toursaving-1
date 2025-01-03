import { Supplier } from "@/data/types";

export interface GuestsObject {
  guestAdults?: number;
  guestChildren?: number;
  guestInfants?: number;
}

export interface PropertyType {
  name: string;
  description: string;
  checked: boolean;
}

export interface Location {
   id: string | number;
   name: string;
   icon?: string;
   coords?: string;
   desc?: string;
   isAirport?: boolean
}

export interface ClassOfProperties extends PropertyType {}

export type DateRage = [Date | null, Date | null];

export type DriveType = "transfer" | "chauffer" | "rental";
export type RentalType = "same-destination" | "different-destination";

export interface RentalServiceType {

   type: RentalType;
   pickUp: Location | null;
   dropOff: Location | null;
   startDate: number | null;
   endDate: number | null;
   startTime: string | null;
   endTime: string | null
}

export interface ChaufferServiceType {

   pickUp: Location | null;
   hours: number | null;
   startDate: number | null;
   startTime: string | null;
}

export interface TransferServiceType {

   pickUp: Location | null;
   destination: Location | null;
   startDate: number | null;
   startTime: string | null;
}

export interface UserSearch {
   type: DriveType | null;
   transfer?: TransferServiceType | null;
   chauffer?: ChaufferServiceType | null;
   rental?: RentalServiceType | null;
   timestamp: number;
}

export interface SearchParams {
   transfer?: TransferServiceType;
   chauffer?: ChaufferServiceType;
   rental?: RentalServiceType;
}

export interface SearchFilterCapacity {
   seats: number,
   bags: number
}

export interface SearchFilters {
   priceRange: number[];
   capacity: SearchFilterCapacity;
   suppliers: Supplier[] | '';
}
