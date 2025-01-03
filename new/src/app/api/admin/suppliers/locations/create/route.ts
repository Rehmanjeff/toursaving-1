import { createSupplierLocation } from '@/_utils/supplier'
import { transformSupplierLocation } from '@/_utils/supplierTransformer'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
   const body = await request.json()
   const {
      supplierId,
      name, 
      arabicName,
      countryName, 
      locationId,
   } = body

   const { status, data } = await createSupplierLocation(
      supplierId,
      name, 
      arabicName,
      countryName, 
      locationId,
   )
   
   const transform = transformSupplierLocation(data as any)

   if (!status) {
      return Response.json({error: data }, {status: 403})
   }

   return Response.json({ transform }, {status: 201})
 }