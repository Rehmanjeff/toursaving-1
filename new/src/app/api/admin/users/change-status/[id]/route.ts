import { updateStatus } from "@/_utils/user"

export async function PATCH(request: Request, { params } : { params: { id : string } }) {

   const { status, data } = await updateStatus(parseInt(params.id))

   if (!status) {
      return Response.json({error: data }, {status: 404})
   }

   return Response.json({})
}