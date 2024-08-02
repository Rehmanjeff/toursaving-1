'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from '@/lib/redux/store'
import { setUser } from '@/lib/redux/features/user/userSlice'

export default function StoreProvider({ children }: { children: React.ReactNode}) {

   const storeRef = useRef<AppStore>()
   if (!storeRef.current) {
      storeRef.current = makeStore()

      const authUser = localStorage.getItem(process.env.NEXT_PUBLIC_AUTH_USER_KEY as string) || null
      if (authUser) {
         const user = JSON.parse(authUser)
         storeRef.current.dispatch(setUser(user))
      }
   }

   return <Provider store={storeRef.current}>{children}</Provider>
}