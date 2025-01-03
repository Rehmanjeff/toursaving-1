
export interface Location {
   id: string | number;
   name: string;
   icon?: string;
   coords?: {lat: any, lng: any};
   desc?: string;
   isAirport?: boolean
}

export interface MasterLocation {
   id: number;
   name: string;
   nameArabic: string;
   countryName: string;
   locationId: string;
   dateTime: string;
}