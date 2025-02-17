-- AlterTable
ALTER TABLE `booking` MODIFY `preferredTimeSlot` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `payment` MODIFY `amount` DOUBLE NULL;

-- AlterTable
ALTER TABLE `service` MODIFY `price` DOUBLE NULL;

-- AlterTable
ALTER TABLE `subservice` MODIFY `price` DOUBLE NULL;
