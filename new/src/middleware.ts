import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(req: NextRequest) {

   try {

      const authorizationHeader = req.headers.get('Authorization')

      if (!authorizationHeader) {
         return new NextResponse(JSON.stringify({ error: 'Unauthorized. Missing required headers' }), { status: 401 })
      }

      const token = authorizationHeader.split(' ')[1]

      if (!token) {
         return new NextResponse(JSON.stringify({ error: 'Unauthorized. Misconfigured header' }), { status: 401 })
      }

      const key = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET_KEY)
      const response : any = await jwtVerify(token, key, {
         algorithms: ['HS256']
      })
      
      if (!response.payload || !response.payload.email || response.payload.email != process.env.NEXT_PUBLIC_MASTER_ADMIN_EMAIL) {
         return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
      }
      
      return NextResponse.next()
   } catch (error) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
   }
}

export const config = {
  matcher: ['/api/admin/bookings/all', '/api/admin/bookings/:number', '/api/admin/users/all']
}