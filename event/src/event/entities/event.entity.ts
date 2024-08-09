import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { EventStatus } from '@prisma/client';

registerEnumType(EventStatus, {
  name: 'EventStatus',
});

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

  @Field(() => EventStatus, { description: 'Event Status' })
  status: EventStatus;
}
