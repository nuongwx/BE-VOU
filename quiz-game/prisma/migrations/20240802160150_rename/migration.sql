/*
  Warnings:

  - You are about to drop the column `correct_answer` on the `QuizGameQuestion` table. All the data in the column will be lost.
  - Added the required column `correctAnswer` to the `QuizGameQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QuizGameQuestion" DROP COLUMN "correct_answer",
ADD COLUMN     "correctAnswer" INTEGER NOT NULL;
