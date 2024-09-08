import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { EventStatus } from '@prisma/client';

registerEnumType(EventStatus, {
  name: 'EventStatus',
});

@ObjectType()
export class Event {
  @Field(() => Int, { description: 'Event Id' })
  id: number;

  @Field(() => String, { description: 'Event Name', nullable: true })
  name: string;

  @Field(() => String, { description: 'Event Description', nullable: true })
  description: string;

  @Field(() => Date, { description: 'Event Begin Date', nullable: true })
  beginAt: Date;

  @Field(() => Date, { description: 'Event End Date', nullable: true })
  endAt: Date;

  @Field(() => EventStatus, { description: 'Event Status', nullable: true })
  status: EventStatus;

  @Field(() => String, { description: 'Event Image URL', nullable: true })
  imageUrl: string;

  @Field(() => [Int], { nullable: true }) // point to user id
  brands: number[];

  @Field(() => [Int], { nullable: true }) // point to user id
  vouchers: number[];

  @Field(() => [Int], { nullable: true })
  quizGameIds?: number[];

  @Field(() => [Int], { nullable: true })
  shakeGameIds?: number[];
}
