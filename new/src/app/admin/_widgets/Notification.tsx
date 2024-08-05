'use client'

import { useState } from 'react'
import { Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'

interface NotificationProps {
   open: boolean;
   message: string;
   description: string;
   type: 'success' | 'error' | null;
}

export default function Notification({ open, message, description, type } : NotificationProps) {
  const [show, setShow] = useState(true)

   return (
      <>
      {open && (
         <div aria-live="assertive" className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-40">
            <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
               <Transition show={show}>
                  <div className="pointer-events-auto w-full max-w-md overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition data-[closed]:data-[enter]:translate-y-2 data-[enter]:transform data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-100 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:data-[enter]:sm:translate-x-2 data-[closed]:data-[enter]:sm:translate-y-0">
                     <div className="p-4">
                        <div className="flex items-start">
                           <div className="flex-shrink-0">
                              {type == 'success' && <CheckCircleIcon aria-hidden="true" className="h-8 w-8 text-green-400" />}
                              {type == 'error' && <XCircleIcon aria-hidden="true" className="h-8 w-8 text-red-400" />}
                           </div>
                           <div className="ml-3 w-0 flex-1 pt-0.5">
                              <p className="text-size-1 font-medium text-gray-900">{message}</p>
                              <p className="mt-1 text-size-1 text-gray-500">{description}</p>
                           </div>
                           <div className="ml-4 flex flex-shrink-0">
                              <button type="button" onClick={() => setShow(false)} className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                 <span className="sr-only">Close</span>
                                 <XMarkIcon aria-hidden="true" className="h-5 w-5" />
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               </Transition>
            </div>
         </div>
      )}
      </>
   )
}