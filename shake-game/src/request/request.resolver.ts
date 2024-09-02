import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { RequestService } from './request.service';
import { Request } from './entities/request.entity';
import { CreateRequestInput } from './dto/create-request.input';
import { UpdateRequestInput } from './dto/update-request.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShakeUser } from 'src/user/entities/user.entity';

@Resolver(() => Request)
export class RequestResolver {
  constructor(
    private readonly requestService: RequestService,
    private readonly prisma: PrismaService,
  ) {}

  @Mutation(() => Request)
  createRequest(@Args('createRequestInput') createRequestInput: CreateRequestInput) {
    return this.requestService.create(createRequestInput);
  }

  @Query(() => [Request], { name: 'requests' })
  findAll() {
    return this.requestService.findAll();
  }

  @Query(() => Request, { name: 'request' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.requestService.findOne(id);
  }

  @Mutation(() => Request)
  updateRequest(@Args('updateRequestInput') updateRequestInput: UpdateRequestInput) {
    return this.requestService.update(updateRequestInput.id, updateRequestInput);
  }

  @Mutation(() => Request)
  removeRequest(@Args('id', { type: () => Int }) id: number) {
    return this.requestService.remove(id);
  }

  @ResolveField('sender', () => ShakeUser, { description: 'Request Sender' })
  sender(@Parent() request: Request) {
    return this.prisma.user.findUniqueOrThrow({
      where: {
        id: request.senderId,
      },
    });
  }

  @ResolveField('receiver', () => ShakeUser, { description: 'Request Receiver' })
  receiver(@Parent() request: Request) {
    return this.prisma.user.findUniqueOrThrow({
      where: {
        id: request.receiverId,
      },
    });
  }
}
