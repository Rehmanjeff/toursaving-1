-- CreateTable
CREATE TABLE "master_locations" (
    "id" SERIAL NOT NULL,
    "location_name" TEXT NOT NULL,
    "location_name_arabic" TEXT NOT NULL,
    "country_name" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "master_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suppliers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "commission" INTEGER NOT NULL,
    "has_mapping_manual" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier_locations" (
    "id" SERIAL NOT NULL,
    "supplier_id" INTEGER NOT NULL,
    "master_location_id" INTEGER NOT NULL,
    "location_name" TEXT NOT NULL,
    "location_name_arabic" TEXT NOT NULL,
    "country_name" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplier_locations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "supplier_locations" ADD CONSTRAINT "supplier_locations_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_locations" ADD CONSTRAINT "supplier_locations_master_location_id_fkey" FOREIGN KEY ("master_location_id") REFERENCES "master_locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
