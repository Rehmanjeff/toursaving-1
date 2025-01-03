import { NextResponse } from 'next/server'
import axios from 'axios'
import { transformLocationCollection } from '@/_utils/locationTransformer'
import { Location } from '@/types/location'

export async function GET(request: Request, {params}: {params: {keyword: string}}){

   const searchQuery = params.keyword;
   const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
   const apiUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json'

   try {

      const response = await axios.get(apiUrl, {
         params: {
            query: searchQuery,
            key: apiKey,
         }
      })

      const responseData = response.data

      if(responseData.error_message){
         throw Error(responseData.error_message)
      }

      const transformedData : Location[] = transformLocationCollection(responseData.results)
      return NextResponse.json({ data: transformedData })
   } catch (e:any) {
      
      return NextResponse.json({error: e.message})
   }
}