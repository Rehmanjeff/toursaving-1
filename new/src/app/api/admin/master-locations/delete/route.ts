import { deleteLocation } from "@/_utils/master-location"

export async function DELETE(request: Request, { params } : { params: { id : string } }) {

   const { status, data } = await deleteLocation(params.id)

   if (!status) {
      return Response.json({error: data }, {status: 404})
   }

   return Response.json({})
}