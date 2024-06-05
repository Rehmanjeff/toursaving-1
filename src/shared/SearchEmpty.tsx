"use client";

import React, { FC, useState } from "react";
import FormItem from "./FormItem";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Input from "./Input";
import Textarea from "./Textarea";
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Notification from '@/shared/Notification';
import { useNotification } from '@/hooks//useNotification';
import { UserSearch } from "@/app/(client-components)/type";
import { decodeFromQuery } from "@/utils/userSearch";

export interface SearchEmptyProps {}

const SearchEmpty: FC<SearchEmptyProps> = () => {

   const { notification, showNotification, hideNotification } = useNotification();
   const queryString = window.location.search.substring(1);
   const search = JSON.stringify(decodeFromQuery(queryString));

   const schema = yup.object().shape({

      name: yup.string().required('This field is required'),
      email: yup.string().email('Email provided is invalid').required('This field is required'),
      description: yup.string()
   });

   const { register, handleSubmit, formState: {errors}, reset } = useForm({
      resolver: yupResolver(schema),
   });

   const onSubmit = async (formData : object) => {
      
      const updatedFormData = {
         ...formData,
         search: search,
      };

      try {
         const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedFormData),
         });
   
         const data = await response.json();
   
         if (data.error) {
            showNotification('Error: ' + data.error, 'error');
         } else {
            showNotification('Your request has been sent successfully', 'success');
            reset({ email: "", name: "", description: ""})
         }
      } catch (error) {
         showNotification('Error: ' + error, 'error');
      }

      setTimeout(() => { hideNotification() }, 3000);
   }

   return (
      <>
         <div className="flex flex-row gap-4">
            <div className="flex-grow">
               <div className="w-full h-full flex flex-col items-center justify-center bg-orange-50 p-10 dark:bg-black/20 rounded-3xl">
                  <h2 className="text-3xl font-semibold text-center">No matching results</h2>
                  <span className="block mt-2 md:mt-3 font-normal text-base text-gray-500 dark:text-gray-400 text-md text-center">Fill out this form to let us know so we can arrange a customized booking for you</span>
               </div>  
            </div>
            <div className="flex flex-col w-full px-8 max-w-3xl mx-auto py-10 space-y-6 border rounded-lg">
               <h2 className="text-2xl font-semibold">Send your request to our operations</h2>
               <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
               <div className="space-y-8">
                  <FormItem label="Full name" desc="">
                     <Input type="text" placeholder="John Doe" error={errors.name ? errors.name.message : ''} {...register('name')} />
                  </FormItem>
                  <FormItem label="Email" desc="">
                     <Input type="email" placeholder="johndoe@hotmail.com" error={errors.email ? errors.email.message : ''} {...register('email')} />
                  </FormItem>
                  <FormItem label="Booking requirements" desc="Please describe in details what are your booking requirements">
                     <Textarea className="mt-1.5" {...register('description')} />
                  </FormItem>
               </div>
               <ButtonPrimary onClick={handleSubmit(onSubmit)} className="ml-auto">Submit</ButtonPrimary>
               {notification.show && <Notification type={notification.type} message={notification.message} />}
            </div>
         </div>
      </>
   );
}
 
export default SearchEmpty;