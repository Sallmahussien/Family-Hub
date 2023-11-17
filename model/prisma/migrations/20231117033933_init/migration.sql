/*
  Warnings:

  - You are about to drop the `Circle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContactBook` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Feed` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Like` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `List` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ListItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_feedId_fkey`;

-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_userId_fkey`;

-- DropForeignKey
ALTER TABLE `ContactBook` DROP FOREIGN KEY `ContactBook_circleId_fkey`;

-- DropForeignKey
ALTER TABLE `Event` DROP FOREIGN KEY `Event_feedId_fkey`;

-- DropForeignKey
ALTER TABLE `Feed` DROP FOREIGN KEY `Feed_circleId_fkey`;

-- DropForeignKey
ALTER TABLE `Feed` DROP FOREIGN KEY `Feed_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Gallery` DROP FOREIGN KEY `Gallery_feedId_fkey`;

-- DropForeignKey
ALTER TABLE `Like` DROP FOREIGN KEY `Like_feedId_fkey`;

-- DropForeignKey
ALTER TABLE `Like` DROP FOREIGN KEY `Like_userId_fkey`;

-- DropForeignKey
ALTER TABLE `List` DROP FOREIGN KEY `List_feedId_fkey`;

-- DropForeignKey
ALTER TABLE `ListItem` DROP FOREIGN KEY `ListItem_listId_fkey`;

-- DropForeignKey
ALTER TABLE `Post` DROP FOREIGN KEY `Post_feedId_fkey`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_circleId_fkey`;

-- DropTable
DROP TABLE `Circle`;

-- DropTable
DROP TABLE `Comment`;

-- DropTable
DROP TABLE `ContactBook`;

-- DropTable
DROP TABLE `Event`;

-- DropTable
DROP TABLE `Feed`;

-- DropTable
DROP TABLE `Like`;

-- DropTable
DROP TABLE `List`;

-- DropTable
DROP TABLE `ListItem`;

-- DropTable
DROP TABLE `Post`;

-- DropTable
DROP TABLE `User`;

-- CreateTable
CREATE TABLE `Circles` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `coverPhoto` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Users` (
    `id` VARCHAR(191) NOT NULL,
    `circleId` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `role` ENUM('CREATOR', 'MEMEBER') NOT NULL DEFAULT 'MEMEBER',
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `profilePhoto` VARCHAR(191) NULL,
    `birthdate` DATETIME(3) NOT NULL,
    `position` ENUM('FATHER', 'MOTHER', 'SON', 'DAUGHTER') NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContactBooks` (
    `id` VARCHAR(191) NOT NULL,
    `circleId` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `profilePhoto` VARCHAR(191) NULL,
    `type` VARCHAR(191) NULL,
    `note` VARCHAR(1024) NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Feeds` (
    `id` VARCHAR(191) NOT NULL,
    `circleId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` ENUM('POST', 'PHOTO', 'EVENT', 'LIST') NOT NULL DEFAULT 'POST',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Events` (
    `id` VARCHAR(191) NOT NULL,
    `feedId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `reminder` DATETIME(3) NULL,
    `description` VARCHAR(1024) NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Events_feedId_key`(`feedId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lists` (
    `id` VARCHAR(191) NOT NULL,
    `feedId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Lists_feedId_key`(`feedId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ListItems` (
    `id` VARCHAR(191) NOT NULL,
    `listId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `ListItems_listId_key`(`listId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Posts` (
    `id` VARCHAR(191) NOT NULL,
    `feedId` VARCHAR(191) NOT NULL,
    `content` VARCHAR(1024) NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Posts_feedId_key`(`feedId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comments` (
    `id` VARCHAR(191) NOT NULL,
    `feedId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `content` VARCHAR(256) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Likes` (
    `id` VARCHAR(191) NOT NULL,
    `feedId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_circleId_fkey` FOREIGN KEY (`circleId`) REFERENCES `Circles`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContactBooks` ADD CONSTRAINT `ContactBooks_circleId_fkey` FOREIGN KEY (`circleId`) REFERENCES `Circles`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Feeds` ADD CONSTRAINT `Feeds_circleId_fkey` FOREIGN KEY (`circleId`) REFERENCES `Circles`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Feeds` ADD CONSTRAINT `Feeds_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Gallery` ADD CONSTRAINT `Gallery_feedId_fkey` FOREIGN KEY (`feedId`) REFERENCES `Feeds`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Events` ADD CONSTRAINT `Events_feedId_fkey` FOREIGN KEY (`feedId`) REFERENCES `Feeds`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lists` ADD CONSTRAINT `Lists_feedId_fkey` FOREIGN KEY (`feedId`) REFERENCES `Feeds`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ListItems` ADD CONSTRAINT `ListItems_listId_fkey` FOREIGN KEY (`listId`) REFERENCES `Lists`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Posts` ADD CONSTRAINT `Posts_feedId_fkey` FOREIGN KEY (`feedId`) REFERENCES `Feeds`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comments` ADD CONSTRAINT `Comments_feedId_fkey` FOREIGN KEY (`feedId`) REFERENCES `Feeds`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comments` ADD CONSTRAINT `Comments_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Likes` ADD CONSTRAINT `Likes_feedId_fkey` FOREIGN KEY (`feedId`) REFERENCES `Feeds`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Likes` ADD CONSTRAINT `Likes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
