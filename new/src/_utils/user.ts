import { PrismaClient } from '@prisma/client'
import { transformUser } from '@/_utils/userTransformer'
import { UserType } from '@/types/user'

const prisma = new PrismaClient()

export async function getAllUsers (req: Request) {

   try {
      
      const users = await prisma.users.findMany({include: { bookings: true },orderBy: { created_at: 'asc' }})
      const transformedData: UserType[] = users.map(transformUser as any)

      return { status: true, data: transformedData }
   } catch (err) {
      return { status: false, data: err }
   }
}

export function isValidUniqueEmail(email: string): boolean {

   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   const isValidFormat = emailRegex.test(email)

   if (!isValidFormat) {
      return false
   }

   return true
} 