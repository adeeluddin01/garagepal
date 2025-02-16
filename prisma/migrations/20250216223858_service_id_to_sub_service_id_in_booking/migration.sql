/*
  Warnings:

  - You are about to drop the column `serviceId` on the `booking` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `Booking_serviceId_fkey`;

-- DropIndex
DROP INDEX `Booking_serviceId_fkey` ON `booking`;

-- AlterTable
ALTER TABLE `booking` DROP COLUMN `serviceId`,
    ADD COLUMN `subServiceId` INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_subServiceId_fkey` FOREIGN KEY (`subServiceId`) REFERENCES `SubService`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
