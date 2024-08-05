// utils/bookingTransformer.ts
import { bookings, users } from '@prisma/client'
import { BookingSummaryType, Currency, BookingType, DriveType, CarSummary, PassengersDetail, BookingStatus } from '@/types/booking'
import { format } from 'date-fns'
import { Location } from '@/types/location'
import { UserType } from '@/types/user'
import { transformUser } from './userTransformer'

export function transformBookingSummary(booking: bookings & { users?: users }): BookingSummaryType {
   return {
      number: booking.booking_number,
      user: booking.users ? transformUser(booking.users) as UserType : null,
      supplier: booking.supplier,
      status: booking.status,
      total: booking.total as any,
      currency: booking.currency as Currency,
      voucher: booking.voucher,
      dateTime: format(new Date(booking.created_at), 'dd/MM/yyyy hh:mm a')
   }
}

export function transformBooking(booking: bookings & { users?: users }): any {
   
   try {
      const cleanedData = booking.booking_data.replace(/\\\\/g, '\\')
      const correctedData = cleanedData.replace(/\\"/g, '"')
      const bookingData = JSON.parse(correctedData)

      return {
         number: booking.booking_number,
         lookupNumber: booking.lookup_number,
         driveType: bookingData.drive_type as DriveType,
         car: bookingData.car as CarSummary,
         passengers: bookingData.passengers as PassengersDetail,
         pickUp: bookingData.pickUp as Location,
         destination: bookingData.destination ? bookingData.destination as Location : null,
         startDateTime: bookingData.start_date_time,
         endDateTime: bookingData.end_date_time ? bookingData.end_date_time : null,
         hours: bookingData.hours ? bookingData.hours : null,
         user: booking.users ? transformUser(booking.users) as UserType : null,
         supplier: booking.supplier,
         status: booking.status as BookingStatus,
         total: booking.total as any,
         currency: booking.currency as Currency,
         voucher: booking.voucher,
         lang: booking.lang,
         notes: bookingData.notes ? bookingData.notes : null,
         canCancel: true,
         dateTime: format(new Date(booking.created_at), 'dd/MM/yyyy hh:mm a')
      }
   } catch (error: any) {
      return 'error encountered while data mapping'
   }
}
