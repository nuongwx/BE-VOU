import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { Game } from 'src/game/entities/game.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Request } from 'src/request/entities/request.entity';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
  ) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.userService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.userService.findOne(id);
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.remove(id);
  }

  @ResolveField('game', () => Game, { description: 'Game' })
  game(@Parent() user: User) {
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
  inventory(@Parent() user: User) {
    return this.prisma.inventory.findFirstOrThrow({
      where: {
        User: {
          id: user.id,
        },
      },
    });
  }

  @ResolveField('transactions', () => [Transaction], { description: 'Transactions' })
  transactions(@Parent() user: User) {
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
  requests(@Parent() user: User) {
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
}
