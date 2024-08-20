'use client'

import { useEffect, useRef, useState } from 'react'
import { Location } from '@/types/location'
import { BookingPrice, CarSummary, DriveType, PassengersDetail } from '@/types/booking'
import Admin from '@/app/admin/_composables/admin'
import { ResponseType } from "@/types/index"
import { UserType } from '@/types/user'
import SearchCars from '@/app/admin/_components/SearchCars'
import SelectedCar from '@/app/admin/_components/SelectedCar'
import { isValidUniqueEmail } from '@/_utils/user'
import useSignOut from '@/_utils/signout'
import { bookingPriceCalculator } from '@/_utils/booking'
import Notification from '@/app/admin/_widgets/Notification'
import { useNotification } from '@/app/admin/_hooks/useNotification'

export default function AdminAddBooking() {

   const { adminSearchLocation, adminAllUsers, adminCreateBooking } = Admin()
   const [bookingType, setBookingType] = useState<DriveType>('transfer')
   const [bookingHours, setBookingHours] = useState<null | number>(0)
   const [bookingHoursError, setBookingHoursError] = useState<string>('')
   const [paymentMode, setPaymentMode] = useState<'cash' | 'online'>('cash')
   const dropdownRef = useRef<HTMLDivElement>(null)
   const dropdownRefTwo = useRef<HTMLDivElement>(null)
   const [isLocationClicked, setIsLocationClicked] = useState<boolean>(false)
   const [allUsersResult, setAllUsersResult] = useState<UserType[]>([])
   const [selectedCustomer, setSelectedCustomer] = useState<UserType>()
   const [selectedCar, setSelectedCar] = useState<CarSummary | null>(null)
   const [isCustomerNew, setIsCustomerNew] = useState<boolean>(true)
   const [showCarPopup, setShowCarPopup] = useState<boolean>(false)
   const [showSelectedCarPopup, setShowSelectedCarPopup] = useState<boolean>(false)
   const [selectedCarError, setSelectedCarError] = useState<string>('')
   const [passengersError, setPassengersError] = useState<string>('')
   const [isLoading, setIsLoading] = useState<boolean>(false)
   const [passengers, setPassengers] = useState<PassengersDetail>({
      total: 1,
      adults: 1,
      children: 0,
      list: [
         {name: ''}
      ]
   })
   const signOut = useSignOut()
   const {
      notificationMessage,
      notificationDescription,
      notificationType,
      showNotification,
      showNotificationHandler,
      hideNotificationHandler,
   } = useNotification()

   const [pickupSearch, setPickupSearch] = useState<string>('')
   const [debouncedPickupSearch, setDebouncedPickupSearch] = useState<string>(pickupSearch)
   const [pickupLocationResult, setPickupLocationResult] = useState<Location[]>([])
   const [pickupLocation, setPickupLocation] = useState<Location | null>(null)
   const [pickupDateTime, setPickupDateTime] = useState<string>('')
   const [pickupLocationError, setPickupLocationError] = useState<string>('')
   const [pickupDateTimeError, setPickupDateTimeError] = useState<string>('')

   const [dropoffSearch, setDropoffSearch] = useState<string>('')
   const [debouncedDropoffSearch, setDebouncedDropoffSearch] = useState<string>(pickupSearch)
   const [dropoffLocationResult, setDropoffLocationResult] = useState<Location[]>([])
   const [dropoffLocation, setDropoffLocation] = useState<Location | null>(null)
   const [dropoffLocationError, setDropoffLocationError] = useState<string>('')

   const [cusFirstN, setCusFirstN] = useState<string>('')
   const [cusFNError, setCusFNError] = useState<string>('')
   const [cusLastN, setCusLastN] = useState<string>('')
   const [cusLNError, setCusLNError] = useState<string>('')
   const [cusEmail, setCusEmail] = useState<string>('')
   const [cusEmailError, setCusEmailError] = useState<string>('')
   const [cusPhone, setCusPhone] = useState<string>('')
   const [cusPhoneError, setCusPhoneError] = useState<string>('')
   const [cusGender, setCusGender] = useState<'male' | 'female'>('male')
   const [bookingTotal, setBookingTotal] = useState<number>(0)
   const [bookingTotalError, setBookingTotalError] = useState<string>('')

   const handleBookingTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {

      setBookingType(event.target.value as DriveType)
      setSelectedCar(null)
   }

   useEffect(() => {

      const fetchUsers = async () => {
         const response = await adminAllUsers();
         if (response.statusCode === 200) {
           setAllUsersResult(response.data as UserType[]);
         }
      }
   
      fetchUsers()
   }, [])

   useEffect(() => {
      const handler = setTimeout(() => {
         if (!isLocationClicked) {
            setDebouncedPickupSearch(pickupSearch)
         }
         setIsLocationClicked(false)
      }, 300)

      return () => {
         clearTimeout(handler)
      }
   }, [pickupSearch])
   
   useEffect(() => {
      const handler = setTimeout(() => {
         if (!isLocationClicked) {
            setDebouncedDropoffSearch(dropoffSearch)
         }
         setIsLocationClicked(false)
      }, 300)

      return () => {
         clearTimeout(handler)
      }
   }, [dropoffSearch])

   useEffect(() => {
      const fetchLocations = async (keyword: string) => {

         if (debouncedPickupSearch.length > 3) {

            const response : ResponseType = await adminSearchLocation(keyword)
            if (response.statusCode == 200) {
               setPickupLocationResult(response.data.data as Location[])
            }
         } else {
            setPickupLocationResult([])
            setPickupLocation(null)
         }
      }

      fetchLocations(debouncedPickupSearch)
   }, [debouncedPickupSearch])
   
   useEffect(() => {
      const fetchLocations = async (keyword: string) => {
         if (debouncedDropoffSearch.length > 3) {
            const response : ResponseType = await adminSearchLocation(keyword)
            if (response.statusCode == 200) {
               setDropoffLocationResult(response.data.data as Location[])
            }
         } else {
            setDropoffLocationResult([])
            setDropoffLocation(null)
         }
      }

      fetchLocations(debouncedDropoffSearch)
   }, [debouncedDropoffSearch])

   useEffect(() => {
      const handleClickOutside = (event: any) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
         setPickupLocationResult([])
        }
      }
  
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
   }, [dropdownRef])
   
   useEffect(() => {
      const handleClickOutside = (event: any) => {
        if (dropdownRefTwo.current && !dropdownRefTwo.current.contains(event.target)) {
         setDropoffLocationResult([])
        }
      }
  
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
   }, [dropdownRefTwo])

   const handleLocationClick = (type: string, location: Location) => {
      
      if (type == 'pick-up') {
         setPickupLocation(location)
         setIsLocationClicked(true)
         setPickupSearch(location.name)
         setPickupLocationResult([])
      } else if (type == 'drop-off') {
         setDropoffLocation(location)
         setIsLocationClicked(true)
         setDropoffSearch(location.name)
         setDropoffLocationResult([])
      }
   }

   const handleCustomerChange = (value: number | 'new') => {

      if (value == 'new') {
         setSelectedCustomer({
            firstName: cusFirstN,
            lastName: cusLastN,
            email: cusEmail,
            phone: cusPhone,
            gender: cusGender,
            fullName: `${cusFirstN} ${cusLastN}` 
         } as UserType)

         setIsCustomerNew(true)
      } else {
         const user = allUsersResult.find(user => user.id == value)
         if (user) {
            setSelectedCustomer(user)
            setCusFirstN(user.firstName)
            setCusLastN(user.lastName)
            setCusEmail(user.email)
            setCusPhone(user.phone)
            setCusGender(user.gender)

            setIsCustomerNew(false)
         }
      }
   }

   const handleShowCarsPopup = () => {

      setPickupLocationError('')
      setPickupDateTimeError('')
      setDropoffLocationError('')
      setBookingHoursError('')

      if(bookingType == 'rental') {

      } else if (!pickupLocation) {
         setPickupLocationError('Required')
      } else if (pickupDateTime == '') {
         setPickupDateTimeError('Required')
      } else if (bookingType == 'transfer' && !dropoffLocation) {
         setDropoffLocationError('Required')
      } else if (bookingType == 'chauffer' && !bookingHours) {
         setBookingHoursError('Required')
      } else {
         setShowCarPopup(true)
      }
   }

   const handleCarSelect = (car: CarSummary) => {
      setSelectedCar(car)
      setShowCarPopup(false)
   }
   
   const handleShowSelectedCar = () => {
      setShowSelectedCarPopup(true)
   }

   const handleCreateBooking = async (event: React.FormEvent) => {

      if (!isLoading) {

         event.preventDefault()
         event.stopPropagation()
         setIsLoading(true)
   
         setCusFNError('')
         setCusLNError('')
         setCusEmailError('')
         setCusPhoneError('')
         setSelectedCarError('')
         setPassengersError('')
         setBookingTotalError('')
   
         let hasError = false
   
         if (cusFirstN == '') {
            setCusFNError('Required')
            hasError = true
         }
         
         if (cusLastN == '') {
            setCusLNError('Required')
            hasError = true
         }
         
         if (cusEmail == '') {
            setCusEmailError('Required')
            hasError = true
         }
         
         if (cusPhone == '') {
            setCusPhoneError('Required')
            hasError = true
         }
         
         if (bookingTotal <= 0) {
            setBookingTotalError('Required')
            hasError = true
         }
         
         if (!selectedCar) {
            setSelectedCarError('No car selected')
            hasError = true
         }
   
         if (!isValidUniqueEmail(cusEmail)) {
            setCusEmailError('This email cannot be accepted')
            hasError = true
         }
   
         for (let i = 0; i < passengers.list.length; i++) {
            if (passengers.list[i].name.trim() === '') {
               setPassengersError('Fill all passengers')
               hasError = true
            }
         }
         
         if (!hasError) {
   
            const price : BookingPrice = bookingPriceCalculator(bookingTotal, 'manual', [])
            const customerr = {
               firstName: cusFirstN,
               lastName: cusLastN,
               email: cusEmail,
               phone: cusPhone,
               gender: cusGender,
               fullName: `${cusFirstN} ${cusLastN}` 
            }
   
            const response = await adminCreateBooking(
               bookingType, 
               bookingHours, 
               paymentMode, 
               price,
               customerr as UserType,
               isCustomerNew, 
               selectedCar as CarSummary, 
               pickupLocation as Location, 
               dropoffLocation, 
               pickupDateTime,
               passengers,
               true
            )

            setIsLoading(false)
         
            if (response.statusCode == 201) {
               
               showNotificationHandler('Successful', 'Booking has been created successfully', 'success')
               resetForm()
            } else {
               
               if (response.data == 'ERR_JWT_EXPIRED') {
                  signOut()   
               }
   
               showNotificationHandler('Error', response.data.error, 'error')
            }
         }
      }
   }

   const handlePassengerChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target
      const updatedList = [...passengers.list]
      updatedList[index] = { ...updatedList[index], name: value }
      setPassengers((prev: any) => ({ ...prev, list: updatedList }))
   }

   const handlePassengerCountChange = (type: string, event: React.ChangeEvent<HTMLInputElement>) => {

      const count = parseInt(event.target.value, 10)

      setPassengers((prev: any) => {
         const newList = [...prev.list]
         const total = prev.adults + prev.children
         if (type === 'adults') {
            if (count > prev.adults) {
               for (let i = total; i < total + (count - prev.adults); i++) {
                  newList.push({ name: '' })
               }
            } else if (count < prev.adults) {
               newList.splice(count + prev.children, prev.adults - count)
            }
            return { ...prev, adults: count, total: count + prev.children, list: newList }
         } else {
            if (count > prev.children) {
               for (let i = total; i < total + (count - prev.children); i++) {
                  newList.push({ name: '' })
               }
            } else if (count < prev.children) {
               newList.splice(prev.adults + count, prev.children - count)
            }
            return { ...prev, children: count, total: prev.adults + count, list: newList }
         }
      })
   }

   const resetForm = () => {
      setBookingType('transfer')
      setBookingHours(null)
      setPaymentMode('cash')
      setSelectedCar(null)
      setPickupLocation(null)
      setDropoffLocation(null)
      setPickupDateTime('')
      setIsCustomerNew(true)
      setCusFirstN('')
      setCusLastN('')
      setCusEmail('')
      setCusPhone('')
      setCusGender('male')
   }

   return (
      <>
         <div className="space-y-12">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
               <div>
                  <h2 className="text-base font-semibold leading-7 text-gray-900">1. Choose customer</h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                     Select an existing customer or enter details to create a new one
                  </p>
               </div>

               <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                  <div className="col-span-full">
                     <label htmlFor="customer" className="block text-sm font-medium leading-6 text-gray-900">
                        Choose Customer
                     </label>
                     <div className="mt-2">
                        <select id="customer" onChange={(e: any) => handleCustomerChange(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none sm:text-sm sm:leading-6">
                           <option value="new">I want to create a new customer</option>
                           {allUsersResult && allUsersResult.map((user: UserType, index: number) => (
                              <option key={index} value={user.id}>
                                 {user.fullName}
                              </option>
                           ))}
                        </select>
                     </div>
                  </div>

                  <div className="sm:col-span-3">
                     <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                        First name
                     </label>
                     <div className="mt-2">
                        <input id="first-name" type="text" readOnly={!isCustomerNew} value={cusFirstN} onChange={(e) => setCusFirstN(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"/>
                        {cusFNError != '' && (
                           <div className="text-theme-red text-sm font-semibold">{cusFNError}</div>
                        )}
                     </div>
                  </div>

                  <div className="sm:col-span-3">
                     <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                        Last name
                     </label>
                     <div className="mt-2">
                        <input id="last-name" type="text" readOnly={!isCustomerNew} value={cusLastN} onChange={(e) => setCusLastN(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"/>
                        {cusLNError != '' && (
                           <div className="text-theme-red text-sm font-semibold">{cusLNError}</div>
                        )}
                     </div>
                  </div>
                  
                  <div className="col-span-full">
                     <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                        Email address
                     </label>
                     <div className="mt-2">
                        <input id="email-address" type="text" readOnly={!isCustomerNew} value={cusEmail} onChange={(e) => setCusEmail(e.target.value)}className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"/>
                        {cusEmailError != '' && (
                           <div className="text-theme-red text-sm font-semibold">{cusEmailError}</div>
                        )}
                     </div>
                  </div>

                  <div className="sm:col-span-3">
                     <label htmlFor="customer" className="block text-sm font-medium leading-6 text-gray-900">
                        Gender
                     </label>
                     <div className="mt-2">
                        <select id="gender" disabled={!isCustomerNew} onChange={(e) => {setCusGender(e.target.value as ('male' | 'female'))}} value={cusGender} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none sm:text-sm sm:leading-6">
                           <option value="male">Male</option>
                           <option value="female">Female</option>
                        </select>
                     </div>
                  </div>

                  <div className="sm:col-span-3">
                     <label htmlFor="phone-number" className="block text-sm font-medium leading-6 text-gray-900">
                        Phone number
                     </label>
                     <div className="mt-2">
                        <input id="phone-number" type="text" readOnly={!isCustomerNew} value={cusPhone} onChange={(e) => setCusPhone(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"/>
                        {cusPhoneError != '' && (
                           <div className="text-theme-red text-sm font-semibold">{cusPhoneError}</div>
                        )}
                     </div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
               <div>
                  <h2 className="text-base font-semibold leading-7 text-gray-900">2. Choose Car {selectedCarError != '' && (<span className="text-theme-red text-sm font-semibold">({selectedCarError})</span>)}</h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">Choose your booking type, add pickup and other necessary booking details. Then press search cars and choose your car</p>
               </div>

               <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                  <div className="col-span-full">
                     <label htmlFor="phone-number" className="block text-sm font-medium leading-6 text-gray-900">
                        Booking type
                     </label>
                     <div className="mt-2 space-y-6 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                        <div className="flex items-center">
                           <input defaultChecked={bookingType === 'transfer'} id="booking-transfer" name="booking-type" type="radio" value="transfer" onChange={handleBookingTypeChange} className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                           <label htmlFor="booking-transfer" className="ml-3 block text-sm font-medium leading-6 text-gray-900">Transfer</label>
                        </div>
                        <div className="flex items-center">
                           <input defaultChecked={bookingType === 'chauffer'} id="booking-chauffer" name="booking-type" type="radio" value="chauffer" onChange={handleBookingTypeChange} className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                           <label htmlFor="booking-chauffer" className="ml-3 block text-sm font-medium leading-6 text-gray-900">Chauffer</label>
                        </div>
                        <div className="flex items-center">
                           <input defaultChecked={bookingType === 'rental'} id="booking-rental" name="booking-type" type="radio" value="rental" onChange={handleBookingTypeChange} className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                           <label htmlFor="booking-rental" className="ml-3 block text-sm font-medium leading-6 text-gray-900">Rental</label>
                        </div>
                     </div>
                  </div>

                  <div className="col-span-full">
                     <label htmlFor="phone-number" className="block text-sm font-medium leading-6 text-gray-900">
                        Booking total (without commission)
                     </label>
                     <div className="mt-2 sm:flex flex-col">
                        <input id="booking-total" type="number" value={bookingTotal} onChange={(e) => setBookingTotal(parseInt(e.target.value))} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"/>
                        {bookingTotal <= 0 && (
                           <div className="text-theme-red text-sm font-semibold">{bookingTotalError}</div>
                        )}
                     </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                     <label htmlFor="pickup-location-name" className="block text-sm font-medium leading-6 text-gray-900">
                        Pick-up location
                     </label>
                     <div className="mt-2">
                        <input id="pickup-location-name" type="text" value={pickupSearch} onChange={(e) => setPickupSearch(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"/>
                        <div className="relative" ref={dropdownRef}>
                           {pickupLocationResult && pickupLocationResult.length > 0 && (
                           <div className="absolute right-0 top-[2px] max-h-[200px] overflow-y-auto w-full rounded-md bg-gray-300 shadow-lg z-10">
                              {pickupLocationResult.map((location: Location) => (
                                 <div key={location.name} onClick={() => handleLocationClick('pick-up', location)} className="px-4 py-2 text-sm text-gray-900 cursor-pointer">
                                    {location.name}
                                 </div>
                              ))}
                           </div>
                           )}
                        </div>
                        {pickupLocationError != '' && (
                           <span className="text-theme-red text-sm font-semibold">{pickupLocationError}</span>
                        )}
                     </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                     <label htmlFor="pickkup-location-name" className="block text-sm font-medium leading-6 text-gray-900">
                        Pick-up date and time
                     </label>
                     <div className="mt-2">
                        <input id="pickkup-date-time" type="datetime-local" value={pickupDateTime} onChange={(e) => setPickupDateTime(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"/>
                        {pickupDateTimeError != '' && (
                           <div className="text-theme-red text-sm font-semibold">{pickupDateTimeError}</div>
                        )}
                     </div>
                  </div>
                  
                  {(bookingType == 'transfer' || bookingType == 'rental') && 
                  <div className="col-span-full">
                     <label htmlFor="dropoff-location-name" className="block text-sm font-medium leading-6 text-gray-900">
                        Drop-off location
                     </label>
                     <div className="mt-2">
                        <input id="dropoff-location-name" type="text" value={dropoffSearch} onChange={(e) => setDropoffSearch(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"/>
                        <div className="relative" ref={dropdownRefTwo}>
                           {dropoffLocationResult && dropoffLocationResult.length > 0 && (
                           <div className="absolute right-0 top-[2px] max-h-[200px] overflow-y-auto w-full rounded-md bg-gray-300 shadow-lg z-10">
                              {dropoffLocationResult.map((location: Location) => (
                                 <div key={location.name} onClick={() => handleLocationClick('drop-off', location)} className="px-4 py-2 text-sm text-gray-900 cursor-pointer">
                                    {location.name}
                                 </div>
                              ))}
                           </div>
                           )}
                        </div>
                        {dropoffLocationError != '' && (
                           <span className="text-theme-red text-sm font-semibold">{dropoffLocationError}</span>
                        )}
                     </div>
                  </div>}
                  
                  {bookingType == 'chauffer' && 
                     <div className="col-span-full">
                     <label htmlFor="booking-hours" className="block text-sm font-medium leading-6 text-gray-900">
                        Hours
                     </label>
                     <div className="mt-2">
                        <input id="booking-hours" type="number" min="1" value={bookingHours as number} onChange={(e) => setBookingHours(parseInt(e.target.value))} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"/>
                        {bookingHoursError != '' && (
                           <div className="text-theme-red text-sm font-semibold">{bookingHoursError}</div>
                        )}
                     </div>
                  </div>}

                  {bookingType == 'rental' && 
                     <div className="col-span-full">
                     <label htmlFor="booking-hours" className="block text-sm font-medium leading-6 text-gray-900">
                        Drop-off date and time
                     </label>
                     <div className="mt-2 space-y-6 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                        <input id="dropoff-date-time" type="text" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"/>
                     </div>
                  </div>}
                  
                  <div className="col-span-full ml-auto">
                     {selectedCar && (
                        <button onClick={handleShowSelectedCar} type="button" className="rounded-md bg-white border px-3 py-2 text-sm font-semibold text-gray-600 shadow-sm hover:bg-gray-300 hover:text-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                           View Selected Car
                        </button>
                     )}
                     <button onClick={handleShowCarsPopup} type="button" className="rounded-md bg-white border px-3 py-2 text-sm font-semibold text-gray-600 shadow-sm hover:bg-gray-300 hover:text-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        Search Cars
                     </button>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
               <div>
                  <h2 className="text-base font-semibold leading-7 text-gray-900">3. Add Passengers</h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                     Add all the passengers information {passengersError != '' && (<span className="text-theme-red text-sm font-semibold">({passengersError})</span>)}
                  </p>
               </div>

               <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                  <div className="sm:col-span-3">
                     <label htmlFor="adults-number" className="block text-sm font-medium leading-6 text-gray-900">
                        Total number of adults
                     </label>
                     <div className="mt-2">
                        <input id="adults-number" type="number" min="1" value={passengers.adults} onChange={(event) => handlePassengerCountChange('adults', event)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"/>
                     </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                     <label htmlFor="children-number" className="block text-sm font-medium leading-6 text-gray-900">
                        Total number of children
                     </label>
                     <div className="mt-2">
                        <input id="children-number" type="number" min="0" value={passengers.children} onChange={(event) => handlePassengerCountChange('children', event)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"/>
                     </div>
                  </div>

                  {passengers.list && passengers.list.map((passenger: any, index: number) => (
                     <div className="sm:col-span-6">
                        <label className="block text-sm font-medium leading-6 text-gray-900">
                           Passenger {index+1}
                        </label>
                        <div className="mt-2">
                           <input type="text" value={passenger.name} onChange={(event) => handlePassengerChange(index, event)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"/>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
               <div>
                  <h2 className="text-base font-semibold leading-7 text-gray-900">4. Choose Payment Mode</h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                     Choose pay by cash or generate a link for invoice
                  </p>
               </div>

               <div className="max-w-2xl space-y-10 md:col-span-2">
                  <div className="col-span-full">
                     <label htmlFor="phone-number" className="block text-sm font-medium leading-6 text-gray-900">
                        Payment mode
                     </label>
                     <div className="mt-2 space-y-6 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                        <div className="flex items-center">
                           <input defaultChecked={paymentMode === 'cash'} id="payment-cash" name="payment-mode" type="radio" value="cash" onChange={() => {setPaymentMode('cash')}} className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                           <label htmlFor="payment-cash" className="ml-3 block text-sm font-medium leading-6 text-gray-900">Cash</label>
                        </div>
                        <div className="flex items-center">
                           <input defaultChecked={paymentMode === 'online'} id="payment-online" name="payment-mode" type="radio" value="online" onChange={() => {setPaymentMode('online')}} className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                           <label htmlFor="payment-online" className="ml-3 block text-sm font-medium leading-6 text-gray-900">Generate Invoice</label>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="mt-6 flex flex-col items-end gap-6">
            <button type="button" onClick={handleCreateBooking} disabled={isLoading} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
               Create Booking
            </button>
         </div>
         {showCarPopup && (
            <div className="absolute top-0 w-full h-screen bottom-0 left-0 right-0 bottom-6 z-50 flex items-center justify-center">
               <div onClick={() => setShowCarPopup(false)} className="fixed inset-0 bg-gray-400 opacity-60 transition-opacity"></div>
               <div className="flex flex-col gap-4 items-center z-[60] w-full md:m-12">
                  <SearchCars onSelect={handleCarSelect} bookingType={bookingType} bookingHours={bookingHours} pickupLocation={pickupLocation} pickupDateTime={pickupDateTime} dropoffLocation={dropoffLocation} />
               </div>
            </div>
         )}
         {showSelectedCarPopup && (
            <div className="absolute top-0 w-full h-screen bottom-0 left-0 right-0 bottom-6 z-50 flex items-center justify-center">
               <div onClick={() => setShowSelectedCarPopup(false)} className="fixed inset-0 bg-gray-400 opacity-60 transition-opacity"></div>
               <div className="flex flex-col gap-4 items-center z-[60] w-full md:m-12">
                  <SelectedCar car={selectedCar as CarSummary} />
               </div>
            </div>
         )}
         <Notification
            open={showNotification}
            message={notificationMessage}
            description={notificationDescription}
            type={notificationType}
            onClose={hideNotificationHandler}
         />
      </>
   )
}
