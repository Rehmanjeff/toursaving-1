-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "is_manual" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "internal_cars" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT,
    "capacity" INTEGER NOT NULL,

    CONSTRAINT "internal_cars_pkey" PRIMARY KEY ("id")
);
