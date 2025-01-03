import random from '@/utils/random';
import { UserSearch } from '../(client-components)/type';
import { checkKey, getValue, setValue } from './redis';

export async function saveSearch(search: UserSearch, response : any){

   const userSearch : UserSearch = search;
   const searchId = random().toString();
   await setValue(searchId, JSON.stringify(userSearch));

   return searchId;
}

export async function getSearch(searchId : string){

   let search : UserSearch | null = null;
   const hasSearch = await checkKey(searchId);
   if(hasSearch){

      let searchString = await getValue(searchId);
      search = searchString ? JSON.parse(searchString) : null;
   }

   return search;
}

