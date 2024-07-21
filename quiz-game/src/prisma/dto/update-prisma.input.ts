import { CreatePrismaInput } from './create-prisma.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePrismaInput extends PartialType(CreatePrismaInput) {
  @Field(() => Int)
  id: number;
}
