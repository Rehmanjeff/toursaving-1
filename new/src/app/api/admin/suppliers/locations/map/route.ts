import { mapLocation } from "@/_utils/supplier"

export async function PATCH(request: Request) {

   const { from, fromId, toId } = await request.json()
   const { status, data } = await mapLocation(from, fromId, toId)

   if (!status) {
      return Response.json({error: data }, {status: 404})
   }

   return Response.json({})
}