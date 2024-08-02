"use client";

import { UserType } from "@/types/user";
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import Admin from "@/app/admin/_composables/admin"
import { ResponseType } from "@/types/index"

export default function DashboardPage() {

   const [user, setUser] = useState<UserType | null>(null)
   const [error, setError] = useState<any>(null)
   const { adminDashboard } = Admin()
   
   useEffect(() => {
      
      const fetchData = async () => {

         const response : ResponseType = await adminDashboard()
         if (response.statusCode == 200) {
            setUser(response.data.payload)
         } else {
            console.log(response.data)
            setError(response.data)
         }
      }

      fetchData()
   }, [])

   return (
      <>
         
      </>
   )
}