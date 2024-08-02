import type { Metadata } from "next"
import "./globals.css"
import StoreProvider from "./StoreProvider"

export const metadata: Metadata = {
   title: "Toursaving",
   description: "",
}

export default function RootLayout({children }: Readonly<{ children: React.ReactNode; }>) {
   return (
      <html lang="en">
         <body>
            <StoreProvider>{children}</StoreProvider>
         </body>
      </html>
   )
}
