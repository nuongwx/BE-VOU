import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
// import { UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from 'src/jwt/jwt.strategy';

@Resolver(() => UserEntity)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [UserEntity])
  async getUsers() {
    return this.userService.getUsers();
  }

  @Query(() => UserEntity, { nullable: true })
  async getUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.getUser(id);
  }

  @Mutation(() => UserEntity)
  async createUser(@Args('data') data: CreateUserInput) {
    return this.userService.createUser(data);
  }

  @Mutation(() => UserEntity)
  async updateUser(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') data: UpdateUserInput,
  ) {
    return this.userService.updateUser(id, data);
  }

  @Mutation(() => UserEntity)
  async deleteUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.deleteUser(id);
  }

  @Mutation(() => UserEntity)
  async activateUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.activateUser(id);
  }

  @Mutation(() => UserEntity)
  async deactivateUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.deactivateUser(id);
  }

  @Query(() => UserEntity, { nullable: true })
  // @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Context() context: any) {
    return this.userService.getUser(context.req.user.id);
  }

  @Query(() => [UserEntity])
  async getAllPlayers() {
    return this.userService.getAllPlayers();
  }

  @Query(() => [UserEntity])
  async getAllBrands() {
    return this.userService.getAllBrands();
  }
}
