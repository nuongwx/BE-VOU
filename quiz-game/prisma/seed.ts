import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Delete all existing data
  await prisma.quizGameQuestionToQuizGameMapping.deleteMany({});
  await prisma.quizGameQuestion.deleteMany({});
  await prisma.quizGameAnswer.deleteMany({});
  await prisma.quizGame.deleteMany({});

  console.log('Old data deleted.');

  // Seed QuizGames
  const quizGame1 = await prisma.quizGame.create({
    data: {
      gameName: 'Sample Quiz Game 1',
      startTime: new Date(),
      endTime: new Date(new Date().getTime() + 3600 * 1000), // 1 hour later
      playerQuantity: 10,
      companyId: 1,
    },
  });

  const quizGame2 = await prisma.quizGame.create({
    data: {
      gameName: 'Sample Quiz Game 2',
      startTime: new Date(),
      endTime: new Date(new Date().getTime() + 7200 * 1000), // 2 hours later
      playerQuantity: 20,
      companyId: 2,
    },
  });

  const quizGame3 = await prisma.quizGame.create({
    data: {
      gameName: 'Sample Quiz Game 3',
      startTime: new Date(),
      endTime: new Date(new Date().getTime() + 10800 * 1000), // 3 hours later
      playerQuantity: 30,
      companyId: 3,
    },
  });

  // Seed QuizGameQuestions and QuizGameAnswers
  const question1 = await prisma.quizGameQuestion.create({
    data: {
      content: 'What is the capital of France?',
      images: ['image1.png', 'image2.png'],
      answers: {
        create: [
          { content: 'Paris' },
          { content: 'Berlin' },
          { content: 'Madrid' },
        ],
      },
      correctAnswer: {
        create: { content: 'Paris' },
      },
    },
    include: {
      answers: true,
    },
  });

  const question2 = await prisma.quizGameQuestion.create({
    data: {
      content: 'What is 2 + 2?',
      images: [],
      answers: {
        create: [{ content: '3' }, { content: '4' }, { content: '5' }],
      },
      correctAnswer: {
        create: { content: '4' },
      },
    },
    include: {
      answers: true,
    },
  });

  const question3 = await prisma.quizGameQuestion.create({
    data: {
      content: 'What is the largest planet in our solar system?',
      images: ['jupiter.png'],
      answers: {
        create: [
          { content: 'Earth' },
          { content: 'Jupiter' },
          { content: 'Saturn' },
        ],
      },
      correctAnswer: {
        create: { content: 'Jupiter' },
      },
    },
    include: {
      answers: true,
    },
  });

  const question4 = await prisma.quizGameQuestion.create({
    data: {
      content: 'What is the square root of 64?',
      images: [],
      answers: {
        create: [{ content: '6' }, { content: '8' }, { content: '10' }],
      },
      correctAnswer: {
        create: { content: '8' },
      },
    },
    include: {
      answers: true,
    },
  });

  const question5 = await prisma.quizGameQuestion.create({
    data: {
      content: "Who wrote 'To be, or not to be'?",
      images: [],
      answers: {
        create: [
          { content: 'Charles Dickens' },
          { content: 'William Shakespeare' },
          { content: 'Mark Twain' },
        ],
      },
      correctAnswer: {
        create: { content: 'William Shakespeare' },
      },
    },
    include: {
      answers: true,
    },
  });

  // Update correctAnswerId for each question
  await prisma.quizGameQuestion.update({
    where: { id: question1.id },
    data: { correctAnswerId: question1.answers[0].id },
  });

  await prisma.quizGameQuestion.update({
    where: { id: question2.id },
    data: { correctAnswerId: question2.answers[1].id },
  });

  await prisma.quizGameQuestion.update({
    where: { id: question3.id },
    data: { correctAnswerId: question3.answers[1].id },
  });

  await prisma.quizGameQuestion.update({
    where: { id: question4.id },
    data: { correctAnswerId: question4.answers[1].id },
  });

  await prisma.quizGameQuestion.update({
    where: { id: question5.id },
    data: { correctAnswerId: question5.answers[1].id },
  });

  // Seed QuizGameQuestionToQuizGameMapping
  await prisma.quizGameQuestionToQuizGameMapping.createMany({
    data: [
      {
        quizGameId: quizGame1.id,
        quizQuestionId: question1.id,
      },
      {
        quizGameId: quizGame1.id,
        quizQuestionId: question2.id,
      },
      {
        quizGameId: quizGame1.id,
        quizQuestionId: question3.id,
      },
      {
        quizGameId: quizGame2.id,
        quizQuestionId: question2.id,
      },
      {
        quizGameId: quizGame2.id,
        quizQuestionId: question3.id,
      },
      {
        quizGameId: quizGame2.id,
        quizQuestionId: question4.id,
      },
      {
        quizGameId: quizGame3.id,
        quizQuestionId: question3.id,
      },
      {
        quizGameId: quizGame3.id,
        quizQuestionId: question4.id,
      },
      {
        quizGameId: quizGame3.id,
        quizQuestionId: question5.id,
      },
    ],
  });

  console.log('Database has been seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
