// utils/bookingTransformer.ts
import { internal_cars } from '@prisma/client'
import { InternalCar } from '@/types/booking'
import { format } from 'date-fns'

export function transformInternalCar(car: internal_cars): any {
   
   try {

      return {
         id: car.id,
         title: car.title,
         capacity: car.capacity,
         description: car.description as string,
         image: car.image,
         dateTime: format(new Date(car.created_at), 'dd/MM/yyyy hh:mm a')
      }
   } catch (error: any) {
      return error
   }
}
