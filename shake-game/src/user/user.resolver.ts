import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { UserService } from './user.service';
import { ShakeUser } from './entities/user.entity';
import { CreateShakeUserInput } from './dto/create-user.input';
import { UpdateShakeUserInput } from './dto/update-user.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { Game } from 'src/game/entities/game.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Request } from 'src/request/entities/request.entity';

@Resolver(() => ShakeUser)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
  ) {}

  @Mutation(() => ShakeUser)
  createShakeUser(@Args('createShakeUserInput') createShakeUserInput: CreateShakeUserInput) {
    return this.userService.create(createShakeUserInput);
  }

  @Query(() => [ShakeUser], { name: 'users' })
  findAll() {
    return this.userService.findAll();
  }

  @Query(() => ShakeUser, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.userService.findOne(id);
  }

  @Mutation(() => ShakeUser)
  updateShakeUser(@Args('updateShakeUserInput') updateShakeUserInput: UpdateShakeUserInput) {
    return this.userService.update(updateShakeUserInput.id, updateShakeUserInput);
  }

  @Mutation(() => ShakeUser)
  removeShakeUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.remove(id);
  }

  @ResolveField('game', () => Game, { description: 'Game' })
  game(@Parent() user: ShakeUser) {
    return this.prisma.game.findFirstOrThrow({
      where: {
        users: {
          some: {
            id: user.id,
          },
        },
      },
    });
  }

  @ResolveField('inventory', () => Inventory, { description: 'Inventory' })
  inventory(@Parent() user: ShakeUser) {
    return this.prisma.inventory.findFirstOrThrow({
      where: {
        User: {
          id: user.id,
        },
      },
    });
  }

  @ResolveField('transactions', () => [Transaction], { description: 'Transactions' })
  transactions(@Parent() user: ShakeUser) {
    return this.prisma.transaction.findMany({
      where: {
        OR: [
          {
            senderId: user.id,
          },
          {
            receiverId: user.id,
          },
        ],
      },
    });
  }

  @ResolveField('requests', () => [Request], { description: 'Live Requests' })
  requests(@Parent() user: ShakeUser) {
    return this.prisma.request.findMany({
      where: {
        OR: [
          {
            senderId: user.id,
          },
          {
            receiverId: user.id,
          },
        ],
      },
    });
  }

  @ResolveField('redeems', () => [Request], { description: 'Redeems' })
  redeems(@Parent() user: ShakeUser) {
    return this.prisma.redeem.findMany({
      where: {
        userId: user.id,
      },
    });
  }
}
