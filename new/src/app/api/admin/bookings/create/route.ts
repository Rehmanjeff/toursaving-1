import { createBooking, readBooking } from '@/_utils/booking'
import { transformBooking } from '@/_utils/bookingTransformer'
import { generateVoucher } from '@/_utils/voucher'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
   const body = await request.json()
   const {
      bookingType,
      bookingHours,
      paymentMode,
      price,
      customer,
      isCustomerNew,
      car,
      pickup,
      dropoff,
      pickupDateTime,
      passengers,
      isManual
   } = body

   const { status, data } = await createBooking(
      bookingType,
      bookingHours,
      paymentMode,
      price,
      customer,
      isCustomerNew,
      car,
      pickup,
      dropoff,
      pickupDateTime,
      passengers,
      isManual
   )

   const transform = transformBooking(data as any)

   if (paymentMode == 'cash') {
      const response = await generateVoucher(transform, transform.voucher)
   }

   if (!status) {
      return Response.json({error: data }, {status: 403})
   }

   return Response.json({ transform }, {status: 201})
 }