// utils/bookingTransformer.ts
import { bookings, users } from '@prisma/client'
import { BookingSummaryType } from '@/types/booking'

export function transformBookingSummary(booking: bookings & { user?: users }): BookingSummaryType {
   return {
      number: booking.booking_number,
      user: booking.user ? {
         email: booking.user.email,
         firstName: booking.user.first_name,
         lastName: booking.user.last_name,
         phone: booking.user.phone_number,
      } : undefined,
      supplier: booking.supplier,
      status: booking.status,
      total: 120,
      dateTime: booking.created_at.toISOString(),
   };
}
