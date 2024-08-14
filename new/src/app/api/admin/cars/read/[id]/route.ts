import { readCar } from "@/_utils/internal-car"

export async function GET(request: Request, { params } : { params: { id : string } }) {

   const { status, data } = await readCar(params.id)
   
   if (!status) {
      return Response.json({error: data }, {status: 404})
   }

   return Response.json(data)
}