'use client'

import React, { useEffect, useState } from 'react'
import { BookingSummaryType } from '@/types/booking'
import Admin from '@/app/admin/_composables/admin'
import { ResponseType } from "@/types/index"
import useSignOut from '@/_utils/signout'
import Link from 'next/link'
import useFileDownload from "@/hooks/useFileDownload"

export default function AllBookings() {

   const { adminAllBookings } = Admin()
   const [error, setError] = useState<boolean>(false)
   const [bookings, setBookings] = useState<BookingSummaryType[]>()
   const signOut = useSignOut()
   const { downloadLink } = useFileDownload()

   const handleDownloadClick = (file: string) => {
      downloadLink({
         filePath: file,
      }).handleDownload()
   }

   useEffect(() => {
      
      const fetchData = async () => {

         const response : ResponseType = await adminAllBookings()
         if (response.statusCode == 200) {
            setBookings(response.data as BookingSummaryType[])
         } else {
            
            if (response.data == 'ERR_JWT_EXPIRED') {
               signOut()   
            }
            setError(response.data)
         }
      }

      fetchData()
   }, [])

   return (
      <div className="px-4 sm:px-6 lg:px-8">
         <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
               <h1 className="text-base font-semibold leading-6 text-gray-900">All Bookings</h1>
               <p className="mt-2 text-sm text-gray-700">
                  A list of all bookings made to date
               </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
               <Link href="add" className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  Add manual booking
               </Link>
            </div>
         </div>
         {error && (
            <div className="text-red-600 font-normal mt-12">Bookings could not be fetched at the moment</div>
         )}
         {bookings?.length && (
            <div className="mt-8 flow-root">
               <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                     <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                     <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                           <tr>
                              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                 Booking Number
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                 Booked By
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                 Supplier
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                 Price
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                 Date and Time
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                 Status
                              </th>
                              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                 <span className="sr-only">Edit</span>
                              </th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                           {bookings.map((booking: BookingSummaryType) => (
                           <tr key={booking.number}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                 {booking.number}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{booking.user?.firstName} {booking.user?.lastName}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{booking.supplier}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{booking.total} {booking.currency}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{booking.dateTime}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{booking.status}</td>
                              <td className="relative flex gap-2 whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                 <Link href={booking.number} className="text-indigo-600 hover:text-indigo-900">Details</Link>
                                 <button onClick={() => handleDownloadClick(`/pdf/${booking.voucher}`)} className="text-indigo-600 hover:text-indigo-900">Voucher</button>
                              </td>
                           </tr>
                           ))}
                        </tbody>
                     </table>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
   )
}
