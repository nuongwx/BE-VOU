import { Injectable } from '@nestjs/common';
import { CreateAGraphSpecInput } from './dto/create-a-graph-spec.input';
import { UpdateAGraphSpecInput } from './dto/update-a-graph-spec.input';

@Injectable()
export class AGraphSpecService {
  create(createAGraphSpecInput: CreateAGraphSpecInput) {
    return 'This action adds a new aGraphSpec';
  }

  findAll() {
    return `This action returns all aGraphSpec`;
  }

  findOne(id: number) {
    return `This action returns a #${id} aGraphSpec`;
  }

  update(id: number, updateAGraphSpecInput: UpdateAGraphSpecInput) {
    return `This action updates a #${id} aGraphSpec`;
  }

  remove(id: number) {
    return `This action removes a #${id} aGraphSpec`;
  }
}
