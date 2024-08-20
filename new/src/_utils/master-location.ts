import { PrismaClient } from '@prisma/client'
import { transformMasterLocation } from '@/_utils/locationTransformer'
import { MasterLocation } from '@/types/location'

const prisma = new PrismaClient()

export async function getAllLocations (req: Request) {

   try {
      
      const locations = await prisma.master_locations.findMany({orderBy: { created_at: 'desc' }})
      const transformedData: MasterLocation[] = locations.map(transformMasterLocation as any)

      return { status: true, data: transformedData }
   } catch (err) {
      console.log(err)
      return { status: false, data: err }
   }
}

export async function readLocation (id: string) {

   try {
      
      const location = await prisma.master_locations.findUnique({
         where: { id: parseInt(id) }
      })
      
      const transformedData: MasterLocation = transformMasterLocation(location as any)

      return { status: true, data: transformedData }
   } catch (err) {
      return { status: false, data: err }
   }
}

export async function deleteLocation (id: string) {

   try {
      
      await prisma.master_locations.delete({
         where: { id: parseInt(id) },
      })

      return { status: true }
   } catch (err) {
      return { status: false, data: err }
   }
}

export async function createLocation (
   name : string,
   countryName: string,
   locationId: string,
   nameArabic: string,
) {

   
   try {
      const response = await prisma.master_locations.create({
         data: {
           location_name: name,
           location_name_arabic: nameArabic,
           country_name: countryName,
           location_id: locationId
         }
      })

      return { status: true, data: response }
   } catch (error: any) {
      return { status: false, data: error.toString() }
   }
}