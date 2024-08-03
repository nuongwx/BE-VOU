/*
  Warnings:

  - You are about to drop the column `answers` on the `QuizGameQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `correctAnswer` on the `QuizGameQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `quizGameId` on the `QuizGameQuestion` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[correctAnswerId]` on the table `QuizGameQuestion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `correctAnswerId` to the `QuizGameQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "QuizGameQuestion" DROP CONSTRAINT "QuizGameQuestion_quizGameId_fkey";

-- AlterTable
ALTER TABLE "QuizGameAnswer" ADD COLUMN     "questionId" INTEGER;

-- AlterTable
ALTER TABLE "QuizGameQuestion" DROP COLUMN "answers",
DROP COLUMN "correctAnswer",
DROP COLUMN "quizGameId",
ADD COLUMN     "correctAnswerId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "QuizGameQuestionToQuizGameMapping" (
    "id" SERIAL NOT NULL,
    "quizQuestionId" INTEGER NOT NULL,
    "quizGameId" INTEGER NOT NULL,

    CONSTRAINT "QuizGameQuestionToQuizGameMapping_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuizGameQuestionToQuizGameMapping_quizGameId_quizQuestionId_key" ON "QuizGameQuestionToQuizGameMapping"("quizGameId", "quizQuestionId");

-- CreateIndex
CREATE UNIQUE INDEX "QuizGameQuestion_correctAnswerId_key" ON "QuizGameQuestion"("correctAnswerId");

-- AddForeignKey
ALTER TABLE "QuizGameQuestion" ADD CONSTRAINT "QuizGameQuestion_correctAnswerId_fkey" FOREIGN KEY ("correctAnswerId") REFERENCES "QuizGameAnswer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizGameAnswer" ADD CONSTRAINT "QuizGameAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuizGameQuestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizGameQuestionToQuizGameMapping" ADD CONSTRAINT "QuizGameQuestionToQuizGameMapping_quizGameId_fkey" FOREIGN KEY ("quizGameId") REFERENCES "QuizGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizGameQuestionToQuizGameMapping" ADD CONSTRAINT "QuizGameQuestionToQuizGameMapping_quizQuestionId_fkey" FOREIGN KEY ("quizQuestionId") REFERENCES "QuizGameQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
