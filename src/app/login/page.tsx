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
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import useNextRouter from "@/hooks/useNextRouter";

export interface PageLoginProps {}

const loginSocials : any = [
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

const PageLogin: FC<PageLoginProps> = ({}) => {

   const [error, setError] = useState<string | false>(false);
   const { redirectTo } = useNextRouter();
   
   const schema = yup.object().shape({
      email: yup.string().email('Email provided is invalid').required('Email cannot be empty'),
      password: yup.string().required('Password cannot be empty'),
   });
   
   const { register, handleSubmit, formState: {errors}, reset } = useForm({
      resolver: yupResolver(schema),
   });
   
   const onSubmit = async (formData : any) => {
      
      const email = formData.email;
      const password = formData.password;
   
      try {
         const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
         });
      
         if (result && result.error) {
            setError('Error: ' + result.error);
         } else {
            redirectTo('/account');
         }
      } catch (error: any) {
         setError('Error: ' + error.toString());
      }
   };
   
   return (
      <div className={`nc-PageLogin`}>
         <div className="container mb-24 lg:mb-32">
            <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
               Login
            </h2>
            <div className="max-w-md mx-auto space-y-6">
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
               <form className="grid grid-cols-1 gap-6">
                  <label className="block">
                     <span className="text-neutral-800 dark:text-neutral-200">
                        Email address
                     </span>
                     <Input type="email" placeholder="johndoe@hotmail.com" error={errors.email ? errors.email.message : ''} {...register('email')} />
                  </label>
                  <label className="block">
                     <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                        Password
                        <Link href={"login" as PathName} className="text-sm underline font-medium">
                           Forgot password?
                        </Link>
                     </span>
                     <Input type="password" error={errors.password ? errors.password.message : ''} {...register('password')} />
                  </label>
                  <ButtonPrimary type="button" onClick={handleSubmit(onSubmit)}>Continue</ButtonPrimary>
               </form>

               <span className="block text-center text-neutral-700 dark:text-neutral-300">
                  New user? {` `}
                  <Link href={"signup" as PathName} className="font-semibold underline">Create an account</Link>
               </span>

               {error && (<p className="text-sm text-center text-red-600" id="email-error">{error}</p>)}
            </div>
         </div>
      </div>
   );
};

export default PageLogin;
