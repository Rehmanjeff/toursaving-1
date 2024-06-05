import { Trip } from "@/data/types";

export async function makePayment(bookingNumber: string, trip : Trip){

   let data = { referenceNumber : null };

   return { success: true, error: null, data: data };
}