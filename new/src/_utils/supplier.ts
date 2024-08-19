import { PrismaClient } from '@prisma/client'
import { transformSupplier } from '@/_utils/supplierTransformer'
import { Supplier } from '@/types/supplier'

const prisma = new PrismaClient()

export async function getAllSuppliers (req: Request) {

   try {
      
      const suppliers = await prisma.suppliers.findMany({orderBy: { created_at: 'desc' }})
      const transformedData: Supplier[] = suppliers.map(transformSupplier as any)

      return { status: true, data: transformedData }
   } catch (err) {
      console.log(err)
      return { status: false, data: err }
   }
}

export async function readSupplier (id: string) {

   try {
      
      const supplier = await prisma.suppliers.findUnique({
         where: { id: parseInt(id) },
         include: { supplier_locations: true }
      })
      
      const transformedData: Supplier = transformSupplier(supplier as any)

      return { status: true, data: transformedData }
   } catch (err) {
      return { status: false, data: err }
   }
}

export async function deleteSupplier (id: string) {

   try {
      
      await prisma.suppliers.delete({
         where: { id: parseInt(id) },
      })

      return { status: true }
   } catch (err) {
      return { status: false, data: err }
   }
}

export async function deleteSupplierLocation (id: string) {

   try {
      
      await prisma.supplier_locations.delete({
         where: { id: parseInt(id) },
      })

      return { status: true }
   } catch (err) {
      return { status: false, data: err }
   }
}

export async function createSupplier (
   name : string,
   commission: number,
   hasMappingManual: boolean
) {

   
   try {
      const response = await prisma.suppliers.create({
         data: {
           name: name,
           commission: commission,
           has_mapping_manual: hasMappingManual
         }
      })

      return { status: true, data: response }
   } catch (error: any) {
      return { status: false, data: error.toString() }
   }
}

export async function createSupplierLocation (
   supplierId: string,
   name : string,
   arabicName: string,
   countryName: string,
   locationId: string
) {

   
   try {
      
      const newLocation = await prisma.supplier_locations.create({
         data: {
            supplier_id: parseInt(supplierId),
            location_name: name,
            location_name_arabic: arabicName,
            country_name: countryName,
            location_id: locationId
         },
      })

      return { status: true, data: newLocation }
   } catch (error: any) {
      return { status: false, data: error.toString() }
   }
}