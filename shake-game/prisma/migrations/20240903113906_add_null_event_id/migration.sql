/*
  Warnings:

  - A unique constraint covering the columns `[gameId,authUserId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `image` on table `Item` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "eventId" DROP NOT NULL,
ALTER COLUMN "eventId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "image" SET NOT NULL,
ALTER COLUMN "image" SET DEFAULT 'https://dummyimage.com/96x96/000/fff&text=Item';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "authUserId" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_gameId_authUserId_key" ON "User"("gameId", "authUserId");
