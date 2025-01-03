import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/lib/redux/hooks'
import { clearUser } from '@/lib/redux/features/user/userSlice'
import { ADMIN_LOGIN } from '@/app/admin/page-routes'

const useSignOut = () => {
   const router = useRouter()
   const dispatch = useAppDispatch()

   const signOut = () => {
      dispatch(clearUser())

      localStorage.removeItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY as string)
      localStorage.removeItem(process.env.NEXT_PUBLIC_AUTH_USER_KEY as string)

      router.push(ADMIN_LOGIN)
   }

   return signOut
}

export default useSignOut