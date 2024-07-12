/*
  Warnings:

  - You are about to drop the column `gameId` on the `Item` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_gameId_fkey";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "gameId";

-- CreateTable
CREATE TABLE "_GameToItem" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GameToItem_AB_unique" ON "_GameToItem"("A", "B");

-- CreateIndex
CREATE INDEX "_GameToItem_B_index" ON "_GameToItem"("B");

-- AddForeignKey
ALTER TABLE "_GameToItem" ADD CONSTRAINT "_GameToItem_A_fkey" FOREIGN KEY ("A") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameToItem" ADD CONSTRAINT "_GameToItem_B_fkey" FOREIGN KEY ("B") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
