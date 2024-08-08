import { BookingPrice, CarSummary, DriveType, PassengersDetail } from "@/types/booking"
import { UserType } from "@/types/user"
import { Location } from "@/types/location"

const baseUrl : string = '/api/admin'

class CustomError extends Error {
   statusCode: number

   constructor(message: string, statusCode: number) {
      super(message)
      this.statusCode = statusCode
      this.name = this.constructor.name
   }
}

const Admin = () => {

   const getToken = () => localStorage.getItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY as string)

   const hasToken = () => {

      const token = localStorage.getItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY as string)
      return token !== null && token != ''
   }

   const getHeaders = () => { 

      const headers : any = { 'Content-Type': 'application/json'}

      if (hasToken()) {
         headers['Authorization'] = `Bearer ${getToken()}`
      }

      return headers
   }

   const adminLogin = async (email: string, password: string) => {
      try {
         
         const response = await fetch(`${baseUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ email, password })
         })

         const data = await response.json()
         return {statusCode: response.status, data: data}
      } catch (err : any) {
         return {statusCode: 500, data: err}
      }
   }
   
   const adminDashboard = async () => {
      try {
         
         const response = await fetch(`${baseUrl}/dashboard`, {
            method: 'GET',
            headers: getHeaders()
         })

         const data = await response.json()
         return {statusCode: response.status, data: data}
      } catch (err : any) {
         return {statusCode: 500, data: err}
      }
   }
   
   const adminAllBookings = async () => {
      try {
         
         const response = await fetch(`${baseUrl}/bookings/all`, {
            method: 'GET',
            headers: getHeaders()
         })

         const data = await response.json()

         if (data.error && data.error.code == 'ERR_JWT_EXPIRED') {
            throw new CustomError(data.error.code, 401)
         }

         return {statusCode: response.status, data: data}
      } catch (err : any) {

         if (err instanceof CustomError) {
            return { statusCode: err.statusCode, data: err.message }
         }

         return {statusCode: 500, data: err}
      }
   }
   
   const adminReadBooking = async (number: number) => {
      try {
         
         const response = await fetch(`${baseUrl}/bookings/read/${number}`, {
            method: 'GET',
            headers: getHeaders()
         })

         const data = await response.json()

         if (data.error && data.error.code == 'ERR_JWT_EXPIRED') {
            throw new CustomError(data.error.code, 401)
         }

         return {statusCode: response.status, data: data}
      } catch (err : any) {

         if (err instanceof CustomError) {
            return { statusCode: err.statusCode, data: err.message }
         }

         return {statusCode: 500, data: err}
      }
   }
   
   const adminCancelBooking = async (number: number) => {
      try {
         
         const response = await fetch(`${baseUrl}/bookings/cancel/${number}`, {
            method: 'PATCH',
            headers: getHeaders()
         })

         const data = await response.json()

         if (data.error && data.error.code == 'ERR_JWT_EXPIRED') {
            throw new CustomError(data.error.code, 401)
         }
         
         return {statusCode: response.status, data: null}
      } catch (err : any) {
         
         if (err instanceof CustomError) {
            return { statusCode: err.statusCode, data: err.message }
         }

         return {statusCode: 500, data: err}
      }
   }
   
   const adminSearchLocation = async (keyword: string) => {
      try {
         
         const response = await fetch(`${baseUrl}/location-search/${keyword}`, {
            method: 'GET',
            headers: getHeaders()
         })

         const data = await response.json()

         if (data.error && data.error.code == 'ERR_JWT_EXPIRED') {
            throw new CustomError(data.error.code, 401)
         }
         
         return {statusCode: response.status, data: data}
      } catch (err : any) {
         
         if (err instanceof CustomError) {
            return { statusCode: err.statusCode, data: err.message }
         }

         return {statusCode: 500, data: err}
      }
   }
   
   const adminAllUsers = async () => {
      try {
         
         const response = await fetch(`${baseUrl}/users/all`, {
            method: 'GET',
            headers: getHeaders()
         })

         const data = await response.json()

         if (data.error && data.error.code == 'ERR_JWT_EXPIRED') {
            throw new CustomError(data.error.code, 401)
         }
         
         return {statusCode: response.status, data: data}
      } catch (err : any) {
         
         if (err instanceof CustomError) {
            return { statusCode: err.statusCode, data: err.message }
         }

         return {statusCode: 500, data: err}
      }
   }
   
   const adminCreateBooking = async (
      bookingType: DriveType, 
      bookingHours: number | null, 
      paymentMode: 'cash' | 'online', 
      price: BookingPrice,
      customer: UserType, 
      isCustomerNew: boolean, 
      car: CarSummary, 
      pickup: Location, 
      dropoff: Location | null, 
      pickupDateTime: string,
      passengers: PassengersDetail
   ) => {
      try {
         
         const response = await fetch(`${baseUrl}/bookings/create`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
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
            })
         })

         const data = await response.json()

         if (data.error && data.error.code == 'ERR_JWT_EXPIRED') {
            throw new CustomError(data.error.code, 401)
         }
         
         return {statusCode: response.status, data: data}
      } catch (err : any) {
         
         if (err instanceof CustomError) {
            return { statusCode: err.statusCode, data: err.message }
         }

         return {statusCode: 500, data: err}
      }
   }

   return {
      adminDashboard,
      adminAllBookings,
      adminReadBooking,
      adminCancelBooking,
      adminSearchLocation,
      adminAllUsers,
      adminLogin,
      adminCreateBooking
   }
}

export default Admin