/*
  Warnings:

  - You are about to drop the column `scheduledAt` on the `booking` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `booking` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(2))`.
  - You are about to drop the column `receiverId` on the `message` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `message` table. All the data in the column will be lost.
  - Added the required column `preferredTimeSlot` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `SubService` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_receiverId_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_senderId_fkey`;

-- DropIndex
DROP INDEX `Message_receiverId_fkey` ON `message`;

-- DropIndex
DROP INDEX `Message_senderId_fkey` ON `message`;

-- AlterTable
ALTER TABLE `booking` DROP COLUMN `scheduledAt`,
    ADD COLUMN `confirmedTimeSlot` DATETIME(3) NULL,
    ADD COLUMN `preferredTimeSlot` DATETIME(3) NOT NULL,
    MODIFY `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `message` DROP COLUMN `receiverId`,
    DROP COLUMN `senderId`,
    ADD COLUMN `read` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `receiverProviderId` INTEGER NULL,
    ADD COLUMN `receiverUserId` INTEGER NULL,
    ADD COLUMN `senderProviderId` INTEGER NULL,
    ADD COLUMN `senderUserId` INTEGER NULL;

-- AlterTable
ALTER TABLE `payment` ADD COLUMN `amount` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `review` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `service` ADD COLUMN `price` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `serviceprovider` ADD COLUMN `availabilityStatus` ENUM('AVAILABLE', 'FULLY_BOOKED') NOT NULL DEFAULT 'AVAILABLE';

-- AlterTable
ALTER TABLE `subservice` ADD COLUMN `price` DOUBLE NOT NULL;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_senderUserId_fkey` FOREIGN KEY (`senderUserId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_senderProviderId_fkey` FOREIGN KEY (`senderProviderId`) REFERENCES `ServiceProvider`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_receiverUserId_fkey` FOREIGN KEY (`receiverUserId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_receiverProviderId_fkey` FOREIGN KEY (`receiverProviderId`) REFERENCES `ServiceProvider`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
