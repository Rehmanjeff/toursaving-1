import { users, bookings } from '@prisma/client'
import { UserType } from '@/types/user'
import { format } from 'date-fns'
import { transformBooking } from './bookingTransformer'

export function transformUser(user: users & { bookings?: bookings[] }): UserType | null {
   
   try {
      return {
         id: user.id,
         firstName: user.first_name,
         lastName: user.last_name,
         fullName: `${user.first_name} ${user.last_name}`,
         email: user.email,
         gender: user.gender == 1 ? 'male' : 'female',
         phone: user.phone_number,
         status: user.status,
         bookings: user.bookings ? user.bookings.map(transformBooking) : [],
         dateTime: format(new Date(user.created_at), 'dd/MM/yyyy hh:mm a')
      }
   } catch (error: any) {
      return null
   }
}