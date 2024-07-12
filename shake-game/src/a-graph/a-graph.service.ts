import { Injectable } from '@nestjs/common';
import { CreateAGraphInput } from './dto/create-a-graph.input';
import { UpdateAGraphInput } from './dto/update-a-graph.input';

@Injectable()
export class AGraphService {
  create(createAGraphInput: CreateAGraphInput) {
    return 'This action adds a new aGraph';
  }

  findAll() {
    return `This action returns all aGraph`;
  }

  findOne(id: number) {
    return `This action returns a #${id} aGraph`;
  }

  update(id: number, updateAGraphInput: UpdateAGraphInput) {
    return `This action updates a #${id} aGraph`;
  }

  remove(id: number) {
    return `This action removes a #${id} aGraph`;
  }
}
