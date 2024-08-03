import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AnswerService } from './answer.service';
import { QuizGameAnswerEntity } from './entities/answer.entity';
import { CreateAnswerInput } from './dto/create-answer.input';
import { UpdateAnswerInput } from './dto/update-answer.input';

@Resolver(() => QuizGameAnswerEntity)
export class AnswerResolver {
  constructor(private readonly answerService: AnswerService) {}

  @Mutation(() => QuizGameAnswerEntity)
  createAnswer(
    @Args('createAnswerInput') createAnswerInput: CreateAnswerInput,
  ) {
    return this.answerService.create(createAnswerInput);
  }

  @Query(() => [QuizGameAnswerEntity], { name: 'answers' })
  findAll() {
    return this.answerService.findAll();
  }

  @Query(() => QuizGameAnswerEntity, { name: 'answer' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.answerService.findOne(id);
  }

  @Mutation(() => QuizGameAnswerEntity)
  updateAnswer(
    @Args('updateAnswerInput') updateAnswerInput: UpdateAnswerInput,
  ) {
    return this.answerService.update(updateAnswerInput.id, updateAnswerInput);
  }

  @Mutation(() => QuizGameAnswerEntity)
  removeAnswer(@Args('id', { type: () => Int }) id: number) {
    return this.answerService.remove(id);
  }

  @Mutation(() => QuizGameAnswerEntity)
  async assignAnswerToQuestion(
    @Args('questionId', { type: () => Int }) questionId: number,
    @Args('answerId', { type: () => Int }) answerId: number,
  ) {
    return await this.answerService.assignAnswerToQuestion(
      questionId,
      answerId,
    );
  }
}
