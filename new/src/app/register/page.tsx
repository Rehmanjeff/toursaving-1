"use client";

import { FormEvent, useState } from 'react'

export default function Register() {

   const [errors, setErrors] = useState<{
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    }>({})

   const validateForm = (formData: FormData) => {
      const errors: {
         name?: string;
         email?: string;
         password?: string;
         confirmPassword?: string;
      } = {}

      const name = formData.get('name')?.toString()
      const email = formData.get('email')?.toString()
      const password = formData.get('password')?.toString()
      const confirmPassword = formData.get('confirm-password')?.toString()
      
      if (!name) {
         errors.name = 'Name is required'
      }

      if (email == '') {
         errors.email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(email as string)) {
         errors.email = 'Email is invalid'
      }

      if (!password) {
         errors.password = 'Password is required'
      } else if (password.length < 8) {
         errors.password = 'Password must be at least 8 characters long'
      }

      if (!confirmPassword) {
         errors.confirmPassword = 'Confirm Password is required'
      } else if (password !== confirmPassword) {
         errors.confirmPassword = 'Passwords do not match'
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
            <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Create your account</h2>
         </div>

         <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
            <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
               <form className="space-y-4" onSubmit={onSubmit} method="POST">
                  <div>
                     <label className="block text-sm font-medium leading-6 text-gray-900">Full Name</label>
                     <div>
                        <input type="text" name="name" className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6" />
                        {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
                     </div>
                  </div>
                  <div>
                     <label className="block text-sm font-medium leading-6 text-gray-900">Email</label>
                     <div>
                        <input type="text" name="email" className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6" />
                        {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
                     </div>
                  </div>
                  <div>
                     <label className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                     <div>
                        <input type="password" name="password" className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6" />
                        {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
                     </div>
                  </div>
                  <div>
                     <label className="block text-sm font-medium leading-6 text-gray-900">Confirm Password</label>
                     <div>
                        <input type="password" name="confirm-password" className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6" />
                        {errors.confirmPassword && <p className="text-xs text-red-600">{errors.confirmPassword}</p>}
                     </div>
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="text-sm leading-6">
                        <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">Already have an account?</a>
                     </div>
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