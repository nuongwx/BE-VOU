/*
  Warnings:

  - You are about to drop the column `qr_code` on the `Voucher` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Voucher` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VoucherStatus" AS ENUM ('VALID', 'INVALID', 'USED');

-- AlterTable
ALTER TABLE "Voucher" DROP COLUMN "qr_code",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "VoucherStatus" NOT NULL DEFAULT 'VALID',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "voucherLine" (
    "id" SERIAL NOT NULL,
    "voucherId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "qr_code" TEXT NOT NULL,
    "status" "VoucherStatus" NOT NULL DEFAULT 'VALID',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "voucherLine_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "voucherLine" ADD CONSTRAINT "voucherLine_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES "Voucher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
