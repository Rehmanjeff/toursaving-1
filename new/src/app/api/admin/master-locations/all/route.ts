import { getAllLocations } from '@/_utils/master-location'

export async function GET(request : Request) {
   
   const { status, data } = await getAllLocations(request)

   if (!status) {
      return Response.json({error: data }, {status: 401})
   }

   return Response.json(data)
}