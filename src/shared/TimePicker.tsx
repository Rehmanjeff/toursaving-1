import React, { useState, ChangeEvent, useEffect } from 'react';
import Select from "@/shared/Select";
import Label from "@/components/Label";

interface TimePickerProps {
   onTimeSelect: (selectedTime: string) => void;
   time?: string;
}

const TimePicker: React.FC<TimePickerProps> = ({ 
   onTimeSelect,
   time = "12:00 am"
}) => {
   
   const [one, ampm] = time.split(' ');
   const [hours, minutes] = one.split(':');

   const [selectedHour, setSelectedHour] = useState(hours);
   const [selectedMinute, setSelectedMinute] = useState(minutes);
   const [selectedAmPm, setSelectedAmPm] = useState(ampm);

   useEffect(() => {
      handleTimeChange();
    }, [selectedHour, selectedMinute, selectedAmPm])

   const handleTimeChange = () => {
      const selectedTime = `${selectedHour}:${selectedMinute} ${selectedAmPm}`;
      onTimeSelect(selectedTime);
   };

   const handleHourChange = (event: ChangeEvent<HTMLSelectElement>) => {
      setSelectedHour(event.target.value);
      handleTimeChange();
   };

   const handleMinuteChange = (event: ChangeEvent<HTMLSelectElement>) => {
      setSelectedMinute(event.target.value);
      handleTimeChange();
   };

   const handleAmPmChange = (event: ChangeEvent<HTMLSelectElement>) => {
      setSelectedAmPm(event.target.value);
      handleTimeChange();
  };

   return (
      <div className="flex flex-row gap-2 items-center ">
         <div className="flex-1">
            <Label>Hour</Label>
            <Select value={selectedHour} onChange={handleHourChange} className="w-full">
               <option value="01">01</option>
               <option value="02">02</option>
               <option value="03">03</option>
               <option value="04">04</option>
               <option value="05">05</option>
               <option value="06">06</option>
               <option value="07">07</option>
               <option value="08">08</option>
               <option value="09">09</option>
               <option value="10">10</option>
               <option value="11">11</option>
               <option value="12">12</option>
            </Select>
         </div>
         <div className="flex-1">
            <Label>Minutes</Label>
            <Select value={selectedMinute} onChange={handleMinuteChange} className="w-full">
               <option value="00">00</option>
               <option value="30">30</option>
            </Select>
         </div>
         <div className="flex-1">
            <Label>&nbsp;</Label>
            <Select value={selectedAmPm} onChange={handleAmPmChange} className="w-full">
               <option value="am">AM</option>
               <option value="pm">PM</option>
            </Select>
         </div>
      </div>
   );
};

export default TimePicker;