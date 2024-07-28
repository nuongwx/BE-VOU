import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PrismaService } from './prisma.service';
import { Prisma } from './entities/prisma.entity';
import { CreatePrismaInput } from './dto/create-prisma.input';
import { UpdatePrismaInput } from './dto/update-prisma.input';

@Resolver(() => Prisma)
export class PrismaResolver {
  constructor(private readonly prismaService: PrismaService) {}
}
