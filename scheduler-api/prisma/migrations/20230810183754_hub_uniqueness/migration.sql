/*
  Warnings:

  - A unique constraint covering the columns `[portalId,hubspotUserId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX `name` ON `User`(`firstName`, `lastName`);

-- CreateIndex
CREATE UNIQUE INDEX `User_portalId_hubspotUserId_key` ON `User`(`portalId`, `hubspotUserId`);
