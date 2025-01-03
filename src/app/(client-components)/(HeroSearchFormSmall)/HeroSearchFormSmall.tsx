"use client";

import React, { FC } from "react";
import RentalCarSearchForm from "@/app/(client-components)/(HeroSearchForm)/(car-search-form)/RentalCarSearchForm";
import ChaufferSearchForm from "@/app/(client-components)/(HeroSearchForm)/(car-search-form)/ChaufferSearchForm";
import TransferSearchForm from "@/app/(client-components)/(HeroSearchForm)/(car-search-form)/TransferSearchForm";
import { UserSearch } from "../type";

export interface HeroSearchFormSmallProps {
  className?: string;
  search?: UserSearch
}

const HeroSearchFormSmall: FC<HeroSearchFormSmallProps> = ({
  className = "",
  search = null
}) => {

   return (
      <div className={`nc-HeroSearchFormSmall ${className}`} data-nc-id="HeroSearchFormSmall">
         <div className="mt-2">
            {(search && search.type == 'rental' && search.rental && <RentalCarSearchForm size="small" userSearch={search.rental} />)}
            {(search && search.type == 'chauffer' && search.chauffer && <ChaufferSearchForm size="small" userSearch={search.chauffer} />)}
            {(search && search.type == 'transfer' && search.transfer && <TransferSearchForm size="small" userSearch={search.transfer} />)}
         </div>
      </div>
   );
};

export default HeroSearchFormSmall;
