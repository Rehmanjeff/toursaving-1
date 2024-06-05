"use client";

import React, { FC, useEffect, useState } from "react";
import SectionGridFilterCard from "@/app/(car-listings)/SectionGridFilterCard";
import HeroSearchFormSmall from "@/app/(client-components)/(HeroSearchFormSmall)/HeroSearchFormSmall";
import SectionSubscribe2 from "@/components/SectionSubscribe2";
import { UserSearch, SearchFilters as SearchFiltersType, SearchFilterCapacity } from "@/app/(client-components)/type";
import { decodeFromQuery } from "@/utils/userSearch";
import {usePathname, useSearchParams} from 'next/navigation';
import { CarDataType, Supplier } from "@/data/types";
import SearchEmpty from "@/shared/SearchEmpty";
import SearchLoading from "@/shared/SearchLoading";
import SearchFilters from "@/components/SearchFilters";

export interface SearchResultssProps {}

const SearchResults: FC<SearchResultssProps> = () => {

   const [ defaultPriceRange, setDefaultPriceRange ] = useState<number[]>([0, 1000]);
   const defaultCapacity : number[] = [0, 0];
   const [ cars, setCars ] = useState<CarDataType[]>([]);
   const [ filteredCars, setFilteredCars ] = useState<CarDataType[]>([]);
   const [ searchFilters, setSearchFilters ] = useState<SearchFiltersType>({
      priceRange: defaultPriceRange,
      capacity: {seats: defaultCapacity[0], bags: defaultCapacity[1]},
      suppliers: ''
   });
   const [ isLoading, setIsLoading ] = useState<boolean>(true);
   const [search, setSearch] = useState<UserSearch>({'type': null, timestamp: new Date().getTime()});
   const pathname = usePathname();
   const searchParams = useSearchParams();

   useEffect(() => {

      const queryString = window.location.search.substring(1);
      const response : UserSearch | string = decodeFromQuery(queryString);
      
      if(typeof(response) == 'string'){

         console.log(response);
      }else{

         setIsLoading(true);
         setSearch(() => (response));
         fetch('/api/search/iway', {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({
               'data': response,
               'lang': 'en',
               'currency': 'USD'
            })})
            .then((response) => response.json())
            .then((data) => {
               
               setIsLoading(false);
               setCars(data.response);
               setFilteredCars(data.response);
               
               if(data.response && data.response.length){

                  let minPrice = 0;
                  let maxPrice = 0;

                  for (const car of data.response) {
                     const carPrice = parseFloat(car.price);
                     minPrice = Math.min(minPrice, carPrice);
                     maxPrice = Math.max(maxPrice, carPrice);
                  }

                  setDefaultPriceRange([minPrice, maxPrice]);
               }
            })
            .catch((error) => {
               console.error('Error fetching data:', error);
               setIsLoading(false);
            });
      }
   }, [pathname, searchParams]);

   useEffect(() => {

      applyFilters(searchFilters);
   }, [searchFilters]);

   const handleRangePricesChange = (newRange: number[]) => {

      setSearchFilters((prevFilters) => ({
         ...prevFilters,
         priceRange: newRange,
      }));
   }

   const handleCapacityChange = (capacity: SearchFilterCapacity) => {
      
      setSearchFilters((prevFilters) => ({
         ...prevFilters,
         capacity: {
           seats: capacity.seats,
           bags: capacity.bags,
         },
      }));
   }

   const handleSuppliersChange = (suppliers: string[]) => {
      
      setSearchFilters((prevFilters) => ({
         ...prevFilters,
         suppliers: suppliers as Supplier[],
      }));
   }

   const applyFilters = (searchFilters: SearchFiltersType) => {

      if (cars.length) {

         let finalFiltered;
         finalFiltered = cars.filter((car) => {
            const carPrice = parseFloat(car.price);
            return carPrice >= searchFilters.priceRange[0] && carPrice <= searchFilters.priceRange[1];
         });
      
         finalFiltered = searchFilters.capacity.seats == 0 ? finalFiltered : finalFiltered.filter((car) => car.seats == searchFilters.capacity.seats);

         if(searchFilters.suppliers.length){

            finalFiltered = finalFiltered.filter((car) => searchFilters.suppliers.includes(car.supplier));
         }
         
         setFilteredCars(finalFiltered);
      }
   }

   return (
      <div className={`nc-ListingCarMapPage relative mt-10`}>
         <div className="container">
            <div className="hidden lg:block lg:pb-16">
               <HeroSearchFormSmall search={search} />
            </div>
            <div className="mb-8 lg:mb-11"><SearchFilters filters={searchFilters} defaultPriceRange={defaultPriceRange} defaultCapacity={defaultCapacity} onRangePricesChange={handleRangePricesChange} onCapacityChange={handleCapacityChange} onSuppliersChange={handleSuppliersChange} /></div>
            {filteredCars && filteredCars.length > 0 && (<SectionGridFilterCard data={filteredCars} className="pb-24 lg:pb-28" />)}
            {(!filteredCars || filteredCars.length == 0) && !isLoading && (<SearchEmpty />)}
            {filteredCars && filteredCars.length == 0 && isLoading && (<SearchLoading />)}
         </div>
         <div className="container overflow-hidden">
            <SectionSubscribe2 className="py-24 lg:py-28" />
         </div>
      </div>
   );
};

export default SearchResults;
