/*
  Warnings:

  - Added the required column `pic` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicleNo` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vin` to the `Vehicle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `booking` MODIFY `status` ENUM('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `vehicle` ADD COLUMN `pic` VARCHAR(191) NOT NULL,
    ADD COLUMN `vehicleNo` VARCHAR(191) NOT NULL,
    ADD COLUMN `vin` VARCHAR(191) NOT NULL;
