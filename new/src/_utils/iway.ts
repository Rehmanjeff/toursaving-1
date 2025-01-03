import { DriveType, BookingPrice, CarSummary } from "@/types/booking"
import { UserType } from "@/types/user"

export async function cancelOrder (number: number) {

   try {

      return { status: true }
   } catch (err) {
      return { status: false, message: err }
   }
}

export async function placeOrder (
   bookingType : DriveType,
   bookingHours: number | null,
   paymentMode: string,
   price: BookingPrice,
   customer: UserType,
   car: CarSummary,
   pickup: Location,
   dropoff: Location,
   pickupDateTime: string
) {

   try {

      return { status: true }
   } catch (err) {
      return { status: false, message: err }
   }
}