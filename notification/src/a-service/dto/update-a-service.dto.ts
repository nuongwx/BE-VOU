import { PartialType } from '@nestjs/mapped-types';
import { CreateAServiceDto } from './create-a-service.dto';

export class UpdateAServiceDto extends PartialType(CreateAServiceDto) {
  id: number;
}
