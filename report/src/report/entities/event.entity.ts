import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';

@ObjectType()
export class Event {
  @Field(() => Int, { description: 'Event Id' })
  id: number;

  @Field(() => String, { description: 'Event Name' })
  name: string;

  @Field(() => String, { description: 'Event Description' })
  description: string;

  @Field(() => Date, { description: 'Event Begin Date' })
  beginAt: Date;

  @Field(() => Date, { description: 'Event End Date' })
  endAt: Date;
}
