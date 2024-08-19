'use client'

import { useState } from 'react'
import Admin from '@/app/admin/_composables/admin'
import useSignOut from '@/_utils/signout'
import Notification from '@/app/admin/_widgets/Notification'
import { useNotification } from '@/app/admin/_hooks/useNotification'

export default function AdminAddSupplierLocation({params} : {params: { id: number }}) {

   const [isLoading, setIsLoading] = useState<boolean>(false)
   const [name, setName] = useState<string>('')
   const [arabicName, setArabicName] = useState<string>('')
   const [countryName, setCountryName] = useState<string>('')
   const [locationId, setLocationId] = useState<string>('')
   const [nameError, setNameError] = useState<string>('')
   const [countryNameError, setCountryNameError] = useState<string>('')
   const { adminAddSupplierLocation } = Admin()

   const {
      notificationMessage,
      notificationDescription,
      notificationType,
      showNotification,
      showNotificationHandler,
      hideNotificationHandler,
   } = useNotification()
   const signOut = useSignOut()

   const handleCreateSupplierLocation = async (event: React.FormEvent) => {

      if (!isLoading) {

         event.preventDefault()
         event.stopPropagation()
         setIsLoading(true)
         resetForm()
   
         let hasError = false
   
         if (name == '') {
            setNameError('Required')
            hasError = true
         }
         
         if (countryName == '') {
            setCountryNameError('Required')
            hasError = true
         }
         
         if (!hasError) {
   
            const response = await adminAddSupplierLocation(
               params.id.toString(),
               name, 
               arabicName,
               countryName,
               locationId
            )
         
            if (response.statusCode == 201) {
               
               showNotificationHandler('Successful', 'Location has been created successfully for the supplier', 'success')
               resetForm()
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

   const resetForm = () => {
      setNameError('')
      setArabicName('')
      setLocationId('')
      setCountryName('')
   }

   return (
      <>
         <div className="space-y-12">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
               <div>
                  <h2 className="text-base font-semibold leading-7 text-gray-900">Location Details</h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">We are adding a location for your desired supplier</p>
               </div>

               <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                  <div className="sm:col-span-3">
                     <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                        Name
                     </label>
                     <div className="mt-2">
                        <input id="title" type="text" value={name} onChange={(e) => setName(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"/>
                        {nameError != '' && (
                           <div className="text-theme-red text-sm font-semibold">{nameError}</div>
                        )}
                     </div>
                  </div>

                  <div className="sm:col-span-3">
                     <label htmlFor="image" className="block text-sm font-medium leading-6 text-gray-900">
                        Arabic Name
                     </label>
                     <div className="mt-2">
                        <input id="image" type="text" value={arabicName} onChange={(e) => setArabicName(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"/>
                     </div>
                  </div>

                  <div className="sm:col-span-3">
                     <label htmlFor="image" className="block text-sm font-medium leading-6 text-gray-900">
                        Country Name
                     </label>
                     <div className="mt-2">
                        <input id="image" type="text" value={countryName} onChange={(e) => setCountryName(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"/>
                        {countryNameError != '' && (
                           <div className="text-theme-red text-sm font-semibold">{countryNameError}</div>
                        )}
                     </div>
                  </div>

                  <div className="sm:col-span-3">
                     <label htmlFor="image" className="block text-sm font-medium leading-6 text-gray-900">
                        Location ID
                     </label>
                     <div className="mt-2">
                        <input id="image" type="text" value={locationId} onChange={(e) => setLocationId(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"/>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="mt-6 flex flex-col items-end gap-6">
            <button type="button" onClick={handleCreateSupplierLocation} disabled={isLoading} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
               Create Location
            </button>
         </div>

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
