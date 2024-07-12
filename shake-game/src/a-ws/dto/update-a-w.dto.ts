import { PartialType } from '@nestjs/mapped-types';
import { CreateAWDto } from './create-a-w.dto';

export class UpdateAWDto extends PartialType(CreateAWDto) {
  id: number;
}
