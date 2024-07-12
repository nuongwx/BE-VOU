import { Injectable } from '@nestjs/common';
import { CreateARestDto } from './dto/create-a-rest.dto';
import { UpdateARestDto } from './dto/update-a-rest.dto';

@Injectable()
export class ARestService {
  create(createARestDto: CreateARestDto) {
    return 'This action adds a new aRest';
  }

  findAll() {
    return `This action returns all aRest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} aRest`;
  }

  update(id: number, updateARestDto: UpdateARestDto) {
    return `This action updates a #${id} aRest`;
  }

  remove(id: number) {
    return `This action removes a #${id} aRest`;
  }
}
