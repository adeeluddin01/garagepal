/*
  Warnings:

  - A unique constraint covering the columns `[vehicleNo]` on the table `Vehicle` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `vehicle` ADD COLUMN `customerId` INTEGER NULL;

-- CreateTable
CREATE TABLE `CustomerOnboarding` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `customerAvatar` VARCHAR(191) NULL,

    UNIQUE INDEX `CustomerOnboarding_email_key`(`email`),
    UNIQUE INDEX `CustomerOnboarding_phoneNumber_key`(`phoneNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomerBookingRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NOT NULL,
    `vehicleId` INTEGER NOT NULL,
    `serviceId` INTEGER NOT NULL,
    `status` ENUM('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `preferredTime` DATETIME(3) NULL,
    `serviceDetails` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Vehicle_vehicleNo_key` ON `Vehicle`(`vehicleNo`);

-- AddForeignKey
ALTER TABLE `Vehicle` ADD CONSTRAINT `Vehicle_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `CustomerOnboarding`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerBookingRequest` ADD CONSTRAINT `CustomerBookingRequest_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `CustomerOnboarding`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
