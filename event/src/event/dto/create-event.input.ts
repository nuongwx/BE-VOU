import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { EventStatus } from '@prisma/client';
import { Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

registerEnumType(EventStatus, {
  name: 'EventStatus',
});

@ValidatorConstraint({ name: 'isBefore', async: false })
export class IsBeforeConstraint implements ValidatorConstraintInterface {
  validate(propertyValue: string, args: ValidationArguments) {
    return propertyValue < args.object[args.constraints[0]];
  }

  defaultMessage(args: ValidationArguments) {
    return `"${args.property}" must be before "${args.constraints[0]}"`;
  }
}

export function IsBefore(date: string) {
  return Validate(IsBeforeConstraint, [date]);
}

@InputType()
export class CreateEventInput {
  @Field(() => String, { description: 'Event Name' })
  name: string;

  @Field(() => String, { description: 'Event Description', defaultValue: 'No Description' })
  description: string;

  @IsBefore('endAt')
  @Field(() => Date, { description: 'Event Begin Date', defaultValue: new Date(0) })
  beginAt: Date;

  @Field(() => Date, { description: 'Event End Date', defaultValue: new Date() })
  endAt: Date;

  @Field(() => EventStatus, { description: 'Event Status', defaultValue: EventStatus.INACTIVE })
  status: EventStatus;
}
