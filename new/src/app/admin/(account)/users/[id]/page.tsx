'use client'

import useSignOut from '@/_utils/signout'
import Admin from '@/app/admin/_composables/admin'
import { useNotification } from '@/app/admin/_hooks/useNotification'
import { BookingType } from '@/types/booking'
import { UserType } from '@/types/user'
import React, { useEffect, useState } from 'react'
import { ResponseType } from "@/types/index"
import useFileDownload from '@/hooks/useFileDownload'
import Link from 'next/link'
import ConfirmModal from '@/app/admin/_widgets/ConfirmModal'
import Notification from '@/app/admin/_widgets/Notification'

export default function AdminUserDetails ({params} : {params: { id: string }}) {

   const { adminReadUser, adminChangeUserStatus } = Admin()

   const [user, setUser] = useState<UserType>()
   const [activeTab, setActiveTab] = useState<string>('profile')
   const signOut = useSignOut()
   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false)
   const {
      notificationMessage,
      notificationDescription,
      notificationType,
      showNotification,
      showNotificationHandler,
      hideNotificationHandler,
   } = useNotification()
   
   const { downloadLink } = useFileDownload()

   const handleChangeUserStatus = async () => {
      const response : ResponseType = await adminChangeUserStatus(params.id)

      if (response.statusCode == 200) {
         handleCloseConfirmModal()
         showNotificationHandler('Successful', 'User has been updated successfully', 'success')
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

      const response : ResponseType = await adminReadUser(params.id)
      if (response.statusCode == 200) {
         setUser(response.data as UserType)
      } else {
         
         if (response.data == 'ERR_JWT_EXPIRED') {
            signOut()   
         }
      }
   }

   useEffect(() => {
      fetchData()
   }, [])

   const handleDownloadClick = (file: string) => {
      downloadLink({
         filePath: file,
      }).handleDownload()
   }


   const tabs = [
      { name: 'Profile', id: 'profile', current: true },
      { name: 'Bookings', id: 'bookings', current: false },
   ]

   function classNames(...classes: any) {
      return classes.filter(Boolean).join(' ')
   }

   return (
      <div>
         <div className="mt-4 w-fit ml-auto">
               <div onClick={openConfirmModal} className="block rounded-md cursor-pointer bg-red-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  {user && user?.status && (<>Deactivate user</>)}
                  {user && !user?.status && (<>Activate user</>)}
               </div>
            </div>
         <div className="sm:hidden">
            <label htmlFor="tabs" className="sr-only">
               Select a tab
            </label>
            <select id="tabs" name="tabs" defaultValue={activeTab} className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
               {tabs.map((tab) => (
                  <option key={tab.id}>{tab.name}</option>
               ))}
            </select>
         </div>
         <div className="hidden sm:block">
            <div className="border-b border-gray-200">
               <nav aria-label="Tabs" className="-mb-px flex space-x-8">
                  {tabs.map((tab) => (
                  <div key={tab.name}  onClick={() => setActiveTab(tab.id)} aria-current={activeTab == tab.id ? 'page' : undefined}
                     className={classNames(
                        activeTab == tab.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                        'whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium cursor-pointer',
                     )}
                  >
                     {tab.name}
                  </div>
                  ))}
               </nav>
            </div>
         </div>

         <div className="mt-6">
            {activeTab == 'profile' && (
               <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="">
                        <dl className="mt-6 space-y-6 divide-y divide-gray-100 text-sm leading-6">
                           <div className="pt-6 sm:flex">
                              <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">First Name</dt>
                              <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                 <div className="text-gray-900">{user?.firstName}</div>
                              </dd>
                           </div>
                           <div className="pt-6 sm:flex">
                              <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Email address</dt>
                              <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                 <div className="text-gray-900">{user?.email}</div>
                              </dd>
                           </div>
                           <div className="pt-6 sm:flex">
                              <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Gender</dt>
                              <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                 <div className="text-gray-900">{user?.gender}</div>
                              </dd>
                           </div>
                        </dl>
                     </div>
                     <div className="">
                        <dl className="mt-6 space-y-6 divide-y divide-gray-100 text-sm leading-6">
                           <div className="pt-6 sm:flex">
                              <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Last Name</dt>
                              <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                 <div className="text-gray-900">{user?.lastName}</div>
                              </dd>
                           </div>
                           <div className="pt-6 sm:flex">
                              <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Phone number</dt>
                              <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                 <div className="text-gray-900">{user?.phone}</div>
                              </dd>
                           </div>
                           <div className="pt-6 sm:flex">
                              <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Status</dt>
                              <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                                 {user?.status && (
                                    <div className="rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-600 ring-1 ring-inset ring-green-600/20 w-fit">Active</div>
                                 )}
                                 {user && !user?.status && (
                                    <div className="rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-600 ring-1 ring-inset ring-green-600/20 w-fit">Inactive</div>
                                 )}
                              </dd>
                           </div>
                        </dl>
                     </div>
                  </div>
               </div>
            )}
            {activeTab == 'bookings' && (
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
                           {user?.bookings?.map((booking: BookingType) => (
                           <tr key={booking.number}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                 {booking.number}
                              </td>
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
            )}
         </div>

         {isConfirmModalOpen && (
            <ConfirmModal
               title={user?.status ? 'Do you want to deactivate this user' : 'Do you want to activate this user'}
               description="Press Yes, confirm to contiue"
               confirmText="Yes, continue"
               isOpen={isConfirmModalOpen}
               onClose={handleCloseConfirmModal}
               onConfirm={handleChangeUserStatus}
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
