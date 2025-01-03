import { getAllSuppliers } from '@/_utils/supplier'

export async function GET(request : Request) {
   
   const { status, data } = await getAllSuppliers(request)

   if (!status) {
      return Response.json({error: data }, {status: 401})
   }

   return Response.json(data)
}