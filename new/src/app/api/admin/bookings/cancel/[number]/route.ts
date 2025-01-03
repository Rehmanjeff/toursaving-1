import { cancelBooking } from "@/_utils/booking"

export async function PATCH(request: Request, { params } : { params: { number : number } }) {

   const { status, data } = await cancelBooking(params.number)

   if (!status) {
      return Response.json({error: data }, {status: 404})
   }

   return Response.json({})
}