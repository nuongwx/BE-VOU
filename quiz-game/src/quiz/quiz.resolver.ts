import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { QuizGameService } from './quiz.service';
import { CreateQuizGameInput } from './dto/create-quiz.input';
import { UpdateQuizGameInput } from './dto/update-quiz.input';
import { QuizGame } from './entities/quiz.entity';

@Resolver(() => QuizGame)
export class QuizGameResolver {
  constructor(private readonly quizGameService: QuizGameService) {}

  @Mutation(() => QuizGame)
  createQuizGame(
    @Args('createQuizGameInput') createQuizGameInput: CreateQuizGameInput,
  ) {
    return this.quizGameService.create(createQuizGameInput);
  }

  @Query(() => [QuizGame], { name: 'quizGames' })
  findAll() {
    return this.quizGameService.findAll();
  }

  @Query(() => QuizGame, { name: 'quizGame' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.quizGameService.findOne(id);
  }

  @Mutation(() => QuizGame)
  updateQuizGame(
    @Args('updateQuizGameInput') updateQuizGameInput: UpdateQuizGameInput,
  ) {
    return this.quizGameService.update(
      updateQuizGameInput.id,
      updateQuizGameInput,
    );
  }

  @Mutation(() => QuizGame)
  removeQuizGame(@Args('id', { type: () => Int }) id: number) {
    return this.quizGameService.remove(id);
  }
}
