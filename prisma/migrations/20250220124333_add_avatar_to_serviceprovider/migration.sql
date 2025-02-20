/*
  Warnings:

  - Added the required column `address` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pic` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ssn` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `employee` ADD COLUMN `address` VARCHAR(191) NOT NULL,
    ADD COLUMN `pic` VARCHAR(191) NOT NULL,
    ADD COLUMN `ssn` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `serviceprovider` ADD COLUMN `avatar` VARCHAR(191) NULL,
    MODIFY `latitude` DOUBLE NULL,
    MODIFY `longitude` DOUBLE NULL;
