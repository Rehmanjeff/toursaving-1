import { PrismaClient } from '@prisma/client'
import { transformBooking, transformBookingSummary } from '@/_utils/bookingTransformer'
import { BookingType, BookingSummaryType, DriveType, CarSummary, BookingPrice, BookingExtra, BookingStatus, PassengersDetail } from '@/types/booking'
import { UserType } from '@/types/user'
import { Location } from '@/types/location'
import { cancelOrder, placeOrder } from './iway'

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

      // based on supplier cancel order using their API
      // todo: await cancelOrder(number)
      
      await prisma.bookings.update({
         where: { booking_number: number.toString() },
         data: { status: 'Cancelled' },
      })

      return { status: true }
   } catch (err) {
      return { status: false, data: err }
   }
}

export const generateRandomNumber = (digits: number): number => {
   if (digits <= 0) {
     throw new Error("Number of digits must be greater than zero.");
   }
 
   const min = Math.pow(10, digits - 1);
   const max = Math.pow(10, digits) - 1;
   return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const bookingPriceCalculator = (car: CarSummary, extras: BookingExtra[]) : BookingPrice => {
   const commissionPercent = parseInt(process.env.NEXT_PUBLIC_BOOKING_COMMISSION as string)
   const carPrice = car.price
   const commission = {
      percentage: commissionPercent,
      amount: carPrice * commissionPercent
   }

   const price : BookingPrice = {
      subTotal: carPrice,
      commission: commission,
      tax: 0,
      extras: {
         total: 0,
         list: extras
      },
      grandTotal: carPrice + commission.amount
   }

   return price
}

async function preBooking(price: BookingPrice, paymentMode: string) {

   return { success: true, message: null }
}

async function postBooking(
   bookingNumber: string,
   bookingType : DriveType,
   bookingHours: number | null,
   paymentMode: string,
   price: BookingPrice,
   customer: UserType,
   isCustomerNew: boolean,
   car: CarSummary,
   pickup: Location,
   dropoff: Location,
   pickupDateTime: string,
   passengers: PassengersDetail
) {

   let userId: number | null = null
   const voucherFileName : string = `VOUCHER-${Date.now()}.pdf`
   const bookingStatus : BookingStatus = paymentMode == 'cash' ? 'Completed' : 'Unpaid'

   if (isCustomerNew) {
      
      const existingUser = await prisma.users.findFirst({
         where: { email: customer.email },
      })

      if (existingUser) {
         return { status: false, message: 'email already exists' }
      }

      try {
         const newUser = await prisma.users.create({
            data: {
              first_name: customer.firstName,
              last_name: customer.lastName,
              gender: customer.gender == 'male' ? 1 : 0,
              email: customer.email,
              password: '',
              phone_number: customer.phone,
            },
         })

         userId = newUser.id
      } catch (error: any) {
         return { status: false, message: error.toString() }
      }

   } else {
      const existingUser = await prisma.users.findUnique({
         where: { email: customer.email },
      })

      if (!existingUser) {
         return { status: false, data: 'Customer does not exist' }
      }

      userId = existingUser.id
   }

   try {
      const newBooking = await prisma.bookings.create({
         data: {
            user_id: userId,
            booking_number: bookingNumber,
            total: price.grandTotal,
            booking_data: JSON.stringify({
               car,
               pickup,
               dropoff,
               pickupDateTime,
               bookingType,
               bookingHours,
               price,
               passengers
            }),
            lookup_number: generateRandomNumber(8).toString(),
            voucher: voucherFileName,
            supplier: car.supplier,
            currency: 'usd',
            drive_type: bookingType,
            lang: 'en',
            status: bookingStatus,
         },
      })
   
      return { success: true, message: newBooking }
   } catch (error: any) {
      return { success: true, message: error.toString() }
   }
}

export async function createBooking (
   bookingType : DriveType,
   bookingHours: number | null,
   paymentMode: string,
   price: BookingPrice,
   customer: UserType,
   isCustomerNew: boolean,
   car: CarSummary,
   pickup: Location,
   dropoff: Location,
   pickupDateTime: string,
   passengers: PassengersDetail
) {

   const preBookingResponse = await preBooking(price, paymentMode)
   if (!preBookingResponse.success) {
      return { status: false, data: preBookingResponse.message }
   }

   const bookingNumber = `BN-${generateRandomNumber(8)}`
   
   // todo: based in supplier create order using their API 
   // await placeOrder()

   const postBookingResponse = await postBooking(
      bookingNumber,
      bookingType,
      bookingHours,
      paymentMode,
      price,
      customer,
      isCustomerNew,
      car,
      pickup,
      dropoff,
      pickupDateTime,
      passengers
   )
   
   if (!postBookingResponse.success) {
      return { status: false, data: postBookingResponse.message }
   }

   return { status: true, data: postBookingResponse.message }
}