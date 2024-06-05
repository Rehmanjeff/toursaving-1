// "use client";

// import React, { FC, useState } from "react";
// import LocationInput from "../LocationInput";
// import DateTimeInput from "../DateTimeInput";
// import IconButton from "@/shared/IconButton";
// import HoursInput from "../HoursInput";
// import useNextRouter from '@/hooks/useNextRouter';
// import { PathName } from "@/routers/types";
// import { ChaufferServiceType, ChaufferType } from "@/app/(client-components)/type";
// import { Location, SearchParams } from "@/app/(client-components)/type";
// import { encodeIntoQuery } from "@/utils/userSearch";

// export interface ChaufferSearchFormProps {}

// const ChaufferSearchForm: FC<ChaufferSearchFormProps> = ({}) => {

//    const [pickUpError, setPickUpError] = useState<string | null>(null);
//    const [destinationError, setDestinationError] = useState<string | null>(null);

//    const defaultDate = new Date(new Date());
//    defaultDate.setDate(defaultDate.getDate() + 1);
//    const defaultTime = "12:00 am";
//    const defaultHours = 4;

//    const { redirectTo } = useNextRouter();
//    const [chaufferSearch, setChaufferSearch] = useState<ChaufferServiceType>({
//       type: 'destination',
//       pickUp: null,
//       destination: null,
//       hours: defaultHours,
//       startDate: defaultDate.getTime(),
//       startTime: defaultTime
//    });
//    const handleBookingType = (value: ChaufferType) => {

//       setChaufferSearch((prevSearch) => ({
//          ...prevSearch,
//          type: value,
//          destination: value == 'hours' ? null : prevSearch.destination
//       }));
//    }
//    const handleLocationInputChange = (location: Location | null, inputIdentifier: string) => {
//       if(inputIdentifier == 'pickUp'){

//          setPickUpError(null);
//          setChaufferSearch((prevSearch) => ({
//             ...prevSearch,
//             pickUp: location
//          }));
//       }
//       if(inputIdentifier == 'destination'){

//          setDestinationError(null);
//          setChaufferSearch((prevSearch) => ({
//             ...prevSearch,
//             destination: location
//          }));
//       }
//    }

//    const handleHoursChange = (selectedHours: string) => {

//       setChaufferSearch((prevSearch) => ({
//          ...prevSearch,
//          hours: parseInt(selectedHours)
//       }));
//    }

//    const handleDateTimeChange = (selectedDate: Date | null, selectedTime: string, identified: string) => {

//       setChaufferSearch((prevSearch) => ({
//          ...prevSearch,
//          startDate: selectedDate ? selectedDate.getTime() : null,
//          startTime: selectedTime
//       }));
//    }

//    const handleSearch = () => {

//       let hasError = false;
//       if(chaufferSearch.pickUp == null){

//          hasError = true
//          setPickUpError('Please provide pick up location');
//       }
//       if(chaufferSearch.type == 'destination' && chaufferSearch.destination == null){

//          hasError = true
//          setDestinationError('Please provide destination location');
//       }

//       if(!hasError){

//          const searchQuery = encodeIntoQuery({'chauffer' : chaufferSearch} as SearchParams);
//          redirectTo('/search?' + searchQuery as PathName);
//       }
//    }

//    const renderRadioBtn = () => {
//       return (
//          <div className=" py-5 [ nc-hero-field-padding ] flex items-center flex-wrap flex-row border-b border-neutral-100 dark:border-neutral-700">
//             <div onClick={(e) => handleBookingType("destination")} className={`py-1.5 px-4 flex items-center rounded-full font-medium text-xs cursor-pointer mr-2 my-1 sm:mr-3 ${chaufferSearch.type === "destination" ? "bg-black text-white shadow-black/10 shadow-lg" : "border border-neutral-300 dark:border-neutral-700" }`}>
//                Book by destination
//             </div>
//             <div onClick={(e) => handleBookingType("hours")} className={`py-1.5 px-4 flex items-center rounded-full font-medium text-xs cursor-pointer mr-2 my-1 sm:mr-3 ${chaufferSearch.type === "hours" ? "bg-black text-white shadow-black/10 shadow-lg" : "border border-neutral-300 dark:border-neutral-700" }`}>
//                Book by hours
//             </div>
//          </div>
//       );
//    };

//    return (
//       <form className="w-full relative mt-8 rounded-[40px] xl:rounded-[49px] rounded-t-2xl xl:rounded-t-3xl shadow-xl dark:shadow-2xl bg-white dark:bg-neutral-800">
//          {renderRadioBtn()}
//          <div className={`relative flex flex-row items-center`}>
//             <LocationInput error={pickUpError} onInputChange={(location) => handleLocationInputChange(location, "pickUp")} placeHolder="City or Airport" desc="Pick up location" className="flex-1" divHideVerticalLineClass="-inset-x-0.5" size="normal" />
//             <div className="self-center border-r border-slate-200 dark:border-slate-700 h-8"></div>
//             {chaufferSearch.type == 'destination' && <><LocationInput error={destinationError} onInputChange={(location) => handleLocationInputChange(location, "destination")} placeHolder="City or Airport" desc="Destination location" className="flex-1" divHideVerticalLineClass="-inset-x-0.5" size="normal" /><div className="self-center border-r border-slate-200 dark:border-slate-700 h-8"></div></>}
//             {chaufferSearch.type == 'hours' && <><HoursInput hours={defaultHours.toString()} onHoursChange={handleHoursChange} desc="Booking hours" className="flex-1" /><div className="self-center border-r border-slate-200 dark:border-slate-700 h-8"></div></>}
//             <DateTimeInput date={defaultDate} time={defaultTime} onDateTimeChange={(date, time) => handleDateTimeChange(date, time, "start-date-time")} placeHolder="Pickup date and time" className="flex-1" />
//             <div className="pr-2 xl:pr-4">
//                <IconButton type="button" className="text-white" onClick={handleSearch} />
//             </div>
//          </div>
//       </form>
//    );
// };

// export default ChaufferSearchForm;
