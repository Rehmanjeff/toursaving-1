'use client'

import { useEffect, useRef, useState } from 'react'
import { Location } from '@/types/location'
import { BookingPrice, CarSummary, DriveType, PassengersDetail } from '@/types/booking'
import Admin from '@/app/admin/_composables/admin'
import { ResponseType } from "@/types/index"
import { UserType } from '@/types/user'
import SearchCars from '@/app/admin/_components/SearchCars'
import SelectedCar from '@/app/admin/_components/SelectedCar'
import { isValidUniqueEmail } from '@/_utils/user'
import useSignOut from '@/_utils/signout'
import { bookingPriceCalculator } from '@/_utils/booking'
import Notification from '@/app/admin/_widgets/Notification'
import { useNotification } from '@/app/admin/_hooks/useNotification'

export default function AdminAddBooking() {

   const [isLoading, setIsLoading] = useState<boolean>(false)
   const [title, setTitle] = useState<string>('')
   const [description, setDescription] = useState<string>('')
   const [image, setImage] = useState<string>('')
   const [capacity, setCapacity] = useState<number>(0)
   const [titleError, setTitleError] = useState<string>('')
   const [descriptionError, setDescriptionError] = useState<string>('')
   const [imageError, setImageError] = useState<string>('')
   const [capacityError, setCapacityError] = useState<string>('')
   const { adminAddCar } = Admin()

   const {
      notificationMessage,
      notificationDescription,
      notificationType,
      showNotification,
      showNotificationHandler,
      hideNotificationHandler,
   } = useNotification()
   const signOut = useSignOut()

   const handleCreateCar = async (event: React.FormEvent) => {

      if (!isLoading) {

         event.preventDefault()
         event.stopPropagation()
         setIsLoading(true)
         resetForm()
   
         let hasError = false
   
         if (title == '') {
            setTitleError('Required')
            hasError = true
         }
         
         if (image == '') {
            setImageError('Required')
            hasError = true
         }
         
         if (capacity <= 0) {
            setCapacityError('Required')
            hasError = true
         }
         
         if (!hasError) {
   
            const response = await adminAddCar(
               title, 
               capacity,
               description,
               image
            )
         
            if (response.statusCode == 201) {
               
               showNotificationHandler('Successful', 'Car has been created successfully', 'success')
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
      setTitleError('')
      setDescriptionError('')
      setImageError('')
      setCapacityError('')
   }

   return (
      <>
         <div className="space-y-12">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
               <div>
                  <h2 className="text-base font-semibold leading-7 text-gray-900">Car Details</h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                     
                  </p>
               </div>

               <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                  <div className="col-span-full">
                     <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                        Title
                     </label>
                     <div className="mt-2">
                        <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"/>
                        {titleError != '' && (
                           <div className="text-theme-red text-sm font-semibold">{titleError}</div>
                        )}
                     </div>
                  </div>

                  <div className="sm:col-span-3">
                     <label htmlFor="image" className="block text-sm font-medium leading-6 text-gray-900">
                        Image
                     </label>
                     <div className="mt-2">
                        <input id="image" type="text" value={image} onChange={(e) => setImage(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"/>
                        {imageError != '' && (
                           <div className="text-theme-red text-sm font-semibold">{imageError}</div>
                        )}
                     </div>
                  </div>

                  <div className="sm:col-span-3">
                     <label htmlFor="capacity" className="block text-sm font-medium leading-6 text-gray-900">
                        Capacity
                     </label>
                     <div className="mt-2">
                        <input id="capacity" type="number" value={capacity} onChange={(e) => setCapacity(parseInt(e.target.value))} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"/>
                        {capacityError != '' && (
                           <div className="text-theme-red text-sm font-semibold">{capacityError}</div>
                        )}
                     </div>
                  </div>
                  
                  <div className="col-span-full">
                     <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                        Description
                     </label>
                     <div className="mt-2">
                        <textarea onChange={(e) => setDescription(e.target.value)} rows={10} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 outline:none sm:text-sm sm:leading-6" />
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="mt-6 flex flex-col items-end gap-6">
            <button type="button" onClick={handleCreateCar} disabled={isLoading} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
               Create Car
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
