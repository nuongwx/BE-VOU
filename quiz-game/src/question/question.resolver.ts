import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { QuestionService } from './question.service';
import { QuizGameQuestionEntity } from './entities/question.entity';
import { CreateQuestionInput } from './dto/create-question.input';
import { UpdateQuestionInput } from './dto/update-question.input';
import GraphQLJSON from 'graphql-type-json';
import { QuizGameAnswerEntity } from '../answer/entities/answer.entity';

@Resolver(() => QuizGameQuestionEntity)
export class QuestionResolver {
  constructor(private readonly questionService: QuestionService) {}

  @Mutation(() => QuizGameQuestionEntity)
  createQuestion(
    @Args('createQuestionInput') createQuestionInput: CreateQuestionInput,
  ) {
    return this.questionService.create(createQuestionInput);
  }

  @Query(() => [QuizGameQuestionEntity], { name: 'questions' })
  findAll() {
    return this.questionService.findAll();
  }

  @Query(() => QuizGameQuestionEntity, { name: 'question' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.questionService.findOne(id);
  }

  @Mutation(() => QuizGameQuestionEntity)
  updateQuestion(
    @Args('updateQuestionInput') updateQuestionInput: UpdateQuestionInput,
  ) {
    return this.questionService.update(
      updateQuestionInput.id,
      updateQuestionInput,
    );
  }

  @Mutation(() => QuizGameQuestionEntity)
  removeQuestion(@Args('id', { type: () => Int }) id: number) {
    return this.questionService.remove(id);
  }

  @Query(() => [QuizGameQuestionEntity], { name: 'generateRandomQuestions' })
  generateRandomQuestions(@Args('length', { type: () => Int }) length: number) {
    return this.questionService.generateRandomQuestions(length);
  }

  @Query(() => Boolean, { name: 'checkAnswer' })
  checkAnswer(
    @Args('questionId', { type: () => Int }) questionId: number,
    @Args('answer', { type: () => GraphQLJSON }) answer: QuizGameAnswerEntity,
  ) {
    return this.questionService.checkAnswer(questionId, answer);
  }
}
