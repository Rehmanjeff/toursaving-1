import { createCar } from '@/_utils/internal-car'
import { transformInternalCar } from '@/_utils/internalCarTransformer'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
   const body = await request.json()
   const {
      title, 
      capacity, 
      description, 
      image
   } = body

   const { status, data } = await createCar(
      title, 
      capacity, 
      description, 
      image
   )

   const transform = transformInternalCar(data as any)

   if (!status) {
      return Response.json({error: data }, {status: 403})
   }

   return Response.json({ transform }, {status: 201})
 }