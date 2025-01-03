import { deleteCar } from "@/_utils/internal-car"

export async function DELETE(request: Request, { params } : { params: { id : string } }) {

   const { status, data } = await deleteCar(params.id)

   if (!status) {
      return Response.json({error: data }, {status: 404})
   }

   return Response.json({})
}