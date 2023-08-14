-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'USER', 'STAFF') NOT NULL DEFAULT 'USER',

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServiceTechnician` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NULL,

    UNIQUE INDEX `ServiceTechnician_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WorkingHours` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `day` ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY') NOT NULL,
    `startHour` DATETIME(3) NOT NULL,
    `endHour` DATETIME(3) NOT NULL,
    `serviceTechnicianId` INTEGER NOT NULL,

    UNIQUE INDEX `WorkingHours_serviceTechnicianId_day_key`(`serviceTechnicianId`, `day`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Appointment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,
    `userId` INTEGER NOT NULL,
    `serviceTechnicianId` INTEGER NOT NULL,

    UNIQUE INDEX `Appointment_serviceTechnicianId_startTime_endTime_key`(`serviceTechnicianId`, `startTime`, `endTime`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WorkingHours` ADD CONSTRAINT `WorkingHours_serviceTechnicianId_fkey` FOREIGN KEY (`serviceTechnicianId`) REFERENCES `ServiceTechnician`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_serviceTechnicianId_fkey` FOREIGN KEY (`serviceTechnicianId`) REFERENCES `ServiceTechnician`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
