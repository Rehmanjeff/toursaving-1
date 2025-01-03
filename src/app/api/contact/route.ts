import { NextResponse } from 'next/server';
import prisma from '@/app/services/prisma';
import { isEmailValid } from '@/utils/random';

export async function POST(request: Request) {
   try {
      const { email, name, description, search } = await request.json();
      
      if (!name || !email || !search) {
         return NextResponse.json({ error: 'Name and email are required fields.' });
      }

      if (!isEmailValid(email)) {
         return NextResponse.json({ error: 'Invalid email format.' });
      }

      const result = await prisma.user_contacts.create({
         data: {
            full_name: name,
            email: email,
            description: description,
            search: JSON.stringify(search)
         }
      });
      
      return NextResponse.json({ data: result });
   } catch (err) {
      return NextResponse.json({ error: 'An error occurred while processing the request.' });
   }
}