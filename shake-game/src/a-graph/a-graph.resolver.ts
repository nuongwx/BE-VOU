import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AGraphService } from './a-graph.service';
import { AGraph } from './entities/a-graph.entity';
import { CreateAGraphInput } from './dto/create-a-graph.input';
import { UpdateAGraphInput } from './dto/update-a-graph.input';

@Resolver(() => AGraph)
export class AGraphResolver {
  constructor(private readonly aGraphService: AGraphService) {}

  @Mutation(() => AGraph)
  createAGraph(
    @Args('createAGraphInput') createAGraphInput: CreateAGraphInput,
  ) {
    return this.aGraphService.create(createAGraphInput);
  }

  @Query(() => [AGraph], { name: 'aGraph' })
  findAll() {
    return this.aGraphService.findAll();
  }

  @Query(() => AGraph, { name: 'aGraph' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.aGraphService.findOne(id);
  }

  @Mutation(() => AGraph)
  updateAGraph(
    @Args('updateAGraphInput') updateAGraphInput: UpdateAGraphInput,
  ) {
    return this.aGraphService.update(updateAGraphInput.id, updateAGraphInput);
  }

  @Mutation(() => AGraph)
  removeAGraph(@Args('id', { type: () => Int }) id: number) {
    return this.aGraphService.remove(id);
  }
}
