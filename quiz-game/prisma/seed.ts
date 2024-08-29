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
  const questionsData = [
    // Original 15 questions
    {
      content: 'What is the capital of France?',
      images: ['image1.png', 'image2.png'],
      answers: ['Paris', 'Berlin', 'Madrid'],
      correctAnswer: 'Paris',
    },
    {
      content: 'What is 2 + 2?',
      images: [],
      answers: ['3', '4', '5'],
      correctAnswer: '4',
    },
    {
      content: 'What is the largest planet in our solar system?',
      images: ['jupiter.png'],
      answers: ['Earth', 'Jupiter', 'Saturn'],
      correctAnswer: 'Jupiter',
    },
    {
      content: 'What is the square root of 64?',
      images: [],
      answers: ['6', '8', '10'],
      correctAnswer: '8',
    },
    {
      content: "Who wrote 'To be, or not to be'?",
      images: [],
      answers: ['Charles Dickens', 'William Shakespeare', 'Mark Twain'],
      correctAnswer: 'William Shakespeare',
    },
    {
      content: 'What is the chemical symbol for water?',
      images: [],
      answers: ['O2', 'H2O', 'CO2'],
      correctAnswer: 'H2O',
    },
    {
      content: 'Who developed the theory of relativity?',
      images: [],
      answers: ['Isaac Newton', 'Albert Einstein', 'Galileo Galilei'],
      correctAnswer: 'Albert Einstein',
    },
    {
      content: 'What is the capital of Japan?',
      images: [],
      answers: ['Tokyo', 'Kyoto', 'Osaka'],
      correctAnswer: 'Tokyo',
    },
    {
      content: 'What is the tallest mountain in the world?',
      images: [],
      answers: ['K2', 'Mount Everest', 'Kangchenjunga'],
      correctAnswer: 'Mount Everest',
    },
    {
      content: 'What is the largest desert in the world?',
      images: [],
      answers: ['Sahara Desert', 'Gobi Desert', 'Kalahari Desert'],
      correctAnswer: 'Sahara Desert',
    },
    {
      content: 'What is the capital of Canada?',
      images: [],
      answers: ['Ottawa', 'Toronto', 'Vancouver'],
      correctAnswer: 'Ottawa',
    },
    {
      content: 'Who painted the Mona Lisa?',
      images: [],
      answers: ['Leonardo da Vinci', 'Vincent van Gogh', 'Pablo Picasso'],
      correctAnswer: 'Leonardo da Vinci',
    },
    {
      content: 'What is the main ingredient in guacamole?',
      images: [],
      answers: ['Tomato', 'Avocado', 'Cucumber'],
      correctAnswer: 'Avocado',
    },
    {
      content: 'What is the smallest continent by land area?',
      images: [],
      answers: ['Europe', 'Australia', 'Antarctica'],
      correctAnswer: 'Australia',
    },
    {
      content: 'Which planet is closest to the sun?',
      images: [],
      answers: ['Mercury', 'Venus', 'Earth'],
      correctAnswer: 'Mercury',
    },
    // 30 new questions
    {
      content: 'Which ocean is the largest?',
      images: [],
      answers: ['Atlantic Ocean', 'Indian Ocean', 'Pacific Ocean'],
      correctAnswer: 'Pacific Ocean',
    },
    {
      content: 'What is the capital of Italy?',
      images: [],
      answers: ['Rome', 'Milan', 'Naples'],
      correctAnswer: 'Rome',
    },
    {
      content: 'Who is known as the "Father of Computers"?',
      images: [],
      answers: ['Charles Babbage', 'Alan Turing', 'John von Neumann'],
      correctAnswer: 'Charles Babbage',
    },
    {
      content: 'Which country is known as the Land of the Rising Sun?',
      images: [],
      answers: ['China', 'Japan', 'South Korea'],
      correctAnswer: 'Japan',
    },
    {
      content: 'Who invented the telephone?',
      images: [],
      answers: ['Alexander Graham Bell', 'Thomas Edison', 'Nikola Tesla'],
      correctAnswer: 'Alexander Graham Bell',
    },
    {
      content: 'Which element has the atomic number 1?',
      images: [],
      answers: ['Hydrogen', 'Oxygen', 'Helium'],
      correctAnswer: 'Hydrogen',
    },
    {
      content: 'What is the capital of Spain?',
      images: [],
      answers: ['Madrid', 'Barcelona', 'Valencia'],
      correctAnswer: 'Madrid',
    },
    {
      content: 'Which metal is liquid at room temperature?',
      images: [],
      answers: ['Mercury', 'Gold', 'Silver'],
      correctAnswer: 'Mercury',
    },
    {
      content: 'What is the capital of Russia?',
      images: [],
      answers: ['Moscow', 'Saint Petersburg', 'Novosibirsk'],
      correctAnswer: 'Moscow',
    },
    {
      content: 'Who discovered penicillin?',
      images: [],
      answers: ['Alexander Fleming', 'Marie Curie', 'Isaac Newton'],
      correctAnswer: 'Alexander Fleming',
    },
    {
      content: 'What is the main component of the sun?',
      images: [],
      answers: ['Oxygen', 'Hydrogen', 'Helium'],
      correctAnswer: 'Hydrogen',
    },
    {
      content: 'Which country is known as the Pearl of the Indian Ocean?',
      images: [],
      answers: ['Maldives', 'Sri Lanka', 'Mauritius'],
      correctAnswer: 'Sri Lanka',
    },
    {
      content: 'What is the hardest natural substance on Earth?',
      images: [],
      answers: ['Diamond', 'Gold', 'Silver'],
      correctAnswer: 'Diamond',
    },
    {
      content: 'Which continent is known as the "Dark Continent"?',
      images: [],
      answers: ['Asia', 'Africa', 'South America'],
      correctAnswer: 'Africa',
    },
    {
      content: 'What is the currency of the United Kingdom?',
      images: [],
      answers: ['Pound Sterling', 'Euro', 'Dollar'],
      correctAnswer: 'Pound Sterling',
    },
    {
      content: 'Which is the longest river in the world?',
      images: [],
      answers: ['Nile', 'Amazon', 'Yangtze'],
      correctAnswer: 'Nile',
    },
    {
      content: 'Who was the first person to walk on the moon?',
      images: [],
      answers: ['Yuri Gagarin', 'Neil Armstrong', 'Buzz Aldrin'],
      correctAnswer: 'Neil Armstrong',
    },
    {
      content: "What is the most abundant gas in Earth's atmosphere?",
      images: [],
      answers: ['Oxygen', 'Nitrogen', 'Carbon Dioxide'],
      correctAnswer: 'Nitrogen',
    },
    {
      content: 'What is the largest mammal in the world?',
      images: [],
      answers: ['Elephant', 'Blue Whale', 'Giraffe'],
      correctAnswer: 'Blue Whale',
    },
    {
      content: 'What is the main language spoken in Brazil?',
      images: [],
      answers: ['Spanish', 'English', 'Portuguese'],
      correctAnswer: 'Portuguese',
    },
    {
      content: 'Which planet is known as the Red Planet?',
      images: [],
      answers: ['Mars', 'Venus', 'Mercury'],
      correctAnswer: 'Mars',
    },
    {
      content: 'What is the capital of Germany?',
      images: [],
      answers: ['Berlin', 'Munich', 'Hamburg'],
      correctAnswer: 'Berlin',
    },
    {
      content: 'Who wrote "Pride and Prejudice"?',
      images: [],
      answers: ['Jane Austen', 'Charlotte Bronte', 'Emily Bronte'],
      correctAnswer: 'Jane Austen',
    },
    {
      content: 'Who invented the World Wide Web?',
      images: [],
      answers: ['Tim Berners-Lee', 'Bill Gates', 'Steve Jobs'],
      correctAnswer: 'Tim Berners-Lee',
    },
    {
      content: 'What is the smallest prime number?',
      images: [],
      answers: ['1', '2', '3'],
      correctAnswer: '2',
    },
    {
      content: 'What is the largest bone in the human body?',
      images: [],
      answers: ['Femur', 'Tibia', 'Fibula'],
      correctAnswer: 'Femur',
    },
    {
      content: 'What is the capital of Australia?',
      images: [],
      answers: ['Canberra', 'Sydney', 'Melbourne'],
      correctAnswer: 'Canberra',
    },
    {
      content: 'Which country hosted the first modern Olympics?',
      images: [],
      answers: ['Greece', 'France', 'USA'],
      correctAnswer: 'Greece',
    },
    {
      content: 'What year did the Titanic sink?',
      images: [],
      answers: ['1912', '1905', '1898'],
      correctAnswer: '1912',
    },
    {
      content: 'What is the chemical symbol for gold?',
      images: [],
      answers: ['Au', 'Ag', 'Pb'],
      correctAnswer: 'Au',
    },
  ];

  const questions = [];

  for (const data of questionsData) {
    // Create the question without setting correctAnswer
    const question = await prisma.quizGameQuestion.create({
      data: {
        content: data.content,
        images: data.images,
        correctAnswerId: null, // This will be updated later
      },
    });

    // Create the actual answers
    const createdAnswers = await prisma.quizGameAnswer.createMany({
      data: data.answers.map((answer) => ({
        content: answer,
        questionId: question.id,
      })),
    });

    // Find the correct answer based on content
    const correctAnswer = await prisma.quizGameAnswer.findFirst({
      where: {
        content: data.correctAnswer,
        questionId: question.id,
      },
    });

    // Update the correctAnswerId in the question
    await prisma.quizGameQuestion.update({
      where: { id: question.id },
      data: { correctAnswerId: correctAnswer!.id },
    });

    // Save the question object for later use in mappings
    questions.push(question);
  }

  // Seed QuizGameQuestionToQuizGameMapping
  const quizGames = [quizGame1, quizGame2, quizGame3];
  const mappings = [];

  questions.forEach((question, index) => {
    quizGames.forEach((quizGame, gameIndex) => {
      if (index % quizGames.length === gameIndex) {
        mappings.push({
          quizGameId: quizGame.id,
          quizQuestionId: question.id,
        });
      }
    });
  });

  await prisma.quizGameQuestionToQuizGameMapping.createMany({
    data: mappings,
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
