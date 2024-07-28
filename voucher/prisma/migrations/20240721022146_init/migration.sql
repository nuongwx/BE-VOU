-- CreateTable
CREATE TABLE "Voucher" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "qr_code" TEXT NOT NULL,
    "images" TEXT[],
    "value" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Voucher_pkey" PRIMARY KEY ("id")
);
