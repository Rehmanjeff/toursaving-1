import React, { FC } from "react";
import { CarDataType } from "@/data/types";
import Heading2 from "@/shared/Heading2";
import CarCard from "@/components/CarCard";

export interface SectionGridFilterCardProps {
  className?: string;
  data: CarDataType[];
}

const SectionGridFilterCard: FC<SectionGridFilterCardProps> = ({
  className = "",
  data,
}) => {
   return (
         <div className={`nc-SectionGridFilterCard ${className}`}>
            <Heading2 heading="Choose your vehicle" subHeading={
               <span className="block text-neutral-500 dark:text-neutral-400 mt-3">
                  {data.length} records found
               </span>
            }
            />
            <div className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.map((car) => (
               <CarCard key={car.id} car={car} />
            ))}
            </div>
         </div>
   );
};

export default SectionGridFilterCard;
