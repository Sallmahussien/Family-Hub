/*
  Warnings:

  - You are about to alter the column `role` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `ListItems` ADD COLUMN `checked` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Users` MODIFY `role` ENUM('CREATOR', 'MEMBER') NOT NULL DEFAULT 'MEMBER';
