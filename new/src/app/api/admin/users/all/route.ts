import { getAllUsers } from '@/_utils/user'

export async function GET(request : Request) {
   
   const { status, data } = await getAllUsers(request)

   if (!status) {
      return Response.json({error: data }, {status: 401})
   }

   return Response.json(data)
}