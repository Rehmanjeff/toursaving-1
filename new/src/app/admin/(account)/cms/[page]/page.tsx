'use client'

import Admin from '@/app/admin/_composables/admin'
import { useNotification } from '@/app/admin/_hooks/useNotification'
import React, { useEffect, useState } from 'react'
import { ResponseType } from "@/types/index"
import useSignOut from '@/_utils/signout'
import Notification from '@/app/admin/_widgets/Notification'

export default function CMS({params} : {params: { page: string }}) {

   const { adminGetPageContent, adminUpdatePageContent } = Admin()
   const signOut = useSignOut()
   const [content, setContent] = useState<string>('')
   const {
      notificationMessage,
      notificationDescription,
      notificationType,
      showNotification,
      showNotificationHandler,
      hideNotificationHandler,
   } = useNotification()

   const handleSaveContent = async () => {

      const response : ResponseType = await adminUpdatePageContent(params.page, content)
      if (response.statusCode == 200) {
         showNotificationHandler('Successful', 'Content saved successfully', 'success')
      } else {
         
         if (response.data == 'ERR_JWT_EXPIRED') {
            signOut()   
         }
      }
   }

   const fetchData = async () => {

      const response : ResponseType = await adminGetPageContent(params.page)
      if (response.statusCode == 200) {
         setContent(response.data)
      } else {
         
         if (response.data == 'ERR_JWT_EXPIRED') {
            signOut()   
         }
      }
   }

   const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(event.target.value)
   }

   useEffect(() => {
      fetchData()
   }, [])

   return (
      <div className="px-4 sm:px-6 lg:px-8">
         <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
               <h1 className="text-base font-semibold leading-6 text-gray-900 capitalize">{params.page}</h1>
               <p className="mt-2 text-sm text-gray-700">
                  This is a content management page for {params.page}
               </p>
            </div>
         </div>
         
         <div>
            <div className="mt-6">
               <textarea onChange={(e) => handleChange(e)} rows={10} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 outline:none sm:text-sm sm:leading-6" defaultValue={content} />
               <div onClick={handleSaveContent} className="mt-6 flex flex-col items-end gap-6">
                  <button type="button" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save Content</button>
               </div>
            </div>
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
