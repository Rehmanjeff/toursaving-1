import { MasterLocation } from "./location"


export interface SupplierLocation {
   id: number;
   name: string;
   nameArabic: string;
   countryName: string;
   locationId: string;
   dateTime: string;
   mappedMasterLocation?:MasterLocation
}

export interface Supplier {
   id: number;
   name: string;
   commission: number;
   hasMappingManual: boolean;
   dateTime:string;
   locations: SupplierLocation[];
}