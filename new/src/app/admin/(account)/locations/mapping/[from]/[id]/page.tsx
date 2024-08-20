'use client'

import React, { useEffect, useState } from 'react'
import { MasterLocation } from '@/types/location'
import { SupplierLocation, Supplier } from '@/types/supplier'
import Admin from '@/app/admin/_composables/admin'
import { ResponseType } from "@/types/index"
import useSignOut from '@/_utils/signout'
import Notification from '@/app/admin/_widgets/Notification'
import { useNotification } from '@/app/admin/_hooks/useNotification'

type From = 'supplier' | 'master'

export default function LocationMapping ({params} : {params: { from: From, id: number }}) {

   const { adminAllLocations, adminReadSupplierLocation, adminMapLocations } = Admin()

   const [isLoading, setIsLoading] = useState<boolean>(false)
   const [error, setError] = useState<string>('')
   const [locations, setLocations] = useState<MasterLocation[]>()
   const [selectedLocation, setSelectedLocation] = useState<MasterLocation | null>(null)
   const [supplier, setSupplier] = useState<Supplier>()
   const [supplierLocation, setSupplierLocation] = useState<SupplierLocation>()
   const [location, setLocation] = useState<MasterLocation>()
   const [suppliers, setSuppliers] = useState<Supplier[]>()
   const signOut = useSignOut()
   const {
      notificationMessage,
      notificationDescription,
      notificationType,
      showNotification,
      showNotificationHandler,
      hideNotificationHandler,
   } = useNotification()

   const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const locationId = parseInt(e.target.value, 10);
      setSelectedLocation(locations?.find(
         (location: any) => location.id === locationId
       ) as MasterLocation)
   }

   const fetchData = async () => {

      if (params.from == 'supplier') {

         const response : ResponseType = await adminAllLocations()
         if (response.statusCode == 200) {
            setLocations(response.data as MasterLocation[])

            if (response.data.length) {
               console.log(response.data[0].id)
               setSelectedLocation(response.data[0])
            }
         } else {
            
            if (response.data == 'ERR_JWT_EXPIRED') {
               signOut()   
            }
         }
         
         const resp : ResponseType = await adminReadSupplierLocation(params.id)
         if (resp.statusCode == 200) {
            setSupplierLocation(resp.data.location)
            setSupplier(resp.data.supplier)
         } else {
            
            if (response.data == 'ERR_JWT_EXPIRED') {
               signOut()   
            }
         }
      }
   }

   const handleSubmit = async (event: React.FormEvent) => {

      if (!isLoading) {

         event.preventDefault()
         event.stopPropagation()
         setIsLoading(true)
   
         let hasError = false
   
         if (!selectedLocation) {
            setError('No Location selected')
            hasError = true
         }
         
         if (!hasError) {
   
            const response = await adminMapLocations(
               params.from, 
               params.id,
               selectedLocation?.id as number,
            )
         
            if (response.statusCode == 200) {
               
               showNotificationHandler('Successful', 'Locations has been mapped successfully', 'success')
            } else {
               
               if (response.data == 'ERR_JWT_EXPIRED') {
                  signOut()   
               }
   
               showNotificationHandler('Error', response.data.error, 'error')
            }
         }

         setIsLoading(false)
      }
   }

   useEffect(() => {
      fetchData()
   }, [])

   const SupplierLocationCard = () => {
      return (
         <div className="w-full">
            <h2 className="font-medium text-lg mb-4">Supplier Location Details</h2>
            <div className="rounded-lg bg-gray-100 shadow-sm ring-1 ring-gray-900/5">
               <dl className="flex flex-wrap">
                  <div className="flex-auto pl-6 pt-6">
                     <dt className="text-sm font-semibold leading-6 text-gray-900">Supplier Name</dt>
                     <dd className="mt-1 text-base font-semibold leading-6 text-gray-900">{supplier?.name}</dd>
                  </div>
                  <div className="mt-6 flex w-full flex items-center gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                     <div className="text-sm font-medium leading-6 text-gray-900">Location Name: </div>
                     <div className="text-sm text-gray-500 capitalize">
                        <span>{supplierLocation?.name}</span>
                     </div>
                  </div>
                  <div className="mt-6 flex w-full flex items-center gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                     <div className="text-sm font-medium leading-6 text-gray-900">Location Name Arabic: </div>
                     <div className="text-sm text-gray-500 capitalize">
                        <span>{supplierLocation?.nameArabic}</span>
                     </div>
                  </div>
                  <div className="mt-6 flex w-full flex items-center gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                     <div className="text-sm font-medium leading-6 text-gray-900">Location Country Name: </div>
                     <div className="text-sm text-gray-500 capitalize">
                        <span>{supplierLocation?.countryName}</span>
                     </div>
                  </div>
                  <div className="mt-6 flex w-full flex items-center gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                     <div className="text-sm font-medium leading-6 text-gray-900">Location ID: </div>
                     <div className="text-sm text-gray-500 capitalize">
                        <span>{supplierLocation?.locationId}</span>
                     </div>
                  </div>
               </dl>
            </div>
         </div>
      )
   }
   
   const MasterLocationCard = () => {
      return (
         <div className="w-full">
            <h2 className="font-medium text-lg mb-4">Master Location Details</h2>
            <div className="rounded-lg bg-gray-100 shadow-sm ring-1 ring-gray-900/5">
               <dl className="flex flex-wrap">
                  <div className="flex-auto pl-6 pt-6">
                     <dt className="text-sm font-semibold leading-6 text-gray-900">Choose Master Location</dt>
                     <select onChange={(e) => handleChange(e)} className="w-[90%] mt-4 border-none outline-none focus:outline-none">
                     {locations?.map((location) => (
                        <option key={location.id} value={location.id}>
                           {location.name}
                        </option>
                     ))}
                     </select>
                  </div>
                  <div className="mt-6 flex w-full flex items-center gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                     <div className="text-sm font-medium leading-6 text-gray-900">Location Name: </div>
                     <div className="text-sm text-gray-500 capitalize">
                        <span>{selectedLocation?.name}</span>
                     </div>
                  </div>
                  <div className="mt-6 flex w-full flex items-center gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                     <div className="text-sm font-medium leading-6 text-gray-900">Location Name Arabic: </div>
                     <div className="text-sm text-gray-500 capitalize">
                        <span>{selectedLocation?.nameArabic}</span>
                     </div>
                  </div>
                  <div className="mt-6 flex w-full flex items-center gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                     <div className="text-sm font-medium leading-6 text-gray-900">Location Country Name: </div>
                     <div className="text-sm text-gray-500 capitalize">
                        <span>{selectedLocation?.countryName}</span>
                     </div>
                  </div>
                  <div className="mt-6 flex w-full flex items-center gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                     <div className="text-sm font-medium leading-6 text-gray-900">Location ID: </div>
                     <div className="text-sm text-gray-500 capitalize">
                        <span>{selectedLocation?.locationId}</span>
                     </div>
                  </div>
               </dl>
            </div>
         </div>
      )
   }
   
   return (
      <div className="flex flex-col gap-2">
         <div className="px-4 sm:px-0 mb-6 flex items-start">
            <div>
               <h3 className="text-base font-semibold leading-7 text-gray-900">Mapping Supplier Location</h3>
               <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500"></p>
            </div>
         </div>
         <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2 flex flex-col gap-4">
               <div>{SupplierLocationCard()}</div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col gap-4">
               <div>{MasterLocationCard()}</div>
            </div>
         </div>
         <div className="ml-auto mt-4">
            <button type="button" onClick={handleSubmit} disabled={isLoading} className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
               Submit
            </button>
         </div>
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