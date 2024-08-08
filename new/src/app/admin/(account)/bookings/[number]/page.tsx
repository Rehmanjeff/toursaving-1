'use client'

import React, { useEffect, useState } from 'react'
import { BookingType } from '@/types/booking'
import Admin from '@/app/admin/_composables/admin'
import { ResponseType } from "@/types/index"
import useSignOut from '@/_utils/signout'
import useFileDownload from "@/hooks/useFileDownload"
import ConfirmModal from '@/app/admin/_widgets/ConfirmModal'
import Notification from '@/app/admin/_widgets/Notification'
import { useNotification } from '@/app/admin/_hooks/useNotification'

export default function BookingtDetails ({params} : {params: { number: number }}) {

   const { adminReadBooking, adminCancelBooking } = Admin()

   const [booking, setBooking] = useState<BookingType>()
   const signOut = useSignOut()
   const { downloadLink } = useFileDownload()
   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false)
   const {
      notificationMessage,
      notificationDescription,
      notificationType,
      showNotification,
      showNotificationHandler,
      hideNotificationHandler,
   } = useNotification()
   
   const handleDownloadClick = (file: string) => {
      downloadLink({
         filePath: file,
      }).handleDownload()
   }

   const handleCancelBooking = async () => {
      const response : ResponseType = await adminCancelBooking(params.number)

      if (response.statusCode == 200) {
         handleCloseConfirmModal()
         showNotificationHandler('Successful', 'Bookings has been cancelled successfully', 'success')
         await fetchData()
      } else {
         showNotificationHandler('Error', response.data, 'error')
      }
   }

   const handleCloseConfirmModal = () => {
      setIsConfirmModalOpen(false)
   }
   
   const openConfirmModal = () => {
      setIsConfirmModalOpen(true)
   }

   const fetchData = async () => {

      const response : ResponseType = await adminReadBooking(params.number)
      if (response.statusCode == 200) {
         setBooking(response.data as BookingType)
      } else {
         
         if (response.data == 'ERR_JWT_EXPIRED') {
            signOut()   
         }
      }
   }

   useEffect(() => {
      fetchData()
   }, [])

   const BookingSummary = () => {
      return (
         <div className="w-full">
            <div className="rounded-lg bg-gray-100 shadow-sm ring-1 ring-gray-900/5">
               <dl className="flex flex-wrap">
                  <div className="flex-auto pl-6 pt-6">
                  <dt className="text-sm font-semibold leading-6 text-gray-900">Booking Total</dt>
                  <dd className="mt-1 text-base font-semibold leading-6 text-gray-900">{booking?.total} USD</dd>
                  </div>
                  <div className="flex-none self-end px-6 pt-4">
                  {booking?.status == 'Completed' && <div className="inline-flex items-center rounded-md bg-green-100 px-8 py-1 text-sm font-medium text-green-800 ring-1 ring-inset ring-green-600/20">
                     Paid
                  </div>}
                  {booking?.status == 'Unpaid' && <div className="inline-flex items-center rounded-md bg-yellow-50 px-8 py-1 text-sm font-medium text-yellow-700 ring-1 ring-inset ring-green-600/20">
                     Awaiting Payment
                  </div>}
                  {booking?.status == 'Created' && <div className="inline-flex items-center rounded-md bg-blue-100 px-8 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-green-600/20">
                     Created
                  </div>}
                  {booking?.status == 'Cancelled' && <div className="inline-flex items-center rounded-md bg-red-100 px-8 py-1 text-sm font-medium text-red-700 ring-1 ring-inset ring-green-600/20">
                     Cancelled
                  </div>}
                  </div>
                  <div className="mt-6 flex w-full flex items-center gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                  <div className="text-sm font-medium leading-6 text-gray-900">Drive Type: </div>
                  <div className="text-sm text-gray-500 capitalize">
                     <span>{booking?.driveType}</span>
                     {booking?.hours && <span> ({booking.hours} Hrs)</span>}
                  </div>
                  </div>
                  <div className="mt-6 flex w-full flex items-center gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                  <div className="text-sm font-medium leading-6 text-gray-900">Supplier: </div>
                  <div className="text-sm text-gray-500">{booking?.supplier}</div>
                  </div>
                  <div className="mt-6 flex w-full flex items-center gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                  <div className="text-sm font-medium leading-6 text-gray-900">Notes: </div>
                  <div className="text-sm text-gray-500">{booking?.notes}</div>
                  </div>
               </dl>
               <div className="mt-6 border-t border-gray-900/5 px-6 py-6">
                  <button onClick={() => handleDownloadClick(`/pdf/${booking?.voucher}`)} className="text-sm font-semibold leading-6 text-gray-900">
                  Download receipt <span aria-hidden="true">&rarr;</span>
                  </button>
               </div>
            </div>
         </div>
      )
   }
   
   const CarDetails = () => {
      return (
         <div className="w-full">
            <div className="rounded-lg bg-gray-100 shadow-sm ring-1 ring-gray-900/5">
               <dl className="flex flex-wrap">
               <div className="flex-auto pl-6 pt-6">
                  <dt className="text-sm font-semibold leading-6 text-gray-900">Car Details</dt>
               </div>
               <div className="mt-6 flex w-full flex items-center gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                  <div className="text-sm font-medium leading-6 text-gray-900">Name: </div>
                  <div className="text-sm text-gray-500 capitalize">{booking?.car.title}</div>
               </div>
               <div className="mt-6 flex w-full flex items-start gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                  <div className="text-sm font-medium leading-6 text-gray-900">Photo: </div>
                  <div className="text-sm text-gray-500 capitalize">
                     <img className="rounded" src={booking?.car.image as string} alt={booking?.car.title as string} />
                  </div>
               </div>
               <div className="mt-6 flex w-full flex items-center gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                  <div className="text-sm font-medium leading-6 text-gray-900">Description: </div>
                  <div className="text-sm text-gray-500">{booking?.car.description}</div>
               </div>
               <div className="mt-6 flex w-full flex items-center gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                  <div className="text-sm font-medium leading-6 text-gray-900">Capacity: </div>
                  <div className="text-sm text-gray-500">{booking?.car.capacity}</div>
               </div>
               </dl>
            </div>
         </div>
      )
   }
   
   const PassengersDetail = () => {
      return (
         <div className="w-full">
            <div className="rounded-lg bg-gray-100 shadow-sm ring-1 ring-gray-900/5">
               <dl className="flex flex-wrap">
                  <div className="flex-auto pl-6 pt-6">
                     <dt className="text-sm font-semibold leading-6 text-gray-900">Passengers Detail</dt>
                  </div>
                  <div className="mt-6 flex w-full flex items-center gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                     <div className="text-sm font-medium leading-6 text-gray-900">Total Passengers: </div>
                     <div className="text-sm text-gray-500 capitalize">{booking?.passengers.total}</div>
                  </div>
                  <div className="mt-6 flex w-full flex items-center gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                     <div className="text-sm font-medium leading-6 text-gray-900">Adults Passengers: </div>
                     <div className="text-sm text-gray-500 capitalize">{booking?.passengers.adults}</div>
                  </div>
                  <div className="mt-6 flex w-full flex items-center gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                     <div className="text-sm font-medium leading-6 text-gray-900">Children Passengers: </div>
                     <div className="text-sm text-gray-500 capitalize">{booking?.passengers.children}</div>
                  </div>
                  {booking?.passengers.list.map((passenger: any, index: number) => (<div key={index} className="mt-6 flex w-full flex items-center gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                     <div className="text-sm font-medium leading-6 text-gray-900">Name: </div>
                     <div className="text-sm text-gray-500 capitalize">{passenger.name}</div>
                     {passenger.email && <div className="text-sm text-gray-500 capitalize">{passenger.email}</div>}
                     {passenger.phonneNumber && <div className="text-sm text-gray-500 capitalize">{passenger.phoneNumber.countryCode}-{passenger.phoneNumber.number}</div>}
                  </div>))}
               </dl>
            </div>
         </div>
      )
   }
   
   const PickUpDestination = () => {
      return (
         <div className="w-full">
            <div className="rounded-lg bg-gray-100 shadow-sm ring-1 ring-gray-900/5">
               <dl className="flex flex-wrap">
                  <div className="flex-auto pl-6 pt-6">
                     <dt className="text-sm font-semibold leading-6 text-gray-900">Pick up and Destination</dt>
                  </div>
                  <div className="mt-6 flex w-full flex items-center gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                     <div className="text-sm font-medium leading-6 text-gray-900">Pickup Location: </div>
                     <div className="text-sm text-gray-500 capitalize">{booking?.pickUp.name}</div>
                     { booking?.pickUp.isAirport && <div className="inline-flex items-center rounded-md bg-blue-100 px-8 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-green-600/20">Airport</div>}
                  </div>
                  <div className="mt-6 flex w-full flex items-center gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                     <div className="text-sm font-medium leading-6 text-gray-900">Pickup Date and Time: </div>
                     <div className="text-sm text-gray-500 capitalize">{booking?.startDateTime}</div>
                  </div>
                  {booking?.destination && 
                  <div className="mt-6 flex w-full flex items-center gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                     <div className="text-sm font-medium leading-6 text-gray-900">Destination: </div>
                     <div className="text-sm text-gray-500 capitalize">{booking?.destination.name}</div>
                     { booking?.destination.isAirport && <div className="inline-flex items-center rounded-md bg-blue-100 px-8 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-green-600/20">Airport</div>}
                  </div>
                  }
                  {booking?.endDateTime && 
                  <div className="mt-6 flex w-full flex items-center gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                     <div className="text-sm font-medium leading-6 text-gray-900">End Date and Time: </div>
                     <div className="text-sm text-gray-500 capitalize">{booking?.endDateTime}</div>
                  </div>
                  }
               </dl>
            </div>
         </div>
      )
   }
   
   return (
      <div className="flex flex-col gap-2">
         <div className="px-4 sm:px-0 mb-6 flex items-start">
            <div>
               <h3 className="text-base font-semibold leading-7 text-gray-900">Booking #{booking?.number}</h3>
               <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">All booking and payment details</p>
            </div>
            {booking?.canCancel && booking?.status != 'Cancelled' && 
            <button onClick={openConfirmModal} type="button" className="ml-auto rounded-md bg-red-600 px-2.5 h-auto py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
               Cancel Booking
            </button>
            }
         </div>
         <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2 flex flex-col gap-4">
               <div>{BookingSummary()}</div>
               <div>{PickUpDestination()}</div>
               <div>{PassengersDetail()}</div>
            </div>
            <div className="w-full md:w-1/2">
               <div className="flex flex-col gap-4">
                  <div>{CarDetails()}</div>
               </div>
            </div>
         </div>
         {isConfirmModalOpen && (
            <ConfirmModal
               title="Do you want to cancel this booking"
               description="You cannot undo this action"
               confirmText="Yes, cancel"
               isOpen={isConfirmModalOpen}
               onClose={handleCloseConfirmModal}
               onConfirm={handleCancelBooking}
            />
         )}
         <Notification
            open={showNotification}
            message={notificationMessage}
            description={notificationDescription}
            type={notificationType}
            onClose={hideNotificationHandler}
         />
      </div>
   )
}