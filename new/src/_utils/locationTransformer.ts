
import { Location, MasterLocation } from '@/types/location'
import { format } from 'date-fns'

export function transformLocationCollection(inputData: any): Location[] {
   return inputData.map((item: any) => ({
      id: item.place_id,
      name: item.name,
      icon: item.icon,
      coords: {
         lat: item.geometry.location.lat,
         lng: item.geometry.location.lng
      },
      desc: '',
      isAirport: item.types.includes('airport')
   }))
}

export function transformMasterLocation(inputData: any): MasterLocation {
   return {
      id: inputData.id,
      name: inputData.location_name,
      nameArabic: inputData.location_name_arabic,
      countryName: inputData.country_name,
      locationId: inputData.location_id,
      dateTime: format(new Date(inputData.created_at), 'dd/MM/yyyy hh:mm a')
   }
}
