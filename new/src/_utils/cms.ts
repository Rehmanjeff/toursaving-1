import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const validPages = ['home', 'about', 'contact', 'privacy', 'terms']

export async function getContent (page: string) {

   try {
      
      if (!validPages.includes(page)) {
         throw new Error('Invalid page parameter')
      }

      const content = await prisma.content.findFirst({
         select: {
            [page]: true,
         },
      })

      if (!content) {
         throw new Error('Content not found')
      }

      return { status: true, data: content[page] }
   } catch (err) {
      console.log(err)
      return { status: false, data: err }
   }
}

export async function updateContent (page: string, newContent: string) {

   try {
      
      if (!validPages.includes(page)) {
         throw new Error('Invalid page parameter')
      }

      const updatedContent = await prisma.content.update({
         where: {
            id: 1,
         },
         data: {
            [page]: newContent,
         },
      })

      return { status: true, data: updatedContent }
   } catch (err) {
      return { status: false, data: err }
   }
}