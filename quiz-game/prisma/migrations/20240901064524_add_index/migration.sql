/*
  Warnings:

  - Added the required column `orderIndex` to the `QuizGameQuestionToQuizGameMapping` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QuizGameQuestionToQuizGameMapping" ADD COLUMN     "orderIndex" INTEGER NOT NULL;
