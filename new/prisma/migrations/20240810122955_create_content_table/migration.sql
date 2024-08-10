-- CreateTable
CREATE TABLE "Content" (
    "id" SERIAL NOT NULL,
    "home" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "privacy" TEXT NOT NULL,
    "terms" TEXT NOT NULL,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);
