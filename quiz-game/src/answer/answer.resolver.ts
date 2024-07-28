import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AnswerService } from './answer.service';
import { QuizGameAnswer } from './entities/answer.entity';
import { CreateAnswerInput } from './dto/create-answer.input';
import { UpdateAnswerInput } from './dto/update-answer.input';

@Resolver(() => QuizGameAnswer)
export class AnswerResolver {
  constructor(private readonly answerService: AnswerService) {}

  @Mutation(() => QuizGameAnswer)
  createAnswer(
    @Args('createAnswerInput') createAnswerInput: CreateAnswerInput,
  ) {
    return this.answerService.create(createAnswerInput);
  }

  @Query(() => [QuizGameAnswer], { name: 'answers' })
  findAll() {
    return this.answerService.findAll();
  }

  @Query(() => QuizGameAnswer, { name: 'answer' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.answerService.findOne(id);
  }

  @Mutation(() => QuizGameAnswer)
  updateAnswer(
    @Args('updateAnswerInput') updateAnswerInput: UpdateAnswerInput,
  ) {
    return this.answerService.update(updateAnswerInput.id, updateAnswerInput);
  }

  @Mutation(() => QuizGameAnswer)
  removeAnswer(@Args('id', { type: () => Int }) id: number) {
    return this.answerService.remove(id);
  }
}
