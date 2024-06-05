import React, { FC } from "react";
import { CarDataType } from "@/data/types";
import BtnLikeIcon from "@/components/BtnLikeIcon";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCouch } from '@fortawesome/free-solid-svg-icons'
import { getCurrencySymbol } from "@/utils/currency";

export interface CarCardProps {
  className?: string;
  size?: "default" | "small";
  car: CarDataType
}

const CarCard: FC<CarCardProps> = ({
  className="",
  size = "default",
  car
}) => {

   const renderSliderGallery = () => {
      return (
         (car && <>
            <div className="relative w-full rounded-2xl overflow-hidden">
               <div className="flex-grow">
                  <Image className="w-full" layout="fixed" width={300} height={150} src={car.featuredImage} alt="car image" />
               </div>
               <BtnLikeIcon isLiked={car.like} className="absolute right-3 top-3 z-[1]" />
            </div>
         </>)
      );
   };

   const renderContent = () => {
      return (
         (car && <>
            <div className={size === "default" ? "p-5  space-y-4" : "p-3  space-y-2"}>
               <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                     <h2 className={`  capitalize ${ size === "default" ? "text-xl font-semibold" : "text-base font-medium"}`}>
                        <span className="line-clamp-1">{car.title}</span>
                     </h2>
                  </div>
                  <div className="flex items-center text-green-800 dark:text-neutral-400 text-sm space-x-2">
                     <span>{car.shortDescription} or similar</span>
                  </div>
                  <div className="flex items-center text-neutral-500 dark:text-neutral-400 text-sm space-x-2">
                     <FontAwesomeIcon icon={faCouch} />
                     <span className="">{car.seats} seats</span>
                  </div>
               </div>
               <div className="w-14 border-b border-neutral-100 dark:border-neutral-800"></div>
               <div className="flex justify-between items-center">
                  <span className="text-base font-semibold">
                     <span className="text-sm text-neutral-500 dark:text-neutral-400 font-normal">
                        From
                     </span>
                     {` `}
                     {getCurrencySymbol(car.currency)}{car.price}
                  </span>
                  <div className="flex flex-col">
                     {car.supplier && car.supplier == 'iway' && <Image src="/suppliers/iway.png" alt="car" width={45} height={19} />}
                  </div>
               </div>
            </div>
         </>)
      );
   };

   return (
      (car && <>
         <div className={`nc-CarCard group relative border border-neutral-200 dark:border-neutral-700 rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 ${className}`} data-nc-id="CarCard">
            <Link href={car.href} className="flex flex-col">
            {renderSliderGallery()}
            {renderContent()}
            </Link>
         </div>
      </>)
   );
};

export default CarCard;
