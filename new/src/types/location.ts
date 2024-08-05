
export interface Location {
   id: string | number;
   name: string;
   icon?: string;
   coords?: {lat: any, lng: any};
   desc?: string;
   isAirport?: boolean
}