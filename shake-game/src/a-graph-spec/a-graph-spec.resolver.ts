import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AGraphSpecService } from './a-graph-spec.service';
import { AGraphSpec } from './entities/a-graph-spec.entity';
import { CreateAGraphSpecInput } from './dto/create-a-graph-spec.input';
import { UpdateAGraphSpecInput } from './dto/update-a-graph-spec.input';

@Resolver(() => AGraphSpec)
export class AGraphSpecResolver {
  constructor(private readonly aGraphSpecService: AGraphSpecService) {}

  @Mutation(() => AGraphSpec)
  createAGraphSpec(@Args('createAGraphSpecInput') createAGraphSpecInput: CreateAGraphSpecInput) {
    return this.aGraphSpecService.create(createAGraphSpecInput);
  }

  @Query(() => [AGraphSpec], { name: 'aGraphSpec' })
  findAll() {
    return this.aGraphSpecService.findAll();
  }

  @Query(() => AGraphSpec, { name: 'aGraphSpec' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.aGraphSpecService.findOne(id);
  }

  @Mutation(() => AGraphSpec)
  updateAGraphSpec(@Args('updateAGraphSpecInput') updateAGraphSpecInput: UpdateAGraphSpecInput) {
    return this.aGraphSpecService.update(updateAGraphSpecInput.id, updateAGraphSpecInput);
  }

  @Mutation(() => AGraphSpec)
  removeAGraphSpec(@Args('id', { type: () => Int }) id: number) {
    return this.aGraphSpecService.remove(id);
  }
}
