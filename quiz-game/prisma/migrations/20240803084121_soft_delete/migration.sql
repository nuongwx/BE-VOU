-- AlterTable
ALTER TABLE "QuizGame" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "QuizGameAnswer" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "QuizGameQuestion" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
