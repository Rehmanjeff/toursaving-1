import { signIn, encryptUser, decryptUser } from '@/_utils/auth'

export async function POST(request : Request) {
   
   const { email, password } = await request.json()

   const result = await signIn(email, password)

   if (result.error) {
      return Response.json({error: result.error }, {status: result.status})
   }

   const userData = {
      firstName: result.user?.first_name, 
      lastName: result.user?.last_name, 
      email: result.user?.email, 
      phone: result.user?.phone_number
   }

   const bearerToken = await encryptUser(userData)

   const user = {user: userData, token: bearerToken}

   return Response.json(user)
}