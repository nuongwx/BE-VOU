import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { GameService } from './game.service';
import { Game } from './entities/game.entity';
import { CreateGameInput } from './dto/create-game.input';
import { UpdateGameInput } from './dto/update-game.input';
import { Item } from 'src/item/entities/item.entity';
// import { ItemService } from 'src/item/item.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShakeUser } from 'src/user/entities/user.entity';

@Resolver(() => Game)
export class GameResolver {
  constructor(
    private readonly gameService: GameService,
    private readonly prisma: PrismaService,
  ) {}

  @Mutation(() => Game)
  createGame(@Args('createGameInput') createGameInput: CreateGameInput) {
    return this.gameService.create(createGameInput);
  }

  @Query(() => [Game], { name: 'games' })
  findAll(
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('offset', { type: () => Int, nullable: true }) offset?: number,
  ) {
    return this.gameService.findAll(limit, offset);
  }

  @Query(() => Game, { name: 'game' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.gameService.findOne(id);
  }

  @Mutation(() => Game)
  updateGame(@Args('updateGameInput') updateGameInput: UpdateGameInput) {
    return this.gameService.update(updateGameInput.id, updateGameInput);
  }

  @Mutation(() => Game)
  removeGame(@Args('id', { type: () => Int }) id: number) {
    return this.gameService.remove(id);
  }

  @ResolveField('items', () => [Item], { description: 'Game Items' })
  items(@Parent() game: Game) {
    return this.prisma.item.findMany({
      where: {
        games: {
          some: {
            id: game.id,
          },
        },
      },
    });
  }

  @ResolveField('users', () => [ShakeUser], { description: 'Game Users' })
  users(@Parent() game: Game) {
    return this.prisma.user.findMany({
      where: {
        gameId: game.id,
      },
    });
  }
}
