'use client'

import React, { useEffect, useState } from 'react'
import { InternalCar } from '@/types/booking'
import Admin from '@/app/admin/_composables/admin'
import { ResponseType } from "@/types/index"
import useSignOut from '@/_utils/signout'
import Link from 'next/link'
import { useNotification } from '@/app/admin/_hooks/useNotification'
import ConfirmModal from '@/app/admin/_widgets/ConfirmModal'
import Notification from '@/app/admin/_widgets/Notification'

export default function AllBookings() {

   const { adminAllCars, adminDeleteCar } = Admin()
   const [error, setError] = useState<boolean>(false)
   const [cars, setCars] = useState<InternalCar[]>()
   const signOut = useSignOut()
   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false)
   const [deleteId, setDeletId] = useState<number | null>(null)
   const {
      notificationMessage,
      notificationDescription,
      notificationType,
      showNotification,
      showNotificationHandler,
      hideNotificationHandler,
   } = useNotification()

   const fetchData = async () => {

      const response : ResponseType = await adminAllCars()
      if (response.statusCode == 200) {
         setCars(response.data as InternalCar[])
      } else {
         
         if (response.data == 'ERR_JWT_EXPIRED') {
            signOut()   
         }
         setError(response.data)
      }
   }

   useEffect(() => {

      fetchData()
   }, [])

   const handleCloseConfirmModal = () => {
      setDeletId(null)
      setIsConfirmModalOpen(false)
   }
   
   const openConfirmModal = (id: number) => {
      setDeletId(id)
      setIsConfirmModalOpen(true)
   }

   const handleDeleteCar = async () => {

      if (deleteId) {
         const response : ResponseType = await adminDeleteCar(deleteId)
   
         if (response.statusCode == 200) {
            handleCloseConfirmModal()
            showNotificationHandler('Successful', 'Car has been cancelled successfully', 'success')
            await fetchData()
         } else {
            showNotificationHandler('Error', response.data, 'error')
         }
   
         setDeletId(null)
      }
   }

   return (
      <div className="px-4 sm:px-6 lg:px-8">
         <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
               <h1 className="text-base font-semibold leading-6 text-gray-900">All Cars</h1>
               <p className="mt-2 text-sm text-gray-700">
                  A list of all the cars
               </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
               <Link href="add" className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  Add car
               </Link>
            </div>
         </div>
         {error && (
            <div className="text-red-600 font-normal mt-12">Cars could not be fetched at the moment</div>
         )}
         <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
               <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                     <thead className="bg-gray-50">
                        <tr>
                           <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                              Title
                           </th>
                           <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Image
                           </th>
                           <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Capacity
                           </th>
                           <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Date and Time
                           </th>
                           <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                              <span className="sr-only">Edit</span>
                           </th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-200 bg-white">
                        {cars?.length == 0 && (
                           <tr>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                 No cars found
                              </td>
                           </tr>
                        )}

                        {cars?.map((car: InternalCar, index: number) => (
                        <tr key={index}>
                           <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {car.title}
                           </td>
                           <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <img className="max-w-[200px]" src={car.image} alt="" />
                           </td>
                           <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{car.capacity}</td>
                           <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{car.dateTime}</td>
                           <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <div className="flex w-full gap-2">
                                 <Link href={car.id.toString()} className="text-indigo-600 hover:text-indigo-900">Details</Link>
                                 <button onClick={() => openConfirmModal(car.id)} className="text-red-600 hover:text-red-900">Delete</button>
                              </div>
                           </td>
                        </tr>
                        ))}
                     </tbody>
                  </table>
                  </div>
               </div>
            </div>
         </div>

         {isConfirmModalOpen && (
            <ConfirmModal
               title="Do you want to delete this car"
               description="You cannot undo this action"
               confirmText="Yes, delete"
               isOpen={isConfirmModalOpen}
               onClose={handleCloseConfirmModal}
               onConfirm={handleDeleteCar}
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
