import { PrismaClient } from '@prisma/client'
import { transformInternalCar } from '@/_utils/internalCarTransformer'
import { InternalCar } from '@/types/booking'

const prisma = new PrismaClient()

export async function getAllCars (req: Request) {

   try {
      
      const cars = await prisma.internal_cars.findMany({orderBy: { created_at: 'desc' }})
      const transformedData: InternalCar[] = cars.map(transformInternalCar as any)

      return { status: true, data: transformedData }
   } catch (err) {
      console.log(err)
      return { status: false, data: err }
   }
}

export async function readCar (id: string) {

   try {
      
      const car = await prisma.internal_cars.findUnique({
         where: { id: parseInt(id) }
      })
      
      const transformedData: InternalCar = transformInternalCar(car as any)

      return { status: true, data: transformedData }
   } catch (err) {
      return { status: false, data: err }
   }
}

export async function deleteCar (id: string) {

   try {
      
      await prisma.internal_cars.delete({
         where: { id: parseInt(id) },
      })

      return { status: true }
   } catch (err) {
      return { status: false, data: err }
   }
}

export async function createCar (
   title : string,
   capacity: number,
   description: string,
   image: string
) {

   
   try {
      const response = await prisma.internal_cars.create({
         data: {
           title: title,
           description: description,
           capacity: capacity,
           image: image
         }
      })

      return { status: true, data: response }
   } catch (error: any) {
      return { status: false, data: error.toString() }
   }
}