-- DropForeignKey
ALTER TABLE "QuizGameQuestion" DROP CONSTRAINT "QuizGameQuestion_correctAnswerId_fkey";

-- AlterTable
ALTER TABLE "QuizGameQuestion" ALTER COLUMN "correctAnswerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "QuizGameQuestion" ADD CONSTRAINT "QuizGameQuestion_correctAnswerId_fkey" FOREIGN KEY ("correctAnswerId") REFERENCES "QuizGameAnswer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
