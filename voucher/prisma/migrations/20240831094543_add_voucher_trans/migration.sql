-- CreateTable
CREATE TABLE "voucherTrans" (
    "id" SERIAL NOT NULL,
    "voucherId" INTEGER NOT NULL,
    "from_user" INTEGER NOT NULL,
    "to_user" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "voucherTrans_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "voucherTrans" ADD CONSTRAINT "voucherTrans_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES "Voucher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
