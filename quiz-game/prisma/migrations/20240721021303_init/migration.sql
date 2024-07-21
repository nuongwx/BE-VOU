-- CreateTable
CREATE TABLE "QuizGame" (
    "id" SERIAL NOT NULL,
    "gameName" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "playerQuantity" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "QuizGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizGameQuestion" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "images" TEXT[],
    "answers" TEXT[],
    "correct_answer" TEXT NOT NULL,
    "quizGameId" INTEGER NOT NULL,

    CONSTRAINT "QuizGameQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizGameAnswer" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "QuizGameAnswer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuizGameQuestion" ADD CONSTRAINT "QuizGameQuestion_quizGameId_fkey" FOREIGN KEY ("quizGameId") REFERENCES "QuizGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
