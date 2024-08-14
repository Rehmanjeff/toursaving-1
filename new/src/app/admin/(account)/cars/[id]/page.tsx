'use client'

import React, { useEffect, useState } from 'react'
import { InternalCar } from '@/types/booking'
import Admin from '@/app/admin/_composables/admin'
import { ResponseType } from "@/types/index"
import useSignOut from '@/_utils/signout'
import useFileDownload from "@/hooks/useFileDownload"
import ConfirmModal from '@/app/admin/_widgets/ConfirmModal'
import Notification from '@/app/admin/_widgets/Notification'
import { useNotification } from '@/app/admin/_hooks/useNotification'

export default function BookingtDetails ({params} : {params: { id: number }}) {

   const { adminReadCar } = Admin()

   const [car, setCar] = useState<InternalCar>()
   const signOut = useSignOut()

   const fetchData = async () => {

      const response : ResponseType = await adminReadCar(params.id)
      if (response.statusCode == 200) {
         setCar(response.data as InternalCar)
      } else {
         
         if (response.data == 'ERR_JWT_EXPIRED') {
            signOut()   
         }
      }
   }

   useEffect(() => {
      fetchData()
   }, [])

   const CarSummary = () => {
      return (
         <div className="w-full">
            <div className="rounded-lg bg-gray-100 shadow-sm ring-1 ring-gray-900/5">
               <dl className="flex flex-wrap">
                  <div className="flex-auto pl-6 pt-6">
                     <dt className="text-sm font-semibold leading-6 text-gray-900">Title</dt>
                     <dd className="mt-1 text-base font-semibold leading-6 text-gray-900">{car?.title}</dd>
                  </div>
                  <div className="mt-6 flex w-full flex items-center gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                     <div className="text-sm font-medium leading-6 text-gray-900">Capacity: </div>
                     <div className="text-sm text-gray-500 capitalize">
                        <span>{car?.capacity}</span>
                     </div>
                  </div>
                  <div className="mt-6 flex w-full flex items-center gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                     <div className="text-sm font-medium leading-6 text-gray-900">Image: </div>
                     <div className="text-sm text-gray-500">
                        <img className="max-w-[200px]" src={car?.image} alt="" />
                     </div>
                  </div>
                  <div className="mt-6 flex w-full flex items-center gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                     <div className="text-sm font-medium leading-6 text-gray-900">Description: </div>
                     <div className="text-sm text-gray-500">{car?.description}</div>
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
               <h3 className="text-base font-semibold leading-7 text-gray-900">Car Details</h3>
               <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500"></p>
            </div>
         </div>
         <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2 flex flex-col gap-4">
               <div>{CarSummary()}</div>
            </div>
         </div>
      </div>
   )
}