/*
  Warnings:

  - A unique constraint covering the columns `[booking_number]` on the table `bookings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "booking_number" TEXT NOT NULL,
    "user_id" INTEGER,
    "service_provider" TEXT NOT NULL,
    "lookup_number" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_booking_number_key" ON "payments"("booking_number");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_booking_number_key" ON "bookings"("booking_number");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_booking_number_fkey" FOREIGN KEY ("booking_number") REFERENCES "bookings"("booking_number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
