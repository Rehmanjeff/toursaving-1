import { PrismaClient } from '@prisma/client'
import { transformBooking, transformBookingSummary } from '@/_utils/bookingTransformer'
import { BookingType, BookingSummaryType } from '@/types/booking'

const prisma = new PrismaClient()

export async function getAllBookings (req: Request) {

   try {
      
      const bookings = await prisma.bookings.findMany({include: { users: true },orderBy: { created_at: 'desc' }})
      const transformedData: BookingSummaryType[] = bookings.map(transformBookingSummary as any)

      return { status: true, data: transformedData }
   } catch (err) {
      return { status: false, data: err }
   }
}

export async function readBooking (number: number) {

   try {
      
      const booking = await prisma.bookings.findUnique({
         where: { booking_number: number.toString() },
         include: { users: true }
      })
      
      const transformedData: BookingType = transformBooking(booking as any)

      return { status: true, data: transformedData }
   } catch (err) {
      return { status: false, data: err }
   }
}

export async function cancelBooking (number: number) {

   try {

      await prisma.bookings.update({
         where: { booking_number: number.toString() },
         data: { status: 'Cancelled' },
      })

      return { status: true }
   } catch (err) {
      return { status: false, data: err }
   }
}