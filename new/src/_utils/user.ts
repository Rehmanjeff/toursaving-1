import { PrismaClient } from '@prisma/client'
import { transformUser } from '@/_utils/userTransformer'
import { UserType } from '@/types/user'

const prisma = new PrismaClient()

export async function getAllUsers (req: Request) {

   try {
      
      const users = await prisma.users.findMany({include: { bookings: true },orderBy: { created_at: 'desc' }})
      const transformedData: UserType[] = users.map(transformUser as any)

      return { status: true, data: transformedData }
   } catch (err) {
      return { status: false, data: err }
   }
}

export async function readUser (userId: number) {

   try {
      
      const user = await prisma.users.findUnique({
         where: { id: userId },
         include: {
            bookings: true,
         },
      })
      
      const transformedData: UserType | null = transformUser(user as any)

      return { status: true, data: transformedData }
   } catch (err) {
      return { status: false, data: err }
   }
}

export async function updateStatus (id: number) {

   try {

      const user = await prisma.users.findUnique({
         where: { id: id },
         select: { status: true },
      });
      
      await prisma.users.update({
         where: { id: id },
         data: { status: !user?.status },
      })

      return { status: true }
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