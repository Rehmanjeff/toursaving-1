import Button, { ButtonProps } from "./Button";
import React from "react";
import useNextRouter from '@/hooks/useNextRouter';
import { PathName } from "@/routers/types";

export interface BookingFailureProps extends ButtonProps {
   message: string;
   buttonText?: string;
   buttonUrl: string;
}

const BookingFailure: React.FC<BookingFailureProps> = ({
  message = false,
  buttonText = '',
  buttonUrl = ''
}) => {

   const { redirectTo } = useNextRouter();
   const handleClick = () => {

      redirectTo(buttonUrl as PathName);
   }

   return (
      <div className="rounded-md bg-red-50 p-4 mt-3">
         <div className="flex">
            <div className="ml-3">
               <h3 className="text-sm font-medium text-red-800">Error</h3>
               <div className="mt-2 text-sm text-red-700">
                  <p>{message}</p>
               </div>
               {buttonText && buttonText != '' && (<div className="mt-4">
                  <div className="-mx-2 -my-1.5 flex">
                     <button type="button" onClick={handleClick} className="rounded-md bg-red-100 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50">
                        {buttonText}
                     </button>
                  </div>
               </div>)}
            </div>
         </div>
      </div>
   );
};

export default BookingFailure;
