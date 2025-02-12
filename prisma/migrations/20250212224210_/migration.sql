-- AlterTable
ALTER TABLE `serviceprovider` ADD COLUMN `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `ServiceProvider` ADD CONSTRAINT `ServiceProvider_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
