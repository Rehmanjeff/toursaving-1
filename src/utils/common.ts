
export const isValidExpiration = (expiration : string) => {

   const [yearMonth, month] = expiration.split('-');
   const yearMatch = yearMonth.match(/\d{4}/);
   const currentYear = new Date().getFullYear();
   const currentMonth = new Date().getMonth() + 1;

   if (yearMatch) {
      const parsedYear = parseInt(yearMatch[0], 10);
      const parsedMonth = parseInt(month, 10);

      if (parsedYear > currentYear) {
         return true;
      } else if (parsedYear === currentYear && parsedMonth >= currentMonth) {
         return true;
      }
   }

   return false;
};

export const creditCardNumberRegExp = /^[0-9]{16}$/;

export function formatDateDescriptive(timestamp: number): string {
   const date = new Date(timestamp);
 
   const options: Intl.DateTimeFormatOptions = {
     weekday: 'long',
     month: 'long',
     day: 'numeric',
     hour: 'numeric',
     minute: 'numeric',
     hour12: true,
   };
 
   const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
 
   return formattedDate;
 }

export const formatDate = (timestamp: string, time?: string, customFormat?: string): string => {
   const date = new Date(parseInt(timestamp));
   
   const year = date.getFullYear();
   const month = String(date.getMonth() + 1).padStart(2, '0');
   const day = String(date.getDate()).padStart(2, '0');
   const hours = String(date.getHours()).padStart(2, '0');
   const minutes = String(date.getMinutes()).padStart(2, '0');
 
   let formattedDate = customFormat
     ? customFormat
         .replace(/Y/g, String(year))
         .replace(/m/g, month)
         .replace(/d/g, day)
     : `${year}-${month}-${day}`;
 
   if (time) {
     formattedDate += ` ${time.split(' ')[0]}`;
   }
 
   return formattedDate;
}

export const generateRandomNumber = (digits: number): number => {
   if (digits <= 0) {
     throw new Error("Number of digits must be greater than zero.");
   }
 
   const min = Math.pow(10, digits - 1);
   const max = Math.pow(10, digits) - 1;
   return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getErrorMessage = (error : any): string => {
   let err;
   if (error.message) {
      err = error.message;
   } else if (error.name) {
      err = error.name;
   } else {
      err = error as string
   }

   return err;
}
