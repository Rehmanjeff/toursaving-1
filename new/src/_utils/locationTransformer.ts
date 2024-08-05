
import { Location } from '@/types/location'

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
