import { PrismaClient } from '@prisma/client'
import { transformBooking, transformBookingSummary } from '@/_utils/bookingTransformer'
import { BookingType, BookingSummaryType, DriveType, CarSummary, BookingPrice, BookingExtra, BookingStatus } from '@/types/booking'
import { UserType } from '@/types/user'
import { Location } from '@/types/location'
import { generateRandomNumber } from '@/_utils/booking'
import * as puppeteer from 'puppeteer'
import * as path from 'path'
import * as ejs from 'ejs'

export async function generateVoucher (data: BookingType, fileName: string) {
   try {
      
      const templateFile = 'src/templates/pdf/booking-invoice.ejs';
      const outputPath = `${process.env.NEXT_PUBLIC_BOOKING_VOUCHER_OUTPUT_DIR}/${fileName}`;

      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();

      const filePath = path.join(process.cwd(), templateFile);
      const templateContent = await require('fs').promises.readFile(filePath, 'utf8')
      const html = ejs.render(templateContent, { data });
      await page.setContent(html);

      await page.pdf({ path: outputPath, format: 'A4' });
      await browser.close();
      
      return fileName;
      
   } catch (err) {
      return err
   }
}