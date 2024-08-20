import { createLocation } from '@/_utils/master-location'
import { transformMasterLocation } from '@/_utils/locationTransformer'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
   const body = await request.json()
   const {
      name, 
      countryName, 
      locationId, 
      nameArabic
   } = body

   const { status, data } = await createLocation(
      name, 
      countryName, 
      locationId, 
      nameArabic
   )

   const transform = transformMasterLocation(data as any)

   if (!status) {
      return Response.json({error: data }, {status: 403})
   }

   return Response.json({ transform }, {status: 201})
 }