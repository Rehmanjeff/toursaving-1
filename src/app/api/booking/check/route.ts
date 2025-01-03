import { NextResponse } from 'next/server';
import { isBookingPossible } from '@/app/services/iway';
 
export async function POST(request: Request) {
  
   const res = await request.json();
   const search = res.search;
   const car = res.car;
   const lang = res.lang;
   
   const data = await isBookingPossible(search, lang, car);
   return NextResponse.json({ response: data });
}
