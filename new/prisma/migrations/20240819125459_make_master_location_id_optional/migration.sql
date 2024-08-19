-- DropForeignKey
ALTER TABLE "supplier_locations" DROP CONSTRAINT "supplier_locations_master_location_id_fkey";

-- AlterTable
ALTER TABLE "supplier_locations" ALTER COLUMN "master_location_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "supplier_locations" ADD CONSTRAINT "supplier_locations_master_location_id_fkey" FOREIGN KEY ("master_location_id") REFERENCES "master_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
