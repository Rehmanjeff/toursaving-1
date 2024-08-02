"use client";

import { FormEvent, useState } from 'react'

export default function ForgetPassword() {

   const [errors, setErrors] = useState<{ email?: string }>({})

   const validateForm = (formData: FormData) => {
      const errors: { email?: string; password?: string } = {}
      const email = formData.get('email')?.toString()
      
      if (email == '') {
         errors.email = 'Email is required';
      }

      return errors
   }

   async function onSubmit(event: FormEvent<HTMLFormElement>) {
      
      event.preventDefault()

      const formData = new FormData(event.currentTarget)
      
      const validationErrors = validateForm(formData)
      if (Object.keys(validationErrors).length > 0) {
         setErrors(validationErrors)
         return
      }
      setErrors({})

      // const response = await fetch('/api/submit', {
      //    method: 'POST',
      //    body: formData,
      // })

      // const data = await response.json()
   }

   return (
      <div className="bg-gray-50 flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
         <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
            <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Give us your account email</h2>
         </div>

         <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
            <div className="bg-white px-6 pb-12 shadow sm:rounded-lg sm:px-12">
               <form className="space-y-6" onSubmit={onSubmit} method="POST">
                  <div>
                     <input type="text" name="email" className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6" />
                     {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
                  </div>
                  <div>
                     <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Submit</button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   )
}