-- AlterTable
ALTER TABLE `booking` ADD COLUMN `cost` INTEGER NULL;

-- AlterTable
ALTER TABLE `payment` ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `money` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `subservice` ADD COLUMN `cost` INTEGER NULL;
