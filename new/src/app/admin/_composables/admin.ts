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
   
   const adminAllCars = async () => {
      try {
         
         const response = await fetch(`${baseUrl}/cars/all`, {
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
   
   const adminAllSuppliers = async () => {
      try {
         
         const response = await fetch(`${baseUrl}/suppliers/all`, {
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
   
   const adminReadCar = async (number: number) => {
      try {
         
         const response = await fetch(`${baseUrl}/cars/read/${number}`, {
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
   
   const adminReadSupplier = async (number: number) => {
      try {
         
         const response = await fetch(`${baseUrl}/suppliers/read/${number}`, {
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
   
   const adminReadUser = async (id: string) => {
      try {
         
         const response = await fetch(`${baseUrl}/users/read/${id}`, {
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
   
   const adminDeleteCar = async (number: number) => {
      try {
         
         const response = await fetch(`${baseUrl}/cars/delete/${number}`, {
            method: 'DELETE',
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
   
   const adminDeleteSupplierLocation = async (number: number) => {
      try {
         
         const response = await fetch(`${baseUrl}/suppliers/locations/delete/${number}`, {
            method: 'DELETE',
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
   
   const adminDeleteSupplier = async (number: number) => {
      try {
         
         const response = await fetch(`${baseUrl}/suppliers/delete/${number}`, {
            method: 'DELETE',
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
   
   const adminChangeUserStatus = async (id: string) => {
      try {
         
         const response = await fetch(`${baseUrl}/users/change-status/${id}`, {
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

   const adminUpdatePageContent = async (page: string, content: string) => {
      try {
         
         const response = await fetch(`${baseUrl}/cms/${page}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ newContent: content })
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
   
   const adminGetPageContent = async (page: string) => {
      try {
         
         const response = await fetch(`${baseUrl}/cms/${page}`, {
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
      passengers: PassengersDetail,
      isManual: boolean
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
               passengers,
               isManual
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
   
   const adminAddCar = async (
      title: string, 
      capacity: number, 
      description: string, 
      image: string
   ) => {
      try {
         
         const response = await fetch(`${baseUrl}/cars/create`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
               title,
               description,
               capacity,
               image
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
   
   const adminAddSupplier = async (
      name: string, 
      commission: number, 
      hasMappingManual: boolean
   ) => {
      try {
         
         const response = await fetch(`${baseUrl}/suppliers/create`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
               name,
               commission,
               hasMappingManual
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
   
   const adminAddSupplierLocation = async (
      supplierId: string,
      name: string, 
      arabicName: string, 
      countryName: string,
      locationId: string
   ) => {
      try {
         
         const response = await fetch(`${baseUrl}/suppliers/locations/create`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
               supplierId,
               name,
               arabicName,
               countryName,
               locationId
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
      adminCreateBooking,
      adminReadUser,
      adminChangeUserStatus,
      adminGetPageContent,
      adminUpdatePageContent,
      adminAddCar,
      adminReadCar,
      adminAllCars,
      adminDeleteCar,
      adminAllSuppliers,
      adminAddSupplier,
      adminReadSupplier,
      adminDeleteSupplier,
      adminAddSupplierLocation,
      adminDeleteSupplierLocation
   }
}

export default Admin