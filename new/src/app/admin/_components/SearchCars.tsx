'use client'

import { CarSummary, DriveType } from '@/types/booking'
import React, { useState } from 'react'
import { Location } from '@/types/location'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'

export default function SearchCars({ onSelect, bookingType, bookingHours, pickupLocation, pickupDateTime, dropoffLocation }:{onSelect: any, bookingType: DriveType, bookingHours: null | number, pickupLocation: Location | null, pickupDateTime: string, dropoffLocation: Location | null}) {
   
   const fetcher = (url: string) => fetch(url).then((res) => res.json())
   const { data, error } = useSWR('/api/admin/cars/all', fetcher)
   const router = useRouter()

   if (error) return <p>Error: {error.message}</p>
   if (!data) return <p>Loading...</p>
   else return (
      <div className="flex fixed top-12 min-h-[200px] max-h-[600px] overflow-y-auto flex-col gap-6 p-6 bg-white pb-8 rounded-3xl w-[90%] mx-auto md:min-w-[400px] md:w-[60%] shadow-custom-symetric-2">
         {/* <div className="text-center">Searching for vehicles...</div>
         <div className="text-cente">No vehicles found</div> */}
         <div className="w-full flex flex-col">
            <button onClick={() => {router.push('/admin/cars/add')}} type="button" className="inline-flex ml-auto mt-4 mb-4 items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
               Add Car
            </button>
            <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 pt-4 border-t border-gray-100">
               {data.map((car: CarSummary, index: number) => (
               <li key={index} onClick={() => onSelect(car)} className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-gray-100 text-center shadow cursor-pointer hover:bg-gray-200">
                  <div className="flex flex-1 flex-col p-8">
                     <div className="relative w-full h-48 bg-cover bg-center" style={{ backgroundImage: `url(${car.image})` }}></div>
                     <h3 className="mt-6 text-sm font-medium text-gray-900">{car.title}</h3>
                     <dl className="mt-1 flex flex-grow flex-col justify-between">
                        <dd className="text-sm text-gray-500">{car.capacity} seats</dd>
                        <dd className="mt-3">
                           <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                              {car.supplier}
                           </span>
                        </dd>
                     </dl>
                  </div>
               </li>
               ))}
            </ul>
         </div>
      </div>
   )
}
