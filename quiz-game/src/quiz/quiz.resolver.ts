import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { QuizGameService } from './quiz.service';
import { CreateQuizGameInput } from './dto/create-quiz.input';
import { UpdateQuizGameInput } from './dto/update-quiz.input';
import { QuizGameEntity } from './entities/quiz.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Resolver(() => QuizGameEntity)
export class QuizGameResolver {
  constructor(private readonly quizGameService: QuizGameService) {}

  @Mutation(() => QuizGameEntity)
  // @UseGuards(JwtAuthGuard)
  createQuizGame(
    @Args('createQuizGameInput') createQuizGameInput: CreateQuizGameInput,
  ) {
    return this.quizGameService.create(createQuizGameInput);
  }

  @Query(() => [QuizGameEntity], { name: 'quizGames' })
  findAll(
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('offset', { type: () => Int, nullable: true }) offset?: number,
  ) {
    return this.quizGameService.findAll(limit, offset);
  }

  @Query(() => QuizGameEntity, { name: 'quizGame' })
  // @UseGuards(JwtAuthGuard)
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.quizGameService.findOne(id);
  }

  @Mutation(() => QuizGameEntity)
  // @UseGuards(JwtAuthGuard)
  updateQuizGame(
    @Args('updateQuizGameInput') updateQuizGameInput: UpdateQuizGameInput,
  ) {
    return this.quizGameService.update(
      updateQuizGameInput.id,
      updateQuizGameInput,
    );
  }

  @Mutation(() => QuizGameEntity)
  // @UseGuards(JwtAuthGuard)
  removeQuizGame(@Args('id', { type: () => Int }) id: number) {
    return this.quizGameService.remove(id);
  }

  @Mutation(() => Boolean)
  // @UseGuards(JwtAuthGuard)
  assignQuestionsToQuizGame(
    @Args('quizGameId', { type: () => Int }) quizGameId: number,
    @Args('questionIds', { type: () => [Int] }) questionIds: number[],
  ) {
    return this.quizGameService.assignQuestionsToQuizGame(
      quizGameId,
      questionIds,
    );
  }

  @Mutation(() => Boolean)
  // @UseGuards(JwtAuthGuard)
  removeQuestionFromQuizGame(
    @Args('quizGameId', { type: () => Int }) quizGameId: number,
    @Args('questionId', { type: () => Int }) questionId: number,
  ) {
    return this.quizGameService.removeQuestionFromQuizGame(
      quizGameId,
      questionId,
    );
  }

  @Query(() => [QuizGameEntity], { name: 'findQuizByUser' })
  // @UseGuards(JwtAuthGuard)
  findQuizByUser(@Args('userId', { type: () => Int }) userId: number) {
    return this.quizGameService.findAll(2, 0);
  }
}
