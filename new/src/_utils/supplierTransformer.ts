import { suppliers, supplier_locations, master_locations } from '@prisma/client'
import { format } from 'date-fns'

export function transformSupplier(supplier: suppliers & { supplier_locations: supplier_locations[] }): any {
   
   try {

      const locs = supplier.supplier_locations?.map((location: supplier_locations) => (
         transformSupplierLocation(location)
      ))

      return {
         id: supplier.id,
         name: supplier.name,
         commission: supplier.commission,
         hasMappingManual: supplier.has_mapping_manual,
         locations: locs,
         dateTime: format(new Date(supplier.created_at), 'dd/MM/yyyy hh:mm a')
      }
   } catch (error: any) {
      return error
   }
}

export function transformSupplierLocation(location: supplier_locations & { master_location?: master_locations }): any {
   
   return {
      id: location.id,
      name: location.location_name,
      nameArabic: location.location_name_arabic,
      countryName: location.country_name,
      locationId: location.location_id,
      mappedMasterLocation: location.master_location ? {
         name: location.master_location.location_name,
         nameArabic: location.master_location.location_name_arabic,
         countryName: location.master_location.country_name,
         locationId: location.master_location.location_id,
      } : null,
      dateTime: format(new Date(location.created_at), 'dd/MM/yyyy hh:mm a'),
   }
}
