import { Currency } from "@/data/types";

export function getCurrencySymbol(currencyCode: Currency): string {
   
   switch (currencyCode.toLowerCase()) {
      case 'usd':
         return '$';
      case 'bd':
         return 'BD';
      default:
         return '';
   }
}