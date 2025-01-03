import { readBooking } from "@/_utils/booking"

export async function GET(request: Request, { params } : { params: { number : number } }) {

   const { status, data } = await readBooking(params.number)

   if (!status) {
      return Response.json({error: data }, {status: 404})
   }

   return Response.json(data)
}