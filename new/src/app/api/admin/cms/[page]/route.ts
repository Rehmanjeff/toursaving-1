import { getContent, updateContent } from "@/_utils/cms"

export async function GET(request: Request, { params } : { params: { page : string } }) {

   const { status, data } = await getContent(params.page)
   
   if (!status) {
      return Response.json({error: data }, {status: 404})
   }

   return Response.json(data)
}

export async function PATCH(request: Request, { params }: { params: { page: string } }) {

   const { newContent } = await request.json()

   if (!newContent) {
      return Response.json({error: 'Content is missing' }, {status: 400})
   }

   const { status, data } = await updateContent(params.page, newContent)

   if (!status) {
      return Response.json({error: data }, {status: 404})
   }

   return Response.json(data)
}