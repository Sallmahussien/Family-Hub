/*
  Warnings:

  - You are about to drop the column `deleted` on the `Events` table. All the data in the column will be lost.
  - You are about to drop the column `deleted` on the `Gallery` table. All the data in the column will be lost.
  - You are about to drop the column `deleted` on the `Lists` table. All the data in the column will be lost.
  - You are about to drop the column `deleted` on the `Posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Events` DROP COLUMN `deleted`;

-- AlterTable
ALTER TABLE `Gallery` DROP COLUMN `deleted`;

-- AlterTable
ALTER TABLE `Lists` DROP COLUMN `deleted`;

-- AlterTable
ALTER TABLE `Posts` DROP COLUMN `deleted`;
