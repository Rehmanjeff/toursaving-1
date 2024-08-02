import { PrismaClient } from '@prisma/client'
import { transformBookingSummary } from '@/_utils/bookingTransformer'
import { BookingSummaryType } from '@/types/booking';

const prisma = new PrismaClient()

export async function getAllBookings (req: Request) {

   try {
      
      const bookings = await prisma.bookings.findMany({})
      const transformedData: BookingSummaryType[] = bookings.map(transformBookingSummary)

      return { status: true, data: transformedData }
   } catch (err) {
      return { status: false, data: err }
   }
}