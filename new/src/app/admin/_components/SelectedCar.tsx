'use client'

import { CarSummary } from '@/types/booking'

export default function SelectedCar({ car }:{car: CarSummary}) {

   return (
      <div className="flex fixed top-12 min-h-[200px] max-h-[600px] overflow-y-auto flex-col gap-6 p-6 bg-white pb-8 rounded-3xl w-[90%] mx-auto md:min-w-[400px] md:w-[60%] shadow-custom-symetric-2">
         <div className="">
            <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-3">
               <li className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-gray-100 text-center shadow">
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
            </ul>
         </div>
      </div>
   )
}
