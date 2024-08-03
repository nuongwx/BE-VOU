import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { QuizGameService } from './quiz.service';
import { CreateQuizGameInput } from './dto/create-quiz.input';
import { UpdateQuizGameInput } from './dto/update-quiz.input';
import { QuizGameEntity } from './entities/quiz.entity';

@Resolver(() => QuizGameEntity)
export class QuizGameResolver {
  constructor(private readonly quizGameService: QuizGameService) {}

  @Mutation(() => QuizGameEntity)
  createQuizGame(
    @Args('createQuizGameInput') createQuizGameInput: CreateQuizGameInput,
  ) {
    return this.quizGameService.create(createQuizGameInput);
  }

  @Query(() => [QuizGameEntity], { name: 'quizGames' })
  findAll() {
    return this.quizGameService.findAll();
  }

  @Query(() => QuizGameEntity, { name: 'quizGame' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.quizGameService.findOne(id);
  }

  @Mutation(() => QuizGameEntity)
  updateQuizGame(
    @Args('updateQuizGameInput') updateQuizGameInput: UpdateQuizGameInput,
  ) {
    return this.quizGameService.update(
      updateQuizGameInput.id,
      updateQuizGameInput,
    );
  }

  @Mutation(() => QuizGameEntity)
  removeQuizGame(@Args('id', { type: () => Int }) id: number) {
    return this.quizGameService.remove(id);
  }

  @Mutation(() => Boolean)
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
  removeQuestionFromQuizGame(
    @Args('quizGameId', { type: () => Int }) quizGameId: number,
    @Args('questionId', { type: () => Int }) questionId: number,
  ) {
    return this.quizGameService.removeQuestionFromQuizGame(
      quizGameId,
      questionId,
    );
  }
}
