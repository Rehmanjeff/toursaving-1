import { deleteSupplier } from "@/_utils/supplier"

export async function DELETE(request: Request, { params } : { params: { id : string } }) {

   const { status, data } = await deleteSupplier(params.id)

   if (!status) {
      return Response.json({error: data }, {status: 404})
   }

   return Response.json({})
}