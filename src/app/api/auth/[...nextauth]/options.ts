import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials"

export const options : NextAuthOptions = {
   providers: [
      CredentialsProvider({
         name: "Credentials",
         credentials: {
            email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials, req) {
            const user = { id: "1", name: "J Smith", email: "jsmith@example.com", password: "123456" }
      
            if (credentials?.email == user.email && credentials?.password == user.password) {
              
               return user;
            } else {
              return null;
            }
         }
      })
   ],
   pages: {
      signIn: "/login"
   }
}