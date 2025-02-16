/*
  Warnings:

  - You are about to drop the column `confirmedTimeSlot` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `preferredTimeSlot` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `read` on the `message` table. All the data in the column will be lost.
  - You are about to drop the column `receiverProviderId` on the `message` table. All the data in the column will be lost.
  - You are about to drop the column `receiverUserId` on the `message` table. All the data in the column will be lost.
  - You are about to drop the column `senderProviderId` on the `message` table. All the data in the column will be lost.
  - You are about to drop the column `senderUserId` on the `message` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `review` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedTime` on the `service` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `service` table. All the data in the column will be lost.
  - You are about to drop the column `availabilityStatus` on the `serviceprovider` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `serviceprovider` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedTime` on the `subservice` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `subservice` table. All the data in the column will be lost.
  - Added the required column `scheduledAt` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiverId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_receiverProviderId_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_receiverUserId_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_senderProviderId_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_senderUserId_fkey`;

-- DropIndex
DROP INDEX `Message_receiverProviderId_fkey` ON `message`;

-- DropIndex
DROP INDEX `Message_receiverUserId_fkey` ON `message`;

-- DropIndex
DROP INDEX `Message_senderProviderId_fkey` ON `message`;

-- DropIndex
DROP INDEX `Message_senderUserId_fkey` ON `message`;

-- AlterTable
ALTER TABLE `booking` DROP COLUMN `confirmedTimeSlot`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `preferredTimeSlot`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `scheduledAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `message` DROP COLUMN `read`,
    DROP COLUMN `receiverProviderId`,
    DROP COLUMN `receiverUserId`,
    DROP COLUMN `senderProviderId`,
    DROP COLUMN `senderUserId`,
    ADD COLUMN `receiverId` INTEGER NOT NULL,
    ADD COLUMN `senderId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `payment` DROP COLUMN `amount`;

-- AlterTable
ALTER TABLE `review` DROP COLUMN `createdAt`;

-- AlterTable
ALTER TABLE `service` DROP COLUMN `estimatedTime`,
    DROP COLUMN `price`;

-- AlterTable
ALTER TABLE `serviceprovider` DROP COLUMN `availabilityStatus`,
    DROP COLUMN `description`;

-- AlterTable
ALTER TABLE `subservice` DROP COLUMN `estimatedTime`,
    DROP COLUMN `price`;

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

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vehicle` ADD CONSTRAINT `Vehicle_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `CustomerOnboarding`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerBookingRequest` ADD CONSTRAINT `CustomerBookingRequest_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `CustomerOnboarding`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerBookingRequest` ADD CONSTRAINT `CustomerBookingRequest_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `Vehicle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerBookingRequest` ADD CONSTRAINT `CustomerBookingRequest_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
