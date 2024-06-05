import { CarAdditionalService, CarDataType, CarFullDataType, CarPriceBreakdown, Supplier } from '@/data/types';
import { checkKey, getValue, setValue } from './redis';
import random from '@/utils/random';
import { PathName } from '@/routers/types';
import { UserSearch } from '../(client-components)/type';
import { getCarSubTotal } from './iway';

export async function saveCars(searchId : string, cars: any, supplier: Supplier, search : UserSearch){

   let carsResult : CarDataType[] = [];
   for (let index = 0; index < cars.length; index++) {
      
      const carId = random();
      const item = cars[index];
      let priceBreakDown = [];
      let car : CarDataType | undefined;
      
      if(supplier == 'iway'){

         let additionalServices : [CarAdditionalService] | undefined;
         let total = getCarSubTotal(item, search);
         if(item.additional_services){

            additionalServices = item.additional_services.map((service : any) => {
               return {
                  id: service.id,
                  serviceId: service.additional_service_id,
                  price: service.price,
                  name: service.name,
                  uid: service.uid,
                  defaultInclude: service.default_include,
                  currency: service.currency.toLowerCase(),
                  category: service.category,
                  type: service.type
               }
            });
         }

         priceBreakDown.push({name: 'Subtotal', price: total.toString()} as CarPriceBreakdown);

         if(item.car_deliverance_fee){
            priceBreakDown.push({name: 'Delivery', price: item.car_deliverance_fee} as CarPriceBreakdown);
            total += item.car_deliverance_fee;
         }

         car = {
            id: carId,
            priceId: item.price_id,
            href: '/car/' + carId as PathName,
            title: item.car_class.title,
            shortDescription: item.car_class.models.length ? item.car_class.models.join(',') : '',
            featuredImage: process.env.NEXT_PUBLIC_IWAY_CAR_PHOTO_URI + "/" + item.car_class.photo,
            price: item.price,
            priceBreakdown: priceBreakDown,
            grandTotal : total.toString(),
            seats: parseInt(item.car_class.capacity),
            supplier: supplier,
            currency: item.currency.toLowerCase(),
            cancellationTime: item.cancellation_time,
            allowableTime: item.allowable_time,
            hasFastBooking : item.is_fast_booking,
         }

         if(additionalServices && additionalServices.length){
            car.additionalServices = additionalServices;
         }

         if(search.type == 'chauffer'){
            
            car.chauffer = {
               deliveryPrice: item.car_deliverance_fee,
               minimumHours: item.minimum_duration/3600,
               ratePerHour: item.price_per_hour
            }
         }
      }

      if(car !== undefined){

         const carFullData : CarFullDataType = {
            'searchId' : searchId,
            'data' : car,
            'timestamp' : new Date().getTime()
         }
   
         await setValue(carId.toString(), JSON.stringify(carFullData));
         carsResult.push(car);
      }
   }

   return carsResult;
}

export async function getCar(carId : string){

   let carResult : CarFullDataType | null = null;
   const isCar = await checkKey(carId);
   if(isCar){

      let carString = await getValue(carId);
      carResult = carString ? JSON.parse(carString) : null;
   }

   return carResult;
}