import { getAuthUser } from '@/_utils/auth'

export async function GET(request : Request) {
   
   const { status, data } = await getAuthUser(request)

   if (!status) {
      return Response.json({error: data }, {status: 401})
   }

   return Response.json(data)
}