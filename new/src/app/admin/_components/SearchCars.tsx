'use client'

import { CarSummary, DriveType } from '@/types/booking'
import React, { useState } from 'react'
import { Location } from '@/types/location'

export default function SearchCars({ onSelect, bookingType, bookingHours, pickupLocation, pickupDateTime, dropoffLocation }:{onSelect: any, bookingType: DriveType, bookingHours: null | number, pickupLocation: Location | null, pickupDateTime: string, dropoffLocation: Location | null}) {

   const [cars, setCars] = useState<CarSummary[]>([
      {title: 'BMW 5 Series Range', description: 'This car is a equipped with many features', supplier:'iway', 'image': 'https://www.bmw.ie/content/dam/bmw/common/all-models/5-series/sedan/2023/5-series-sedan-silver.png', capacity: 3},
      {title: 'Tesla Cybertruck', description: 'The Tesla Cybertruck is a battery electric pickup truck built by Tesla', supplier:'iway', 'image': 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Cybertruck-fremont-cropped.jpg', capacity: 5},
      {title: 'Mercedes Benz S-Class', description: 'Explore the special offers on the current Mercedes-Benz', supplier:'iway', 'image': 'https://www.mbusa.com/content/dam/mb-nafta/us/myco/my24/e-class/sedan/all-vehicles/2024-E350-4M-SEDAN-AVP-DR.png', capacity: 7},
      {title: 'BMW 5 Series Range', description: 'This car is a equipped with many features', supplier:'iway', 'image': 'https://www.bmw.ie/content/dam/bmw/common/all-models/5-series/sedan/2023/5-series-sedan-silver.png', capacity: 3},
      {title: 'Tesla Cybertruck', description: 'The Tesla Cybertruck is a battery electric pickup truck built by Tesla', supplier:'iway', 'image': 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Cybertruck-fremont-cropped.jpg', capacity: 5},
      {title: 'Mercedes Benz S-Class', description: 'Explore the special offers on the current Mercedes-Benz', supplier:'iway', 'image': 'https://www.mbusa.com/content/dam/mb-nafta/us/myco/my24/e-class/sedan/all-vehicles/2024-E350-4M-SEDAN-AVP-DR.png', capacity: 7},
      {title: 'BMW 5 Series Range', description: 'This car is a equipped with many features', supplier:'iway', 'image': 'https://www.bmw.ie/content/dam/bmw/common/all-models/5-series/sedan/2023/5-series-sedan-silver.png', capacity: 3},
      {title: 'Tesla Cybertruck', description: 'The Tesla Cybertruck is a battery electric pickup truck built by Tesla', supplier:'iway', 'image': 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Cybertruck-fremont-cropped.jpg', capacity: 5},
      {title: 'Mercedes Benz S-Class', description: 'Explore the special offers on the current Mercedes-Benz', supplier:'iway', 'image': 'https://www.mbusa.com/content/dam/mb-nafta/us/myco/my24/e-class/sedan/all-vehicles/2024-E350-4M-SEDAN-AVP-DR.png', capacity: 7},
   ])

   return (
      <div className="flex fixed top-12 min-h-[200px] max-h-[600px] overflow-y-auto flex-col gap-6 p-6 bg-white pb-8 rounded-3xl w-[90%] mx-auto md:min-w-[400px] md:w-[60%] shadow-custom-symetric-2">
         {/* <div className="text-center">Searching for vehicles...</div>
         <div className="text-cente">No vehicles found</div> */}
         <div className="">
            <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
               {cars.map((car: CarSummary, index: number) => (
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
