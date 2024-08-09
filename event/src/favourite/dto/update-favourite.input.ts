import { CreateFavouriteInput } from './create-favourite.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateFavouriteInput extends PartialType(CreateFavouriteInput) {
  @Field(() => Int, { description: 'Favourite Id' })
  id: number;
}
