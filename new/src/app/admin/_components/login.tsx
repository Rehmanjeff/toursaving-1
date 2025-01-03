"use client";

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/redux/hooks'
import { setUser } from '@/lib/redux/features/user/userSlice'
import Admin from "@/app/admin/_composables/admin"
import { ResponseType } from "@/types/index"
import { ADMIN_DASHBOARD } from '@/app/admin/page-routes'

export default function LoginPage() {

   const [errors, setErrors] = useState<{ email?: string; password?: string, response?: string }>({})
   const router = useRouter()
   const authUserToken = localStorage.getItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY as string) || null
   const { adminLogin } = Admin()
   const store = useAppStore()

   useEffect(() => {
      if (authUserToken && authUserToken !== '') {
         router.push(ADMIN_DASHBOARD)
         return
      }
   }, [])

   const validateForm = (formData: FormData) => {
      const errors: { email?: string; password?: string } = {}
      const email = formData.get('email')?.toString()
      const password = formData.get('password')?.toString()
      
      if (email == '') {
         errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(email as string)) {
         errors.email = 'Email is invalid'
      }

      if (!password) {
         errors.password = 'Password is required'
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

      const email = formData.get('email') as string
      const password = formData.get('password') as string

      const response : ResponseType = await adminLogin(email, password)
      if (response.statusCode == 200) {
         
         const userData = {
            first_name: response.data.user.firstName,
            last_name: response.data.user.lastName,
            email: response.data.user.email
         }

         store.dispatch(setUser(userData))
         const authKey = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY as string
         const authUserKey = process.env.NEXT_PUBLIC_AUTH_USER_KEY as string

         if (typeof window !== 'undefined') {
            localStorage.setItem(authKey, response.data.token)
            localStorage.setItem(authUserKey, JSON.stringify(userData))
         }
         
         router.push(ADMIN_DASHBOARD)
      } else {
         console.log(response.data)
         setErrors({response: `Error: ${response.data.error}`})
      }
   }

   return (
      !authUserToken && (
         <div className="bg-gray-50 flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
               <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
               <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
               <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
                  <form className="space-y-6" onSubmit={onSubmit} method="POST">
                     <div>
                        <label className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                           <div className="mt-1">
                           <input type="text" name="email" autoComplete="off" className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6" />
                           {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
                        </div>
                     </div>

                     <div>
                        <label className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                           <div className="mt-1">
                           <input type="password" name="password" autoComplete="off" className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6" />
                           {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
                        </div>
                     </div>

                     <div className="flex items-center justify-between">
                        <div className="flex items-center">
                           <input type="checkbox" className="h-3 w-3 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                           <label className="ml-3 block text-xs leading-6 text-gray-900">Remember me</label>
                        </div>

                        <div className="text-sm leading-6">
                           <div onClick={() => router.push('/admin/forget-password')} className="cursor-pointer text-xs font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</div>
                        </div>
                     </div>

                     <div>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
                     </div>
                     {errors.response && <p className="text-red-600">{errors.response}</p>}
                  </form>
               </div>
            </div>
         </div>
      )
   )
}