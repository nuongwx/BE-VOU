/*
  Warnings:

  - You are about to drop the column `userId` on the `Voucher` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Voucher" DROP COLUMN "userId",
ADD COLUMN     "brandId" INTEGER[];
