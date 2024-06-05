import { NextResponse } from 'next/server';
import prisma from '@/app/services/prisma';
import { isEmailValid } from '@/utils/random';

export async function POST(request: Request) {
   try {
      const { email, fullName, contactNumber, password } = await request.json();
      
      if (!fullName || !email || !contactNumber || !password) {
         return NextResponse.json({ error: 'Name and email are required fields.' });
      }

      if (!isEmailValid(email)) {
         return NextResponse.json({ error: 'Invalid email format.' });
      }
      
      const result = null
      // const result = await prisma.user_contacts.create({
      //    data: {
      //       full_name: fullName,
      //       email: email,
      //       description: description,
      //       search: JSON.stringify(search)
      //    }
      // });
      
      return NextResponse.json({ data: result });
   } catch (err) {
      return NextResponse.json({ error: 'An error occurred while processing the request.' });
   }
}