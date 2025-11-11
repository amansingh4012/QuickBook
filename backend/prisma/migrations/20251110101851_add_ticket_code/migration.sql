/*
  Warnings:

  - A unique constraint covering the columns `[ticketCode]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `booking` ADD COLUMN `ticketCode` VARCHAR(50) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Booking_ticketCode_key` ON `Booking`(`ticketCode`);
