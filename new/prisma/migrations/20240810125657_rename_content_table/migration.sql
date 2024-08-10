/*
  Warnings:

  - You are about to drop the `Content` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Content";

-- CreateTable
CREATE TABLE "content" (
    "id" SERIAL NOT NULL,
    "home" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "privacy" TEXT NOT NULL,
    "terms" TEXT NOT NULL,

    CONSTRAINT "content_pkey" PRIMARY KEY ("id")
);
