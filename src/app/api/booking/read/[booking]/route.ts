import { NextResponse } from 'next/server';
import prisma from '@/app/services/prisma';
import { Booking, FlightDetails } from '@/data/types';
import { DriveType, Location } from '@/app/(client-components)/type';
import { fetchBooking } from '@/app/services/iway';

export async function GET(request: Request, {params}: {params: {booking: string}}){

   let data;
   const bookingNumber = params.booking;
   
   try {

      const { success, error, booking } = await getBookingAndPayment(bookingNumber);

      if (!success || !booking) {
         throw error;
      }

      if (booking.supplier == 'iway') {

         const { success, error, bookingDetails } = await fetchBooking(booking);
         data = { success: success, error: error, data: bookingDetails };
      } else {

         data = { success: false, error: 'unknown provider', data: null };
      }
      
   } catch (error:any) {
      
      data = { success: false, error: error.toString(), data: null };
   }

   return NextResponse.json({ response: data });
}

const getBookingAndPayment = async (bookingNumber: string) => {

   try {
      let booking = await prisma.bookings.findUnique({
         where: {
           booking_number: bookingNumber,
         },
         include: {
            payment: true,
         },
      });

      if (!booking) {
         return { success: false, error: 'No booking found' };
      }

      if (!booking.payment) {
         return { success: false, error: 'No payment found for this booking' };
      }

      return { success : true, error: null, booking: booking };
   } catch (error) {

      return { success : false, error: error };
   }
}