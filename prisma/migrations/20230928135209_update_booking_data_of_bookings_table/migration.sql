/*
  Warnings:

  - You are about to alter the column `booking_data` on the `bookings` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10000)`.

*/
-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "booking_data" SET DATA TYPE VARCHAR(10000);
