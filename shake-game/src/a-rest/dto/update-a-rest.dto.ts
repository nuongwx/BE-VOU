import { PartialType } from '@nestjs/mapped-types';
import { CreateARestDto } from './create-a-rest.dto';

export class UpdateARestDto extends PartialType(CreateARestDto) {}
