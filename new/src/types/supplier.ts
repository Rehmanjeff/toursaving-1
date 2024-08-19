
export interface Supplier {
   id: number;
   name: string;
   commission: number;
   hasMappingManual: boolean;
   dateTime:string;
   locations: {
      id: number;
      locationName: string;
      locationNameArabic: string;
      countryName: string;
      locationId: string;
      dateTime: string;
   }[];
}