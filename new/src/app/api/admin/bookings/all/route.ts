import { getAllBookings } from '@/_utils/booking'

export async function GET(request : Request) {
   
   const { status, data } = await getAllBookings(request)

   if (!status) {
      return Response.json({error: data }, {status: 401})
   }

   return Response.json(data)
}