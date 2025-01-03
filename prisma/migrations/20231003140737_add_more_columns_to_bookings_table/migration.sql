-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'usd',
ADD COLUMN     "drive_type" TEXT NOT NULL DEFAULT 'transfer',
ADD COLUMN     "lang" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'created';
