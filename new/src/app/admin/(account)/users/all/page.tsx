'use client'

import React, { useEffect, useState } from 'react'
import { UserType } from '@/types/user'
import Admin from '@/app/admin/_composables/admin'
import { ResponseType } from "@/types/index"
import useSignOut from '@/_utils/signout'
import Link from 'next/link'

export default function AdminAllUsers() {
   
   const { adminAllUsers } = Admin()
   const [error, setError] = useState<boolean>(false)
   const [users, setUsers] = useState<UserType[]>()
   const signOut = useSignOut()

   useEffect(() => {
      
      const fetchData = async () => {

         const response : ResponseType = await adminAllUsers()
         if (response.statusCode == 200) {
            setUsers(response.data as UserType[])
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
               <h1 className="text-base font-semibold leading-6 text-gray-900">All Users</h1>
               <p className="mt-2 text-sm text-gray-700">
                  A list of all users regisered to date
               </p>
            </div>
         </div>
         {error && (
            <div className="text-red-600 font-normal mt-12">Users could not be fetched at the moment</div>
         )}
         {users?.length && (
            <div className="mt-8 flow-root">
               <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                     <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                     <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                           <tr>
                              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                 ID
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                 Full Name
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                 Email
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                 Status
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                 Created at
                              </th>
                              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                 <span className="sr-only">Edit</span>
                              </th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                           {users.map((user: UserType) => (
                           <tr key={user.id}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{user.id}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.firstName} {user.lastName}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.email}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                 {user.status && (
                                    <div className="rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-600 ring-1 ring-inset ring-green-600/20 w-fit">active</div>
                                 )}
                                 {!user.status && (
                                    <div className="rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-600 ring-1 ring-inset ring-red-600/20 w-fit">inactive</div>
                                 )}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.dateTime}</td>
                              <td className="relative flex gap-2 whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                 <Link href={user.id.toString()} className="text-indigo-600 hover:text-indigo-900">Details</Link>
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
