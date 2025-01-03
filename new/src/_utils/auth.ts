import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { SignJWT, jwtVerify } from 'jose'

const prisma = new PrismaClient()

export async function signIn(email: string, password: string) {
   if (!email) {
      return { error: 'No email found', status: 401 }
   }

   if (!password) {
      return { error: 'No password found', status: 401 }
   }

   try {

      if (email != process.env.NEXT_PUBLIC_MASTER_ADMIN_EMAIL) {
         return { error: 'Invalid admin email', status: 401 }
      }

      const user = await prisma.users.findUnique({where: { email }})
      if (!user) {
         return { error: 'User not found', status: 404 }
      }

      const passwordMatch = await bcrypt.compare(password, user.password)
      if (!passwordMatch) {
         return { error: 'Invalid password', status: 401 }
      }
      
      return { user: user, status: 200 }
   } catch (error) {

      console.error(error)
      return { error: 'Internal server error', status: 500 }
   } finally {
      await prisma.$disconnect()
   }
}

export async function encryptUser (payload: any) {

   const key = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET_KEY)

   return await new SignJWT(payload)
      .setProtectedHeader({alg: 'HS256'})
      .setIssuedAt()
      .setExpirationTime('24 hours from now')
      .sign(key)
}

export async function decryptUser (input: string) {

   const key = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET_KEY)
   const payload = await jwtVerify(input, key, {
      algorithms: ['HS256']
   })

   return payload
}

export async function getAuthUser (req: Request) {

   const authorizationHeader = req.headers.get('Authorization')

   if (!authorizationHeader) {
      return { status: false, error: 'no authorization header' }
   }

   const token = authorizationHeader.split(' ')[1]

   if (!token) {
      return { status: false, error: 'no token' }
   }

   try {
      
      const payload = await decryptUser(token)
      return { status: true, data: payload }
   } catch (err) {
      
      return { status: false, data: err }
   }
}