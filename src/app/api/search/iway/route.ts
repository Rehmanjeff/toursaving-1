import { NextResponse } from 'next/server';
import { saveSearch } from '@/app/services/search';
import { saveCars } from '@/app/services/car';
import { rewriteSearch } from '@/app/services/iway';
 
export async function POST(request: Request) {
  
   const res = await request.json();
   const search = res.data;
   const lang = res.lang;
   const currency = res.currency;
   const headers = {
      Authorization: `Bearer ${process.env.IWAY_API_TOKEN}`,
   };
   
   if(search.type == 'transfer' || search.type == 'chauffer'){

      const iwayUser = process.env.IWAY_USER_ID;
      let uri = '/prices';

      if(search.type == 'chauffer'){

         uri += `/rent/?user_id=${iwayUser}&lang=${lang}&start_place_point=${search.chauffer.pickUp.coords}&duration=${search.chauffer.hours * 3600}&currency=${currency}`;
      }else if(search.type == 'transfer'){

         uri += `/?user_id=${iwayUser}&lang=${lang}&start_place_point=${search.transfer.pickUp.coords}&finish_place_point=${search.transfer.destination.coords}&currency=${currency}`;
      }

      const url = process.env.IWAY_API_URI + uri;
      const apiResponse = await fetch(url, {
         headers: {
            ...headers
         }
      });

      let response = await apiResponse.json();

      if(response.result && response.result.length){
         
         const newSearch = rewriteSearch(search, response.result);
         const searchId = await saveSearch(newSearch, response);
         const data = await saveCars(searchId, response.result, 'iway', search);
         response = data;
      }else{

         response = response.result;
      }

      return NextResponse.json({ response });
   }
}