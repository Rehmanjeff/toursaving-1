import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request, {params}: {params: {search: string}}){

   const searchQuery = params.search;
   const apiKey = process.env.GOOGLE_API_KEY;
   const apiUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json';

   try {

      const response = await axios.get(apiUrl, {
         params: {
            query: searchQuery,
            key: apiKey,
         }
      });

      const responseData = response.data;

      if(responseData.error_message){
         throw Error(responseData.error_message)
      }

      return NextResponse.json({ data: responseData.results });
   } catch (e:any) {
      
      return NextResponse.json({error: e.message});
   }
}