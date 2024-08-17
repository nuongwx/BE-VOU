import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { User as UserModel } from './models/user.model';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/jwt/jwt.strategy';

@Resolver(() => UserModel)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [UserModel])
  async getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Query(() => UserModel, { nullable: true })
  async getUser(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<User | null> {
    return this.userService.getUser(id);
  }

  @Mutation(() => UserModel)
  async createUser(@Args('data') data: CreateUserInput): Promise<User> {
    return this.userService.createUser(data);
  }

  @Mutation(() => UserModel)
  async updateUser(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') data: UpdateUserInput,
  ): Promise<User> {
    return this.userService.updateUser(id, data);
  }

  @Mutation(() => UserModel)
  async deleteUser(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return this.userService.deleteUser(id);
  }

  @Mutation(() => UserModel)
  async activateUser(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<User> {
    return this.userService.activateUser(id);
  }

  @Mutation(() => UserModel)
  async deactivateUser(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<User> {
    return this.userService.deactivateUser(id);
  }

  @Query(() => UserModel, { nullable: true })
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Context() context: any): Promise<User | null> {
    return this.userService.getUser(context.req.user.id);
    return context;
  }
}
