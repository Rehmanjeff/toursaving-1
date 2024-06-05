"use client";

import React, { FC, useState } from "react";
import facebookSvg from "@/images/Facebook.svg";
import twitterSvg from "@/images/Twitter.svg";
import googleSvg from "@/images/Google.svg";
import Input from "@/shared/Input";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Image from "next/image";
import Link from "next/link";
import { PathName } from "@/routers/types";
import useNextRouter from "@/hooks/useNextRouter";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from "react-hook-form";

export interface PageSignUpProps {}

const loginSocials: any = [
   // {
   //    name: "Continue with Facebook",
   //    href: "#",
   //    icon: facebookSvg,
   // },
   // {
   //    name: "Continue with Twitter",
   //    href: "#",
   //    icon: twitterSvg,
   // },
   // {
   //    name: "Continue with Google",
   //    href: "#",
   //    icon: googleSvg,
   // },
];

const PageSignUp: FC<PageSignUpProps> = ({}) => {

   const [error, setError] = useState<string | false>(false);
   const { redirectTo } = useNextRouter();
   
   const schema = yup.object().shape({
      fullName: yup.string().max(40, 'Full name is too long').required('Full name is required'),
      email: yup.string().email('Email provided is invalid').required('Email is required'),
      emailConfirmation: yup.string()
        .email('Email confirmation provided is invalid')
        .oneOf([yup.ref('email')], 'Email confirmation must match the email')
        .required('Email confirmation is required'),
      password: yup.string().min(8, 'Password must be at least 8 characters long').required('Password is required'),
      contactNumber: yup.string()
         .matches(/^[0-9]+$/, 'Contact number must only contain numeric digits')
         .min(10, 'Contact number is too short')
         .max(15, 'Contact number is too long')
         .required('Contact number required'),
   });
   
   const { register, handleSubmit, formState: {errors}, reset } = useForm({
      resolver: yupResolver(schema),
   });
   
   // const onSubmit = async (formData : any) => {
      
   //    const email = formData.email;
   //    const password = formData.password;
   //    const fullName = formData.fullName;
   //    const contactNumber = formData.contactNumber;
   
   //    try {
         
   //       fetch('/api/user/signup', {
   //          method: 'POST', 
   //          headers: {'Content-Type': 'application/json'}, 
   //          body: JSON.stringify({'search': search, 'lang': 'en', 'car' : car, trip: updatedTrip})
   //       }).then((response) => response.json()).then((data) => {

   //          setIsLoading(false);
   //          if (data.response.error) {
   //             throw data.response.error;
   //          } else {
   //             localStorage.removeItem('tour-checkout-vehicle');
   //             localStorage.removeItem('tour-search');
   //             localStorage.setItem('tour-booking-number', data.response.booking);
   //             redirectTo('/pay-done' as any);
   //          }
   //       }).catch((error) => {

   //          const err = getErrorMessage(error);
   //          setIsLoading(false);
   //          showNotification(err, 'error');
   //          setTimeout(() => { hideNotification() }, 3000);
   //       });
      
   //       if (result && result.error) {
   //          setError('Error: ' + result.error);
   //       } else {
   //          redirectTo('/account');
   //       }
   //    } catch (error: any) {
   //       setError('Error: ' + error.toString());
   //    }
   // };
   
   return (
      <div className={`nc-PageSignUp  `}>
         <div className="container mb-24 lg:mb-32">
         <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
            Signup
         </h2>
         <div className="max-w-md mx-auto space-y-6 ">
            <div className="grid gap-3">
               {loginSocials.map((item: any, index: number) => (
                  <a key={index} href={item.href} className="flex w-full rounded-lg bg-primary-50 dark:bg-neutral-800 px-4 py-3 transform transition-transform sm:px-6 hover:translate-y-[-2px]">
                     <Image className="flex-shrink-0" src={item.icon} alt={item.name} />
                     <h3 className="flex-grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm">
                        {item.name}
                     </h3>
                  </a>
               ))}
            </div>
            {loginSocials && loginSocials.length > 0 && (
               <div className="relative text-center">
                  <span className="relative z-10 inline-block px-4 font-medium text-sm bg-white dark:text-neutral-400 dark:bg-neutral-900">
                  OR
                  </span>
                  <div className="absolute left-0 w-full top-1/2 transform -translate-y-1/2 border border-neutral-100 dark:border-neutral-800"></div>
               </div>
            )}
            <form className="grid grid-cols-1 gap-6" action="#" method="post">
               <label className="block">
                  <span className="text-neutral-800 dark:text-neutral-200">
                     Full name
                  </span>
                  <Input type="text" placeholder="" className="mt-1" error={errors.fullName ? errors.fullName.message : ''} {...register('fullName')} />
               </label>
               <label className="block">
                  <span className="text-neutral-800 dark:text-neutral-200">
                     Email address
                  </span>
                  <Input type="text" placeholder="" className="mt-1" error={errors.email ? errors.email.message : ''} {...register('email')} />
               </label>
               <label className="block">
                  <span className="text-neutral-800 dark:text-neutral-200">
                     Confirm your email
                  </span>
                  <Input type="text" placeholder="" className="mt-1" error={errors.emailConfirmation ? errors.emailConfirmation.message : ''} {...register('emailConfirmation')} />
               </label>
               <label className="block">
                  <span className="text-neutral-800 dark:text-neutral-200">
                     Contact number
                  </span>
                  <Input type="text" placeholder="" className="mt-1" error={errors.contactNumber ? errors.contactNumber.message : ''} {...register('contactNumber')} />
               </label>
               <label className="block">
                  <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                     Password
                  </span>
                  <Input type="password" className="mt-1" error={errors.password ? errors.password.message : ''} {...register('password')} />
               </label>
               <ButtonPrimary type="button">Continue</ButtonPrimary>
            </form>

            {/* ==== */}
            <span className="block text-center text-neutral-700 dark:text-neutral-300">
               Already have an account? {` `}
               <Link href={"login" as PathName} className="font-semibold underline">
               Log in
               </Link>
            </span>
         </div>
         </div>
      </div>
   );
};

export default PageSignUp;
