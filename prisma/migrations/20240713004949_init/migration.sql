-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'staff', 'player');

-- CreateEnum
CREATE TYPE "OTPMethod" AS ENUM ('email', 'phone');

-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('male', 'female', 'other');

-- CreateEnum
CREATE TYPE "BrandCategory" AS ENUM ('medical', 'education', 'food');

-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "CollectionStatus" AS ENUM ('active', 'inactive');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "userName" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatar" TEXT,
    "role" "UserRole" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT,
    "facebookAccount" TEXT,
    "OTP" TEXT,
    "OTP_method" "OTPMethod",
    "dateOfBirth" TIMESTAMP(3),
    "sex" "Sex",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" SERIAL NOT NULL,
    "address" TEXT,
    "category" "BrandCategory" NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "status" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrandToStaffMapping" (
    "id" SERIAL NOT NULL,
    "staffId" INTEGER NOT NULL,
    "brandId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrandToStaffMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizGame" (
    "id" SERIAL NOT NULL,
    "gameName" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "playerQuantity" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuizGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizGameQuestion" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "images" TEXT[],
    "answer" TEXT[],
    "correct_answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuizGameQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizGameAnswer" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuizGameAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizGameQuestionToQuizGameMapping" (
    "id" SERIAL NOT NULL,
    "quizQuestionId" INTEGER NOT NULL,
    "quizGameId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuizGameQuestionToQuizGameMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameToUserMapping" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameToUserMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShakeGame" (
    "id" SERIAL NOT NULL,
    "gameName" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "playerQuantity" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,
    "items" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShakeGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "images" TEXT[],
    "content" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "status" "ItemStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "images" TEXT[],
    "vouchers" TEXT[],
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "brands" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Voucher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" SERIAL NOT NULL,
    "items" TEXT[],
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "status" "CollectionStatus" NOT NULL,
    "brandId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "donationTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameToPlayerMapping" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "liveCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameToPlayerMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemToPlayerMapping" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemToPlayerMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventToPlayerMapping" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventToPlayerMapping_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BrandToStaffMapping_staffId_brandId_key" ON "BrandToStaffMapping"("staffId", "brandId");

-- CreateIndex
CREATE UNIQUE INDEX "QuizGameQuestionToQuizGameMapping_quizQuestionId_quizGameId_key" ON "QuizGameQuestionToQuizGameMapping"("quizQuestionId", "quizGameId");

-- CreateIndex
CREATE UNIQUE INDEX "GameToUserMapping_userId_gameId_key" ON "GameToUserMapping"("userId", "gameId");

-- CreateIndex
CREATE UNIQUE INDEX "GameToPlayerMapping_gameId_playerId_key" ON "GameToPlayerMapping"("gameId", "playerId");

-- CreateIndex
CREATE UNIQUE INDEX "ItemToPlayerMapping_gameId_playerId_itemId_key" ON "ItemToPlayerMapping"("gameId", "playerId", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "EventToPlayerMapping_playerId_eventId_key" ON "EventToPlayerMapping"("playerId", "eventId");

-- AddForeignKey
ALTER TABLE "BrandToStaffMapping" ADD CONSTRAINT "BrandToStaffMapping_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandToStaffMapping" ADD CONSTRAINT "BrandToStaffMapping_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizGameQuestionToQuizGameMapping" ADD CONSTRAINT "QuizGameQuestionToQuizGameMapping_quizGameId_fkey" FOREIGN KEY ("quizGameId") REFERENCES "QuizGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizGameQuestionToQuizGameMapping" ADD CONSTRAINT "QuizGameQuestionToQuizGameMapping_quizQuestionId_fkey" FOREIGN KEY ("quizQuestionId") REFERENCES "QuizGameQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameToUserMapping" ADD CONSTRAINT "GameToUserMapping_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameToUserMapping" ADD CONSTRAINT "GameToUserMapping_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "QuizGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_id_fkey" FOREIGN KEY ("id") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "QuizGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameToPlayerMapping" ADD CONSTRAINT "GameToPlayerMapping_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameToPlayerMapping" ADD CONSTRAINT "GameToPlayerMapping_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "QuizGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemToPlayerMapping" ADD CONSTRAINT "ItemToPlayerMapping_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemToPlayerMapping" ADD CONSTRAINT "ItemToPlayerMapping_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemToPlayerMapping" ADD CONSTRAINT "ItemToPlayerMapping_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "QuizGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventToPlayerMapping" ADD CONSTRAINT "EventToPlayerMapping_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventToPlayerMapping" ADD CONSTRAINT "EventToPlayerMapping_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
