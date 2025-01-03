"use client";

import React, { FC, useState } from "react";
import ChaufferSearchForm from "./(car-search-form)/ChaufferSearchForm";
import RentalCarSearchForm from "./(car-search-form)/RentalCarSearchForm";
import TransferSearchForm from "./(car-search-form)/TransferSearchForm";

export type SearchTab = "Transfer" | "Chauffer" | "Rental";

export interface HeroSearchFormProps {
  className?: string;
  currentTab?: SearchTab;
}

const HeroSearchForm: FC<HeroSearchFormProps> = ({
  className = "",
  currentTab = "Transfer"
}) => {
   const tabs: SearchTab[] = ["Transfer", "Chauffer", "Rental"];
   const [tabActive, setTabActive] = useState<SearchTab>(currentTab);

   const handleTabChange = (value : SearchTab) => {

      setTabActive(value);
   }

   const renderTab = () => {
      return (
         <ul className="ml-2 sm:ml-6 md:ml-12 flex space-x-5 sm:space-x-8 lg:space-x-11 overflow-x-auto hiddenScrollbar">
            {tabs.map((tab) => {
               const active = tab === tabActive;
               return (
                  <li onClick={() => handleTabChange(tab)} className={`flex-shrink-0 flex items-center cursor-pointer text-sm lg:text-base font-medium ${active ? "" : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-400"} `} key={tab}>
                     {active && (<span className="block w-2.5 h-2.5 rounded-full bg-neutral-800 dark:bg-neutral-100 mr-2" />)}
                     <span>{tab}</span>
                  </li>
               );
            })}
         </ul>
      );
   };

   const renderForm = () => {
      switch (tabActive) {
         case "Transfer":
            return <TransferSearchForm size="normal" />;
         case "Chauffer":
            return <ChaufferSearchForm size="normal" />;
         case "Rental":
            return <RentalCarSearchForm size="normal" />;

         default:
            return null;
      }
   };

   return (
      <div className={`nc-HeroSearchForm w-full py-5 lg:py-0 ${className}`}>
         {renderTab()}
         {renderForm()}
      </div>
   );
};

export default HeroSearchForm;
