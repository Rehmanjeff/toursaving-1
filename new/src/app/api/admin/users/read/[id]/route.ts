import { readUser } from "@/_utils/user"

export async function GET(request: Request, { params } : { params: { id : string } }) {

   const { status, data } = await readUser(parseInt(params.id))

   if (!status) {
      return Response.json({error: data }, {status: 404})
   }

   return Response.json(data)
}