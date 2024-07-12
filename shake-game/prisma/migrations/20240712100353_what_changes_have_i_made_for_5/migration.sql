/*
  Warnings:

  - You are about to drop the column `transactionId` on the `InventoryItem` table. All the data in the column will be lost.
  - Added the required column `inventoryItemId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "InventoryItem" DROP CONSTRAINT "InventoryItem_transactionId_fkey";

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "lives" INTEGER NOT NULL DEFAULT 3;

-- AlterTable
ALTER TABLE "InventoryItem" DROP COLUMN "transactionId";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "inventoryItemId" INTEGER NOT NULL,
ADD COLUMN     "itemId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "InventoryItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
