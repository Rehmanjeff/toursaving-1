import { NextResponse } from 'next/server';
import { getCar } from '@/app/services/car';
import { CarDataType } from '@/data/types';
import { getSearch } from '@/app/services/search';
 
export async function POST(request: Request) {
  
   const res = await request.json();
   const carId = res.id;
   const car = await getCar(carId);
   const search = car ? await getSearch(car.searchId) : null;

   return NextResponse.json({ car : car?.data, search: search });
}
