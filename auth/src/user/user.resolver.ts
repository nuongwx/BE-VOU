import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { User as UserModel } from './models/user.model';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver(of => UserModel)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(returns => [UserModel])
  async getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Query(returns => UserModel, { nullable: true })
  async getUser(@Args('id', { type: () => Int }) id: number): Promise<User | null> {
    return this.userService.getUser(id);
  }

  @Mutation(returns => UserModel)
  async createUser(@Args('data') data: CreateUserInput): Promise<User> {
    return this.userService.createUser(data);
  }

  @Mutation(returns => UserModel)
  async updateUser(@Args('id', { type: () => Int }) id: number, @Args('data') data: UpdateUserInput): Promise<User> {
    return this.userService.updateUser(id, data);
  }

  @Mutation(returns => UserModel)
  async deleteUser(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return this.userService.deleteUser(id);
  }

  @Mutation(returns => UserModel)
  async activateUser(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return this.userService.activateUser(id);
  }

  @Mutation(returns => UserModel)
  async deactivateUser(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return this.userService.deactivateUser(id);
  }
}
