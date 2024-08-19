import { createSupplier } from '@/_utils/supplier'
import { transformSupplier } from '@/_utils/supplierTransformer'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
   const body = await request.json()
   const {
      name, 
      commission, 
      hasMappingManual,
   } = body

   const { status, data } = await createSupplier(
      name, 
      commission, 
      hasMappingManual
   )

   const transform = transformSupplier(data as any)

   if (!status) {
      return Response.json({error: data }, {status: 403})
   }

   return Response.json({ transform }, {status: 201})
 }