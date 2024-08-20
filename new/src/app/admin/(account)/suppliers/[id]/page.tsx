'use client'

import React, { useEffect, useState } from 'react'
import { Supplier } from '@/types/supplier'
import Admin from '@/app/admin/_composables/admin'
import { ResponseType } from "@/types/index"
import useSignOut from '@/_utils/signout'
import ConfirmModal from '@/app/admin/_widgets/ConfirmModal'
import Notification from '@/app/admin/_widgets/Notification'
import { useNotification } from '@/app/admin/_hooks/useNotification'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminSupplierDetails ({params} : {params: { id: number }}) {

   const { adminReadSupplier, adminDeleteSupplierLocation } = Admin()

   const [supplier, setSupplier] = useState<Supplier>()
   const [deleteId, setDeletId] = useState<number | null>(null)
   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false)
   const signOut = useSignOut()
   const router = useRouter()
   const {
      notificationMessage,
      notificationDescription,
      notificationType,
      showNotification,
      showNotificationHandler,
      hideNotificationHandler,
   } = useNotification()

   const fetchData = async () => {

      const response : ResponseType = await adminReadSupplier(params.id)
      if (response.statusCode == 200) {
         setSupplier(response.data as Supplier)
      } else {
         
         if (response.data == 'ERR_JWT_EXPIRED') {
            signOut()   
         }
      }
   }

   const handleCloseConfirmModal = () => {
      setDeletId(null)
      setIsConfirmModalOpen(false)
   }
   
   const openConfirmModal = (id: number) => {
      setDeletId(id)
      setIsConfirmModalOpen(true)
   }

   const handleDeleteLocation = async () => {

      if (deleteId) {
         const response : ResponseType = await adminDeleteSupplierLocation(deleteId)
   
         if (response.statusCode == 200) {
            handleCloseConfirmModal()
            showNotificationHandler('Successful', 'Location has been deleted successfully', 'success')
            await fetchData()
         } else {
            showNotificationHandler('Error', response.data, 'error')
         }
   
         setDeletId(null)
      }
   }

   useEffect(() => {
      fetchData()
   }, [])

   const Summary = () => {
      return (
         <div className="w-full">
            <div className="rounded-lg bg-gray-100 shadow-sm ring-1 ring-gray-900/5">
               <dl className="flex flex-wrap">
                  <div className="flex-auto pl-6 pt-6">
                     <dt className="text-sm font-semibold leading-6 text-gray-900">Name</dt>
                     <dd className="mt-1 text-base font-semibold leading-6 text-gray-900">{supplier?.name}</dd>
                  </div>
                  <div className="mt-6 flex w-full flex items-center gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                     <div className="text-sm font-medium leading-6 text-gray-900">Commission: </div>
                     <div className="text-sm text-gray-500 capitalize">
                        <span>{supplier?.commission}</span>
                     </div>
                  </div>
                  <div className="mt-6 flex w-full flex items-center gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                     <div className="text-sm font-medium leading-6 text-gray-900">This supplier has manual locations: </div>
                     <div className="text-sm text-gray-500 capitalize">
                        {supplier?.hasMappingManual ? 'yes' : 'no'}
                     </div>
                  </div>
               </dl>
            </div>
         </div>
      )
   }
   
   const SupplierLocations = () => {
      return (
         <div className="inline-block min-w-full py-2 align-middle">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
               <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                     <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                           Name
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                           Country Name
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                           Mapped Master Location
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
                     {supplier?.locations.length == 0 && (
                        <tr>
                           <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              No locations added
                           </td>
                        </tr>
                     )}

                     {supplier?.locations?.map((location: any, index: number) => (
                     <tr key={index}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                           {location.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{location.countryName}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                           {location.mappedMasterLocation ? `${location.mappedMasterLocation.name} - ${location.mappedMasterLocation.countryName}` : ''}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{location.dateTime}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                           <div className="flex w-full gap-2">
                              <Link href={`/admin/locations/mapping/supplier/${location.id}`} className="text-indigo-600 hover:text-indigo-900">Mapping</Link>
                              <button onClick={() => openConfirmModal(location.id)} className="text-red-600 hover:text-red-900">Delete</button>
                           </div>
                        </td>
                     </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      )
   }
   
   return (
      <>
         <div className="flex flex-col gap-2">
            <div className="px-4 sm:px-0 mb-6 flex items-start">
               <div>
                  <h3 className="text-base font-semibold leading-7 text-gray-900">Supplier Details</h3>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500"></p>
               </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
               <div className="w-full flex flex-col gap-4">
                  <div>{Summary()}</div>
               </div>
            </div>
            {supplier?.hasMappingManual && (
               <>
                  <div className="px-4 sm:px-0 mb-6 flex items-start mt-12">
                     <div className="flex flex-col md:flex-row md:items-center w-full">
                        <div>
                           <h3 className="text-base font-semibold leading-7 text-gray-900">Locations</h3>
                           <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">This table will show all locations added for this supplier</p>
                        </div>
                        <div className="ml-auto">
                           <button onClick={() => {router.push(`${params.id}/locations/add`)}} type="button" className="inline-flex ml-auto mt-4 mb-4 items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                              Add Location
                           </button>
                        </div>
                     </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4">
                     <div className="w-full flex flex-col gap-4">
                        <div>{SupplierLocations()}</div>
                     </div>
                  </div>
               </>
            )}
         </div>
         {isConfirmModalOpen && (
            <ConfirmModal
               title="Do you want to delete this location"
               description="You cannot undo this action"
               confirmText="Yes, delete"
               isOpen={isConfirmModalOpen}
               onClose={handleCloseConfirmModal}
               onConfirm={handleDeleteLocation}
            />
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