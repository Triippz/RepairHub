-- AlterTable
ALTER TABLE `Appointment` ADD COLUMN `durationInMinutes` INTEGER NOT NULL DEFAULT 60,
    MODIFY `endTime` DATETIME(3) NULL;
