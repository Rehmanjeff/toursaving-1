import { getAllCars } from '@/_utils/internal-car'

export async function GET(request : Request) {
   
   const { status, data } = await getAllCars(request)

   if (!status) {
      return Response.json({error: data }, {status: 401})
   }

   return Response.json(data)
}