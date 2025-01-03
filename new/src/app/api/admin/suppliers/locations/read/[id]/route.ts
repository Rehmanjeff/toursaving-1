import { readSupplierLocation } from "@/_utils/supplier"

export async function GET(request: Request, { params } : { params: { id : string } }) {

   const { status, data } = await readSupplierLocation(params.id)
   
   if (!status) {
      return Response.json({error: data }, {status: 404})
   }

   return Response.json(data)
}